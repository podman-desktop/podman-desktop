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
import { appendFile, readFile } from 'node:fs/promises';

import type { WebContents, WebPreferences } from 'electron';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { registerStartupDiagnostics } from './startup-diagnostics.js';

vi.mock(import('node:fs/promises'));

let contents: WebContents;
const preferences: WebPreferences = { preload: '/app/preload.cjs', sandbox: true };
const getLastWebPreferences = vi.fn<() => WebPreferences>();

function logEntries(): { event: string; sequence: number; elapsedMs: number; details: unknown }[] {
  return vi.mocked(appendFile).mock.calls.map(([, entry]) => JSON.parse(String(entry)));
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('PODMAN_DESKTOP_STARTUP_DIAGNOSTICS', '1');
  vi.stubEnv('PODMAN_DESKTOP_STARTUP_DIAGNOSTICS_FILE', '/tmp/startup.jsonl');
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.mocked(appendFile).mockResolvedValue(undefined);
  vi.mocked(readFile).mockResolvedValue(Buffer.from('preload source'));
  getLastWebPreferences.mockReturnValue({ ...preferences, contextIsolation: true, nodeIntegration: false });
  contents = Object.assign(new EventEmitter(), {
    id: 7,
    getOSProcessId: vi.fn().mockReturnValue(99),
    getURL: vi.fn().mockReturnValue('file:///app/index.html'),
    getLastWebPreferences,
    mainFrame: { processId: 4, routingId: 1, url: 'file:///app/index.html', detached: false },
  }) as unknown as WebContents;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('normal application launches do not register diagnostics or read the preload', () => {
  vi.stubEnv('PODMAN_DESKTOP_STARTUP_DIAGNOSTICS', undefined);
  registerStartupDiagnostics(contents, preferences);

  expect(contents.eventNames()).toEqual([]);
  expect(readFile).not.toHaveBeenCalled();
  expect(appendFile).not.toHaveBeenCalled();
  expect(getLastWebPreferences).not.toHaveBeenCalled();
});

test('records effective preferences separately from constructor preferences and refreshes them at dom-ready', () => {
  registerStartupDiagnostics(contents, preferences);
  getLastWebPreferences.mockReturnValue({ ...preferences, contextIsolation: false });
  contents.emit('dom-ready');

  expect(
    logEntries()
      .filter(entry => entry.event === 'effective-preferences')
      .map(entry => entry.details),
  ).toEqual([
    {
      stage: 'window-created',
      available: true,
      preferences: { ...preferences, contextIsolation: true, nodeIntegration: false },
    },
    { stage: 'dom-ready', available: true, preferences: { ...preferences, contextIsolation: false } },
  ]);
});

test('an unavailable preferences API does not interrupt diagnostics', () => {
  Object.assign(contents, { getLastWebPreferences: undefined });
  registerStartupDiagnostics(contents, preferences);

  expect(logEntries()).toContainEqual(
    expect.objectContaining({
      event: 'effective-preferences',
      details: { stage: 'window-created', available: false },
    }),
  );
});

test('a failing preferences API does not interrupt navigation logging', () => {
  getLastWebPreferences.mockImplementation(() => {
    throw new Error('preferences unavailable');
  });
  registerStartupDiagnostics(contents, preferences);
  contents.emit('did-finish-load');

  expect(logEntries()).toContainEqual(expect.objectContaining({ event: 'effective-preferences-error' }));
  expect(logEntries()).toContainEqual(expect.objectContaining({ event: 'did-finish-load' }));
});

test('correlates navigation and preload IPC with frame identities in emission order', () => {
  registerStartupDiagnostics(contents, preferences);
  contents.emit('did-start-navigation', {
    url: 'file:///app/index.html',
    isSameDocument: false,
    isMainFrame: true,
    frame: contents.mainFrame,
  });
  contents.emit('ipc-message', { senderFrame: contents.mainFrame }, 'startup-diagnostics:preload', {
    stage: 'events-exposed',
  });
  contents.emit('did-frame-navigate', {}, 'file:///app/index.html', -1, '', true, 4, 1);
  contents.emit('dom-ready');

  const entries = logEntries();
  expect(entries.map(entry => entry.sequence)).toEqual(entries.map((_, index) => index + 1));
  expect(entries.map(entry => entry.elapsedMs)).toEqual(
    entries.map(entry => entry.elapsedMs).toSorted((a, b) => a - b),
  );
  expect(entries.find(entry => entry.event === 'did-start-navigation')?.details).toEqual({
    url: 'file:///app/index.html',
    isSameDocument: false,
    isMainFrame: true,
    frame: { processId: 4, routingId: 1, url: 'file:///app/index.html' },
  });
  expect(entries.find(entry => entry.event === 'preload-sender')?.details).toEqual({
    frame: { processId: 4, routingId: 1, url: 'file:///app/index.html' },
  });
  expect(entries.find(entry => entry.event === 'did-frame-navigate')?.details).toEqual({
    url: 'file:///app/index.html',
    isMainFrame: true,
    frameProcessId: 4,
    frameRoutingId: 1,
  });
});

test('navigation diagnostics tolerate a detached or missing frame', () => {
  registerStartupDiagnostics(contents, preferences);
  contents.emit('did-start-navigation', { url: 'file:///app/index.html', frame: null });
  contents.emit('frame-created', {}, { frame: { detached: true } });

  expect(logEntries()).toContainEqual(expect.objectContaining({ event: 'frame-created', details: {} }));
});

test('persists preload errors before the document is ready', () => {
  registerStartupDiagnostics(contents, preferences);
  const error = new Error('module is not available in sandbox');
  contents.emit('preload-error', {}, '/app/preload.cjs', error);

  expect(appendFile).toHaveBeenCalledWith(
    '/tmp/startup.jsonl',
    expect.stringContaining('module is not available in sandbox'),
  );
  expect(appendFile).toHaveBeenCalledWith('/tmp/startup.jsonl', expect.stringContaining('"event":"preload-error"'));
});

test('captures bundle entry markers without recursively logging forwarded main console messages', () => {
  registerStartupDiagnostics(contents, preferences);
  vi.mocked(appendFile).mockClear();
  contents.emit('console-message', {
    level: 'info',
    message: '[preload startup] bundle-entry 99',
    sourceId: '/app/preload.cjs',
    lineNumber: 1,
  });
  contents.emit('console-message', { level: 'info', message: 'main ↪️ [startup diagnostics] forwarded message' });

  expect(appendFile).toHaveBeenCalledOnce();
  expect(appendFile).toHaveBeenCalledWith(
    '/tmp/startup.jsonl',
    expect.stringContaining('[preload startup] bundle-entry'),
  );
});

test('records preload stage messages directly from IPC', () => {
  registerStartupDiagnostics(contents, preferences);
  contents.emit('ipc-message', {}, 'startup-diagnostics:preload', { stage: 'events-exposed', rendererPID: 99 });

  expect(appendFile).toHaveBeenCalledWith('/tmp/startup.jsonl', expect.stringContaining('"event":"preload-stage"'));
  expect(appendFile).toHaveBeenCalledWith('/tmp/startup.jsonl', expect.stringContaining('"stage":"events-exposed"'));
});

test('records an unreadable preload without interrupting window startup', async () => {
  vi.mocked(readFile).mockRejectedValue(new Error('ENOENT'));
  registerStartupDiagnostics(contents, preferences);

  await vi.waitFor(() => {
    expect(appendFile).toHaveBeenCalledWith(
      '/tmp/startup.jsonl',
      expect.stringContaining('"event":"preload-file-error"'),
    );
  });
});

test('reads actual Linux renderer sandbox flags even without a preload stage message', async () => {
  vi.stubGlobal('process', { ...process, platform: 'linux' });
  vi.mocked(readFile)
    .mockResolvedValueOnce(Buffer.from('preload source'))
    .mockResolvedValueOnce('electron\0--type=renderer\0--enable-sandbox\0--no-sandbox\0--unrelated=value\0');
  registerStartupDiagnostics(contents, preferences);
  contents.emit('dom-ready');

  await vi.waitFor(() => {
    expect(appendFile).toHaveBeenCalledWith(
      '/tmp/startup.jsonl',
      expect.stringContaining('"flags":["--type=renderer","--enable-sandbox","--no-sandbox"]'),
    );
  });
  expect(readFile).toHaveBeenCalledWith('/proc/99/cmdline', 'utf8');
});
