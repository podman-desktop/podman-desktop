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

import { createHash } from 'node:crypto';
import { appendFile, readFile } from 'node:fs/promises';

import type { WebContents, WebPreferences } from 'electron';

export function registerStartupDiagnostics(contents: WebContents, preferences: WebPreferences = {}): void {
  if (process.env['PODMAN_DESKTOP_STARTUP_DIAGNOSTICS'] !== '1') return;

  const logFile = process.env['PODMAN_DESKTOP_STARTUP_DIAGNOSTICS_FILE'];
  const log = (event: string, details: unknown): void => {
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      mainPID: process.pid,
      webContentsID: contents.id,
      event,
      details,
    });
    console.log('[startup diagnostics]', entry);
    if (logFile) {
      appendFile(logFile, `${entry}\n`).catch((error: unknown) => {
        console.log('[startup diagnostics] Could not save startup diagnostics:', error);
      });
    }
  };

  // Register before loadURL(), including errors that happen before electron.launch() resolves.
  contents.on('preload-error', (_event, preloadPath, error) => {
    log('preload-error', { preloadPath, error: error.stack ?? error.message });
  });
  contents.on('render-process-gone', (_event, details) => log('render-process-gone', details));
  contents.on('did-fail-load', (_event, code, description, url, isMainFrame) => {
    log('did-fail-load', { code, description, url, isMainFrame });
  });
  contents.on('console-message', ({ level, message, sourceId, lineNumber }) => {
    if (level === 'error' || message.startsWith('[preload startup]')) {
      log('renderer-console', { level, message, sourceId, lineNumber });
    }
  });
  contents.on('ipc-message', (_event, channel, details: unknown) => {
    if (channel === 'startup-diagnostics:preload') log('preload-stage', details);
  });
  contents.on('dom-ready', () => {
    const rendererPID = contents.getOSProcessId();
    log('dom-ready', {
      rendererPID,
      url: contents.getURL(),
    });
    if (process.platform === 'linux' && rendererPID > 0) {
      readFile(`/proc/${rendererPID}/cmdline`, 'utf8')
        .then(commandLine => {
          log('renderer-sandbox-flags', {
            rendererPID,
            // Read the actual renderer arguments even when its preload never executes.
            flags: commandLine.split('\0').filter(arg => arg.includes('sandbox') || arg.startsWith('--type=')),
          });
        })
        .catch((error: unknown) => log('renderer-command-line-error', String(error)));
    }
  });

  log('window-created', {
    versions: process.versions,
    platform: process.platform,
    sandboxFlags: process.argv.filter(arg => arg.includes('sandbox')),
    requestedPreferences: {
      preload: preferences.preload,
      sandbox: preferences.sandbox,
      contextIsolation: preferences.contextIsolation,
      nodeIntegration: preferences.nodeIntegration,
    },
  });
  if (preferences.preload) {
    const preloadPath = preferences.preload;
    readFile(preloadPath)
      .then(source => {
        log('preload-file', {
          preloadPath,
          bytes: source.length,
          sha256: createHash('sha256').update(source).digest('hex'),
        });
      })
      .catch((error: unknown) => log('preload-file-error', { preloadPath, error: String(error) }));
  }
}
