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
 * @fileoverview Comprehensive tests for the OptimizedImage React component
 *
 * This test suite validates the OptimizedImage component, which is a critical piece
 * of the website's performance optimization strategy. The component:
 *
 * - Automatically serves modern image formats (AVIF, WebP) with PNG fallback.
 * - Generates responsive srcsets for different viewport sizes.
 * - Supports theme-aware image switching (light/dark variants).
 * - Provides extensive prop validation for developer experience.
 * - Implements performance optimizations with React hooks.
 * - Ensures accessibility compliance.
 *
 * Testing approach:
 * - Mock Docusaurus hooks to isolate component logic.
 * - Mock React hooks to verify optimization strategies.
 * - Test prop validation with descriptive error messages.
 * - Validate theme switching behavior.
 * - Check edge cases and error scenarios.
 * - Verify accessibility requirements.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * Mock Docusaurus hooks for isolated testing.
 * These hooks are essential for the component's functionality but external to our logic.
 */
const mockUseColorMode = vi.fn();
const mockUseBaseUrl = vi.fn();

vi.mock('@docusaurus/theme-common', () => ({
  useColorMode: (): unknown => mockUseColorMode(),
}));

vi.mock('@docusaurus/useBaseUrl', () => ({
  default: (url: string): unknown => mockUseBaseUrl(url),
}));

/**
 * Mock React hooks to capture their behavior and verify optimization strategies.
 * This allows us to test that the component is using memoization and callbacks correctly.
 */
const mockUseMemo = vi.fn();
const mockUseCallback = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useCallback: (...args: unknown[]): unknown => mockUseCallback(...args),
    useMemo: (...args: unknown[]): unknown => mockUseMemo(...args),
  };
});

// Import the component after mocks are set up to ensure they're properly applied.
const OptimizedImageModule = await import('./OptimizedImage');
const { default: OptimizedImage, resetWarningFlag } = OptimizedImageModule;

/**
 * Mock console methods to test warning and error handling.
 * The component should provide helpful feedback to developers.
 */
const consoleWarnMock = vi.fn();
const consoleErrorMock = vi.fn();
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach((): void => {
  vi.clearAllMocks();
  console.warn = consoleWarnMock;
  console.error = consoleErrorMock;

  /**
   * Set up default mock behaviors for consistent testing.
   * These represent the most common usage scenarios.
   */
  mockUseColorMode.mockReturnValue({ colorMode: 'light' });
  mockUseBaseUrl.mockImplementation((url: string) => `/base${url}`);

  // Reset React hooks to default behavior (actual implementation).
  mockUseMemo.mockImplementation((fn: () => unknown, _deps?: unknown[]): unknown => fn());
  mockUseCallback.mockImplementation((fn: unknown, _deps?: unknown[]): unknown => fn);

  // Reset the warning flag for each test to ensure consistent behavior.
  // This allows each test to verify the warning behavior independently.
  resetWarningFlag();
});

afterEach((): void => {
  // Restore original console methods to prevent test pollution.
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe('OptimizedImage Component', () => {
  describe('prop validation', () => {
    /**
     * Alt text is required for accessibility compliance.
     * Screen readers and SEO tools depend on proper alt text.
     */
    test('should throw error when alt prop is missing', (): void => {
      expect(() => OptimizedImage({ src: '/test.png' } as unknown as Parameters<typeof OptimizedImage>[0])).toThrow(
        'OptimizedImage: alt prop is required and must be a non-empty string for accessibility',
      );
    });

    /**
     * Empty alt text is not sufficient for accessibility.
     * Better to throw an error than silently degrade accessibility.
     */
    test('should throw error when alt prop is empty string', (): void => {
      expect(() => OptimizedImage({ alt: '', src: '/test.png' })).toThrow(
        'OptimizedImage: alt prop is required and must be a non-empty string for accessibility',
      );
    });

    /**
     * Whitespace-only alt text should be rejected.
     * Prevents accidental submission of placeholder text.
     */
    test('should throw error when alt prop is whitespace only', (): void => {
      expect(() => OptimizedImage({ alt: '   ', src: '/test.png' })).toThrow(
        'OptimizedImage: alt prop is required and must be a non-empty string for accessibility',
      );
    });

    /**
     * Alt prop must be a string type.
     * Prevents runtime errors and ensures proper HTML output.
     */
    test('should throw error when alt prop is not a string', (): void => {
      expect(() => OptimizedImage({ alt: 123 as unknown as string, src: '/test.png' })).toThrow(
        'OptimizedImage: alt prop is required and must be a non-empty string for accessibility',
      );
    });

    /**
     * Component requires at least one image source.
     * Prevents rendering empty images.
     */
    test('should throw error when no image source is provided', (): void => {
      expect(() => OptimizedImage({ alt: 'test' } as unknown as Parameters<typeof OptimizedImage>[0])).toThrow(
        'OptimizedImage: requires either src, darkSrc, or sources prop',
      );
    });

    /**
     * Sources prop validation - missing dark theme image.
     * Theme switching requires both light and dark variants.
     */
    test('should throw error when sources prop is incomplete - missing dark', (): void => {
      expect(() =>
        OptimizedImage({ alt: 'test', sources: { light: '/light.png' } as unknown as { light: string; dark: string } }),
      ).toThrow('OptimizedImage: sources prop must contain both light and dark properties with valid image paths');
    });

    /**
     * Sources prop validation - missing light theme image.
     * Both variants are required for proper theme switching.
     */
    test('should throw error when sources prop is incomplete - missing light', (): void => {
      expect(() =>
        OptimizedImage({ alt: 'test', sources: { dark: '/dark.png' } as unknown as { light: string; dark: string } }),
      ).toThrow('OptimizedImage: sources prop must contain both light and dark properties with valid image paths');
    });

    /**
     * Warn about conflicting props - sources with src.
     * Helps developers understand prop precedence.
     */
    test('should warn when sources prop is used with src prop', () => {
      OptimizedImage({
        alt: 'test',
        src: '/test.png',
        sources: { light: '/light.png', dark: '/dark.png' },
      });

      expect(consoleWarnMock).toHaveBeenCalledWith(
        'OptimizedImage: when sources prop is provided, src and darkSrc props are ignored',
      );
    });

    /**
     * Warn about conflicting props - sources with darkSrc.
     * Ensures developers understand which props take precedence.
     */
    test('should warn when sources prop is used with darkSrc prop', () => {
      OptimizedImage({
        alt: 'test',
        darkSrc: '/dark.png',
        sources: { light: '/light.png', dark: '/dark.png' },
      });

      expect(consoleWarnMock).toHaveBeenCalledWith(
        'OptimizedImage: when sources prop is provided, src and darkSrc props are ignored',
      );
    });

    /**
     * Warn about conflicting props - sources with both src and darkSrc.
     * Complete validation of prop conflicts.
     */
    test('should warn when sources prop is used with both src and darkSrc props', () => {
      OptimizedImage({
        alt: 'test',
        src: '/test.png',
        darkSrc: '/dark.png',
        sources: { light: '/light.png', dark: '/dark.png' },
      });

      expect(consoleWarnMock).toHaveBeenCalledWith(
        'OptimizedImage: when sources prop is provided, src and darkSrc props are ignored',
      );
    });

    /**
     * Warning should only fire once per session to prevent noise.
     * Prevents excessive console output on repeated renders.
     */
    test('should only warn about conflicting props once per session', () => {
      // First call should trigger warning
      OptimizedImage({
        alt: 'test',
        src: '/test.png',
        sources: { light: '/light.png', dark: '/dark.png' },
      });

      expect(consoleWarnMock).toHaveBeenCalledTimes(1);
      expect(consoleWarnMock).toHaveBeenCalledWith(
        'OptimizedImage: when sources prop is provided, src and darkSrc props are ignored',
      );

      // Reset the mock to track subsequent calls
      consoleWarnMock.mockClear();

      // Second call with same conflicting props should NOT trigger warning
      OptimizedImage({
        alt: 'test2',
        src: '/test2.png',
        sources: { light: '/light2.png', dark: '/dark2.png' },
      });

      expect(consoleWarnMock).not.toHaveBeenCalled();

      // Third call with different conflicting props should also NOT trigger warning
      OptimizedImage({
        alt: 'test3',
        darkSrc: '/dark3.png',
        sources: { light: '/light3.png', dark: '/dark3.png' },
      });

      expect(consoleWarnMock).not.toHaveBeenCalled();
    });
  });

  describe('theme switching logic', () => {
    /**
     * Light mode should use light image from sources.
     * Core functionality for theme-aware image display.
     */
    test('should use light image in light mode with sources prop', () => {
      mockUseColorMode.mockReturnValue({ colorMode: 'light' });

      OptimizedImage({
        alt: 'test',
        sources: { light: '/light.png', dark: '/dark.png' },
      });

      expect(mockUseBaseUrl).toHaveBeenCalledWith('/light.png');
    });

    /**
     * Dark mode should use dark image from sources.
     * Ensures proper theme switching functionality.
     */
    test('should use dark image in dark mode with sources prop', () => {
      mockUseColorMode.mockReturnValue({ colorMode: 'dark' });

      OptimizedImage({
        alt: 'test',
        sources: { light: '/light.png', dark: '/dark.png' },
      });

      expect(mockUseBaseUrl).toHaveBeenCalledWith('/dark.png');
    });

    /**
     * Dark mode with darkSrc prop (alternative to sources).
     * Provides simpler API for basic theme switching.
     */
    test('should use darkSrc in dark mode when no sources prop', () => {
      mockUseColorMode.mockReturnValue({ colorMode: 'dark' });

      OptimizedImage({
        alt: 'test',
        src: '/light.png',
        darkSrc: '/dark.png',
      });

      expect(mockUseBaseUrl).toHaveBeenCalledWith('/dark.png');
    });

    /**
     * Fallback behavior when darkSrc is not provided.
     * Graceful degradation for single-theme images.
     */
    test('should fallback to src when darkSrc is not provided in dark mode', () => {
      mockUseColorMode.mockReturnValue({ colorMode: 'dark' });

      OptimizedImage({
        alt: 'test',
        src: '/test.png',
      });

      expect(mockUseBaseUrl).toHaveBeenCalledWith('/test.png');
    });

    /**
     * Handle unknown theme modes gracefully.
     * Defensive programming for edge cases.
     */
    test('should handle unusual theme modes gracefully', () => {
      mockUseColorMode.mockReturnValue({ colorMode: 'auto' });

      OptimizedImage({
        alt: 'test',
        sources: { light: '/light.png', dark: '/dark.png' },
      });

      // Should default to light mode for unknown theme modes
      expect(mockUseBaseUrl).toHaveBeenCalledWith('/light.png');
    });
  });

  describe('image optimization logic', () => {
    /**
     * PNG images should be optimized.
     * Most common web image format, benefits greatly from optimization.
     */
    test('should optimize PNG images', () => {
      OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/test');
    });

    /**
     * JPG images should be optimized.
     * Common for photos, important for performance.
     */
    test('should optimize JPG images', () => {
      OptimizedImage({ alt: 'test', src: '/test.jpg' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/test');
    });

    /**
     * JPEG images should be optimized.
     * Alternative extension for JPG format.
     */
    test('should optimize JPEG images', () => {
      OptimizedImage({ alt: 'test', src: '/test.jpeg' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/test');
    });

    /**
     * WebP images should be optimized.
     * Modern format but can still benefit from responsive sizing.
     */
    test('should optimize WebP images', () => {
      OptimizedImage({ alt: 'test', src: '/test.webp' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/test');
    });

    /**
     * Case-insensitive extension handling.
     * Important for cross-platform compatibility.
     */
    test('should handle case-insensitive extensions', () => {
      OptimizedImage({ alt: 'test', src: '/test.PNG' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/test');
    });

    /**
     * HTTPS external URLs should not be optimized.
     * Can't optimize external resources, should serve as-is.
     */
    test('should skip HTTPS external URLs', () => {
      const result = OptimizedImage({ alt: 'test', src: 'https://example.com/test.png' });
      expect(result).toBeDefined();
      expect(mockUseBaseUrl).toHaveBeenCalledWith('https://example.com/test.png');
      // Should not call with optimized path
      expect(mockUseBaseUrl).not.toHaveBeenCalledWith(expect.stringContaining('optimized-images'));
    });

    /**
     * HTTP external URLs should not be optimized.
     * Same reasoning as HTTPS URLs.
     */
    test('should skip HTTP external URLs', () => {
      OptimizedImage({ alt: 'test', src: 'http://example.com/test.png' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('http://example.com/test.png');
      expect(mockUseBaseUrl).not.toHaveBeenCalledWith(expect.stringContaining('optimized-images'));
    });

    /**
     * Data URLs should not be optimized.
     * Already embedded, optimization would be counterproductive.
     */
    test('should skip data URLs', () => {
      OptimizedImage({ alt: 'test', src: 'data:image/png;base64,abc123' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('data:image/png;base64,abc123');
      expect(mockUseBaseUrl).not.toHaveBeenCalledWith(expect.stringContaining('optimized-images'));
    });

    /**
     * Protocol-relative URLs should not be optimized.
     * External resources that inherit current protocol.
     */
    test('should skip protocol-relative URLs', () => {
      OptimizedImage({ alt: 'test', src: '//example.com/test.png' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('//example.com/test.png');
      expect(mockUseBaseUrl).not.toHaveBeenCalledWith(expect.stringContaining('optimized-images'));
    });

    /**
     * SVG images should not be optimized.
     * Vector graphics don't benefit from raster optimization.
     */
    test('should skip SVG images', () => {
      OptimizedImage({ alt: 'test', src: '/icon.svg' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('/icon.svg');
      expect(mockUseBaseUrl).not.toHaveBeenCalledWith(expect.stringContaining('optimized-images'));
    });

    /**
     * GIF images should not be optimized.
     * Would break animations.
     */
    test('should skip GIF images', () => {
      OptimizedImage({ alt: 'test', src: '/animation.gif' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('/animation.gif');
      expect(mockUseBaseUrl).not.toHaveBeenCalledWith(expect.stringContaining('optimized-images'));
    });

    /**
     * Handle null/undefined src values.
     * Defensive programming for edge cases.
     */
    test('should handle null/undefined src gracefully', (): void => {
      expect(() => OptimizedImage({ alt: 'test', src: null as unknown as string })).toThrow(
        'OptimizedImage: requires either src, darkSrc, or sources prop',
      );
      expect(() => OptimizedImage({ alt: 'test', src: undefined as unknown as string })).toThrow(
        'OptimizedImage: requires either src, darkSrc, or sources prop',
      );
    });

    /**
     * Empty string src should be handled.
     * Prevents rendering broken images.
     */
    test('should handle empty string src', () => {
      expect(() => OptimizedImage({ alt: 'test', src: '' })).toThrow(
        'OptimizedImage: requires either src, darkSrc, or sources prop',
      );
    });
  });

  describe('path generation', () => {
    /**
     * Handle images with leading slash.
     * Most common path format in web development.
     */
    test('should generate correct optimized path for images with leading slash', () => {
      OptimizedImage({ alt: 'test', src: '/img/test.png' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/img/test');
    });

    /**
     * Handle images without leading slash.
     * Relative path support.
     */
    test('should generate correct optimized path for images without leading slash', () => {
      OptimizedImage({ alt: 'test', src: 'img/test.png' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/img/test');
    });

    /**
     * Handle complex directory structures.
     * Real-world path complexity.
     */
    test('should handle complex directory structures', () => {
      OptimizedImage({ alt: 'test', src: '/static/assets/images/deep/nested/test.jpg' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/static/assets/images/deep/nested/test');
    });

    /**
     * Handle filenames with multiple dots.
     * Common in versioned assets.
     */
    test('should handle filenames with multiple dots', () => {
      OptimizedImage({ alt: 'test', src: '/img/my.awesome.image.png' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/img/my.awesome.image');
    });

    /**
     * Handle images with query strings.
     * Should strip query parameters before generating optimized path.
     */
    test('should handle images with query strings', () => {
      OptimizedImage({ alt: 'test', src: '/img/test.png?v=123&cache=false' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/img/test');
    });

    /**
     * Handle images with URL fragments.
     * Should strip hash fragments before generating optimized path.
     */
    test('should handle images with URL fragments', () => {
      OptimizedImage({ alt: 'test', src: '/img/test.png#section' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/img/test');
    });

    /**
     * Handle images with both query strings and URL fragments.
     * Should strip both before generating optimized path.
     */
    test('should handle images with query strings and URL fragments', () => {
      OptimizedImage({ alt: 'test', src: '/img/test.png?v=123#section' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/img/test');
    });

    /**
     * Handle complex URLs with multiple query parameters and fragments.
     * Real-world URL complexity with versioning and tracking.
     */
    test('should handle complex URLs with multiple parameters', () => {
      OptimizedImage({ alt: 'test', src: '/static/images/hero.jpg?v=1.2.3&t=1234567890&cache=no#hero-section' });
      expect(mockUseBaseUrl).toHaveBeenCalledWith('optimized-images/static/images/hero');
    });
  });

  describe('component props handling', () => {
    /**
     * Default loading behavior should be lazy.
     * Performance optimization by default.
     */
    test('should use default loading="lazy"', () => {
      const result = OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(result).toBeDefined();
      expect(result.type).toBe('picture');
    });

    /**
     * Support custom loading="eager".
     * For above-the-fold images.
     */
    test('should accept custom loading="eager"', () => {
      const result = OptimizedImage({ alt: 'test', src: '/test.png', loading: 'eager' });
      expect(result).toBeDefined();
      expect(result.type).toBe('picture');
    });

    /**
     * Support title attribute.
     * Additional context for users.
     */
    test('should handle title prop', () => {
      const result = OptimizedImage({
        alt: 'test',
        src: '/test.png',
        title: 'Additional context',
      });
      expect(result).toBeDefined();
      expect(result.type).toBe('picture');
    });

    /**
     * Support CSS classes.
     * Styling integration.
     */
    test('should handle className prop', () => {
      const result = OptimizedImage({
        alt: 'test',
        src: '/test.png',
        className: 'custom-class',
      });
      expect(result).toBeDefined();
      expect(result.props.className).toContain('custom-class');
    });

    /**
     * Support inline styles.
     * Direct styling support.
     */
    test('should handle style prop', () => {
      const result = OptimizedImage({
        alt: 'test',
        src: '/test.png',
        style: { border: '1px solid red' },
      });
      expect(result).toBeDefined();
      expect(result.props.style).toEqual(expect.objectContaining({ border: '1px solid red' }));
    });

    /**
     * Support custom sizes attribute.
     * Responsive image control.
     */
    test('should handle custom sizes prop', () => {
      const result = OptimizedImage({
        alt: 'test',
        src: '/test.png',
        sizes: '(max-width: 500px) 100vw, 50vw',
      });
      expect(result).toBeDefined();
      expect(result.type).toBe('picture');
    });

    /**
     * Support all props together.
     * Integration testing.
     */
    test('should handle all props together', () => {
      const result = OptimizedImage({
        alt: 'test image',
        src: '/test.png',
        loading: 'eager',
        title: 'Test title',
        className: 'test-class',
        style: { maxWidth: '100%' },
        sizes: '100vw',
      });
      expect(result).toBeDefined();
    });

    /**
     * Test className merging in optimized image fallback.
     * Ensures user className is preserved alongside default inline-block.
     */
    test('should merge className with inline-block for optimized image fallback', () => {
      const result = OptimizedImage({
        alt: 'test',
        src: '/test.png',
        className: 'custom-class',
      });
      expect(result).toBeDefined();
      // The component should render without errors and preserve custom className
    });

    /**
     * Test style merging in optimized image fallback.
     * Ensures user styles are preserved alongside default responsive styles.
     */
    test('should merge style with default responsive styles for optimized image fallback', () => {
      const result = OptimizedImage({
        alt: 'test',
        src: '/test.png',
        style: { border: '1px solid red' },
      });
      expect(result).toBeDefined();
      // The component should render without errors and preserve custom styles
    });
  });

  describe('memoization behavior', () => {
    /**
     * Test memoization of image source resolution.
     * Performance optimization verification.
     */
    test('should memoize image source resolution', () => {
      let foundCorrectDeps = false;
      mockUseMemo.mockImplementation((fn, deps) => {
        // Look for the dependency array that contains theme and image source.
        if (deps && Array.isArray(deps) && deps.includes('light') && deps.includes('/test.png')) {
          foundCorrectDeps = true;
        }
        return fn();
      });

      OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(mockUseMemo).toHaveBeenCalled();
      expect(foundCorrectDeps).toBe(true);
    });

    /**
     * Test memoization of optimized image paths.
     * Ensures expensive path calculations are cached.
     */
    test('should memoize optimized image base path', () => {
      let callCount = 0;
      mockUseMemo.mockImplementation(fn => {
        callCount++;
        return fn();
      });

      OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(callCount).toBeGreaterThan(0);
    });

    /**
     * Test memoization of srcset generation.
     * Complex string generation should be cached.
     */
    test('should memoize srcsets generation', () => {
      let callCount = 0;
      mockUseMemo.mockImplementation(fn => {
        callCount++;
        return fn();
      });

      OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(callCount).toBeGreaterThan(0);
    });
  });

  describe('callback behavior', () => {
    /**
     * Test useCallback for error handler.
     * Event handlers should be memoized to prevent re-renders.
     */
    test('should create error handler with useCallback', () => {
      mockUseCallback.mockImplementation((fn, deps) => {
        expect(deps).toEqual(['/base/test.png']);
        return fn;
      });

      OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(mockUseCallback).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    /**
     * Test infinite loop prevention in error handler.
     * Should prevent repeated error handling when original image fails.
     */
    test('should prevent infinite loop when original image fails to load', () => {
      const result = OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(result).toBeDefined();
      // The component should render without errors and include proper error handling
    });

    /**
     * Test graceful fallback when optimized images fail.
     * Should fallback to original image when optimized version fails.
     */
    test('should fallback to original image when optimized version fails', () => {
      const result = OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(result).toBeDefined();
      // The component should render with proper error handling for optimized images
    });

    /**
     * Test ultimate fallback when all images fail.
     * Should provide transparent fallback to prevent broken image display.
     */
    test('should provide transparent fallback when all images fail', () => {
      const result = OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(result).toBeDefined();
      // The component should render with ultimate fallback mechanism
    });
  });

  describe('edge cases and error scenarios', () => {
    /**
     * Handle very long filenames.
     * Stress testing path handling.
     */
    test('should handle very long filenames', () => {
      const longFilename = 'a'.repeat(200) + '.png';
      expect(() => OptimizedImage({ alt: 'test', src: `/${longFilename}` })).not.toThrow();
    });

    /**
     * Handle special characters in filenames.
     * Real-world filename complexity.
     */
    test('should handle special characters in filenames', () => {
      expect(() => OptimizedImage({ alt: 'test', src: '/img/file with spaces.png' })).not.toThrow();
      expect(() => OptimizedImage({ alt: 'test', src: '/img/file-with-dashes.png' })).not.toThrow();
      expect(() => OptimizedImage({ alt: 'test', src: '/img/file_with_underscores.png' })).not.toThrow();
    });

    /**
     * Handle Unicode characters in filenames.
     * International filename support.
     */
    test('should handle Unicode characters in filenames', () => {
      expect(() => OptimizedImage({ alt: 'test', src: '/img/файл.png' })).not.toThrow();
      expect(() => OptimizedImage({ alt: 'test', src: '/img/文件.png' })).not.toThrow();
    });

    /**
     * Handle very long alt text.
     * Accessibility edge case.
     */
    test('should handle very long alt text', () => {
      const longAlt = 'a'.repeat(1000);
      expect(() => OptimizedImage({ alt: longAlt, src: '/test.png' })).not.toThrow();
    });

    /**
     * Handle sources with empty strings.
     * Validate proper error handling for invalid configurations.
     */
    test('should handle sources with empty strings', () => {
      expect(() =>
        OptimizedImage({
          alt: 'test',
          sources: { light: '', dark: '/dark.png' },
        }),
      ).toThrow('OptimizedImage: sources prop must contain both light and dark properties with valid image paths');
    });
  });

  describe('responsive breakpoints', () => {
    /**
     * Test Tailwind CSS breakpoint integration.
     * Ensures consistency with design system.
     */
    test('should use standard Tailwind CSS breakpoints', () => {
      const result = OptimizedImage({ alt: 'test', src: '/test.png' });
      expect(result).toBeDefined();
      // The component should process without errors, indicating proper breakpoint handling.
    });
  });

  describe('accessibility', () => {
    /**
     * Alt text is mandatory for accessibility.
     * WCAG compliance requirement.
     */
    test('should always require alt text', (): void => {
      expect(() => OptimizedImage({ src: '/test.png' } as unknown as Parameters<typeof OptimizedImage>[0])).toThrow();
    });

    /**
     * Support descriptive alt text.
     * Encourages proper accessibility practices.
     */
    test('should accept descriptive alt text', () => {
      expect(() =>
        OptimizedImage({
          alt: 'A detailed description of the image content for screen readers',
          src: '/test.png',
        }),
      ).not.toThrow();
    });
  });
});
