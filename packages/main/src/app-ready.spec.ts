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

import { EventEmitter } from 'node:events';

import type { App } from 'electron';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { whenAppReady } from './app-ready.js';

let app: App;
let electronReady: PromiseWithResolvers<void>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubEnv('PODMAN_DESKTOP_E2E_STARTUP_HANDSHAKE', '1');
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  electronReady = Promise.withResolvers<void>();
  app = Object.assign(new EventEmitter(), {
    whenReady: vi.fn().mockReturnValue(electronReady.promise),
    exit: vi.fn(),
  }) as unknown as App;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test.each([undefined, '0'])('normal startup does not install a handshake when the flag is %s', flag => {
  vi.stubEnv('PODMAN_DESKTOP_E2E_STARTUP_HANDSHAKE', flag);

  expect(whenAppReady(app)).toBe(electronReady.promise);
  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});

test('all startup consumers wait for Playwright after Electron becomes ready', async () => {
  const windowStartup = vi.fn();
  const extensionStartup = vi.fn();
  const ready = whenAppReady(app);
  const windowStarted = ready.then(windowStartup);
  const extensionsStarted = whenAppReady(app).then(extensionStartup);
  electronReady.resolve();
  await vi.advanceTimersByTimeAsync(0);

  expect(windowStartup).not.toHaveBeenCalled();
  expect(extensionStartup).not.toHaveBeenCalled();
  expect(app.listenerCount('podman-desktop:playwright-ready')).toBe(1);

  expect(app.emit('podman-desktop:playwright-ready')).toBe(true);
  await Promise.all([windowStarted, extensionsStarted]);

  expect(windowStartup).toHaveBeenCalledOnce();
  expect(extensionStartup).toHaveBeenCalledOnce();
  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
  expect(whenAppReady(app)).toBe(ready);
  expect(app.emit('podman-desktop:playwright-ready')).toBe(false);
  await vi.advanceTimersByTimeAsync(120_000);
  expect(app.exit).not.toHaveBeenCalled();
});

test('an early Playwright acknowledgement still waits for Electron readiness', async () => {
  const startup = vi.fn();
  const ready = whenAppReady(app);
  const started = ready.then(startup);
  app.emit('podman-desktop:playwright-ready');
  await vi.advanceTimersByTimeAsync(0);

  expect(startup).not.toHaveBeenCalled();
  electronReady.resolve();
  await started;
  expect(startup).toHaveBeenCalledOnce();
});

test('a missing acknowledgement fails startup and cleans up the handshake', async () => {
  electronReady.resolve();
  const ready = whenAppReady(app);
  const rejected = expect(ready).rejects.toThrow('Playwright startup handshake timed out after 120000ms');
  await vi.advanceTimersByTimeAsync(119_999);
  expect(app.exit).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1);
  await rejected;

  expect(app.exit).toHaveBeenCalledWith(1);
  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
  expect(app.emit('podman-desktop:playwright-ready')).toBe(false);
});

test('quitting while waiting cancels the handshake and its timeout', async () => {
  const ready = whenAppReady(app);
  const rejected = expect(ready).rejects.toThrow('Application quit before the Playwright startup handshake completed');
  app.emit('before-quit');
  await rejected;

  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
  await vi.advanceTimersByTimeAsync(120_000);
  expect(app.exit).not.toHaveBeenCalled();
});
