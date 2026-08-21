#!/bin/bash
# /**********************************************************************
#  Copyright (C) 2026 Red Hat, Inc.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#  SPDX-License-Identifier: Apache-2.0
#  **********************************************************************/
set -euo pipefail

# Deploy a local Squid proxy with TLS support for E2E testing.
# The proxy listens on localhost:3128 (HTTP) and localhost:3129 (HTTPS).
# Pre-generated PKI material (rootCA.crt / squid.pem) from the pki/ directory
# is volume-mounted into the container so the same root CA can be installed
# into the host system trust store before running tests.
#
# Usage:
#   ./setup-squid-proxy.sh          # build image and start the proxy
#   ./setup-squid-proxy.sh cleanup  # stop and remove the container and image

CONTAINER_NAME="${SQUID_CONTAINER_NAME:-pd-test-squid}"
RESOURCES_DIR="tests/playwright/resources/squid-proxy"
IMAGE_NAME="localhost/squid:latest"

cleanup() {
  echo "Stopping squid proxy container..."
  podman stop "${CONTAINER_NAME}" 2>/dev/null || true
  podman rm -f "${CONTAINER_NAME}" 2>/dev/null || true
  echo "Removing squid image..."
  podman rmi "${IMAGE_NAME}" 2>/dev/null || true
  echo "Cleanup complete."
}

build_image() {
  echo "Building squid proxy image from ${RESOURCES_DIR}/Containerfile..."
  podman build -t "${IMAGE_NAME}" -f "${RESOURCES_DIR}/Containerfile" "${RESOURCES_DIR}"
  echo "Squid image built."
}

start_proxy() {
  podman run -d \
    --name "${CONTAINER_NAME}" \
    -v "$(pwd)/${RESOURCES_DIR}/pki:/etc/pki/squid:z" \
    -p 3128:3128 \
    -p 3129:3129 \
    "${IMAGE_NAME}"
  echo "Squid proxy container started."
}

wait_for_proxy() {
  echo "Waiting for squid proxy to be ready on port 3128..."
  local retries=30
  until curl -s --connect-timeout 2 -o /dev/null http://localhost:3128; do
    retries=$((retries - 1))
    if [ "${retries}" -eq 0 ]; then
      echo "ERROR: Squid proxy did not become ready in time."
      podman logs "${CONTAINER_NAME}" || true
      exit 1
    fi
    sleep 2
  done
  echo "Squid proxy is ready. HTTP: localhost:3128, HTTPS: localhost:3129"
}

container_exists() {
  podman container exists "${CONTAINER_NAME}" 2>/dev/null
}

case "${1:-start}" in
  start)
    if container_exists; then
      if [ "${CI:-}" = "true" ]; then
        echo "CI detected - tearing down existing container."
        cleanup
      else
        echo "Container '${CONTAINER_NAME}' already exists."
        echo ""
        read -rp "  [t]eardown and recreate / [R]estart existing? (t/R): " choice
        case "${choice}" in
          t|T)
            cleanup
            ;;
          *)
            echo "Restarting existing container..."
            podman restart "${CONTAINER_NAME}"
            echo "Squid proxy restarted."
            exit 0
            ;;
        esac
      fi
    fi
    build_image
    start_proxy
    wait_for_proxy
    ;;
  cleanup)
    cleanup
    ;;
  *)
    echo "Usage: $0 {start|cleanup}" >&2
    exit 1
    ;;
esac
