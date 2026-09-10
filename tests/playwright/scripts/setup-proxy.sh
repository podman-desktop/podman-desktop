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

# Deploy a local Squid forwarding proxy for E2E testing of Podman Desktop's
# "System" proxy mode. The proxy listens on localhost:3128 and simply
# forwards traffic - it does not cache, authenticate or inspect requests.
#
# Usage:
#   ./setup-proxy.sh          # start the proxy
#   ./setup-proxy.sh cleanup  # stop and remove it
#
# Override via env:
#   PROXY_CONTAINER_NAME, PROXY_PORT, PROXY_IMAGE

DEFAULT_IMAGE="docker.io/ubuntu/squid@sha256:6a097f68bae708cedbabd6188d68c7e2e7a38cedd05a176e1cc0ba29e3bbe029"

PROXY_NAME="${PROXY_CONTAINER_NAME:-pd-test-proxy}"
PROXY_PORT="${PROXY_PORT:-3128}"
PROXY_IMAGE="${PROXY_IMAGE:-${DEFAULT_IMAGE}}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF_FILE="${SCRIPT_DIR}/squid-forward.conf"

cleanup() {
  echo "Stopping proxy container..."
  podman stop "${PROXY_NAME}" 2>/dev/null || true
  podman rm -f "${PROXY_NAME}" 2>/dev/null || true
  echo "Cleanup complete."
}

proxy_exists() {
  podman container exists "${PROXY_NAME}" 2>/dev/null
}

start_proxy() {
  podman run -d \
    --name "${PROXY_NAME}" \
    -p "${PROXY_PORT}:3128" \
    -v "${CONF_FILE}:/etc/squid/squid.conf:Z,ro" \
    "${PROXY_IMAGE}"

  echo "Waiting for proxy to accept connections on localhost:${PROXY_PORT}..."
  for _ in $(seq 1 30); do
    if curl -s -o /dev/null --max-time 1 "http://localhost:${PROXY_PORT}/"; then
      echo "Proxy started at localhost:${PROXY_PORT}"
      return 0
    fi
    sleep 1
  done

  echo "Proxy did not become ready in time" >&2
  podman logs "${PROXY_NAME}" || true
  exit 1
}

case "${1:-start}" in
  start)
    if proxy_exists; then
      if [ "${CI:-}" = "true" ]; then
        echo "CI detected - tearing down existing proxy."
        cleanup
      else
        echo "Proxy container '${PROXY_NAME}' already exists."
        echo ""
        read -rp "  [t]eardown and recreate / [R]estart existing? (t/R): " choice
        case "${choice}" in
          t|T)
            cleanup
            ;;
          *)
            echo "Restarting existing container..."
            podman restart "${PROXY_NAME}"
            echo "Proxy restarted at localhost:${PROXY_PORT}"
            exit 0
            ;;
        esac
      fi
    fi
    start_proxy
    ;;
  cleanup)
    cleanup
    ;;
  *)
    echo "Usage: $0 {start|cleanup}" >&2
    exit 1
    ;;
esac
