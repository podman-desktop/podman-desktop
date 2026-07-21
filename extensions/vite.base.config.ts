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

import { builtinModules } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = join(PACKAGE_ROOT, '..');

export default defineConfig({
  mode: process.env.MODE,
  envDir: process.cwd(),
  resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
  },
  build: {
    sourcemap: 'inline',
    target: 'esnext',
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE === 'production',
    lib: {
      entry: 'src/extension.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['@podman-desktop/api', ...builtinModules.flatMap(p => [p, `node:${p}`])],
      output: {
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globalSetup: [join(WORKSPACE_ROOT, 'packages', 'api-mocks-vitest', 'src', 'vitest-generate-api-global-setup.ts')],
    alias: {
      '@podman-desktop/api': join(WORKSPACE_ROOT, 'packages', 'api-mocks-vitest', 'src', '@podman-desktop', 'api.js'),
    },
  },
});
