/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

/**
 * @fileoverview Tests for the Docusaurus plugin that configures optimized image serving.
 *
 * This test suite validates the docusaurus-plugin-optimized-images plugin, which is responsible
 * for integrating the image optimization system with Docusaurus. The plugin:
 *
 * - Configures webpack aliases for optimized image serving.
 * - Sets up dev server static file serving for development.
 * - Ensures cross-platform path compatibility (Windows/Unix).
 * - Provides build hooks for production deployment.
 * - Integrates seamlessly with Docusaurus build pipeline.
 *
 * Testing strategy:
 * - Mock Docusaurus LoadContext for isolated testing.
 * - Validate webpack configuration modifications.
 * - Test dev server static file serving setup.
 * - Verify cross-platform path handling.
 * - Check error scenarios and edge cases.
 * - Ensure proper integration with build hooks.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type { ConfigureWebpackUtils, LoadContext } from '@docusaurus/types';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Configuration } from 'webpack';

import optimizedImagesPlugin from './docusaurus-plugin-optimized-images';

// Define the plugin options interface for testing
interface OptimizedImagesPluginOptions {
  optimizedImagesAlias?: string;
}

/**
 * Mock console.log and console.warn to capture and validate build messages.
 * The plugin should provide feedback during the build process.
 */
const consoleLogMock = vi.fn();
const consoleWarnMock = vi.fn();
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

/**
 * Mock fs module for testing file system operations.
 */
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
}));

const fsMock = vi.mocked(fs);

beforeEach(() => {
  vi.clearAllMocks();
  console.log = consoleLogMock;
  console.warn = consoleWarnMock;
});

afterEach(() => {
  // Restore original console to prevent test pollution.
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
});

describe('docusaurus-plugin-optimized-images', () => {
  /**
   * Minimal mock context for testing.
   * Only includes the essential siteDir property that the plugin uses.
   */
  const mockContext: LoadContext = {
    siteDir: '/mock/site/directory',
  } as LoadContext;

  const mockOptions: OptimizedImagesPluginOptions = {};

  describe('plugin initialization', () => {
    /**
     * Test basic plugin object structure.
     * Ensures the plugin exports the required Docusaurus plugin interface.
     */
    test('should return a plugin object with correct name', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      expect(plugin.name).toBe('docusaurus-plugin-optimized-images');
      expect(typeof plugin.configureWebpack).toBe('function');
      expect(typeof plugin.postBuild).toBe('function');
    });

    /**
     * Test plugin with different site directories.
     * Ensures the plugin works with various project structures.
     */
    test('should handle different site directories', () => {
      const customContext = {
        ...mockContext,
        siteDir: '/custom/path/to/site',
      };

      const plugin = optimizedImagesPlugin(customContext, mockOptions);
      expect(plugin.name).toBe('docusaurus-plugin-optimized-images');
    });

    /**
     * Test plugin with empty options.
     * Ensures graceful handling of minimal configuration.
     */
    test('should handle empty plugin options', () => {
      expect(() => {
        optimizedImagesPlugin(mockContext, {});
      }).not.toThrow();
    });
  });

  describe('webpack configuration', () => {
    /**
     * Test webpack alias configuration with existing aliases.
     * Should preserve existing aliases while adding optimized image path.
     */
    test('should configure webpack with correct alias', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockWebpackConfig: Configuration = {
        resolve: {
          alias: {
            '@existing': '/some/path',
          },
        },
      };

      const result = plugin.configureWebpack!(mockWebpackConfig, false, {} as ConfigureWebpackUtils);

      // Normalize expected path for cross-platform compatibility.
      const expectedPath = path.join(mockContext.siteDir, 'static', 'optimized-images');
      expect(result.resolve?.alias).toEqual({
        '@existing': '/some/path',
        '/optimized-images': expectedPath,
      });
    });

    /**
     * Test webpack configuration without existing aliases.
     * Should create the resolve.alias object if it doesn't exist.
     */
    test('should handle webpack config without existing aliases', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockWebpackConfig: Configuration = {
        resolve: {},
      };

      const result = plugin.configureWebpack!(mockWebpackConfig, false, {} as ConfigureWebpackUtils);

      expect(result.resolve?.alias).toEqual({
        '/optimized-images': path.join(mockContext.siteDir, 'static/optimized-images'),
      });
    });

    /**
     * Test webpack configuration without resolve section.
     * Should handle completely minimal webpack configurations.
     */
    test('should handle webpack config without resolve section', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockWebpackConfig: Configuration = {};

      const result = plugin.configureWebpack!(mockWebpackConfig, false, {} as ConfigureWebpackUtils);

      expect(result.resolve?.alias).toEqual({
        '/optimized-images': path.join(mockContext.siteDir, 'static/optimized-images'),
      });
    });

    /**
     * Test dev server static serving configuration.
     * Essential for serving optimized images during development.
     */
    test('should configure dev server static serving', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockWebpackConfig: Configuration = {};

      const result = plugin.configureWebpack!(mockWebpackConfig, false, {} as ConfigureWebpackUtils);

      expect((result as Configuration & { devServer?: unknown }).devServer).toEqual({
        static: [
          {
            directory: path.join(mockContext.siteDir, 'static/optimized-images'),
            publicPath: '/optimized-images',
            serveIndex: false,
          },
        ],
      });
    });

    /**
     * Test server-side rendering compatibility.
     * Should work consistently for both client and server builds.
     */
    test('should work with server-side rendering', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockWebpackConfig: Configuration = {};

      const result = plugin.configureWebpack!(mockWebpackConfig, true, {} as ConfigureWebpackUtils);

      // Should work the same for server-side rendering.
      expect(result.resolve?.alias).toEqual({
        '/optimized-images': path.join(mockContext.siteDir, 'static/optimized-images'),
      });
    });
  });

  describe('path resolution', () => {
    /**
     * Test cross-platform path handling.
     * Ensures the plugin works correctly on both Windows and Unix systems.
     */
    test('should use correct path separator for current platform', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);
      const result = plugin.configureWebpack!({}, false, {} as ConfigureWebpackUtils);

      const expectedPath = path.join(mockContext.siteDir, 'static/optimized-images');
      expect(result.resolve?.alias?.['/optimized-images']).toBe(expectedPath);
      expect(
        (result as Configuration & { devServer?: { static?: { directory?: string }[] } }).devServer?.static?.[0]
          ?.directory,
      ).toBe(expectedPath);
    });

    /**
     * Test relative path handling.
     * Should work with relative project paths.
     */
    test('should handle relative paths correctly', () => {
      const relativeContext = {
        ...mockContext,
        siteDir: './relative/path',
      };

      const plugin = optimizedImagesPlugin(relativeContext, mockOptions);
      const result = plugin.configureWebpack!({}, false, {} as ConfigureWebpackUtils);

      expect(result.resolve?.alias?.['/optimized-images']).toBe(
        path.join('./relative/path', 'static/optimized-images'),
      );
    });
  });

  describe('postBuild hook', () => {
    /**
     * Test postBuild hook execution.
     * Should complete without errors for successful builds.
     */
    test('should execute postBuild without errors', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.readdirSync.mockReturnValue(['image1.jpg', 'image2.png']);

      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
      } as { siteConfig: Record<string, unknown>; siteDir: string };

      await expect(plugin.postBuild!(mockProps)).resolves.not.toThrow();
    });

    /**
     * Test postBuild logging when directory exists with images.
     * Should log success message with file count.
     */
    test('should log success message with file count when images exist', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.readdirSync.mockReturnValue(['image1.jpg', 'image2.png', 'doc.txt']);

      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
      } as { siteConfig: Record<string, unknown>; siteDir: string };

      await plugin.postBuild!(mockProps);

      expect(consoleLogMock).toHaveBeenCalledWith('Optimized images ready for production build (2 files processed)');
    });

    /**
     * Test postBuild logging when directory doesn't exist.
     * Should log informational message about missing directory.
     */
    test('should log informational message when directory does not exist', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
      } as { siteConfig: Record<string, unknown>; siteDir: string };

      await plugin.postBuild!(mockProps);

      expect(consoleLogMock).toHaveBeenCalledWith(
        'No optimized images directory found - images may not have been processed',
      );
    });

    /**
     * Test postBuild logging when directory exists but has no images.
     * Should log informational message about empty directory.
     */
    test('should log message when directory exists but contains no images', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.readdirSync.mockReturnValue(['config.json', 'readme.txt']);

      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
      } as { siteConfig: Record<string, unknown>; siteDir: string };

      await plugin.postBuild!(mockProps);

      expect(consoleLogMock).toHaveBeenCalledWith('Optimized images directory exists but contains no image files');
    });

    /**
     * Test postBuild error handling.
     * Should handle file system errors gracefully.
     */
    test('should handle file system errors gracefully', async () => {
      fsMock.existsSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
      } as { siteConfig: Record<string, unknown>; siteDir: string };

      await plugin.postBuild!(mockProps);

      expect(consoleWarnMock).toHaveBeenCalledWith('Unable to verify optimized images status:', expect.any(Error));
    });

    /**
     * Test image file filtering.
     * Should correctly identify image files by extension.
     */
    test('should correctly filter image files by extension', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.readdirSync.mockReturnValue([
        'image1.jpg',
        'image2.jpeg',
        'image3.png',
        'image4.webp',
        'image5.avif',
        'image6.gif',
        'image7.svg',
        'document.pdf',
        'config.json',
        'style.css',
      ]);

      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
      } as { siteConfig: Record<string, unknown>; siteDir: string };

      await plugin.postBuild!(mockProps);

      expect(consoleLogMock).toHaveBeenCalledWith('Optimized images ready for production build (7 files processed)');
    });
  });

  describe('configurable alias', () => {
    /**
     * Test default alias behavior.
     * Should use '/optimized-images' when no custom alias is provided.
     */
    test('should use default alias when none provided', () => {
      const plugin = optimizedImagesPlugin(mockContext, {});

      const mockWebpackConfig: Configuration = {};
      const result = plugin.configureWebpack!(mockWebpackConfig, false, {} as ConfigureWebpackUtils);

      expect(result.resolve?.alias).toEqual({
        '/optimized-images': path.join(mockContext.siteDir, 'static/optimized-images'),
      });

      expect((result as Configuration & { devServer?: unknown }).devServer).toEqual({
        static: [
          {
            directory: path.join(mockContext.siteDir, 'static/optimized-images'),
            publicPath: '/optimized-images',
            serveIndex: false,
          },
        ],
      });
    });

    /**
     * Test custom alias configuration.
     * Should use the provided custom alias instead of the default.
     */
    test('should use custom alias when provided', () => {
      const customAlias = '/custom-images';
      const plugin = optimizedImagesPlugin(mockContext, { optimizedImagesAlias: customAlias });

      const mockWebpackConfig: Configuration = {};
      const result = plugin.configureWebpack!(mockWebpackConfig, false, {} as ConfigureWebpackUtils);

      expect(result.resolve?.alias).toEqual({
        [customAlias]: path.join(mockContext.siteDir, 'static/optimized-images'),
      });

      expect((result as Configuration & { devServer?: unknown }).devServer).toEqual({
        static: [
          {
            directory: path.join(mockContext.siteDir, 'static/optimized-images'),
            publicPath: customAlias,
            serveIndex: false,
          },
        ],
      });
    });

    /**
     * Test alias validation - should reject aliases that don't start with '/'.
     */
    test('should throw error for alias not starting with slash', () => {
      expect(() => {
        optimizedImagesPlugin(mockContext, { optimizedImagesAlias: 'invalid-alias' });
      }).toThrow('The alias "invalid-alias" for optimized images must start with \'/\'');
    });

    /**
     * Test alias validation - should reject conflicting paths.
     */
    test('should throw error for conflicting paths', () => {
      const conflictingAliases = ['/img', '/assets', '/static', '/img/subfolder', '/assets/images'];

      for (const alias of conflictingAliases) {
        expect(() => {
          optimizedImagesPlugin(mockContext, { optimizedImagesAlias: alias });
        }).toThrow(`The alias "${alias}" for optimized images conflicts with a common static path`);
      }
    });

    /**
     * Test custom alias with existing webpack aliases.
     * Should preserve existing aliases while adding the custom one.
     */
    test('should preserve existing aliases with custom alias', () => {
      const customAlias = '/my-optimized-images';
      const plugin = optimizedImagesPlugin(mockContext, { optimizedImagesAlias: customAlias });

      const mockWebpackConfig: Configuration = {
        resolve: {
          alias: {
            '@existing': '/some/path',
            '@components': '/src/components',
          },
        },
      };

      const result = plugin.configureWebpack!(mockWebpackConfig, false, {} as ConfigureWebpackUtils);

      expect(result.resolve?.alias).toEqual({
        '@existing': '/some/path',
        '@components': '/src/components',
        [customAlias]: path.join(mockContext.siteDir, 'static/optimized-images'),
      });
    });

    /**
     * Test valid custom aliases that should not cause conflicts.
     */
    test('should accept valid custom aliases', () => {
      const validAliases = ['/opt-images', '/custom-assets', '/processed-imgs', '/build-images'];

      for (const alias of validAliases) {
        expect(() => {
          optimizedImagesPlugin(mockContext, { optimizedImagesAlias: alias });
        }).not.toThrow();
      }
    });
  });

  describe('error handling', () => {
    /**
     * Test graceful handling of missing siteDir.
     * Should not crash the build process.
     */
    test('should handle missing siteDir gracefully', () => {
      const invalidContext = {
        ...mockContext,
        siteDir: '',
      };

      expect(() => {
        optimizedImagesPlugin(invalidContext, mockOptions);
      }).not.toThrow();
    });

    /**
     * Test postBuild with empty directory.
     * Should handle empty directory gracefully.
     */
    test('should handle empty optimized images directory', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.readdirSync.mockReturnValue([]);

      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
      } as { siteConfig: Record<string, unknown>; siteDir: string };

      await plugin.postBuild!(mockProps);

      expect(consoleLogMock).toHaveBeenCalledWith('Optimized images directory exists but contains no image files');
    });

    /**
     * Test handling of malformed webpack configuration.
     * Should provide meaningful error messages for debugging.
     */
    test('should handle malformed webpack config gracefully', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const malformedConfig = null as unknown as Configuration;

      expect(() => {
        plugin.configureWebpack!(malformedConfig, false, {} as ConfigureWebpackUtils);
      }).toThrow(TypeError);
    });
  });

  describe('platform compatibility', () => {
    /**
     * Test Windows path compatibility.
     * Should handle backslash path separators correctly.
     */
    test('should work on Windows paths', () => {
      const windowsContext = {
        ...mockContext,
        siteDir: 'C:\\Users\\test\\site',
      };

      const plugin = optimizedImagesPlugin(windowsContext, mockOptions);
      const result = plugin.configureWebpack!({}, false, {} as ConfigureWebpackUtils);

      const expectedPath = path.join(windowsContext.siteDir, 'static/optimized-images');
      expect(result.resolve?.alias?.['/optimized-images']).toBe(expectedPath);
    });

    /**
     * Test Unix path compatibility.
     * Should handle forward slash path separators correctly.
     */
    test('should work on Unix paths', () => {
      const unixContext = {
        ...mockContext,
        siteDir: '/home/user/site',
      };

      const plugin = optimizedImagesPlugin(unixContext, mockOptions);
      const result = plugin.configureWebpack!({}, false, {} as ConfigureWebpackUtils);

      const expectedPath = path.join(unixContext.siteDir, 'static/optimized-images');
      expect(result.resolve?.alias?.['/optimized-images']).toBe(expectedPath);
    });
  });
});
