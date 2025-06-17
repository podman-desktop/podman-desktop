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

import path from 'node:path';

import type { ConfigureWebpackUtils, LoadContext, PluginOptions } from '@docusaurus/types';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Configuration } from 'webpack';

import optimizedImagesPlugin from './docusaurus-plugin-optimized-images';

/**
 * Mock console.log to capture and validate build messages.
 * The plugin should provide feedback during the build process.
 */
const consoleLogMock = vi.fn();
const originalConsoleLog = console.log;

beforeEach(() => {
  vi.clearAllMocks();
  console.log = consoleLogMock;
});

afterEach(() => {
  // Restore original console to prevent test pollution.
  console.log = originalConsoleLog;
});

describe('docusaurus-plugin-optimized-images', () => {
  /**
   * Minimal mock context for testing.
   * Only includes the essential siteDir property that the plugin uses.
   */
  const mockContext: LoadContext = {
    siteDir: '/mock/site/directory',
  } as LoadContext;

  const mockOptions: PluginOptions = {};

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

      expect(result.resolve?.alias).toEqual({
        '@existing': '/some/path',
        '/optimized-images': path.join(mockContext.siteDir, 'static/optimized-images'),
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
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      await expect(plugin.postBuild!(mockProps)).resolves.not.toThrow();
    });

    /**
     * Test postBuild logging.
     * Should provide feedback about optimization completion.
     */
    test('should log success message during postBuild', async () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      const mockProps = {
        siteConfig: {},
        siteDir: mockContext.siteDir,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      await plugin.postBuild!(mockProps);

      expect(consoleLogMock).toHaveBeenCalledWith('Optimized images ready for production build');
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
     * Test handling of malformed webpack configuration.
     * Should provide meaningful error messages for debugging.
     */
    test('should handle malformed webpack config gracefully', () => {
      const plugin = optimizedImagesPlugin(mockContext, mockOptions);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const malformedConfig = null as any;

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugin.configureWebpack!(malformedConfig, false, {} as any);
      }).toThrow('Cannot read properties of null');
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = plugin.configureWebpack!({}, false, {} as any);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = plugin.configureWebpack!({}, false, {} as any);

      const expectedPath = path.join(unixContext.siteDir, 'static/optimized-images');
      expect(result.resolve?.alias?.['/optimized-images']).toBe(expectedPath);
    });
  });
});
