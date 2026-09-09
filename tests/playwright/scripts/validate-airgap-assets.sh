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

# podman.json key for the current OS, or empty when the OS ships no installers
platform_key() {
  case "${OS}" in
    Darwin)
      echo "darwin"
      ;;
    MINGW*|MSYS*|CYGWIN*|Windows_NT)
      echo "win32"
      ;;
    *)
      echo ""
      ;;
  esac
}

# each platform/arch entry points at .versions via versionRef, and the refs may
# differ per arch (darwin ships v5 on x64 and v6 on arm64), so versions have to
# be resolved per entry rather than once for the whole file
version_for_ref() {
  jq -r --arg ref "$1" '.versions[$ref].version' "${PODMAN_JSON}" | tr -d '\r'
}

tag_for_ref() {
  jq -r --arg ref "$1" '.versions[$ref].tagVersion' "${PODMAN_JSON}" | tr -d '\r'
}

refs_for_platform() {
  jq -r --arg p "$1" '[.platform[$p].arch[].versionRef] | unique[]' "${PODMAN_JSON}" | tr -d '\r'
}

filenames_for_ref() {
  jq -r --arg p "$1" --arg ref "$2" \
    '.platform[$p].arch | to_entries[] | select(.value.versionRef == $ref) | .value.fileName' \
    "${PODMAN_JSON}" | tr -d '\r'
}

archs_for_ref() {
  jq -r --arg p "$1" --arg ref "$2" \
    '.platform[$p].arch | to_entries[] | select(.value.versionRef == $ref) | .key' \
    "${PODMAN_JSON}" | tr -d '\r'
}

verify_installer_checksums() {
  local pkey
  pkey=$(platform_key)

  if [ -z "${pkey}" ]; then
    echo "SKIP: no installer checksums to verify on ${OS}"
    return
  fi

  local ref
  for ref in $(refs_for_platform "${pkey}"); do
    local tag
    tag=$(tag_for_ref "${ref}")

    if [ -z "${tag}" ] || [ "${tag}" = "null" ]; then
      echo "FAIL: ${pkey} references unknown version '${ref}' (no .versions.${ref}.tagVersion)"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    local files=()
    while IFS= read -r fname; do
      [ -z "${fname}" ] && continue
      files+=("${fname}")
    done < <(filenames_for_ref "${pkey}" "${ref}")

    if [ ${#files[@]} -eq 0 ]; then
      continue
    fi

    echo "Fetching shasums from GitHub release ${tag} (${ref}) for: ${files[*]}"

    local shasums_content
    if ! shasums_content=$(curl -sL --fail "https://github.com/podman-container-tools/podman/releases/download/${tag}/shasums" | tr -d '\r'); then
      echo "FAIL: could not fetch shasums from GitHub for ${tag} (curl failed)"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    if [ -z "${shasums_content}" ]; then
      echo "FAIL: shasums response was empty for ${tag}"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    local local_name
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
  done
}

verify_oci_checksums() {
  local pkey
  pkey=$(platform_key)

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

  local registry_url="https://quay.io/v2/podman/machine-os"

  local ref
  for ref in $(refs_for_platform "${pkey}"); do
    local version
    version=$(version_for_ref "${ref}")

    if [ -z "${version}" ] || [ "${version}" = "null" ]; then
      echo "FAIL: ${pkey} references unknown version '${ref}' (no .versions.${ref}.version)"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    # the machine-os image is tagged major.minor, while podman.json carries the full version
    local major_minor
    major_minor=$(echo "${version}" | cut -d. -f1,2)
    local manifest_url="${registry_url}/manifests/${major_minor}"

    # only the arches that actually resolve to this ref belong to this manifest
    local wanted_archs
    wanted_archs=$(archs_for_ref "${pkey}" "${ref}")

    if [ -z "${wanted_archs}" ]; then
      continue
    fi

    echo "Fetching OCI manifest from ${manifest_url} (disktype: ${disktype}, arch: $(echo ${wanted_archs} | tr '\n' ' '))..."
    local index_manifest
    if ! index_manifest=$(curl -sL --fail \
      -H 'Accept: application/vnd.oci.image.index.v1+json, application/vnd.oci.image.manifest.v1+json' \
      "${manifest_url}" | tr -d '\r'); then
      echo "FAIL: could not fetch OCI manifest index for ${major_minor} (curl failed)"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    if [ -z "${index_manifest}" ]; then
      echo "FAIL: OCI manifest response was empty for ${major_minor}"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    if echo "${index_manifest}" | jq -e '.errors' &>/dev/null; then
      echo "FAIL: OCI manifest returned errors for ${major_minor}"
      echo "${index_manifest}" | jq '.errors' 2>/dev/null || true
      ERRORS=$((ERRORS + 1))
      continue
    fi

    local arch_digests
    arch_digests=$(echo "${index_manifest}" | jq -r --arg dt "${disktype}" '.manifests[] | select(.annotations.disktype == $dt) | "\(.platform.architecture) \(.digest)"' || true)

    if [ -z "${arch_digests}" ]; then
      echo "WARN: no manifests found for disktype ${disktype} in ${major_minor}"
      continue
    fi

    echo "Found OCI entries for: $(echo "${arch_digests}" | awk '{printf "%s ", $1}')"

    while IFS=' ' read -r arch digest; do
      [ -z "${arch}" ] && continue

      local json_arch
      local local_name
      case "${arch}" in
        aarch64) json_arch="arm64"; local_name="podman-image-arm64.zst" ;;
        x86_64)  json_arch="x64";   local_name="podman-image-x64.zst" ;;
        *)       json_arch="${arch}"; local_name="podman-image-${arch}.zst" ;;
      esac

      # skip arches served by a different versionRef, they get their own manifest
      if ! echo "${wanted_archs}" | grep -qx "${json_arch}"; then
        continue
      fi

      local path="${ASSETS_DIR}/${local_name}"
      if [ ! -f "${path}" ]; then
        continue
      fi

      local arch_manifest
      if ! arch_manifest=$(curl -sL --fail \
        -H 'Accept: application/vnd.oci.image.manifest.v1+json' \
        "${registry_url}/manifests/${digest}" | tr -d '\r'); then
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
  done
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

OS="$(uname -s)"
ARCH="$(uname -m)"
echo "Platform: ${OS} / ${ARCH}"

PLATFORM_KEY=$(platform_key)
if [ -n "${PLATFORM_KEY}" ]; then
  echo "Podman versions:"
  jq -r --arg p "${PLATFORM_KEY}" \
    '.versions as $v | .platform[$p].arch | to_entries[]
     | "  \(.key): \(.value.versionRef) -> \($v[.value.versionRef].version // "UNKNOWN")"' \
    "${PODMAN_JSON}" | tr -d '\r'
fi
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
if [ -n "${PLATFORM_KEY}" ]; then
  while IFS= read -r fname; do
    [ -z "${fname}" ] && continue
    validate_file "${fname}"
  done < <(jq -r --arg p "${PLATFORM_KEY}" '.platform[$p].arch | to_entries[].value.fileName' "${PODMAN_JSON}" | tr -d '\r')
else
  echo "SKIP: no installer assets expected on ${OS}"
fi

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
verify_installer_checksums
echo ""
verify_oci_checksums

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
