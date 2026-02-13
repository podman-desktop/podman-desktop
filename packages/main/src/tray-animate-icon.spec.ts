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

import * as path from 'node:path';

import { app, nativeTheme } from 'electron';
import { beforeEach, expect, test, vi } from 'vitest';

import { AnimatedTray } from './tray-animate-icon.js';
import * as util from './util.js';

// to call protected methods
class TestAnimatedTray extends AnimatedTray {
  override getAssetsFolder(): string {
    return super.getAssetsFolder();
  }

  override isProd(): boolean {
    return super.isProd();
  }

  override getIconPath(iconName: string): string {
    return super.getIconPath(iconName);
  }
}

let testAnimatedTray: TestAnimatedTray;

vi.mock('electron', async () => {
  return {
    app: {
      getAppPath: (): string => 'a-custom-appPath',
    },
    nativeTheme: {
      on: vi.fn(),
      shouldUseDarkColors: false,
    },
  };
});

vi.mock('./util.js', () => ({
  isMac: vi.fn(),
  isLinux: vi.fn(),
  isWindows: vi.fn(),
}));

const setShouldUseDarkColors = (value: boolean): void => {
  Object.defineProperty(nativeTheme, 'shouldUseDarkColors', {
    value,
    writable: true,
    configurable: true,
  });
};

beforeEach(() => {
  testAnimatedTray = new TestAnimatedTray();
  vi.clearAllMocks();

  // Reset platform detection to false by default
  vi.mocked(util.isMac).mockReturnValue(false);
  vi.mocked(util.isLinux).mockReturnValue(false);
  vi.mocked(util.isWindows).mockReturnValue(false);

  // Reset theme to light by default
  setShouldUseDarkColors(false);
});

test('valid path for icons', () => {
  // ensure we are not in prod mode
  const appPathValue = path.resolve(__dirname, 'appPath-value');

  const spyElectronGetAppPath = vi.spyOn(app, 'getAppPath').mockReturnValue(appPathValue);

  const assetFolder = testAnimatedTray.getAssetsFolder();
  expect(assetFolder).toBe(path.resolve(appPathValue, AnimatedTray.MAIN_ASSETS_FOLDER));
  expect(spyElectronGetAppPath).toHaveBeenCalled();
});

test('macOS should always use template icon', () => {
  vi.mocked(util.isMac).mockReturnValue(true);

  const iconPath = testAnimatedTray.getIconPath('default');

  expect(iconPath).toContain('tray-iconTemplate.png');
});

test('macOS should use template icon for all states', () => {
  vi.mocked(util.isMac).mockReturnValue(true);

  expect(testAnimatedTray.getIconPath('default')).toContain('tray-iconTemplate.png');
  expect(testAnimatedTray.getIconPath('empty')).toContain('tray-icon-emptyTemplate.png');
  expect(testAnimatedTray.getIconPath('error')).toContain('tray-icon-errorTemplate.png');
  expect(testAnimatedTray.getIconPath('step0')).toContain('tray-icon-step0Template.png');
});

test('Linux should always use regular icon', () => {
  vi.mocked(util.isLinux).mockReturnValue(true);

  const iconPath = testAnimatedTray.getIconPath('default');

  expect(iconPath).toContain('tray-icon.png');
  expect(iconPath).not.toContain('Dark');
  expect(iconPath).not.toContain('Template');
});

test('Linux should use regular icon for all states', () => {
  vi.mocked(util.isLinux).mockReturnValue(true);

  expect(testAnimatedTray.getIconPath('default')).toContain('tray-icon.png');
  expect(testAnimatedTray.getIconPath('empty')).toContain('tray-icon-empty.png');
  expect(testAnimatedTray.getIconPath('error')).toContain('tray-icon-error.png');
  expect(testAnimatedTray.getIconPath('step0')).toContain('tray-icon-step0.png');

  // Ensure none contain Template or Dark suffix
  expect(testAnimatedTray.getIconPath('default')).not.toContain('Template');
  expect(testAnimatedTray.getIconPath('default')).not.toContain('Dark');
});

test('Windows should always use regular icon (ignoring theme)', () => {
  vi.mocked(util.isWindows).mockReturnValue(true);
  vi.mocked(nativeTheme).shouldUseDarkColors = false;

  const iconPath = testAnimatedTray.getIconPath('default');

  // Should use regular icon, NOT template or dark
  expect(iconPath).toContain('tray-icon.png');
  expect(iconPath).not.toContain('Template');
  expect(iconPath).not.toContain('Dark');
});

test('Windows should use regular icon even with dark theme', () => {
  vi.mocked(util.isWindows).mockReturnValue(true);
  vi.mocked(nativeTheme).shouldUseDarkColors = true;

  const iconPath = testAnimatedTray.getIconPath('default');

  // Should still use regular icon, NOT dark
  expect(iconPath).toContain('tray-icon.png');
  expect(iconPath).not.toContain('Template');
  expect(iconPath).not.toContain('Dark');
});

test('Windows should use regular icon for all states', () => {
  vi.mocked(util.isWindows).mockReturnValue(true);

  expect(testAnimatedTray.getIconPath('default')).toContain('tray-icon.png');
  expect(testAnimatedTray.getIconPath('empty')).toContain('tray-icon-empty.png');
  expect(testAnimatedTray.getIconPath('error')).toContain('tray-icon-error.png');
  expect(testAnimatedTray.getIconPath('step0')).toContain('tray-icon-step0.png');

  // Ensure none contain Template or Dark suffix
  expect(testAnimatedTray.getIconPath('default')).not.toContain('Template');
  expect(testAnimatedTray.getIconPath('default')).not.toContain('Dark');
});

test('manual color override to light should use template icon', () => {
  vi.mocked(util.isWindows).mockReturnValue(true);

  testAnimatedTray.setColor('light');
  const iconPath = testAnimatedTray.getIconPath('default');

  expect(iconPath).toContain('tray-iconTemplate.png');
});

test('manual color override to dark should use dark icon', () => {
  vi.mocked(util.isWindows).mockReturnValue(true);
  vi.mocked(nativeTheme).shouldUseDarkColors = false;

  testAnimatedTray.setColor('dark');
  const iconPath = testAnimatedTray.getIconPath('default');

  expect(iconPath).toContain('tray-iconDark.png');
});
