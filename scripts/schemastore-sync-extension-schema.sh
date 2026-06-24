#!/usr/bin/env bash
# shellcheck shell=bash

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

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

forwarded_args=("$@")
incoming_file="../schemas/extension-schema.json"
schema_dir="src/schemas/json"
catalog_file="src/api/json/catalog.json"
schema_validation_file="src/schema-validation.jsonc"
schema_file_name="podman-desktop-extension.json"
versioned_schema_file_name=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --versioned-schema-file-name)
      versioned_schema_file_name="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$versioned_schema_file_name" ]]; then
  echo "Missing required argument --versioned-schema-file-name" >&2
  exit 1
fi

node --experimental-strip-types "${REPO_ROOT}/scripts/schemastore-sync-extension-schema.ts" \
  --incoming-file "${incoming_file}" \
  --schema-dir "${schema_dir}" \
  --catalog-file "${catalog_file}" \
  --schema-validation-file "${schema_validation_file}" \
  --schema-file-name "${schema_file_name}" \
  "${forwarded_args[@]}"
npm install --no-audit --no-fund --ignore-scripts
npx prettier \
  --write \
  --config .prettierrc.cjs \
  "${schema_dir%/}/${schema_file_name}" \
  "${schema_dir%/}/${versioned_schema_file_name}" \
  "${catalog_file}" \
  "${schema_validation_file}"
