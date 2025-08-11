/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { existsSync } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { Configuration } from '@podman-desktop/api';
import { app } from 'electron';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';

import { MacosStartup } from './macos-startup.js';

type AppGetPathParam = Parameters<typeof app.getPath>[0];

vi.mock('electron', async () => {
  return {
    app: {
      getPath: vi.fn(),
    },
  };
});

vi.mock('node:fs', async () => {
  return {
    existsSync: vi.fn(),
  };
});
vi.mock('node:fs/promises');
vi.mock('node:path');

const configurationRegistry = {
  getConfiguration: vi.fn(),
} as unknown as ConfigurationRegistry;

let macosStartup: MacosStartup;

const fakeAppExe = 'fakeAppExe';
const fakeAppHome = 'fakeAppHome';

const savedCommandLine = `/usr/bin/truncate -s 0 '${fakeAppHome}/Library/Logs/Podman Desktop/launchd-stdout.log'; /usr/bin/truncate -s 0 '${fakeAppHome}/Library/Logs/Podman Desktop/launchd-stderr.log'; '${fakeAppExe}' `;

const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  vi.resetAllMocks();
  console.info = vi.fn();
  console.warn = vi.fn();

  // fake path.resolve by just adding /
  vi.mocked(resolve).mockImplementation((...args: string[]) => args.join('/'));

  vi.mocked(app.getPath).mockImplementation((name: AppGetPathParam) => {
    if (name === 'exe') {
      return fakeAppExe;
    }
    if (name === 'home') {
      return fakeAppHome;
    }
    throw new Error('Unsupported path');
  });
  macosStartup = new MacosStartup(configurationRegistry);
});

afterEach(() => {
  console.info = originalConsoleInfo;
  console.warn = originalConsoleWarn;
});

describe('enable', () => {
  test('check writing the plist file with the correct instruction', async () => {
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(true),
    } as unknown as Configuration);

    await macosStartup.enable();

    // check content being written
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('fakeAppHome/Library/LaunchAgents/io.podman_desktop.PodmanDesktop.plist'),
      expect.stringContaining(savedCommandLine),
      'utf-8',
    );

    // check console
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('Installing Podman Desktop startup file at'));
  });

  test('check unable to write the plist file if app is in /Volumes', async () => {
    // change the app home to be in /Volumes
    vi.mocked(app.getPath).mockImplementation((name: AppGetPathParam) => {
      if (name === 'exe') {
        return `/Volumes/${fakeAppExe}`;
      }
      if (name === 'home') {
        return fakeAppHome;
      }
      throw new Error('Unsupported path');
    });
    // recreate the object to get correct resolve method
    macosStartup = new MacosStartup(configurationRegistry);

    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(true),
    } as unknown as Configuration);

    await macosStartup.enable();

    // check no content has being written
    expect(writeFile).not.toHaveBeenCalled();

    // check console
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  test('check writing the plist file according to login.minimize configuration value', async () => {
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
    } as unknown as Configuration);

    await macosStartup.enable();

    // check content being written
    expect(writeFile).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining(`<string>${savedCommandLine}--minimize</string>`),
      'utf-8',
    );

    vi.mocked(writeFile).mockReset();
    await macosStartup.enable();

    // check content being written
    expect(writeFile).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining(`<string>${savedCommandLine}</string>`),
      'utf-8',
    );
  });
});

describe('disable', () => {
  test('check remove if exists', async () => {
    // mock as file exists
    vi.mocked(existsSync).mockReturnValue(true);

    await macosStartup.disable();

    // check calls on fs
    expect(existsSync).toHaveBeenCalled();
    expect(unlink).toHaveBeenCalled();
  });

  test('check do not remove if not exists', async () => {
    // mock as file not existing
    vi.mocked(existsSync).mockReturnValue(false);

    await macosStartup.disable();

    // check calls on fs
    expect(existsSync).toHaveBeenCalled();
    expect(unlink).not.toHaveBeenCalled();
  });
});

describe('shouldEnable', () => {
  test('check shouldEnable being true', async () => {
    // change the app folder to be in /Applications
    vi.mocked(app.getPath).mockImplementation((name: AppGetPathParam) => {
      if (name === 'exe') {
        return `/Applications/${fakeAppExe}`;
      }
      if (name === 'home') {
        return fakeAppHome;
      }
      throw new Error('Unsupported path');
    });

    // recreate the object to get correct resolve method
    macosStartup = new MacosStartup(configurationRegistry);

    const result = macosStartup.shouldEnable();
    expect(result).toBeTruthy();
  });

  test('check shouldEnable being false', async () => {
    const result = macosStartup.shouldEnable();

    expect(console.warn).toHaveBeenCalledWith(
      'Skipping Start on Login option as the app is not starting from an Applications folder',
    );

    expect(result).toBeFalsy();
  });
});
