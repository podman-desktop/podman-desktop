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
 * @file Vite configuration for the accent-themes extension.
 *
 * Builds the extension TypeScript source into a CJS bundle and includes
 * a custom plugin that watches {@link theme-palette.json} for changes
 * during development, triggering theme regeneration on each save.
 */

import { join } from 'path';
import { builtinModules } from 'module';
import { execFileSync } from 'child_process';

const PACKAGE_ROOT = __dirname;

/**
 * Vite plugin that watches `theme-palette.json` and re-runs the theme
 * generation script whenever the palette file changes.
 *
 * During `vite build --watch`, vite monitors files registered via
 * `addWatchFile`. When `theme-palette.json` is modified, the
 * `watchChange` hook fires, regenerates `package.json` themes, and
 * vite continues the rebuild -- causing the extension to reload with
 * the updated colors.
 *
 * @returns {import('vite').Plugin} Vite plugin instance.
 */
function themePalettePlugin() {
  const palettePath = join(PACKAGE_ROOT, 'theme-palette.json');
  return {
    name: 'watch-theme-palette',
    buildStart() {
      this.addWatchFile(palettePath);
    },
    watchChange(id) {
      if (id === palettePath) {
        execFileSync(process.execPath, [join(PACKAGE_ROOT, 'scripts/generate-themes.js')]);
      }
    },
  };
}

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  plugins: [themePalettePlugin()],
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  build: {
    sourcemap: 'inline',
    target: 'esnext',
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE === 'production' ? 'esbuild' : false,
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
};

export default config;
