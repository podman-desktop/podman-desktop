/**
 * Vite config for building the Podman Desktop renderer as a static web app
 * (no Electron). Uses mock-preload.ts to stub all window.* APIs.
 *
 * Usage:
 *   pnpm --filter renderer build:static
 *   # or from repo root:
 *   pnpm run build:static
 */

import { join } from 'path';
import * as path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

let filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(filename);

export default defineConfig({
  mode: 'production',
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [tailwindcss(), svelte({ configFile: '../../svelte.config.js' })],
  optimizeDeps: {
    exclude: ['tinro', '@podman-desktop/api'],
  },
  base: './',
  build: {
    sourcemap: false,
    outDir: 'dist-static',
    assetsDir: 'static',
    emptyOutDir: true,
    reportCompressedSize: false,
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index-static.html'),
    },
  },
});
