/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url));
const PACKAGE_NAME = '@podman-desktop/tests-playwright';

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    target: 'esnext',
    outDir: 'dist',
    assetsDir: '.',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      name: PACKAGE_NAME,
    },
    // emptyOutDir: true,
    reportCompressedSize: false,
    rollupOptions: {
      external: ['electron', '@playwright/test', ...builtinModules.flatMap(p => [p, `node:${p}`])],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
