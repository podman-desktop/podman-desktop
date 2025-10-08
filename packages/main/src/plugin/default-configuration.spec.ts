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

import { promises as fsPromises } from 'node:fs';
import * as path from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isLinux, isMac, isWindows } from '../util.js';
import { DefaultConfiguration } from './default-configuration.js';

// mock the fs module as we don't want to check the read file / exists / promises, but rather
vi.mock(import('node:fs'));

// mock util functions
vi.mock('../util.js', () => ({
  isMac: vi.fn(),
  isWindows: vi.fn(),
  isLinux: vi.fn(),
}));

let defaultConfiguration: DefaultConfiguration;

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  defaultConfiguration = new DefaultConfiguration();
});

describe('DefaultConfiguration', () => {
  test('should get correct managed defaults file path for Mac', () => {
    vi.mocked(isMac).mockReturnValue(true);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const managedDefaultsFile = defaultConfiguration['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe('/Library/Application Support/com.podman.desktop/default-settings.json');
  });

  test('should get correct managed defaults file path for Windows', () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(true);
    vi.mocked(isLinux).mockReturnValue(false);

    process.env['PROGRAMDATA'] = 'C:\\ProgramData';
    const managedDefaultsFile = defaultConfiguration['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe(path.join('C:\\ProgramData', 'PodmanDesktop', 'default-settings.json'));
  });

  test('should get correct managed defaults file path for Linux', () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(true);

    const managedDefaultsFile = defaultConfiguration['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe('/usr/share/podman-desktop/default-settings.json');
  });

  test('should fallback to Linux path for unknown platforms', () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const managedDefaultsFile = defaultConfiguration['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe('/usr/share/podman-desktop/default-settings.json');
  });

  test('should load managed defaults when file exists', async () => {
    const managedDefaults = { 'managed.setting': 'managedValue' };
    vi.mocked(fsPromises.readFile).mockResolvedValue(JSON.stringify(managedDefaults));

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = await defaultConfiguration.getContent();

    expect(result).toEqual(managedDefaults);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Loaded managed defaults from:'));
    consoleSpy.mockRestore();
  });

  test('should handle missing managed defaults file gracefully', async () => {
    const error = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    vi.mocked(fsPromises.readFile).mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    const result = await defaultConfiguration.getContent();

    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No managed defaults file found'));
    consoleSpy.mockRestore();
  });

  test('should handle corrupted managed defaults file gracefully', async () => {
    vi.mocked(fsPromises.readFile).mockResolvedValue('invalid json');

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
    const managedDefaults = { 'managed.setting': 'managedValue', 'another.setting': 'anotherValue' };
    vi.mocked(fsPromises.readFile).mockResolvedValue(JSON.stringify(managedDefaults));

    const result = await defaultConfiguration.getContent();

    expect(result).toEqual(managedDefaults);
  });
});
