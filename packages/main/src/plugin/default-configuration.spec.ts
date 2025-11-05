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

import { readFile } from 'node:fs/promises';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { DefaultConfiguration } from './default-configuration.js';
import type { Directories } from './directories.js';

// mock the fs module
vi.mock('node:fs/promises');

let defaultConfiguration: DefaultConfiguration;
const getManagedDefaultsDirectoryMock = vi.fn();
const directories = {
  getManagedDefaultsDirectory: getManagedDefaultsDirectoryMock,
} as unknown as Directories;

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  defaultConfiguration = new DefaultConfiguration(directories);
});

describe('DefaultConfiguration', () => {
  test('should load managed defaults when file exists', async () => {
    getManagedDefaultsDirectoryMock.mockReturnValue('/test/path');
    const managedDefaults = { 'managed.setting': 'managedValue' };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(managedDefaults));

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = await defaultConfiguration.getContent();

    expect(result).toEqual(managedDefaults);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Loaded managed defaults from:'));
    consoleSpy.mockRestore();
  });

  test('should handle missing managed defaults file gracefully', async () => {
    getManagedDefaultsDirectoryMock.mockReturnValue('/test/path');
    const error = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    vi.mocked(readFile).mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    const result = await defaultConfiguration.getContent();

    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No managed defaults file found'));
    consoleSpy.mockRestore();
  });

  test('should handle corrupted managed defaults file gracefully', async () => {
    getManagedDefaultsDirectoryMock.mockReturnValue('/test/path');
    vi.mocked(readFile).mockResolvedValue('invalid json');

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await defaultConfiguration.getContent();

    expect(result).toEqual({});
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to parse managed defaults from'),
      expect.anything(),
    );
    consoleErrorSpy.mockRestore();
  });

  test('should load managed defaults configuration with valid JSON', async () => {
    getManagedDefaultsDirectoryMock.mockReturnValue('/test/path');
    const managedDefaults = { 'managed.setting': 'managedValue', 'another.setting': 'anotherValue' };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(managedDefaults));

    const result = await defaultConfiguration.getContent();

    expect(result).toEqual(managedDefaults);
  });
});
