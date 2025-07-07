/*********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
 ********************************************************************/

import type { App as ElectronApp, BrowserWindow, Event as ElectronEvent } from 'electron';
import { assert, beforeEach, describe, expect, test, vi } from 'vitest';

import { createNewWindow, restoreWindow } from '/@/mainWindow.js';
import { WindowPlugin } from '/@/plugin/app-ready/window-plugin.js';
import { isMac } from '/@/util.js';

// mock createNewWindow & restoreWindow
vi.mock(import('/@/mainWindow.js'));
vi.mock(import('electron-context-menu'), () => ({
  default: vi.fn(),
}));
// mock isMac
vi.mock(import('/@/util.js'));

const ELECTRON_APP_MOCK: ElectronApp = {
  on: vi.fn(),
} as unknown as ElectronApp;

const BROWSER_WINDOW_MOCK: BrowserWindow = {
  id: 42,
} as unknown as BrowserWindow;

const CREATE_WINDOW_PROMISE_WITH_RESOLVERS: PromiseWithResolvers<BrowserWindow> = Promise.withResolvers();

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(createNewWindow).mockReturnValue(CREATE_WINDOW_PROMISE_WITH_RESOLVERS.promise);
  vi.mocked(restoreWindow).mockResolvedValue(undefined);

  // default to false
  vi.mocked(isMac).mockReturnValue(false);
});

test('no window operation should be triggered on constructor', async () => {
  const plugin = new WindowPlugin(ELECTRON_APP_MOCK, vi.fn());
  expect(plugin).toBeDefined();

  expect(ELECTRON_APP_MOCK.on).not.toHaveBeenCalled();
  expect(createNewWindow).not.toHaveBeenCalled();
  expect(restoreWindow).not.toHaveBeenCalled();
});

test('onReady should createWindow & register on activate listener', async () => {
  const plugin = new WindowPlugin(ELECTRON_APP_MOCK, vi.fn());
  await plugin.onReady();

  expect(createNewWindow).toHaveBeenCalledOnce();
  expect(ELECTRON_APP_MOCK.on).toHaveBeenCalledOnce();
  expect(ELECTRON_APP_MOCK.on).toHaveBeenCalledWith('activate', expect.any(Function));
});

test('createNewWindow results should be passed to constructor callback', async () => {
  const resolveMock = vi.fn();

  const plugin = new WindowPlugin(ELECTRON_APP_MOCK, resolveMock);
  await plugin.onReady();

  expect(resolveMock).not.toHaveBeenCalled();
  CREATE_WINDOW_PROMISE_WITH_RESOLVERS.resolve(BROWSER_WINDOW_MOCK);

  await vi.waitFor(() => {
    expect(resolveMock).toHaveBeenCalledOnce();
    expect(resolveMock).toHaveBeenCalledWith(BROWSER_WINDOW_MOCK);
  });
});

const DUMMY_ELECTRON_EVENT: ElectronEvent = {} as unknown as ElectronEvent;

describe('activate', () => {
  let listener: (event: ElectronEvent, hasVisibleWindows: boolean) => void;

  beforeEach(async () => {
    const plugin = new WindowPlugin(ELECTRON_APP_MOCK, vi.fn());
    await plugin.onReady();

    expect(ELECTRON_APP_MOCK.on).toHaveBeenCalledOnce();

    const mListener = vi.mocked(ELECTRON_APP_MOCK.on).mock.calls[0]?.[1];
    assert(mListener);

    listener = mListener;

    vi.mocked(createNewWindow).mockClear();
    vi.mocked(restoreWindow).mockClear();
  });

  test('activate listener should call createNewWindow', async () => {
    expect(createNewWindow).not.toHaveBeenCalled();

    listener(DUMMY_ELECTRON_EVENT, false);

    expect(createNewWindow).toHaveBeenCalledOnce();
  });

  test('activate listener on MacOS should call restoreWindow', async () => {
    vi.mocked(isMac).mockReturnValue(true);
    expect(restoreWindow).not.toHaveBeenCalled();

    listener(DUMMY_ELECTRON_EVENT, false);

    expect(restoreWindow).toHaveBeenCalledOnce();
  });
});
