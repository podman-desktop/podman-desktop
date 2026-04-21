/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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
import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';

import { app } from 'electron';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { MacosStartup } from './macos-startup.js';

type AppGetPathParam = Parameters<typeof app.getPath>[0];

vi.mock(import('electron'), async () => {
  return {
    app: {
      getPath: vi.fn(),
      setLoginItemSettings: vi.fn(),
    },
  } as unknown as typeof Electron;
});

vi.mock(import('node:fs'), async () => {
  return {
    existsSync: vi.fn(),
  };
});
vi.mock(import('node:fs/promises'));
vi.mock(import('node:path'));

let macosStartup: MacosStartup;

const fakeAppExe = 'fakeAppExe';
const fakeAppHome = 'fakeAppHome';

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
  macosStartup = new MacosStartup();
});

afterEach(() => {
  console.info = originalConsoleInfo;
  console.warn = originalConsoleWarn;
});

describe('enable', () => {
  test('should call app.setLoginItemSettings with openAtLogin true', async () => {
    await macosStartup.enable();

    expect(app.setLoginItemSettings).toHaveBeenCalledWith({
      openAtLogin: true,
    });

    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('Registered Podman Desktop as a login item'));
  });

  test('should remove legacy plist file if it exists', async () => {
    vi.mocked(existsSync).mockReturnValue(true);

    await macosStartup.enable();

    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('Library/LaunchAgents/io.podman_desktop.PodmanDesktop.plist'),
    );
    expect(app.setLoginItemSettings).toHaveBeenCalledWith({
      openAtLogin: true,
    });
  });

  test('should not attempt to remove legacy plist if it does not exist', async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    await macosStartup.enable();

    expect(unlink).not.toHaveBeenCalled();
    expect(app.setLoginItemSettings).toHaveBeenCalledWith({
      openAtLogin: true,
    });
  });

  test('should skip when running from a volume', async () => {
    vi.mocked(app.getPath).mockImplementation((name: AppGetPathParam) => {
      if (name === 'exe') {
        return `/Volumes/${fakeAppExe}`;
      }
      if (name === 'home') {
        return fakeAppHome;
      }
      throw new Error('Unsupported path');
    });
    macosStartup = new MacosStartup();

    await macosStartup.enable();

    expect(app.setLoginItemSettings).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Cannot enable the start on login'));
  });
});

describe('disable', () => {
  test('should call app.setLoginItemSettings with openAtLogin false', async () => {
    await macosStartup.disable();

    expect(app.setLoginItemSettings).toHaveBeenCalledWith({
      openAtLogin: false,
    });
  });

  test('should remove legacy plist file if it exists', async () => {
    vi.mocked(existsSync).mockReturnValue(true);

    await macosStartup.disable();

    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('Library/LaunchAgents/io.podman_desktop.PodmanDesktop.plist'),
    );
    expect(app.setLoginItemSettings).toHaveBeenCalledWith({
      openAtLogin: false,
    });
  });

  test('should not attempt to remove legacy plist if it does not exist', async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    await macosStartup.disable();

    expect(unlink).not.toHaveBeenCalled();
  });
});

describe('shouldEnable', () => {
  test('should return true when running from /Applications', async () => {
    vi.mocked(app.getPath).mockImplementation((name: AppGetPathParam) => {
      if (name === 'exe') {
        return `/Applications/${fakeAppExe}`;
      }
      if (name === 'home') {
        return fakeAppHome;
      }
      throw new Error('Unsupported path');
    });

    macosStartup = new MacosStartup();

    const result = macosStartup.shouldEnable();
    expect(result).toBeTruthy();
  });

  test('should return true when running from ~/Applications', async () => {
    vi.mocked(app.getPath).mockImplementation((name: AppGetPathParam) => {
      if (name === 'exe') {
        return `${fakeAppHome}/Applications/${fakeAppExe}`;
      }
      if (name === 'home') {
        return fakeAppHome;
      }
      throw new Error('Unsupported path');
    });

    macosStartup = new MacosStartup();

    const result = macosStartup.shouldEnable();
    expect(result).toBeTruthy();
  });

  test('should return false when not running from Applications folder', async () => {
    const result = macosStartup.shouldEnable();

    expect(console.warn).toHaveBeenCalledWith(
      'Skipping Start on Login option as the app is not starting from an Applications folder',
    );

    expect(result).toBeFalsy();
  });
});
