/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { z } from 'zod';

import { ExtensionManifestSchema } from './extension-manifest-schema.js';

const PACKAGE_JSON_SCHEMA_URL = 'https://json.schemastore.org/package.json';

export function generateExtensionManifestJsonSchema(): Record<string, unknown> {
  const extensionSchema = z.toJSONSchema(ExtensionManifestSchema, {
    target: 'draft-07',
  });

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Podman Desktop Extension Manifest',
    description: 'Schema for Podman Desktop extension package.json files',
    allOf: [{ $ref: PACKAGE_JSON_SCHEMA_URL }, extensionSchema],
  };
}
