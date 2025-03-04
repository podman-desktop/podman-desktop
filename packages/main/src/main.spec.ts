/**********************************************************************
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
 ***********************************************************************/
import type { App as ElectronApp } from 'electron';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { SecurityRestrictions } from '/@/security-restrictions.js';
import { isLinux, isMac, isWindows } from '/@/util.js';

import { Main } from './main.js';

// mock electron
vi.mock('electron');
vi.mock('/@/util.js');
vi.mock('/@/security-restrictions.js');

const ELECTRON_APP_MOCK: ElectronApp = {
  name: 'dummy-electron-mock',
  disableHardwareAcceleration: vi.fn(),
  requestSingleInstanceLock: vi.fn(),
  setAppUserModelId: vi.fn(),
  quit: vi.fn(),
  on: vi.fn(),
} as unknown as ElectronApp;

let PROCESS_EXIT_ORIGINAL: typeof process.exit;

beforeEach(() => {
  vi.resetAllMocks();

  // mock process.exit
  PROCESS_EXIT_ORIGINAL = process.exit;
  (process.exit as unknown) = vi.fn();

  // mock current being primary instance
  vi.mocked(ELECTRON_APP_MOCK.requestSingleInstanceLock).mockReturnValue(true);
});

afterEach(() => {
  // restore proper process.exit
  process.exit = PROCESS_EXIT_ORIGINAL;
});

test('running main for non-primary instance should quit application', () => {
  // mock current not primary instance
  vi.mocked(ELECTRON_APP_MOCK.requestSingleInstanceLock).mockReturnValue(false);

  const code = new Main(ELECTRON_APP_MOCK);
  code.main([]);

  expect(ELECTRON_APP_MOCK.quit).toHaveBeenCalledOnce();
  expect(process.exit).toHaveBeenCalledOnce();
});

test('hardware acceleration should be disabled', async () => {
  const code = new Main(ELECTRON_APP_MOCK);
  code.main([]);

  expect(ELECTRON_APP_MOCK.disableHardwareAcceleration).toHaveBeenCalledOnce();
});

test('security restriction should be initialized', async () => {
  const code = new Main(ELECTRON_APP_MOCK);
  code.main([]);

  expect(SecurityRestrictions.prototype.init).toHaveBeenCalledOnce();
});

test('on windows setAppUserModelId should be called', async () => {
  vi.mocked(isWindows).mockReturnValue(true);

  const code = new Main(ELECTRON_APP_MOCK);
  code.main([]);

  expect(ELECTRON_APP_MOCK.setAppUserModelId).toHaveBeenCalledWith(ELECTRON_APP_MOCK.name);
});

// Utility type definition for {@link ElectronApp.on} and {@link WebContents.on}
type Listener = (...args: unknown[]) => void;

/**
 * Utility function to get listener register in {@link ELECTRON_APP_MOCK.on}
 * @remarks cannot found any way to properly infer type based on event value (see https://github.com/microsoft/TypeScript/issues/53439)
 * @param event
 */
function findElectronAppListener(event: string): Listener | undefined {
  expect(ELECTRON_APP_MOCK.on).toHaveBeenCalledWith(event, expect.any(Function));
  return vi.mocked(ELECTRON_APP_MOCK.on).mock.calls.find(([mEvent]) => mEvent === event)?.[1];
}

/**
 * Based on {@link findElectronAppListener}, throw an error if the result is undefined
 * @param event
 */
function getElectronAppListener(event: string): Listener {
  const listener = findElectronAppListener(event);
  if (!listener) throw new Error(`cannot found listener for event ${event}`);
  return listener;
}

describe('ElectronApp#on window-all-closed', () => {
  let code: Main;
  beforeEach(() => {
    code = new Main(ELECTRON_APP_MOCK);
    code.main([]);
  });

  test('listener should be registered on init', () => {
    expect(ELECTRON_APP_MOCK.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
  });

  test('listener should be a valid function', () => {
    const listener = findElectronAppListener('window-all-closed');
    expect(listener).toBeDefined();
    expect(listener).toBeInstanceOf(Function);
  });

  test('listener should not call ElectronApp#quit on mac', () => {
    vi.mocked(isMac).mockReturnValue(true);

    const listener = getElectronAppListener('window-all-closed');
    listener();

    expect(ELECTRON_APP_MOCK.quit).not.toHaveBeenCalled();
  });

  test.each(['windows', 'linux'])('listener should not call ElectronApp#quit on %s', platform => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(platform === 'windows');
    vi.mocked(isLinux).mockReturnValue(platform === 'linux');

    const listener = getElectronAppListener('window-all-closed');
    listener();

    expect(ELECTRON_APP_MOCK.quit).toHaveBeenCalledOnce();
  });
});
