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
PODMAN_JSON="${REPO_ROOT}/extensions/podman/packages/extension/src/podman5.json"

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

verify_installer_checksums() {
  local version="$1"
  local shasums_url="https://github.com/podman-container-tools/podman/releases/download/v${version}/shasums"

  echo "Fetching shasums from GitHub release v${version}..."
  local shasums_content
  if ! shasums_content=$(curl -sL --fail "${shasums_url}"); then
    echo "FAIL: could not fetch shasums from GitHub (curl failed)"
    ERRORS=$((ERRORS + 1))
    return
  fi

  if [ -z "${shasums_content}" ]; then
    echo "FAIL: shasums response was empty"
    ERRORS=$((ERRORS + 1))
    return
  fi

  local files=()
  case "${OS}" in
    Darwin)
      mapfile -t files < <(jq -r '.platform.darwin.arch | to_entries[].value.fileName' "${PODMAN_JSON}")
      ;;
    MINGW*|MSYS*|CYGWIN*|Windows_NT)
      mapfile -t files < <(jq -r '.platform.win32.arch | to_entries[].value.fileName' "${PODMAN_JSON}")
      ;;
    *)
      echo "SKIP: no installer checksums to verify on ${OS}"
      return
      ;;
  esac

  echo "Files to verify: ${files[*]:-none}"

  for local_name in "${files[@]}"; do
    local path="${ASSETS_DIR}/${local_name}"
    if [ ! -f "${path}" ]; then
      continue
    fi

    local shasums_name
    shasums_name=$(installer_shasums_name "${local_name}")

    local expected
    expected=$(echo "${shasums_content}" | grep -F "${shasums_name}" | awk '{print $1}' || true)

    if [ -z "${expected}" ]; then
      echo "WARN: no shasums entry found for ${shasums_name} (local: ${local_name})"
      continue
    fi

    verify_checksum "${path}" "${expected}" "${local_name}"
  done
}

verify_oci_checksums() {
  local version="$1"
  local major_minor
  major_minor=$(echo "${version}" | cut -d. -f1,2)

  local registry_url="https://quay.io/v2/podman/machine-os"
  local manifest_url="${registry_url}/manifests/${major_minor}"

  local disktype
  case "${OS}" in
    Darwin)
      disktype="applehv"
      ;;
    MINGW*|MSYS*|CYGWIN*|Windows_NT)
      disktype="wsl"
      ;;
    *)
      echo "SKIP: no OCI image checksums to verify on ${OS}"
      return
      ;;
  esac

  echo "Fetching OCI manifest from ${manifest_url} (disktype: ${disktype})..."
  local index_manifest
  if ! index_manifest=$(curl -sL --fail \
    -H 'Accept: application/vnd.oci.image.index.v1+json, application/vnd.oci.image.manifest.v1+json' \
    "${manifest_url}"); then
    echo "FAIL: could not fetch OCI manifest index (curl failed)"
    ERRORS=$((ERRORS + 1))
    return
  fi

  if [ -z "${index_manifest}" ]; then
    echo "FAIL: OCI manifest response was empty"
    ERRORS=$((ERRORS + 1))
    return
  fi

  if echo "${index_manifest}" | jq -e '.errors' &>/dev/null; then
    echo "FAIL: OCI manifest returned errors"
    echo "${index_manifest}" | jq '.errors' 2>/dev/null || true
    ERRORS=$((ERRORS + 1))
    return
  fi

  local arch_digests
  arch_digests=$(echo "${index_manifest}" | jq -r --arg dt "${disktype}" '.manifests[] | select(.annotations.disktype == $dt) | "\(.platform.architecture) \(.digest)"' || true)

  if [ -z "${arch_digests}" ]; then
    echo "WARN: no manifests found for disktype ${disktype}"
    return
  fi

  echo "Found OCI entries for: $(echo "${arch_digests}" | awk '{printf "%s ", $1}')"

  while IFS=' ' read -r arch digest; do
    [ -z "${arch}" ] && continue

    local local_name
    case "${arch}" in
      aarch64) local_name="podman-image-arm64.zst" ;;
      x86_64)  local_name="podman-image-x64.zst" ;;
      *)       local_name="podman-image-${arch}.zst" ;;
    esac

    local path="${ASSETS_DIR}/${local_name}"
    if [ ! -f "${path}" ]; then
      continue
    fi

    local arch_manifest
    if ! arch_manifest=$(curl -sL --fail \
      -H 'Accept: application/vnd.oci.image.manifest.v1+json' \
      "${registry_url}/manifests/${digest}"); then
      echo "WARN: could not fetch arch manifest for ${arch}"
      continue
    fi

    local layer_digest
    layer_digest=$(echo "${arch_manifest}" | jq -r '.layers[0].digest' 2>/dev/null | sed 's/sha256://' || true)

    if [ -z "${layer_digest}" ] || [ "${layer_digest}" = "null" ]; then
      echo "WARN: could not extract layer digest for ${arch} (${local_name})"
      continue
    fi

    verify_checksum "${path}" "${layer_digest}" "${local_name}"
  done <<< "${arch_digests}"
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

VERSION=$(jq -r '.version' "${PODMAN_JSON}")
echo "Podman version: ${VERSION}"

OS="$(uname -s)"
ARCH="$(uname -m)"
echo "Platform: ${OS} / ${ARCH}"
echo ""

echo "--- Installer assets ---"
case "${OS}" in
  Darwin)
    validate_file "podman-installer-macos-amd64-v${VERSION}.pkg"
    validate_file "podman-installer-macos-aarch64-v${VERSION}.pkg"
    validate_file "podman-installer-macos-universal-v${VERSION}.pkg"
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    validate_file "podman-installer-windows-amd64.msi"
    validate_file "podman-installer-windows-arm64.msi"
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
verify_installer_checksums "${VERSION}"
echo ""
verify_oci_checksums "${VERSION}"

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
