#!/usr/bin/env node

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
 * Start Storybook with `packages/ui` rebuilding on every source change.
 *
 * Storybook resolves `@podman-desktop/ui-svelte` through the package export map, which
 * points at `packages/ui/dist`. Vite already watches that folder, so keeping `dist` fresh
 * is all that is needed for component edits to hot-reload. This also builds `dist` before
 * Storybook starts, so a fresh checkout works without a separate `build:ui` step.
 */

import { spawn, spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { watch as watchUiPackage } from '../node_modules/@sveltejs/package/src/index.js';
import { load_config as loadUiPackageConfig } from '../node_modules/@sveltejs/package/src/config.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = join(rootDir, 'packages/ui');

// `watch()` awaits the first build before returning, so `dist` exists once this resolves
await watchUiPackage({
  cwd: uiDir,
  input: 'src/lib',
  output: 'dist',
  preserve_output: false,
  types: true,
  config: await loadUiPackageConfig({ cwd: uiDir }),
});

const isWindows = process.platform === 'win32';

// Own process group on POSIX, so a signal reaches pnpm and every process below it
const storybook = spawn('pnpm', ['--filter', 'storybook', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: isWindows,
  detached: !isWindows,
});

// Stop Storybook together with everything pnpm started for it
function stopStorybook(signal) {
  try {
    if (isWindows) {
      spawnSync('taskkill', ['/pid', String(storybook.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      process.kill(-storybook.pid, signal);
    }
  } catch {
    // Already exited.
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stopStorybook(signal));
}

storybook.on('exit', (code, signal) => {
  // A signal stop is the user ending the session, not a failure
  process.exit(code ?? (signal ? 0 : 1));
});
