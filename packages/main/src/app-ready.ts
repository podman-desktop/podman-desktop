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

import type { EventEmitter } from 'node:events';

import type { App } from 'electron';

const PLAYWRIGHT_READY_EVENT = 'podman-desktop:playwright-ready';
const HANDSHAKE_TIMEOUT_MS = 120_000;
const startupPromises = new WeakMap<App, Promise<void>>();

/**
 * Playwright's loader defers readiness for development launches, but is skipped
 * when launching an explicit executable. Let the E2E runner defer our startup
 * until it has connected, without changing Electron's own readiness APIs.
 */
export function whenAppReady(app: App): Promise<void> {
  if (process.env['PODMAN_DESKTOP_E2E_STARTUP_HANDSHAKE'] !== '1') return app.whenReady();

  const existing = startupPromises.get(app);
  if (existing) return existing;

  // Electron's App overloads only list native events; this event stays in the main process.
  const events: EventEmitter = app;
  const connected = new Promise<void>((resolve, reject) => {
    const cleanup = (): void => {
      clearTimeout(timeout);
      events.removeListener(PLAYWRIGHT_READY_EVENT, onConnected);
      events.removeListener('before-quit', onQuit);
    };
    const onConnected = (): void => {
      cleanup();
      console.log('[startup handshake] Playwright connected; releasing application startup');
      resolve();
    };
    const onQuit = (): void => {
      cleanup();
      reject(new Error('Application quit before the Playwright startup handshake completed'));
    };
    const timeout = setTimeout(() => {
      cleanup();
      const error = new Error(`Playwright startup handshake timed out after ${HANDSHAKE_TIMEOUT_MS}ms`);
      console.error('[startup handshake]', error);
      reject(error);
      // Never silently start without the handshake: that would invalidate the experiment.
      app.exit(1);
    }, HANDSHAKE_TIMEOUT_MS);
    timeout.unref();

    events.once(PLAYWRIGHT_READY_EVENT, onConnected);
    events.once('before-quit', onQuit);
    console.log('[startup handshake] Waiting for Playwright before application startup');
  });

  const ready = Promise.all([app.whenReady(), connected]).then(() => {});
  startupPromises.set(app, ready);
  return ready;
}
