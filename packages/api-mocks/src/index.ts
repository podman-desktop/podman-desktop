/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

/**
 * @packageDocumentation
 *
 * This package provides auto-generated vitest mocks for the Podman Desktop
 * extension API (`@podman-desktop/api`).
 *
 * Usage in a 3rd party extension's vitest config:
 *
 * ```ts
 * import { defineConfig } from 'vitest/config';
 * import { join } from 'node:path';
 * import { createRequire } from 'node:module';
 *
 * const require = createRequire(import.meta.url);
 * const apiMocksDir = require.resolve('@podman-desktop/api-mocks');
 * const apiMockPath = join(apiMocksDir, '..', '@podman-desktop', 'api.js');
 *
 * export default defineConfig({
 *   test: {
 *     globals: true,
 *     globalSetup: ['@podman-desktop/api-mocks/setup'],
 *     alias: {
 *       '@podman-desktop/api': apiMockPath,
 *     },
 *   },
 * });
 * ```
 */
export { default as vitestGenerateApiGlobalSetup } from './vitest-generate-api-global-setup.js';
