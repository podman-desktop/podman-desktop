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
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

import type { App as ElectronApp } from 'electron';
import { nativeImage } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isMac } from '/@/util.js';

import { AppIdentityPlugin, getDevWindowIconPath, toBannerLabel } from './app-identity-plugin.js';
import { buildDevIcon } from './dev-icon-builder.js';

vi.mock(import('/@/util.js'));
vi.mock(import('node:child_process'), () => ({
  execSync: vi.fn(),
}));
vi.mock(import('./dev-icon-builder.js'), () => ({
  buildDevIcon: vi.fn(),
}));

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

const expectedHash = createHash('sha1').update(APP_ROOT_PATH).digest('hex').slice(0, 8);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('onBeforeReady', () => {
  test('should redirect userData to a clone-specific dev directory', () => {
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    plugin.onBeforeReady();

    expect(app.setPath).toHaveBeenCalledWith(
      'userData',
      join(APP_DATA_PATH, `containers/podman-desktop-dev-${expectedHash}`),
    );
  });

  test('should include git branch in app name when available', () => {
    vi.mocked(execSync).mockReturnValue('my-feature\n');
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    plugin.onBeforeReady();

    expect(app.setName).toHaveBeenCalledWith('Podman Desktop Dev (my-feature)');
  });

  test('should fall back to plain Dev suffix when git is unavailable', () => {
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('not a git repo');
    });
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    plugin.onBeforeReady();

    expect(app.setName).toHaveBeenCalledWith('Podman Desktop Dev');
  });
});

describe('onReady', () => {
  test('should build dynamic dock icon on macOS using last branch segment and hash', async () => {
    vi.mocked(isMac).mockReturnValue(true);
    vi.mocked(execSync).mockReturnValue('user/my-feature\n');
    const mockBaseIcon = { mock: 'base' };
    const mockBuiltIcon = { mock: 'built' };
    vi.mocked(nativeImage.createFromPath).mockReturnValue(mockBaseIcon as never);
    vi.mocked(buildDevIcon).mockReturnValue(mockBuiltIcon as never);
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    plugin.onBeforeReady();
    await plugin.onReady();

    expect(nativeImage.createFromPath).toHaveBeenCalledWith(resolve(APP_ROOT_PATH, 'buildResources/icon.png'));
    expect(buildDevIcon).toHaveBeenCalledWith(mockBaseIcon, 'my-featu', expectedHash);
    expect(app.dock?.setIcon).toHaveBeenCalledWith(mockBuiltIcon);
  });

  test('should fall back to DEV label when branch is unavailable', async () => {
    vi.mocked(isMac).mockReturnValue(true);
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('not a git repo');
    });
    const mockBaseIcon = { mock: 'base' };
    vi.mocked(nativeImage.createFromPath).mockReturnValue(mockBaseIcon as never);
    vi.mocked(buildDevIcon).mockReturnValue(mockBaseIcon as never);
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    plugin.onBeforeReady();
    await plugin.onReady();

    expect(buildDevIcon).toHaveBeenCalledWith(mockBaseIcon, 'DEV', expectedHash);
  });

  test('should not set dock icon on non-macOS', async () => {
    vi.mocked(isMac).mockReturnValue(false);
    const app = createMockApp();
    const plugin = new AppIdentityPlugin(app);

    await plugin.onReady();

    expect(nativeImage.createFromPath).not.toHaveBeenCalled();
    expect(buildDevIcon).not.toHaveBeenCalled();
  });
});

describe('getDevWindowIconPath', () => {
  test('should return resolved path to dev icon', () => {
    const app = createMockApp();

    const result = getDevWindowIconPath(app);

    expect(result).toBe(resolve(APP_ROOT_PATH, 'buildResources/icon-dev.png'));
  });
});

describe('toBannerLabel', () => {
  test('should return DEV when branch is undefined', () => {
    expect(toBannerLabel(undefined)).toBe('DEV');
  });

  test('should return last segment after slash', () => {
    expect(toBannerLabel('user/my-feat')).toBe('my-feat');
  });

  test('should return branch as-is when no slash', () => {
    expect(toBannerLabel('main')).toBe('main');
  });

  test('should truncate to 8 characters', () => {
    expect(toBannerLabel('a-very-long-branch-name')).toBe('a-very-l');
  });

  test('should take last segment then truncate', () => {
    expect(toBannerLabel('feat/a-very-long-branch-name')).toBe('a-very-l');
  });

  test('should extract GH issue number from branch', () => {
    expect(toBannerLabel('user/gh-1234-fix-something')).toBe('GH 1234');
    expect(toBannerLabel('gh1234-fix-something')).toBe('GH 1234');
    expect(toBannerLabel('GH-5678')).toBe('GH 5678');
  });

  test('should extract PR number from branch', () => {
    expect(toBannerLabel('pr-999-review')).toBe('PR 999');
    expect(toBannerLabel('PR42')).toBe('PR 42');
  });
});
