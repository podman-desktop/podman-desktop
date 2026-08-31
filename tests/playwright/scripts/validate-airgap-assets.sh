#!/bin/bash
#
# Copyright (C) 2026 Red Hat, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
ASSETS_DIR="${REPO_ROOT}/extensions/podman/packages/extension/assets"
PODMAN_JSON="${REPO_ROOT}/extensions/podman/packages/extension/src/podman.json"

ERRORS=0
CHECKSUM_DETAILS=()

compute_sha256() {
  local file="$1"
  if command -v sha256sum &>/dev/null; then
    sha256sum "$file" | awk '{print $1}'
  else
    shasum -a 256 "$file" | awk '{print $1}'
  fi
}

verify_checksum() {
  local file="$1"
  local expected="$2"
  local label="$3"

  local actual
  actual=$(compute_sha256 "$file")

  if [ "${actual}" = "${expected}" ]; then
    echo "OK:   ${label}  (sha256 verified)"
  else
    echo "FAIL: ${label}  checksum mismatch"
    CHECKSUM_DETAILS+=("  ${label}: expected ${expected}, got ${actual}")
    ERRORS=$((ERRORS + 1))
  fi
}

installer_shasums_name() {
  local filename="$1"
  local name="${filename}"
  name=$(echo "${name}" | sed -E 's/-v[0-9]+\.[0-9]+\.[0-9]+(\.pkg|\.msi)/\1/')
  name="${name//aarch64/arm64}"
  echo "${name}"
}

# Resolve a versionRef (e.g. "v6") to its concrete version (e.g. "6.1.0").
resolve_version() {
  jq -r --arg r "$1" '.versions[$r].version' "${PODMAN_JSON}" | tr -d '\r'
}

verify_installer_checksums() {
  local platform_key="$1"

  # Each architecture points at a version group via versionRef; different
  # architectures may map to different podman versions (e.g. macOS x64 -> v5,
  # arm64 -> v6), so resolve and fetch shasums per entry.
  while IFS='|' read -r local_name version_ref; do
    [ -z "${local_name}" ] && continue

    local path="${ASSETS_DIR}/${local_name}"
    [ -f "${path}" ] || continue

    local version
    version=$(resolve_version "${version_ref}")
    if [ -z "${version}" ] || [ "${version}" = "null" ]; then
      echo "WARN: could not resolve version for ref '${version_ref}' (${local_name})"
      continue
    fi

    echo "Fetching shasums from GitHub release v${version}..."
    local shasums_content
    if ! shasums_content=$(curl -sL --fail \
      "https://github.com/podman-container-tools/podman/releases/download/v${version}/shasums" | tr -d '\r'); then
      echo "FAIL: could not fetch shasums from GitHub for v${version} (curl failed)"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    local shasums_name expected
    shasums_name=$(installer_shasums_name "${local_name}")
    expected=$(echo "${shasums_content}" | grep -F "${shasums_name}" | awk '{print $1}' || true)
    if [ -z "${expected}" ]; then
      echo "WARN: no shasums entry found for ${shasums_name} (local: ${local_name})"
      continue
    fi

    verify_checksum "${path}" "${expected}" "${local_name}"
  done <<< "$(jq -r --arg p "${platform_key}" \
    '.platform[$p].arch | to_entries[] | "\(.value.fileName)|\(.value.versionRef)"' \
    "${PODMAN_JSON}" | tr -d '\r')"
}

verify_oci_checksums() {
  local platform_key="$1"

  local disktype
  case "${platform_key}" in
    darwin) disktype="applehv" ;;
    win32)  disktype="wsl" ;;
    *) echo "SKIP: no OCI image checksums to verify for platform ${platform_key}"; return ;;
  esac

  local registry_url="https://quay.io/v2/podman/machine-os"

  # Machine-OS images are pulled per architecture using the major.minor of that
  # architecture's resolved version (mirrors scripts/podman-download.ts).
  while IFS='|' read -r arch_key version; do
    [ -z "${arch_key}" ] && continue

    local oci_arch local_name
    case "${arch_key}" in
      x64|amd64)     oci_arch="x86_64";  local_name="podman-image-x64.zst" ;;
      arm64|aarch64) oci_arch="aarch64"; local_name="podman-image-arm64.zst" ;;
      *) echo "WARN: unknown architecture key '${arch_key}'"; continue ;;
    esac

    local path="${ASSETS_DIR}/${local_name}"
    [ -f "${path}" ] || continue

    if [ -z "${version}" ] || [ "${version}" = "null" ]; then
      echo "WARN: could not resolve version for ${local_name}"
      continue
    fi
    local major_minor="${version%.*}"

    echo "Fetching OCI manifest from ${registry_url}/manifests/${major_minor} (disktype: ${disktype})..."
    local index_manifest
    if ! index_manifest=$(curl -sL --fail \
      -H 'Accept: application/vnd.oci.image.index.v1+json, application/vnd.oci.image.manifest.v1+json' \
      "${registry_url}/manifests/${major_minor}" | tr -d '\r'); then
      echo "FAIL: could not fetch OCI manifest index for ${major_minor} (curl failed)"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    local digest
    digest=$(echo "${index_manifest}" | jq -r --arg dt "${disktype}" --arg arch "${oci_arch}" \
      '.manifests[] | select(.annotations.disktype == $dt and .platform.architecture == $arch) | .digest' \
      | head -n1 || true)
    if [ -z "${digest}" ] || [ "${digest}" = "null" ]; then
      echo "WARN: no OCI manifest found for ${oci_arch}/${disktype} (${local_name})"
      continue
    fi

    local arch_manifest
    if ! arch_manifest=$(curl -sL --fail \
      -H 'Accept: application/vnd.oci.image.manifest.v1+json' \
      "${registry_url}/manifests/${digest}" | tr -d '\r'); then
      echo "WARN: could not fetch arch manifest for ${oci_arch}"
      continue
    fi

    local layer_digest
    layer_digest=$(echo "${arch_manifest}" | jq -r '.layers[0].digest' 2>/dev/null | sed 's/sha256://' || true)
    if [ -z "${layer_digest}" ] || [ "${layer_digest}" = "null" ]; then
      echo "WARN: could not extract layer digest for ${oci_arch} (${local_name})"
      continue
    fi

    verify_checksum "${path}" "${layer_digest}" "${local_name}"
  done <<< "$(jq -r --arg p "${platform_key}" \
    '.versions as $v | .platform[$p].arch | to_entries[] | "\(.key)|\($v[.value.versionRef].version)"' \
    "${PODMAN_JSON}" | tr -d '\r')"
}

validate_file() {
  local file="$1"
  local path="${ASSETS_DIR}/${file}"

  if [ ! -f "${path}" ]; then
    echo "FAIL: missing ${file}"
    ERRORS=$((ERRORS + 1))
    return
  fi

  local size
  size=$(wc -c < "${path}" | tr -d ' ')
  if [ "${size}" -eq 0 ]; then
    echo "FAIL: ${file} is empty"
    ERRORS=$((ERRORS + 1))
    return
  fi

  local human_size
  if command -v numfmt &>/dev/null; then
    human_size=$(numfmt --to=iec "${size}")
  else
    human_size="${size} bytes"
  fi
  echo "OK:   ${file}  (${human_size})"
}

echo "=== Airgap asset validation ==="
echo "Assets dir: ${ASSETS_DIR}"

if [ ! -d "${ASSETS_DIR}" ]; then
  echo "FAIL: assets directory does not exist"
  exit 1
fi

echo "Podman versions:"
jq -r '.versions | to_entries[] | "  \(.key): \(.value.version)"' "${PODMAN_JSON}" | tr -d '\r'

OS="$(uname -s)"
ARCH="$(uname -m)"
echo "Platform: ${OS} / ${ARCH}"
echo ""

echo "--- DEBUG: assets directory listing ---"
ls -la "${ASSETS_DIR}/" 2>&1 || echo "(empty or inaccessible)"
echo ""

echo "--- DEBUG: podman.json platform structure ---"
jq '.platform' "${PODMAN_JSON}"
echo ""

echo "--- DEBUG: dist directory listing ---"
ls -la "${REPO_ROOT}/dist/" 2>&1 || echo "(no dist directory)"
echo ""

echo "--- Installer assets ---"
case "${OS}" in
  Darwin)
    while IFS= read -r fname; do
      validate_file "${fname}"
    done < <(jq -r '.platform.darwin.arch | to_entries[].value.fileName' "${PODMAN_JSON}" | tr -d '\r')
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    while IFS= read -r fname; do
      validate_file "${fname}"
    done < <(jq -r '.platform.win32.arch | to_entries[].value.fileName' "${PODMAN_JSON}" | tr -d '\r')
    ;;
  *)
    echo "SKIP: no installer assets expected on ${OS}"
    ;;
esac

echo ""
echo "--- Airgap machine OS images ---"
case "${OS}" in
  Darwin|MINGW*|MSYS*|CYGWIN*|Windows_NT)
    validate_file "podman-image-arm64.zst"
    validate_file "podman-image-x64.zst"
    ;;
  *)
    echo "SKIP: no airgap machine OS images expected on ${OS}"
    ;;
esac

echo ""
echo "--- Checksum verification ---"
case "${OS}" in
  Darwin)                           PLATFORM_KEY="darwin" ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)  PLATFORM_KEY="win32" ;;
  *)                                PLATFORM_KEY="" ;;
esac
if [ -z "${PLATFORM_KEY}" ]; then
  echo "SKIP: no checksums to verify on ${OS}"
else
  verify_installer_checksums "${PLATFORM_KEY}"
  echo ""
  verify_oci_checksums "${PLATFORM_KEY}"
fi

echo ""
if [ "${ERRORS}" -gt 0 ]; then
  echo "FAILED: ${ERRORS} asset(s) missing or invalid"
  if [ ${#CHECKSUM_DETAILS[@]} -gt 0 ]; then
    echo ""
    echo "Checksum mismatches:"
    for detail in "${CHECKSUM_DETAILS[@]}"; do
      echo "${detail}"
    done
  fi
  exit 1
fi

echo "All airgap assets validated successfully"
