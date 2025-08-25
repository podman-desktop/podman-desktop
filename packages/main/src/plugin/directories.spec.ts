/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { Directories } from './directories.js';

class TestDirectories extends Directories {
  public getDesktopAppHomeDir(): string {
    return this.desktopAppHomeDir;
  }
}

let directories: TestDirectories;

const originalProcessEnv = process.env;

beforeEach(() => {
  // mock the env variable
  process.env = { ...process.env };

  // mock the fs module
  vi.mock('node:fs');

  // mock the existSync and mkdir methods
  const existSyncSpy = vi.spyOn(fs, 'existsSync');
  existSyncSpy.mockImplementation(() => true);

  const mkdirSpy = vi.spyOn(fs, 'mkdirSync');
  mkdirSpy.mockImplementation(() => '');
});

afterEach(() => {
  process.env = originalProcessEnv;
});

describe('Linux/Unix systems (XDG)', () => {
  beforeEach(() => {
    vi.spyOn(process, 'platform', 'get').mockReturnValue('linux');
  });

  test('should use XDG directories by default', async () => {
    // Mock no existing default configuration to trigger XDG usage
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    directories = new TestDirectories();

    const dataDir = directories.getDataDirectory();
    const configDir = directories.getConfigurationDirectory();
    const desktopAppHomeDir = directories.getDesktopAppHomeDir();

    // Should follow XDG Base Directory Specification
    expect(configDir).toEqual(path.resolve(os.homedir(), '.config', 'containers', 'podman-desktop'));
    expect(dataDir).toEqual(path.resolve(os.homedir(), '.local', 'share', 'containers', 'podman-desktop'));

    // desktopAppHomeDir should point to data directory for backward compatibility
    expect(desktopAppHomeDir).toEqual(dataDir);
  });

  test('should respect custom XDG environment variables set by user', async () => {
    const customDataHome = '/custom/data/home';
    const customConfigHome = '/custom/config/home';

    // Mock no existing default configuration to trigger XDG usage
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Mock XDG environment variables using vi.stubEnv
    vi.stubEnv('XDG_DATA_HOME', customDataHome);
    vi.stubEnv('XDG_CONFIG_HOME', customConfigHome);

    directories = new TestDirectories();

    const dataDir = directories.getDataDirectory();
    const configDir = directories.getConfigurationDirectory();

    // should use custom XDG paths
    expect(dataDir).toEqual(path.resolve(customDataHome, 'containers', 'podman-desktop'));
    expect(configDir).toEqual(path.resolve(customConfigHome, 'containers', 'podman-desktop'));
  });

  test('should use default directory structure when PODMAN_DESKTOP_HOME_DIR is set by user', async () => {
    const wantedDirectory = '/fake-directory';

    // add the env variable
    process.env[Directories.PODMAN_DESKTOP_HOME_DIR] = wantedDirectory;

    directories = new TestDirectories();
    const result = directories.getDesktopAppHomeDir();

    // should be the directory provided as env var
    expect(result).toEqual(wantedDirectory);
  });

  test('should use default structure when existing configuration is detected on Linux', async () => {
    // Mock existing default configuration to trigger default structure usage
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    directories = new TestDirectories();

    const dataDir = directories.getDataDirectory();
    const configDir = directories.getConfigurationDirectory();
    const desktopAppHomeDir = directories.getDesktopAppHomeDir();

    // Should use default structure when configuration exists
    const baseDir = path.resolve(os.homedir(), '.local', 'share', 'containers', 'podman-desktop');
    expect(dataDir).toEqual(baseDir);
    expect(configDir).toEqual(path.resolve(baseDir, 'configuration'));
    expect(desktopAppHomeDir).toEqual(dataDir);
  });
});

describe.each(['win32', 'darwin'])('Non-Linux systems (%s) default directory structure', platform => {
  beforeEach(() => {
    vi.spyOn(process, 'platform', 'get').mockReturnValue(platform as NodeJS.Platform);
  });

  test('should use default directory structure', async () => {
    directories = new TestDirectories();

    const dataDir = directories.getDataDirectory();
    const configDir = directories.getConfigurationDirectory();
    const desktopAppHomeDir = directories.getDesktopAppHomeDir();

    // Non-Linux should use default structure
    const baseDir = path.resolve(os.homedir(), '.local', 'share', 'containers', 'podman-desktop');
    expect(dataDir).toEqual(baseDir);
    expect(configDir).toEqual(path.resolve(baseDir, 'configuration'));

    // desktopAppHomeDir should be same as data directory
    expect(desktopAppHomeDir).toEqual(dataDir);
  });

  test('should override default path', async () => {
    const wantedDirectory = '/fake-directory';

    // add the env variable
    process.env[Directories.PODMAN_DESKTOP_HOME_DIR] = wantedDirectory;

    directories = new TestDirectories();
    const result = directories.getDesktopAppHomeDir();

    // desktop app home dir should not start anymore with user's home dir
    expect(result.startsWith(os.homedir())).toBeFalsy();

    // should not ends with the default path
    expect(result.endsWith(Directories.XDG_DATA_DIRECTORY)).toBeFalsy();

    // should be the directory provided as env var
    expect(result).toEqual(wantedDirectory);
  });
});
