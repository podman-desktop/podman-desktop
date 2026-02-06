/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

/* eslint-env node */
import { join } from 'path';
import * as path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import tailwindcss from '@tailwindcss/vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import chokidar from 'chokidar';

import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

let filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(filename);
const ROOT_DIR = path.join(PACKAGE_ROOT, '..');

// Vite plugin to watch color-registry and regenerate themes.css
function colorRegistryWatcher() {
  let isRegenerating = false;
  let pendingChange = false;
  let pendingChangedFile = null;

  return {
    name: 'color-registry-watcher',
    configureServer(server) {
      // Watch files using chokidar
      const filesToWatch = [
        path.join(ROOT_DIR, 'packages/main/src/plugin/color-registry.ts'),
        path.join(ROOT_DIR, 'tailwind-color-palette.json'),
      ];

      const watcher = chokidar.watch(filesToWatch, {
        persistent: true,
        ignoreInitial: true,
      });

      watcher.on('change', async changedFile => {
        if (isRegenerating) {
          pendingChange = true;
          pendingChangedFile = changedFile;
          return;
        }

        isRegenerating = true;

        // Regeneration loop: process until no pending changes remain
        while (true) {
          const currentChangedFile = pendingChangedFile || changedFile;
          pendingChange = false;
          pendingChangedFile = null;

          console.log(
            `\n[color-registry-watcher] ${path.basename(currentChangedFile)} changed, regenerating themes.css...`,
          );

          try {
            await execAsync('pnpm run storybook:css', { cwd: ROOT_DIR });
            console.log('[color-registry-watcher] themes.css regenerated successfully\n');

            // Trigger full reload using Vite Environment API
            this.environment.hot.send({
              type: 'full-reload',
              path: '*',
            });
          } catch (error) {
            console.error('[color-registry-watcher] Failed to regenerate themes.css:', error.message);
          }

          // Check if a change arrived during this regeneration
          if (!pendingChange) {
            break;
          }
        }

        isRegenerating = false;
      });

      server.httpServer?.on('close', () => {
        watcher.close();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [
    tailwindcss(),
    svelte({ configFile: '../svelte.config.js', compilerOptions: { hmr: true } }),
    svelteTesting(),
    colorRegistryWatcher(),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    alias: [{ find: '@testing-library/svelte', replacement: '@testing-library/svelte/svelte5' }],
    deps: {
      inline: ['moment'],
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
    watch: {
      // Watch the UI package dist folder for changes
      ignored: ['!**/node_modules/@podman-desktop/ui-svelte/**'],
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: '.',
    lib: {
      entry: 'src/lib/index.ts',
      formats: ['es'],
    },

    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
