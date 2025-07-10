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
import path from 'node:path';

import { app } from 'electron';
import { beforeEach, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';

import { WindowsStartup } from './windows-startup.js';

vi.mock('electron', async () => {
  return {
    app: {
      getPath: vi.fn(),
      setLoginItemSettings: vi.fn(),
    },
  };
});

vi.mock('node:fs', async () => {
  return {
    existsSync: vi.fn(),
  };
});

const minimizeOnStatup = vi.fn();
const configurationRegistry = {
  getConfiguration: () => ({
    get: minimizeOnStatup,
  }),
} as unknown as ConfigurationRegistry;

let windowsStartup: WindowsStartup;
const appExePath = path.join('app-name', 'Podman Desktop.exe');
const tempPath = 'temp';
const appDataPath = 'AppData';

beforeEach(() => {
  vi.restoreAllMocks();
  minimizeOnStatup.mockReturnValue(true);
});

test('Auto startup should not be enable for not portable installation in temp folder', async () => {
  vi.mocked(app.getPath).mockImplementation((name: Parameters<typeof app.getPath>[0]) => {
    if (name === 'exe') {
      return path.join(tempPath, appExePath);
    }
    if (name === 'temp') {
      return tempPath;
    }
    throw new Error('Unsupported path');
  });
  windowsStartup = new WindowsStartup(configurationRegistry);
  await windowsStartup.enable();
  expect(app.setLoginItemSettings).not.toHaveBeenCalled();
});

test('Autostart should be enabled for portable installation', async () => {
  const portablePath = path.join('portable', 'location', 'Podman Desktop.exe');
  vi.spyOn(process, 'env', 'get').mockReturnValue({
    PORTABLE_EXECUTABLE_FILE: portablePath,
  });
  vi.mocked(app.getPath).mockImplementation((name: Parameters<typeof app.getPath>[0]) => {
    if (name === 'exe') {
      return path.join(appExePath);
    }
    if (name === 'temp') {
      return tempPath;
    }
    if (name === 'appData') {
      return appDataPath;
    }
    throw new Error('Unsupported path');
  });
  vi.mocked(existsSync).mockReturnValue(false);
  windowsStartup = new WindowsStartup(configurationRegistry);
  await windowsStartup.enable();
  expect(app.setLoginItemSettings).toBeCalledWith({
    openAtLogin: true,
    path: `"${portablePath}"`,
    args: [' --minimized'],
  });
});

test('Autostart should be enabled for updated application when present', async () => {
  vi.mocked(app.getPath).mockImplementation((name: Parameters<typeof app.getPath>[0]) => {
    if (name === 'exe') {
      return path.join(appExePath);
    }
    if (name === 'temp') {
      return tempPath;
    }
    if (name === 'appData') {
      return appDataPath;
    }
    throw new Error('Unsupported path');
  });
  vi.mocked(existsSync).mockReturnValue(true);
  const resolvedUpdatedExecPath = path.join('Programs', 'Podman Desktop.exe');
  vi.spyOn(path, 'resolve').mockReturnValue(resolvedUpdatedExecPath);
  windowsStartup = new WindowsStartup(configurationRegistry);
  await windowsStartup.enable();
  expect(app.setLoginItemSettings).toBeCalledWith({
    openAtLogin: true,
    path: `"${resolvedUpdatedExecPath}"`,
    args: [' --minimized'],
  });
});

test('Autostart enable call should setup startup at login for normal installation minimized', async () => {
  vi.mocked(app.getPath).mockImplementation((name: Parameters<typeof app.getPath>[0]) => {
    if (name === 'exe') {
      return path.join(appExePath);
    }
    if (name === 'temp') {
      return tempPath;
    }
    if (name === 'appData') {
      return appDataPath;
    }
    throw new Error('Unsupported path');
  });
  vi.mocked(existsSync).mockReturnValue(false);
  windowsStartup = new WindowsStartup(configurationRegistry);
  await windowsStartup.enable();
  expect(app.setLoginItemSettings).toBeCalledWith({
    openAtLogin: true,
    path: `"${appExePath}"`,
    args: [' --minimized'],
  });
});

test('Autostart enable call should setup startup at login for normal installation not minimized', async () => {
  vi.mocked(app.getPath).mockImplementation((name: Parameters<typeof app.getPath>[0]) => {
    if (name === 'exe') {
      return path.join(appExePath);
    }
    if (name === 'temp') {
      return tempPath;
    }
    if (name === 'appData') {
      return appDataPath;
    }
    throw new Error('Unsupported path');
  });
  vi.mocked(existsSync).mockReturnValue(false);
  minimizeOnStatup.mockReturnValue(false);
  windowsStartup = new WindowsStartup(configurationRegistry);
  await windowsStartup.enable();
  expect(app.setLoginItemSettings).toBeCalledWith({
    openAtLogin: true,
    path: `"${appExePath}"`,
    args: [''],
  });
});

test('Autostart disable call should disable startup at login', async () => {
  vi.mocked(app.getPath).mockImplementation((name: Parameters<typeof app.getPath>[0]) => {
    if (name === 'exe') {
      return path.join(appExePath);
    }
    throw new Error('Unsupported path');
  });
  vi.mocked(existsSync).mockReturnValue(false);
  windowsStartup = new WindowsStartup(configurationRegistry);
  await windowsStartup.disable();
  expect(app.setLoginItemSettings).toBeCalledWith({
    openAtLogin: false,
    path: undefined,
    args: undefined,
  });
});
