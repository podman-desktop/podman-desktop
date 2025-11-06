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

import type { Telemetry } from '/@/plugin/telemetry/telemetry.js';

import type { Directories } from './directories.js';
import { LockedConfiguration } from './locked-configuration.js';

// mock the fs/promises module
vi.mock('node:fs/promises');

let lockedConfiguration: LockedConfiguration;
const getManagedDefaultsDirectoryMock = vi.fn();
const directories = {
  getManagedDefaultsDirectory: getManagedDefaultsDirectoryMock,
} as unknown as Directories;

const telemetry: Telemetry = {
  track: vi.fn(),
} as unknown as Telemetry;

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  lockedConfiguration = new LockedConfiguration(directories, telemetry);
});

describe('LockedConfiguration', () => {
  test('should load managed locked when file exists', async () => {
    getManagedDefaultsDirectoryMock.mockReturnValue('/test/path');
    const managedLocked = { locked: ['telemetry.enabled', 'some.other.setting'] };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(managedLocked));

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = await lockedConfiguration.getContent();

    expect(result).toEqual(managedLocked);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Loaded managed locked from:'));
    expect(telemetry.track).toHaveBeenCalledWith('managedConfigurationEnabledAndLocked');
    consoleSpy.mockRestore();
  });

  test('should handle missing managed locked file gracefully', async () => {
    getManagedDefaultsDirectoryMock.mockReturnValue('/test/path');
    const error = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    vi.mocked(readFile).mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    const result = await lockedConfiguration.getContent();

    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No managed locked file found'));
    consoleSpy.mockRestore();
  });

  test('should handle corrupted managed locked file gracefully', async () => {
    getManagedDefaultsDirectoryMock.mockReturnValue('/test/path');
    vi.mocked(readFile).mockResolvedValue('invalid json');

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await lockedConfiguration.getContent();

    expect(result).toEqual({});
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Managed-by]: Failed to parse managed locked from'),
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});
