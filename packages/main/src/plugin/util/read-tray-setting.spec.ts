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

import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';

import { beforeEach, expect, test, vi } from 'vitest';

import { isLinux } from '/@/util.js';

import { readShowTrayIconSetting } from './read-tray-setting.js';

vi.mock(import('node:fs'), () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock(import('node:os'), () => ({
  homedir: vi.fn(),
}));

vi.mock(import('/@/util.js'), () => ({
  isLinux: vi.fn(),
}));

const originalProcessEnv = process.env;

beforeEach(() => {
  process.env = { ...originalProcessEnv };
  vi.clearAllMocks();
  vi.mocked(homedir).mockReturnValue('/home/user');
  vi.mocked(isLinux).mockReturnValue(true);
});

test('should return true when settings file does not exist', () => {
  vi.mocked(existsSync).mockReturnValue(false);

  const result = readShowTrayIconSetting();

  expect(result).toBe(true);
});

test('should return true when ShowTrayIcon is not set', () => {
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(readFileSync).mockReturnValue(JSON.stringify({}));

  const result = readShowTrayIconSetting();

  expect(result).toBe(true);
});

test('should return true when ShowTrayIcon is true', () => {
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ 'preferences.ShowTrayIcon': true }));

  const result = readShowTrayIconSetting();

  expect(result).toBe(true);
});

test('should return false when ShowTrayIcon is false', () => {
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ 'preferences.ShowTrayIcon': false }));

  const result = readShowTrayIconSetting();

  expect(result).toBe(false);
});

test('should return true on JSON parse error', () => {
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(readFileSync).mockReturnValue('invalid json');

  const result = readShowTrayIconSetting();

  expect(result).toBe(true);
});

test('should return true on filesystem error', () => {
  vi.mocked(existsSync).mockImplementation(() => {
    throw new Error('Filesystem error');
  });

  const result = readShowTrayIconSetting();

  expect(result).toBe(true);
});
