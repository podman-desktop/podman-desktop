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
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { CodeMain } from '/@/code-main.js';
import { isWindows } from '/@/util.js';

// mock electron
vi.mock('electron');
vi.mock('/@/util.js');

const ELECTRON_APP_MOCK: ElectronApp = {
  name: 'dummy-electron-mock',
  disableHardwareAcceleration: vi.fn(),
  requestSingleInstanceLock: vi.fn(),
  setAppUserModelId: vi.fn(),
  quit: vi.fn(),
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

  const code = new CodeMain(ELECTRON_APP_MOCK);
  code.main([]);

  expect(ELECTRON_APP_MOCK.quit).toHaveBeenCalledOnce();
  expect(process.exit).toHaveBeenCalledOnce();
});

test('hardware acceleration should be disabled', async () => {
  const code = new CodeMain(ELECTRON_APP_MOCK);
  code.main([]);

  expect(ELECTRON_APP_MOCK.disableHardwareAcceleration).toHaveBeenCalledOnce();
});

test('on windows setAppUserModelId should be called', async () => {
  vi.mocked(isWindows).mockReturnValue(true);

  const code = new CodeMain(ELECTRON_APP_MOCK);
  code.main([]);

  expect(ELECTRON_APP_MOCK.setAppUserModelId).toHaveBeenCalledWith(ELECTRON_APP_MOCK.name);
});
