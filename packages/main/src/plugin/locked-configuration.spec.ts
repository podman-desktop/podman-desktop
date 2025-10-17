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

import * as fs from 'node:fs';

import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  SYSTEM_LOCKED_FILE_LINUX,
  SYSTEM_LOCKED_FILE_MAC,
  SYSTEM_LOCKED_FILE_WINDOWS_DIR,
  SYSTEM_LOCKED_FILE_WINDOWS_FILE,
} from '/@api/configuration/system-defaults.js';

import * as util from '../util.js';
import { LockedConfiguration } from './locked-configuration.js';

const isMacMock = vi.spyOn(util, 'isMac');
const isWindowsMock = vi.spyOn(util, 'isWindows');
const isLinuxMock = vi.spyOn(util, 'isLinux');

const originalProcessEnv = process.env;

afterEach(() => {
  process.env = originalProcessEnv;
  vi.resetAllMocks();
});

describe('LockedConfiguration', () => {
  test('getManagedLockedFile should return Mac path when running on Mac', () => {
    isMacMock.mockReturnValue(true);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(false);

    const lockedConfiguration = new LockedConfiguration();
    const lockedFile = lockedConfiguration['getManagedLockedFile']();

    expect(lockedFile).toBe(SYSTEM_LOCKED_FILE_MAC);
  });

  test('getManagedLockedFile should return Windows path when running on Windows', () => {
    isMacMock.mockReturnValue(false);
    isWindowsMock.mockReturnValue(true);
    isLinuxMock.mockReturnValue(false);

    process.env = { PROGRAMDATA: 'C:\\ProgramData' };

    const lockedConfiguration = new LockedConfiguration();
    const lockedFile = lockedConfiguration['getManagedLockedFile']();

    expect(lockedFile).toContain('ProgramData');
    expect(lockedFile).toContain(SYSTEM_LOCKED_FILE_WINDOWS_DIR);
    expect(lockedFile).toContain(SYSTEM_LOCKED_FILE_WINDOWS_FILE);
  });

  test('getManagedLockedFile should return Linux path when running on Linux', () => {
    isMacMock.mockReturnValue(false);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(true);

    const lockedConfiguration = new LockedConfiguration();
    const lockedFile = lockedConfiguration['getManagedLockedFile']();

    expect(lockedFile).toBe(SYSTEM_LOCKED_FILE_LINUX);
  });

  test('getManagedLockedFile should fallback to Linux path when OS is not detected', () => {
    isMacMock.mockReturnValue(false);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(false);

    const lockedConfiguration = new LockedConfiguration();
    const lockedFile = lockedConfiguration['getManagedLockedFile']();

    expect(lockedFile).toBe(SYSTEM_LOCKED_FILE_LINUX);
  });

  test('getContent should return empty object when file does not exist', async () => {
    isMacMock.mockReturnValue(true);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(false);

    const readFileMock = vi.spyOn(fs.promises, 'readFile');
    readFileMock.mockRejectedValue(new Error('ENOENT: no such file or directory'));

    const lockedConfiguration = new LockedConfiguration();
    const content = await lockedConfiguration.getContent();

    expect(content).toEqual({});
  });

  test('getContent should return parsed JSON when file exists and is valid', async () => {
    isMacMock.mockReturnValue(true);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(false);

    const mockContent = {
      locked: ['telemetry.enabled', 'some.other.setting'],
    };

    const readFileMock = vi.spyOn(fs.promises, 'readFile');
    readFileMock.mockResolvedValue(JSON.stringify(mockContent));

    const lockedConfiguration = new LockedConfiguration();
    const content = await lockedConfiguration.getContent();

    expect(content).toEqual(mockContent);
  });

  test('getContent should return empty object when file exists but has invalid JSON', async () => {
    isMacMock.mockReturnValue(true);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(false);

    const readFileMock = vi.spyOn(fs.promises, 'readFile');
    readFileMock.mockResolvedValue('invalid json content');

    const lockedConfiguration = new LockedConfiguration();
    const content = await lockedConfiguration.getContent();

    expect(content).toEqual({});
  });

  test('getContent should log success message when file is loaded successfully', async () => {
    isMacMock.mockReturnValue(true);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(false);

    const mockContent = {
      locked: ['telemetry.enabled'],
    };

    const readFileMock = vi.spyOn(fs.promises, 'readFile');
    readFileMock.mockResolvedValue(JSON.stringify(mockContent));

    const consoleLogMock = vi.spyOn(console, 'log');

    const lockedConfiguration = new LockedConfiguration();
    await lockedConfiguration.getContent();

    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('[Managed-by]: Loaded managed locked from:'));
  });

  test('getContent should log error message when file loading fails', async () => {
    isMacMock.mockReturnValue(true);
    isWindowsMock.mockReturnValue(false);
    isLinuxMock.mockReturnValue(false);

    const readFileMock = vi.spyOn(fs.promises, 'readFile');
    readFileMock.mockRejectedValue(new Error('Read error'));

    const consoleErrorMock = vi.spyOn(console, 'error');

    const lockedConfiguration = new LockedConfiguration();
    await lockedConfiguration.getContent();

    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('[Managed-by]: Failed to parse managed locked from'),
      expect.any(Error),
    );
  });
});
