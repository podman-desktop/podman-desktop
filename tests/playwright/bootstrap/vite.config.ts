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
import { join } from 'node:path';

import { node } from '../../../.electron-vendors.cache.json';
import { defineConfig } from 'vite';

const mainPackageRoot = join(__dirname, '../../../packages/main');

export default defineConfig({
  mode: process.env['MODE'],
  root: mainPackageRoot,
  envDir: process.cwd(),
  resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
    alias: {
      '/@/': `${join(mainPackageRoot, 'src')}/`,
      '/@product.json': `${join(mainPackageRoot, '../../product.json')}`,
    },
  },
  build: {
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env['MODE'] === 'production',
    lib: {
      entry: [
        join(__dirname, 'index.ts'),
        'scripts/download-remote-extensions.ts',
        'scripts/generate-extension-schema.ts',
      ],
      formats: ['cjs'],
    },
    rollupOptions: {
      platform: 'node',
      external: [
        'electron',
        'chokidar',
        'tar-fs',
        'ssh2',
        '@segment/analytics-node',
        'isomorphic-ws',
        ...builtinModules.flatMap(module => [module, `node:${module}`]),
      ],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    retry: 3,
    environment: 'node',
    name: 'e2e-bootstrap',
    include: [join(__dirname, '*.spec.ts')],
  },
});
