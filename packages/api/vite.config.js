/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { chrome } from '../../.electron-vendors.cache.json';
import { join } from 'path';
import { builtinModules } from 'module';
import dts from 'vite-plugin-dts';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
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
      entryRoot: 'src',
      outDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: {
        index: 'src/index.ts',
        'api-sender/api-sender-type': 'src/api-sender/api-sender-type.ts',
        'appearance/appearance-settings': 'src/appearance/appearance-settings.ts',
        'authentication/authentication': 'src/authentication/authentication.ts',
        'configuration/index': 'src/configuration/index.ts',
        'context/index': 'src/context/index.ts',
        'editor/editor-settings': 'src/editor/editor-settings.ts',
        'extension-catalog/extensions-catalog-api': 'src/extension-catalog/extensions-catalog-api.ts',
        'featured/featured-api': 'src/featured/featured-api.ts',
        'kubernetes/kubernetes-generator-api': 'src/kubernetes/kubernetes-generator-api.ts',
        'learning-center/guide': 'src/learning-center/guide.ts',
        'libpod/libpod': 'src/libpod/libpod.ts',
        'recommendations/index': 'src/recommendations/index.ts',
        'status-bar/index': 'src/status-bar/index.ts',
        'telemetry/telemetry-settings': 'src/telemetry/telemetry-settings.ts',
        'terminal/terminal-settings': 'src/terminal/terminal-settings.ts',
        'welcome/welcome-settings': 'src/welcome/welcome-settings.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['electron', ...builtinModules.flatMap(p => [p, `node:${p}`])],
      output: {
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    passWithNoTests: true,
  },
};

export default config;
