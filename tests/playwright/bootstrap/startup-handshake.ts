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

import { app } from 'electron';

function installStartupHandshake(): void {
  if (process.env['PODMAN_DESKTOP_E2E_STARTUP_HANDSHAKE'] !== '1') return;

  const electronReady = app.whenReady();
  // Electron's App overloads only describe native events.
  const events: EventEmitter = app;
  const connected = new Promise<void>((resolve, reject) => {
    const cleanup = (): void => {
      clearTimeout(timeout);
      events.removeListener('podman-desktop:playwright-ready', onConnected);
      events.removeListener('before-quit', onQuit);
    };
    const onConnected = (): void => {
      cleanup();
      console.log('[startup handshake] Playwright connected');
      resolve();
    };
    const onQuit = (): void => {
      cleanup();
      reject(new Error('Application quit before the Playwright startup handshake completed'));
    };
    const timeout = setTimeout(() => {
      cleanup();
      const error = new Error('Playwright startup handshake timed out after 120000ms');
      console.error('[startup handshake]', error);
      reject(error);
      app.exit(1);
    }, 120_000);
    timeout.unref();

    events.once('podman-desktop:playwright-ready', onConnected);
    events.once('before-quit', onQuit);
  });

  const ready = Promise.all([electronReady, connected]).then(() => {
    console.log('[startup handshake] App-ready gate released; starting window and extensions');
  });
  app.whenReady = (): Promise<void> => ready;
  console.log('[startup handshake] Waiting for Electron and Playwright');
}

installStartupHandshake();
