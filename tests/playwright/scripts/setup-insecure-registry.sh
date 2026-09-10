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

# Requires Bash 3.2+ (macOS GitHub runners ship Bash 3.2).
#
# Deploy a local Docker registry with self-signed TLS and basic auth.
# The registry listens on localhost:5443 and is intended for E2E testing
# of insecure/self-signed registry workflows in Podman Desktop.
#
# All artifacts (certs, htpasswd) live under /tmp - nothing is written
# outside of it, so the script is safe to run on any dev machine.
#
# Usage:
#   ./setup-insecure-registry.sh          # start the registry
#   ./setup-insecure-registry.sh cleanup  # stop and remove everything
#
# Authentication:
#   Username / Password: override via INSECURE_REGISTRY_USERNAME / INSECURE_REGISTRY_PASSWORD
#   Defaults: testuser / testpassword123

DEFAULT_USERNAME="testuser"
DEFAULT_PASSWORD="testpassword123"
# Dollar signs are literal (bcrypt hash), not variables
# shellcheck disable=SC2016
DEFAULT_HTPASSWD='testuser:$2y$05$vsNY0rsRh7vNP360CqaAD.PtXGF0e1hRCPkpztRkMFZ422aPyA6Qe'

REGISTRY_NAME="${INSECURE_REGISTRY_CONTAINER_NAME:-pd-test-registry}"
REGISTRY_PORT="${INSECURE_REGISTRY_PORT:-5443}"
REGISTRY_USERNAME="${INSECURE_REGISTRY_USERNAME:-${DEFAULT_USERNAME}}"
REGISTRY_PASSWORD="${INSECURE_REGISTRY_PASSWORD:-${DEFAULT_PASSWORD}}"
WORK_DIR="/tmp/${REGISTRY_NAME}"

cleanup() {
  echo "Stopping registry container..."
  podman stop "${REGISTRY_NAME}" 2>/dev/null || true
  podman rm -f "${REGISTRY_NAME}" 2>/dev/null || true

  if [ -d "${WORK_DIR}" ]; then
    echo "Removing artifacts from ${WORK_DIR}..."
    rm -rf "${WORK_DIR}"
  fi

  echo "Cleanup complete."
}

generate_certs() {
  mkdir -p "${WORK_DIR}"

  # Use a config file for SANs instead of -addext, which is not
  # supported by LibreSSL (the default openssl on macOS / GH runners).
  cat > "${WORK_DIR}/openssl.cnf" <<EOF
[req]
distinguished_name = req_dn
x509_extensions    = v3_ca
prompt             = no

[req_dn]
CN = localhost

[v3_ca]
subjectAltName = DNS:localhost,IP:127.0.0.1
keyUsage = digitalSignature,keyCertSign
extendedKeyUsage = serverAuth
basicConstraints = critical,CA:true
EOF

  openssl req -newkey rsa:2048 -nodes -sha256 \
    -keyout "${WORK_DIR}/registry.key" \
    -x509 -days 1 \
    -out "${WORK_DIR}/registry.crt" \
    -config "${WORK_DIR}/openssl.cnf" \
    2>/dev/null
  echo "Self-signed certificate generated in ${WORK_DIR}"
}

generate_htpasswd() {
  if [ "${REGISTRY_USERNAME}" = "${DEFAULT_USERNAME}" ] && [ "${REGISTRY_PASSWORD}" = "${DEFAULT_PASSWORD}" ]; then
    echo "${DEFAULT_HTPASSWD}" > "${WORK_DIR}/htpasswd"
  else
    local hash
    hash=$(openssl passwd -apr1 "${REGISTRY_PASSWORD}")
    echo "${REGISTRY_USERNAME}:${hash}" > "${WORK_DIR}/htpasswd"
  fi
  echo "htpasswd file created in ${WORK_DIR} (user: ${REGISTRY_USERNAME})"
}

start_registry() {
  podman run -d \
    --name "${REGISTRY_NAME}" \
    -p "${REGISTRY_PORT}:5000" \
    -v "${WORK_DIR}:/certs:Z" \
    -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/registry.crt \
    -e REGISTRY_HTTP_TLS_KEY=/certs/registry.key \
    -e REGISTRY_AUTH=htpasswd \
    -e REGISTRY_AUTH_HTPASSWD_REALM="Podman Desktop Test Registry" \
    -e REGISTRY_AUTH_HTPASSWD_PATH=/certs/htpasswd \
    docker.io/library/registry:2

  echo "Registry started at localhost:${REGISTRY_PORT}"
}

registry_exists() {
  podman container exists "${REGISTRY_NAME}" 2>/dev/null
}

case "${1:-start}" in
  start)
    if registry_exists; then
      if [ "${CI:-}" = "true" ]; then
        echo "CI detected - tearing down existing registry."
        cleanup
      else
        echo "Registry container '${REGISTRY_NAME}' already exists."
        echo ""
        read -rp "  [t]eardown and recreate / [R]estart existing? (t/R): " choice
        case "${choice}" in
          t|T)
            cleanup
            ;;
          *)
            echo "Restarting existing container..."
            podman restart "${REGISTRY_NAME}"
            echo "Registry restarted at localhost:${REGISTRY_PORT}"
            exit 0
            ;;
        esac
      fi
    fi
    generate_certs
    generate_htpasswd
    start_registry
    ;;
  cleanup)
    cleanup
    ;;
  *)
    echo "Usage: $0 {start|cleanup}" >&2
    exit 1
    ;;
esac
