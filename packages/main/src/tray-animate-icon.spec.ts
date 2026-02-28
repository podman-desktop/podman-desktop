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

import type { Tray } from 'electron';
import { app, nativeTheme } from 'electron';
import { beforeEach, expect, test, vi } from 'vitest';

import { AnimatedTray } from './tray-animate-icon.js';

// to call protected methods
class TestAnimatedTray extends AnimatedTray {
  override getAssetsFolder(): string {
    return super.getAssetsFolder();
  }

  override isProd(): boolean {
    return super.isProd();
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
      off: vi.fn(),
    },
  };
});

beforeEach(() => {
  testAnimatedTray = new TestAnimatedTray();
  vi.clearAllMocks();
});

test('valid path for icons', () => {
  // ensure we are not in prod mode
  const appPathValue = path.resolve(__dirname, 'appPath-value');

  const spyElectronGetAppPath = vi.spyOn(app, 'getAppPath').mockReturnValue(appPathValue);

  const assetFolder = testAnimatedTray.getAssetsFolder();
  expect(assetFolder).toBe(path.resolve(appPathValue, AnimatedTray.MAIN_ASSETS_FOLDER));
  expect(spyElectronGetAppPath).toHaveBeenCalled();
});

test('constructor registers theme update handler', () => {
  const updateSpy = vi.spyOn(AnimatedTray.prototype as unknown as { updateIcon: () => void }, 'updateIcon');
  const trayInstance = new TestAnimatedTray();

  expect(updateSpy).toHaveBeenCalled();
  expect(vi.mocked(nativeTheme.on)).toHaveBeenCalledWith('updated', expect.any(Function));

  const handler = vi.mocked(nativeTheme.on).mock.calls[0]?.[1] as (() => void) | undefined;
  expect(handler).toBeDefined();
  handler?.();
  expect(updateSpy).toHaveBeenCalledTimes(2);

  trayInstance.destroyTray();
});

test('destroyTray clears timers and unregisters listeners', () => {
  vi.useFakeTimers();
  const tray = {
    setImage: vi.fn(),
    setToolTip: vi.fn(),
  } as unknown as Tray;

  testAnimatedTray.setTray(tray);
  testAnimatedTray.setStatus('updating');

  const clearSpy = vi.spyOn(global, 'clearInterval');

  testAnimatedTray.destroyTray();

  expect(clearSpy).toHaveBeenCalled();
  expect(vi.mocked(nativeTheme.off)).toHaveBeenCalledWith('updated', expect.any(Function));

  const callsBefore = vi.mocked(tray.setImage).mock.calls.length;
  testAnimatedTray.setStatus('ready');
  expect(vi.mocked(tray.setImage).mock.calls.length).toBe(callsBefore);

  vi.useRealTimers();
});
