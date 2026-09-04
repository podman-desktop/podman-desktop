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
import { join, resolve } from 'node:path';

import type { App as ElectronApp } from 'electron';
import { nativeImage } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isMac } from '/@/util.js';

import { AppIdentityPlugin, getDevWindowIconPath } from './app-identity-plugin.js';

vi.mock(import('/@/util.js'));

const APP_DATA_PATH = '/mock/appData';
const APP_ROOT_PATH = '/mock/appRoot';

function createMockApp(overrides?: Partial<ElectronApp>): ElectronApp {
  return {
    getPath: vi.fn().mockImplementation((name: string) => {
      if (name === 'appData') return APP_DATA_PATH;
      return `/mock/${name}`;
    }),
    getAppPath: vi.fn().mockReturnValue(APP_ROOT_PATH),
    setPath: vi.fn(),
    setName: vi.fn(),
    dock: {
      setIcon: vi.fn(),
    },
    ...overrides,
  } as unknown as ElectronApp;
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('onBeforeReady', () => {
  test('should redirect userData to a dev-specific directory', () => {
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    plugin.onBeforeReady();

    expect(app.setPath).toHaveBeenCalledWith('userData', join(APP_DATA_PATH, 'containers/podman-desktop-dev'));
  });

  test('should set app name to include Dev suffix', () => {
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    plugin.onBeforeReady();

    expect(app.setName).toHaveBeenCalledWith('Podman Desktop Dev');
  });
});

describe('onReady', () => {
  test('should set dock icon on macOS', async () => {
    vi.mocked(isMac).mockReturnValue(true);
    const mockIcon = { mock: 'icon' };
    vi.mocked(nativeImage.createFromPath).mockReturnValue(mockIcon as never);
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    await plugin.onReady();

    expect(nativeImage.createFromPath).toHaveBeenCalledWith(resolve(APP_ROOT_PATH, 'buildResources/icon-dev.png'));
    expect(app.dock?.setIcon).toHaveBeenCalledWith(mockIcon);
  });

  test('should not set dock icon on non-macOS', async () => {
    vi.mocked(isMac).mockReturnValue(false);
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    await plugin.onReady();

    expect(nativeImage.createFromPath).not.toHaveBeenCalled();
  });
});

describe('getDevWindowIconPath', () => {
  test('should return resolved path to dev icon', () => {
    const app = createMockApp();

    const result = getDevWindowIconPath(app);

    expect(result).toBe(resolve(APP_ROOT_PATH, 'buildResources/icon-dev.png'));
  });
});
