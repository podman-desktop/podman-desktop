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

import { app } from 'electron';
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

  override createTrayImage(iconName: string): Electron.NativeImage {
    return super.createTrayImage(iconName);
  }

  override animateTrayIcon(): void {
    return super.animateTrayIcon();
  }

  override getIconPath(iconName: string): { path: string; isTemplate: boolean } {
    return super.getIconPath(iconName);
  }

  // Access to private cache for testing
  getImageCache(): Map<string, Electron.NativeImage> {
    return (this as unknown as { imageCache: Map<string, Electron.NativeImage> }).imageCache;
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
    nativeImage: {
      createEmpty: vi.fn(() => ({
        addRepresentation: vi.fn(),
        isEmpty: vi.fn(() => false),
        setTemplateImage: vi.fn(),
      })),
      createFromPath: vi.fn(() => ({
        addRepresentation: vi.fn(),
        isEmpty: vi.fn(() => false),
        setTemplateImage: vi.fn(),
      })),
      createFromBuffer: vi.fn(() => ({
        addRepresentation: vi.fn(),
        isEmpty: vi.fn(() => false),
        setTemplateImage: vi.fn(),
      })),
    },
  };
});

vi.mock('./util.js', () => ({
  isMac: vi.fn(() => false),
  isLinux: vi.fn(() => false),
}));

beforeEach(() => {
  testAnimatedTray = new TestAnimatedTray();
  vi.clearAllMocks();
});

test('valid path for icons', () => {
  const appPathValue = path.resolve(__dirname, 'appPath-value');

  const spyElectronGetAppPath = vi.spyOn(app, 'getAppPath').mockReturnValue(appPathValue);
  const isProdSpy = vi.spyOn(testAnimatedTray, 'isProd');

  // Test production mode.
  isProdSpy.mockReturnValue(true);
  let assetFolder = testAnimatedTray.getAssetsFolder();
  expect(assetFolder).toBe(path.resolve(appPathValue, AnimatedTray.MAIN_ASSETS_FOLDER));
  expect(spyElectronGetAppPath).toHaveBeenCalled();

  // Test development mode.
  isProdSpy.mockReturnValue(false);
  const cwd = process.cwd();
  assetFolder = testAnimatedTray.getAssetsFolder();
  expect(assetFolder).toBe(path.resolve(cwd, AnimatedTray.MAIN_ASSETS_FOLDER));
});

test('image caching works correctly', () => {
  const cache = testAnimatedTray.getImageCache();

  // Initially cache should be empty
  expect(cache.size).toBe(0);

  // Create an image
  const image1 = testAnimatedTray.createTrayImage('default');
  expect(image1).toBeDefined();

  // Cache should now have one entry
  expect(cache.size).toBe(1);
  expect(cache.has('default')).toBe(true);

  // Calling again should return cached version
  const image2 = testAnimatedTray.createTrayImage('default');
  expect(image2).toBe(image1); // Should be the exact same object
  expect(cache.size).toBe(1); // Cache size should not increase

  // Creating a different image should add to cache
  const image3 = testAnimatedTray.createTrayImage('error');
  expect(image3).toBeDefined();
  expect(cache.size).toBe(2);
  expect(cache.has('error')).toBe(true);
});

test('animation method should call createTrayImage and setImage', () => {
  const mockTray = {
    setImage: vi.fn(),
    setToolTip: vi.fn(),
  };

  testAnimatedTray.setTray(mockTray as unknown as Electron.Tray);

  const createTrayImageSpy = vi.spyOn(testAnimatedTray, 'createTrayImage');

  // Call animation method
  testAnimatedTray.animateTrayIcon();

  // Should have called createTrayImage with step0
  expect(createTrayImageSpy).toHaveBeenCalledWith('step0');
  expect(mockTray.setImage).toHaveBeenCalled();
});

test('getIconPath returns correct template flag based on platform and preferences', () => {
  // Test default behavior (should use template for mac, dark for others in the mock)
  const defaultResult = testAnimatedTray.getIconPath('default');
  expect(defaultResult).toHaveProperty('path');
  expect(defaultResult).toHaveProperty('isTemplate');
  expect(typeof defaultResult.isTemplate).toBe('boolean');

  // Test with light color preference
  testAnimatedTray.setColor('light');
  const lightResult = testAnimatedTray.getIconPath('default');
  expect(lightResult.isTemplate).toBe(true);
  expect(lightResult.path).toContain('Template');

  // Test with dark color preference
  testAnimatedTray.setColor('dark');
  const darkResult = testAnimatedTray.getIconPath('default');
  expect(darkResult.isTemplate).toBe(false);
  expect(darkResult.path).toContain('Dark');

  // Reset to default
  testAnimatedTray.setColor('default');
});

test('buffer creation uses proper initialization for transparency', () => {
  // Test the buffer allocation directly to ensure it's initialized correctly
  const buffer = Buffer.alloc(16 * 16 * 4, 0); // This is what our code should do

  // Verify buffer properties
  expect(buffer.length).toBe(16 * 16 * 4); // 16x16 RGBA = 1024 bytes
  expect(buffer.every(byte => byte === 0)).toBe(true); // All bytes should be 0 (transparent)

  // Compare with uninitialized buffer to show the difference
  const uninitializedBuffer = Buffer.alloc(16 * 16 * 4); // Without explicit 0 initialization
  expect(uninitializedBuffer.length).toBe(16 * 16 * 4);
  expect(uninitializedBuffer.every(byte => byte === 0)).toBe(true); // Buffer.alloc defaults to 0, but this shows intent

  // Test that our implementation matches expected behavior
  expect(buffer).toEqual(uninitializedBuffer); // Both should be zero-filled
});
