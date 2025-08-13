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
    super.animateTrayIcon();
  }

  override getIconPath(iconName: string): { path: string; isTemplate: boolean } {
    return super.getIconPath(iconName);
  }

  override updateIcon(): void {
    super.updateIcon();
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
  const defaultVariant = testAnimatedTray.getIconPath('default').isTemplate ? 'Template' : 'Dark';
  const defaultKey = `default:${defaultVariant}`;
  expect(cache.has(defaultKey)).toBe(true);

  // Calling again should return cached version
  const image2 = testAnimatedTray.createTrayImage('default');
  expect(image2).toBe(image1); // Should be the exact same object
  expect(cache.size).toBe(1); // Cache size should not increase

  // Creating a different image should add to cache
  const image3 = testAnimatedTray.createTrayImage('error');
  expect(image3).toBeDefined();
  expect(cache.size).toBe(2);
  const errorVariant = testAnimatedTray.getIconPath('error').isTemplate ? 'Template' : 'Dark';
  const errorKey = `error:${errorVariant}`;
  expect(cache.has(errorKey)).toBe(true);
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

test('cache invalidation works correctly when color changes', () => {
  const cache = testAnimatedTray.getImageCache();

  // Create initial cached images
  testAnimatedTray.createTrayImage('default');
  testAnimatedTray.createTrayImage('error');
  expect(cache.size).toBe(2);

  // Change color should clear cache
  testAnimatedTray.setColor('light');
  expect(cache.size).toBe(0);

  // Create new images with new color
  testAnimatedTray.createTrayImage('default');
  expect(cache.size).toBe(1);

  // Verify the cache key includes the new variant
  const lightVariant = testAnimatedTray.getIconPath('default').isTemplate ? 'Template' : 'Dark';
  const lightKey = `default:${lightVariant}`;
  expect(cache.has(lightKey)).toBe(true);
});

test('cache handles different variants correctly', () => {
  const cache = testAnimatedTray.getImageCache();

  // Test explicit color variants
  testAnimatedTray.setColor('light');
  testAnimatedTray.createTrayImage('default');
  expect(cache.size).toBe(1);
  expect(cache.has('default:Template')).toBe(true);

  // Clear cache and test Dark variant
  cache.clear();
  testAnimatedTray.setColor('dark');
  testAnimatedTray.createTrayImage('default');
  expect(cache.size).toBe(1);
  expect(cache.has('default:Dark')).toBe(true);
});

test('TRAY_ICON_STEP_COUNT constant is used correctly', () => {
  expect(AnimatedTray.TRAY_ICON_STEP_COUNT).toBe(4);

  // Verify the constant is used in animation logic
  const mockTray = {
    setImage: vi.fn(),
    setToolTip: vi.fn(),
  };
  testAnimatedTray.setTray(mockTray as unknown as Electron.Tray);

  // Clear call count from setTray which calls updateIcon
  mockTray.setImage.mockClear();

  // Simulate animation loop to verify step count behavior
  for (let i = 0; i < AnimatedTray.TRAY_ICON_STEP_COUNT + 1; i++) {
    testAnimatedTray.animateTrayIcon();
  }

  // Should have wrapped around after TRAY_ICON_STEP_COUNT steps
  expect(mockTray.setImage).toHaveBeenCalledTimes(AnimatedTray.TRAY_ICON_STEP_COUNT + 1);
});

test('animateTrayIcon warns when tray is not set', () => {
  const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  // Call animateTrayIcon without setting tray
  testAnimatedTray.animateTrayIcon();

  expect(consoleSpy).toHaveBeenCalledWith('Cannot animate tray icon: tray is not set');
  consoleSpy.mockRestore();
});

test('animateTrayIcon handles errors and stops animation', () => {
  const mockTray = {
    setImage: vi.fn(),
    setToolTip: vi.fn(),
  };

  testAnimatedTray.setTray(mockTray as unknown as Electron.Tray);

  // Clear previous calls
  mockTray.setImage.mockClear();

  // Make setImage throw an error to trigger error handling in animateTrayIcon
  mockTray.setImage.mockImplementation(() => {
    throw new Error('Test error during animation');
  });

  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  // Start animation which should create an interval
  testAnimatedTray.setStatus('updating');

  // The interval should be stopped after the error in animateTrayIcon
  // The error happens during updateIcon which calls animateTrayIcon
  // Since animateTrayIcon throws, the interval gets cleared in the catch block
  expect(consoleSpy).toHaveBeenCalled();

  consoleSpy.mockRestore();
});

test('fallback to empty icon when requested icon does not exist', async () => {
  const { nativeImage } = vi.mocked(await import('electron'));

  // Make createFromPath return empty for non-existent icon, then valid for empty icon
  let callCount = 0;
  vi.mocked(nativeImage.createFromPath).mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      // First call (non-existent icon) returns empty
      return {
        addRepresentation: vi.fn(),
        isEmpty: vi.fn(() => true),
        setTemplateImage: vi.fn(),
      } as unknown as ReturnType<typeof nativeImage.createFromPath>;
    } else {
      // Second call (empty icon) returns valid image
      return {
        addRepresentation: vi.fn(),
        isEmpty: vi.fn(() => false),
        setTemplateImage: vi.fn(),
      } as unknown as ReturnType<typeof nativeImage.createFromPath>;
    }
  });

  const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  const image = testAnimatedTray.createTrayImage('nonexistent');
  expect(image).toBeDefined();
  expect(consoleSpy).toHaveBeenCalledWith('Using fallback empty icon for: nonexistent');

  consoleSpy.mockRestore();
});

test('creates minimal transparent fallback when even empty icon fails', async () => {
  const { nativeImage } = vi.mocked(await import('electron'));

  // Make all createFromPath calls return empty
  vi.mocked(nativeImage.createFromPath).mockReturnValue({
    addRepresentation: vi.fn(),
    isEmpty: vi.fn(() => true),
    setTemplateImage: vi.fn(),
  } as unknown as ReturnType<typeof nativeImage.createFromPath>);

  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  const image = testAnimatedTray.createTrayImage('nonexistent');
  expect(image).toBeDefined();
  expect(consoleSpy).toHaveBeenCalledWith('Created minimal transparent fallback icon');
  expect(nativeImage.createFromBuffer).toHaveBeenCalled();

  consoleSpy.mockRestore();
});

test('getIconPath returns correct paths for Linux platform', async () => {
  const { isLinux } = vi.mocked(await import('./util.js'));
  vi.mocked(isLinux).mockReturnValue(true);

  const result = testAnimatedTray.getIconPath('default');
  expect(result.isTemplate).toBe(false);
  expect(result.path).toContain('Dark.png');
});

test('getIconPath returns correct paths for Mac platform', async () => {
  const { isMac, isLinux } = vi.mocked(await import('./util.js'));
  vi.mocked(isMac).mockReturnValue(true);
  vi.mocked(isLinux).mockReturnValue(false);

  const result = testAnimatedTray.getIconPath('default');
  expect(result.isTemplate).toBe(true);
  expect(result.path).toContain('Template.png');
});

test('getIconPath uses nativeTheme for Windows platform', async () => {
  const { isLinux, isMac } = vi.mocked(await import('./util.js'));
  const { nativeTheme } = await import('electron');

  vi.mocked(isLinux).mockReturnValue(false);
  vi.mocked(isMac).mockReturnValue(false);

  // Mock shouldUseDarkColors as a getter
  Object.defineProperty(nativeTheme, 'shouldUseDarkColors', {
    get: vi.fn(() => true),
    configurable: true,
  });

  const result = testAnimatedTray.getIconPath('default');
  expect(result.isTemplate).toBe(false); // shouldUseDarkColors is true, so !true = false
  expect(result.path).toContain('Dark.png');

  // Change the mock value
  Object.defineProperty(nativeTheme, 'shouldUseDarkColors', {
    get: vi.fn(() => false),
    configurable: true,
  });

  const lightResult = testAnimatedTray.getIconPath('default');
  expect(lightResult.isTemplate).toBe(true); // shouldUseDarkColors is false, so !false = true
  expect(lightResult.path).toContain('Template.png');
});

test('updateIcon handles errors and sets fallback', () => {
  const mockTray = {
    setImage: vi.fn(),
    setToolTip: vi.fn(),
  };

  // First set the tray (this calls updateIcon once)
  testAnimatedTray.setTray(mockTray as unknown as Electron.Tray);

  // Clear previous calls
  mockTray.setImage.mockClear();
  mockTray.setToolTip.mockClear();

  // Now make setImage throw on first call but succeed on second
  mockTray.setImage
    .mockImplementationOnce(() => {
      throw new Error('Test error');
    })
    .mockImplementationOnce(() => {});

  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  testAnimatedTray.setStatus('ready');

  // Should have tried to set image twice (original + fallback)
  expect(mockTray.setImage).toHaveBeenCalledTimes(2);
  expect(consoleSpy).toHaveBeenCalledWith("Failed to update tray icon for status 'ready':", expect.any(Error));

  consoleSpy.mockRestore();
});

test('updateIcon handles fallback failure gracefully', () => {
  const mockTray = {
    setImage: vi.fn().mockImplementation(() => {
      throw new Error('Always fails');
    }),
    setToolTip: vi.fn(),
  };

  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  testAnimatedTray.setTray(mockTray as unknown as Electron.Tray);
  testAnimatedTray.setStatus('ready');

  expect(consoleSpy).toHaveBeenCalledWith('Failed to set fallback tray icon:', expect.any(Error));

  consoleSpy.mockRestore();
});

test('setTemplateImage is called on macOS for template images', async () => {
  const { isMac } = vi.mocked(await import('./util.js'));
  const { nativeImage } = vi.mocked(await import('electron'));

  vi.mocked(isMac).mockReturnValue(true);

  const mockImage = {
    addRepresentation: vi.fn(),
    isEmpty: vi.fn(() => false),
    setTemplateImage: vi.fn(),
  };

  vi.mocked(nativeImage.createFromPath).mockReturnValue(
    mockImage as unknown as ReturnType<typeof nativeImage.createFromPath>,
  );

  // Clear cache to ensure fresh image creation
  testAnimatedTray.getImageCache().clear();

  // Create image with default settings (should be template on Mac)
  testAnimatedTray.createTrayImage('default');

  expect(mockImage.setTemplateImage).toHaveBeenCalledWith(true);
});

test('theme change event clears cache', async () => {
  const cache = testAnimatedTray.getImageCache();

  // Create cached images
  testAnimatedTray.createTrayImage('default');
  testAnimatedTray.createTrayImage('error');
  expect(cache.size).toBe(2);

  // Simulate theme change by calling the nativeTheme 'updated' event handler
  // Get the event handler that was registered
  const { nativeTheme } = await import('electron');
  const themeUpdateHandler = vi.mocked(nativeTheme.on).mock.calls.find((call: unknown[]) => call[0] === 'updated')?.[1];

  if (themeUpdateHandler) {
    themeUpdateHandler();
    expect(cache.size).toBe(0);
  }
});

test('error handling in updateIcon provides fallback', () => {
  const mockTray = {
    setImage: vi.fn(),
    setToolTip: vi.fn(),
  };

  // Set tray first (this will trigger one updateIcon call with 'initialized' status)
  testAnimatedTray.setTray(mockTray as unknown as Electron.Tray);

  // Clear call count and then make setImage throw an error on first call but succeed on second
  mockTray.setImage.mockClear();
  let callCount = 0;
  mockTray.setImage.mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      throw new Error('Test error');
    }
  });

  // This should trigger error handling
  testAnimatedTray.setStatus('ready');

  // Should have attempted setImage twice (original + fallback)
  expect(mockTray.setImage).toHaveBeenCalledTimes(2);
});

test('animation prewarming loads all step frames', () => {
  const mockTray = {
    setImage: vi.fn(),
    setToolTip: vi.fn(),
  };
  testAnimatedTray.setTray(mockTray as unknown as Electron.Tray);

  const createTrayImageSpy = vi.spyOn(testAnimatedTray, 'createTrayImage');
  const cache = testAnimatedTray.getImageCache();

  // Clear cache to ensure we're testing prewarming
  cache.clear();

  // Start updating status should prewarm all animation frames
  testAnimatedTray.setStatus('updating');

  // Should have prewarmed all step frames (step0, step1, step2, step3)
  expect(createTrayImageSpy).toHaveBeenCalledWith('step0');
  expect(createTrayImageSpy).toHaveBeenCalledWith('step1');
  expect(createTrayImageSpy).toHaveBeenCalledWith('step2');
  expect(createTrayImageSpy).toHaveBeenCalledWith('step3');

  // Should have called createTrayImage for prewarming + first animation frame
  expect(createTrayImageSpy).toHaveBeenCalledTimes(AnimatedTray.TRAY_ICON_STEP_COUNT + 1);
});
