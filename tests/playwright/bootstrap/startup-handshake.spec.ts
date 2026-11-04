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

import type { App } from 'electron';
import { app } from 'electron';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

vi.mock(import('electron'), async () => {
  const { EventEmitter } = await import('node:events');
  return {
    app: Object.assign(new EventEmitter(), { whenReady: vi.fn(), exit: vi.fn() }) as unknown as App,
  };
});

const originalWhenReady = app.whenReady;
let electronReady: PromiseWithResolvers<void>;

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.stubEnv('PODMAN_DESKTOP_E2E_STARTUP_HANDSHAKE', '1');
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  electronReady = Promise.withResolvers<void>();
  app.whenReady = originalWhenReady;
  vi.mocked(app.whenReady).mockReturnValue(electronReady.promise);
});

afterEach(() => {
  app.whenReady = originalWhenReady;
  app.removeAllListeners();
  vi.doUnmock('/@/index.js');
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test.each([undefined, '0'])('leaves normal readiness untouched when the handshake flag is %s', async flag => {
  vi.stubEnv('PODMAN_DESKTOP_E2E_STARTUP_HANDSHAKE', flag);
  await import('./startup-handshake.js');

  expect(app.whenReady).toBe(originalWhenReady);
  expect(app.whenReady()).toBe(electronReady.promise);
  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});

test('holds all startup consumers until Playwright connects after Electron becomes ready', async () => {
  await import('./startup-handshake.js');
  const windowStartup = vi.fn();
  const extensionStartup = vi.fn();
  const ready = app.whenReady();
  const windowStarted = ready.then(windowStartup);
  const extensionsStarted = app.whenReady().then(extensionStartup);
  electronReady.resolve();
  await vi.advanceTimersByTimeAsync(0);

  expect(windowStartup).not.toHaveBeenCalled();
  expect(extensionStartup).not.toHaveBeenCalled();
  expect(app.emit('podman-desktop:playwright-ready')).toBe(true);
  await Promise.all([windowStarted, extensionsStarted]);

  expect(windowStartup).toHaveBeenCalledOnce();
  expect(extensionStartup).toHaveBeenCalledOnce();
  expect(app.whenReady()).toBe(ready);
  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
  expect(app.emit('podman-desktop:playwright-ready')).toBe(false);
  await vi.advanceTimersByTimeAsync(120_000);
  expect(app.exit).not.toHaveBeenCalled();
});

test('an early Playwright acknowledgement still waits for Electron readiness', async () => {
  await import('./startup-handshake.js');
  const startup = vi.fn();
  const started = app.whenReady().then(startup);
  app.emit('podman-desktop:playwright-ready');
  await vi.advanceTimersByTimeAsync(0);
  expect(startup).not.toHaveBeenCalled();

  electronReady.resolve();
  await started;
  expect(startup).toHaveBeenCalledOnce();
});

test('exits instead of starting without an acknowledgement when the handshake times out', async () => {
  await import('./startup-handshake.js');
  electronReady.resolve();
  const rejected = expect(app.whenReady()).rejects.toThrow('Playwright startup handshake timed out after 120000ms');
  await vi.advanceTimersByTimeAsync(119_999);
  expect(app.exit).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1);
  await rejected;

  expect(app.exit).toHaveBeenCalledWith(1);
  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});

test('quitting cancels the handshake and its timeout', async () => {
  await import('./startup-handshake.js');
  const rejected = expect(app.whenReady()).rejects.toThrow(
    'Application quit before the Playwright startup handshake completed',
  );
  app.emit('before-quit');
  await rejected;

  expect(app.eventNames()).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
  await vi.advanceTimersByTimeAsync(120_000);
  expect(app.exit).not.toHaveBeenCalled();
});

test('the E2E entry point installs the gate before loading the application', async () => {
  const startup = vi.fn();
  let started: Promise<void> | undefined;
  vi.doMock(import('/@/index.js'), () => {
    started = app.whenReady().then(startup);
    return {};
  });

  await import('./index.js');
  electronReady.resolve();
  await vi.advanceTimersByTimeAsync(0);
  expect(startup).not.toHaveBeenCalled();

  expect(app.emit('podman-desktop:playwright-ready')).toBe(true);
  await started;
  expect(startup).toHaveBeenCalledOnce();
});
