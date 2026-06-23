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
if [ "${ERRORS}" -gt 0 ]; then
  echo "FAILED: ${ERRORS} asset(s) missing or invalid"
  exit 1
fi

echo "All airgap assets validated successfully"
