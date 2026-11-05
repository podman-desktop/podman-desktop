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

import { createServer } from 'node:net';

import type * as Electron from 'electron';

/**
 * In development mode, Playwright launches its own Electron executable with
 * `-r playwright-core/lib/server/electron/loader.js`, which delays app readiness until Playwright
 * is attached. With an explicit `executablePath`, Playwright skips this loader, so the app can
 * create its window before Playwright attaches. Packaged binaries ignore `-r` and `NODE_OPTIONS`,
 * but accept `--inspect-brk` when the `EnableNodeCliInspectArguments` fuse is on (required by
 * Playwright anyway for `--inspect=0`).
 *
 * The runner starts the app paused with `--inspect-brk`, installs the readiness gate of Playwright's
 * loader.js through the Node inspector, then resumes it. Playwright releases the gate by calling
 * `__playwright_run()` once its browser targets are configured, as it does in development mode.
 */

/**
 * Runs inside the Electron main process before the application entry point.
 *
 * The logic is copied from the "Defer ready event" part of Playwright's loader.js:
 * https://github.com/microsoft/playwright/blob/v1.64.1/packages/playwright-core/src/server/electron/loader.ts
 * Keep it in sync when upgrading Playwright. The other parts of loader.js are deliberately not
 * reproduced: removing Playwright's arguments from `process.argv`, and appending Playwright's
 * Chromium switches with `app.commandLine.appendSwitch()`.
 */
function installGate({ app }: typeof Electron): string {
  const originalWhenReady = app.whenReady();
  const originalEmit = app.emit.bind(app);
  let readyEventArgs: unknown[] = [];
  app.emit = (event: string | symbol, ...args: unknown[]): boolean => {
    if (event === 'ready') {
      readyEventArgs = args;
      return app.listenerCount('ready') > 0;
    }
    return originalEmit(event, ...args);
  };

  let isReady = false;
  let whenReadyCallback: (event: unknown) => void = () => {};
  const whenReadyPromise = new Promise<unknown>(resolve => (whenReadyCallback = resolve));
  app.isReady = (): boolean => isReady;
  // Like Electron's own promise, it resolves with the launch info.
  app.whenReady = (() => whenReadyPromise) as typeof app.whenReady;

  (globalThis as { __playwright_run?: () => Promise<void> }).__playwright_run = async (): Promise<void> => {
    console.log('[startup gate] Playwright attached, releasing app ready');
    const event = await originalWhenReady;
    isReady = true;
    whenReadyCallback(event);
    originalEmit('ready', ...readyEventArgs);
  };
  return 'installed';
}

export async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === 'object') resolve(address.port);
        else reject(new Error('Unable to allocate a free port'));
      });
    });
  });
}

async function findInspectorUrl(port: number, signal: AbortSignal): Promise<string> {
  while (!signal.aborted) {
    try {
      const [target] = (await (await fetch(`http://127.0.0.1:${port}/json/list`, { signal })).json()) as {
        webSocketDebuggerUrl: string;
      }[];
      if (target) return target.webSocketDebuggerUrl;
    } catch {
      // The inspector is not listening yet.
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('Startup gate installation aborted');
}

/**
 * Connect to the main process paused by `--inspect-brk=<port>`, install the gate and resume it.
 * Must run concurrently with `electron.launch()`: the launch cannot complete while the app is paused.
 */
export async function installStartupGate(port: number, signal: AbortSignal): Promise<void> {
  const url = await findInspectorUrl(port, signal);
  const ws = new WebSocket(url);
  try {
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = (): void => reject(new Error(`Unable to connect to the inspector at ${url}`));
    });

    let lastId = 0;
    const pending = new Map<number, (message: { result?: unknown; error?: { message: string } }) => void>();
    let onPaused: (callFrameId: string) => void = () => {};
    const paused = new Promise<string>(resolve => (onPaused = resolve));
    ws.onmessage = (event): void => {
      const message = JSON.parse(String(event.data));
      if (message.id) pending.get(message.id)?.(message);
      else if (message.method === 'Debugger.paused') onPaused(message.params.callFrames[0].callFrameId);
    };
    const send = async (method: string, params: object = {}): Promise<unknown> => {
      const id = ++lastId;
      const response = await new Promise<{ result?: unknown; error?: { message: string } }>(resolve => {
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
      pending.delete(id);
      if (response.error) throw new Error(`${method} failed: ${response.error.message}`);
      return response.result;
    };

    await send('Runtime.enable');
    await send('Debugger.enable');
    await send('Runtime.runIfWaitingForDebugger');
    const callFrameId = await paused;
    const { result, exceptionDetails } = (await send('Debugger.evaluateOnCallFrame', {
      callFrameId,
      expression: `(${installGate.toString()})(require('electron'))`,
    })) as { result: { value?: unknown }; exceptionDetails?: { text: string } };
    if (exceptionDetails || result.value !== 'installed') {
      throw new Error(`Unable to install the startup gate: ${JSON.stringify(exceptionDetails ?? result)}`);
    }
    await send('Debugger.resume');
    await send('Debugger.disable');
    console.log('[startup gate] Installed, waiting for Playwright to attach');
  } finally {
    ws.close();
  }
}
