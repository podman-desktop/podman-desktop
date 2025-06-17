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
 * @fileoverview Tests for the image optimization script.
 *
 * This test suite validates the core image optimization functionality that runs during
 * the website build process. The optimization script is responsible for:
 *
 * - Converting images to modern formats (AVIF, WebP, PNG).
 * - Generating responsive sizes for different viewport widths.
 * - Incremental processing (only optimize changed/new images).
 * - Cross-platform path handling (Windows/Unix compatibility).
 * - Build-time performance optimization.
 * - Error handling and graceful degradation.
 *
 * Testing strategy:
 * - Mock file system operations to avoid actual file I/O during tests.
 * - Mock Sharp image processing library for consistent test results.
 * - Test path normalization for cross-platform compatibility.
 * - Validate optimization logic and decision-making.
 * - Verify incremental processing based on file modification times.
 * - Test error scenarios and edge cases.
 */

import type { Dirent, Stats } from 'node:fs';
import path from 'node:path';

import type { Metadata, Sharp } from 'sharp';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  compressImage,
  generateOptimizedImage,
  getRelativeOutputDir,
  optimizeImage,
  processImageFormats,
} from './optimize-images';

// Mock console.log to capture and validate build output messages.
const consoleLogMock = vi.fn();
const originalConsoleLog = console.log;

/**
 * Test directory structure for mocking file system operations.
 * Simulates a realistic project structure with nested directories and various file types.
 */
const startDir = 'start-dir';
const imagesDir = path.join(startDir, 'images');
const nestedDir = path.join(imagesDir, 'nested');
const docsDir = path.join(startDir, 'docs');

/**
 * Mock file system structure for testing.
 * Represents different scenarios the optimization script needs to handle:
 * - Nested directory structures.
 * - Mixed file types (images, archives, documents).
 * - Different image formats (PNG, AVIF, WebP).
 * - Files that should and shouldn't be processed.
 */
const mockFsStructure: Record<string, Dirent[]> = {
  [startDir]: [
    createDirent('images', 'directory'),
    createDirent('docs', 'directory'),
    createDirent('root-image.png', 'file'),
  ],
  [imagesDir]: [
    createDirent('nested', 'directory'),
    createDirent('photo.avif', 'file'), // Already optimized format
    createDirent('icon.webp', 'file'), // Already optimized format
    createDirent('archive.zip', 'file'), // Non-image file (should be skipped)
  ],
  [nestedDir]: [createDirent('final.png', 'file')], // Nested image file
  [docsDir]: [createDirent('readme.md', 'file')], // Non-image file in docs
};

/**
 * Mock the Node.js file system module.
 * Provides controlled file system operations for testing without actual I/O.
 */
vi.mock('node:fs', async () => {
  return {
    promises: {
      /**
       * Mock readdir to return our predefined directory structure.
       * Enables testing of directory traversal logic.
       */
      readdir: vi.fn(async (dirPath: string) => {
        if (mockFsStructure[dirPath]) {
          return mockFsStructure[dirPath];
        }
        return [];
      }),

      /**
       * Mock stat to return consistent file metadata.
       * Crucial for testing incremental optimization logic based on modification times.
       */
      stat: vi.fn().mockResolvedValue({
        mtime: new Date('2000-10-01T12:12:12Z'), // Fixed modification time for consistent tests
        size: 420, // Fixed file size for predictable results
        isFile: () => true,
        isDirectory: () => false,
      }),

      /**
       * Mock file writing operations.
       * Prevents actual file creation during tests.
       */
      writeFile: vi.fn(),

      /**
       * Mock directory creation with error handling test.
       * Tests both success and failure scenarios for directory creation.
       */
      mkdir: vi.fn().mockRejectedValueOnce(vi.fn()).mockResolvedValue(vi.fn()),
    },
  };
});

/**
 * Mock the Sharp image processing library.
 * Provides predictable image processing behavior for testing optimization logic.
 */
vi.mock('sharp', () => {
  const mockSharpInstance = {
    resize: vi.fn().mockReturnThis(), // Chainable resize method
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('foo.bar')), // Mock processed image data
    png: vi.fn().mockReturnThis(), // PNG format compression
    avif: vi.fn().mockReturnThis(), // AVIF format compression
    webp: vi.fn().mockReturnThis(), // WebP format compression
    metadata: vi.fn().mockResolvedValue({}), // Mock image metadata
  } as unknown as Sharp;

  return {
    default: vi.fn(() => {
      return mockSharpInstance;
    }),
  };
});

/**
 * Helper function to create mock Dirent objects.
 * Simulates file system entries for directory listing operations.
 *
 * @param name - File or directory name
 * @param type - Whether it's a file or directory
 * @returns Mock Dirent object with proper type checking methods
 */
function createDirent(name: string, type: 'file' | 'directory'): Dirent {
  return {
    name,
    isFile: () => type === 'file',
    isDirectory: () => type === 'directory',
  } as unknown as Dirent;
}

beforeEach(() => {
  vi.clearAllMocks();
  console.log = consoleLogMock;
});

afterEach(() => {
  // Restore original console to prevent test pollution.
  console.log = originalConsoleLog;
});

describe('compressImage', () => {
  const mockSharpInstance = {
    png: vi.fn(),
    avif: vi.fn(),
    webp: vi.fn(),
  } as unknown as Sharp;

  /**
   * Test successful image compression for supported formats.
   * Validates that the compression function calls the correct Sharp method
   * for each supported image format.
   */
  test('compressImage should compress valid image format', () => {
    compressImage(mockSharpInstance, 'png');
    expect(mockSharpInstance.png).toBeCalled();
  });

  /**
   * Test error handling for unsupported image formats.
   * Ensures the function throws meaningful errors for invalid formats
   * and doesn't attempt processing with unsupported format methods.
   */
  test('compressImage should throw error for invalid image format', () => {
    expect(() => compressImage(mockSharpInstance, 'pdf')).toThrow('Unsupported image format: pdf');
    expect(mockSharpInstance.png).not.toBeCalled();
    expect(mockSharpInstance.avif).not.toBeCalled();
    expect(mockSharpInstance.webp).not.toBeCalled();
  });
});

describe('getRelativeOutputDir', () => {
  /**
   * Test path normalization for static directory.
   * Validates correct path transformation for static assets.
   * Critical for maintaining proper directory structure in optimized output.
   */
  test('dir starts with "static"', () => {
    const result = getRelativeOutputDir('static/foo/bar');
    // Normalize path separators for cross-platform compatibility.
    const normalizedResult = result.replace(/\\/g, '/');
    expect(normalizedResult).toStrictEqual('foo/bar');
  });

  /**
   * Test path transformation for blog images.
   * Special handling for blog image paths to maintain logical organization.
   * Ensures blog images are properly categorized in the output structure.
   */
  test('dir starts with "blog/img"', () => {
    const result = getRelativeOutputDir('blog/img/foo/bar');
    // Normalize path separators for cross-platform compatibility.
    const normalizedResult = result.replace(/\\/g, '/');
    expect(normalizedResult).toStrictEqual('img/blog/foo/bar');
  });

  /**
   * Test path transformation for general blog content.
   * Handles blog assets that aren't specifically in the img subdirectory.
   * Maintains clean directory structure for blog-related files.
   */
  test('dir starts with "blog"', () => {
    const result = getRelativeOutputDir('blog/foo/bar');
    // Normalize path separators for cross-platform compatibility.
    const normalizedResult = result.replace(/\\/g, '/');
    expect(normalizedResult).toStrictEqual('foo/bar');
  });
});

describe('generateOptimizedImage', () => {
  /**
   * Test successful image optimization.
   * Validates that images with recent modification times are processed
   * and that the function reports correct processing statistics.
   */
  test('should optimize image', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT'; // Recent date (should trigger optimization)
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/',
      'png',
      statsMock,
    );

    expect(processed).toBeTruthy();
    expect(savedBytes).toBeGreaterThan(0);
  });

  /**
   * Test incremental optimization logic.
   * Validates that images with old modification times are skipped.
   * Critical for build performance - avoids reprocessing unchanged images.
   */
  test('should not optimize image', async () => {
    const date = 'Mon, 1 Oct 1990 12:12:12 GMT'; // Old date (should skip optimization)
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;
    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/',
      'png',
      statsMock,
    );

    expect(processed).toBeFalsy();
    expect(savedBytes).toBe(0);
  });

  /**
   * Test custom optimization options.
   * Validates that custom Sharp options (like width) are properly applied.
   * Ensures flexibility in optimization settings for different use cases.
   */
  test('should optimize image with custom options', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/',
      'png',
      statsMock,
      { width: 42 }, // Custom width option
    );

    expect(processed).toBeTruthy();
    expect(savedBytes).toBeGreaterThan(0);
  });
});

describe('optimizeImage', () => {
  /**
   * Test image optimization workflow - skip scenario.
   * Tests the complete optimization pipeline when images should be skipped.
   * Validates that the function correctly identifies when no processing is needed.
   */
  test('should not optimize image', async () => {
    const { processedCount, savedBytes } = await optimizeImage('blog/img/imagePath.png', '/build/dir');
    expect(processedCount).toBe(0);
    expect(savedBytes).toBe(0);
  });

  /**
   * Test image optimization workflow - process scenario.
   * Tests the complete optimization pipeline when images should be processed.
   * Validates that the function correctly processes eligible images and reports statistics.
   */
  test('should optimize image', async () => {
    const { processedCount, savedBytes } = await optimizeImage('blog/img/imagePath.png', '/build/dir');
    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);
  });
});

describe('processImageFormats', () => {
  /**
   * Test multi-format processing with responsive sizes.
   * Validates the core functionality that generates multiple image formats
   * and responsive sizes for each image.
   *
   * This is a critical integration test that verifies:
   * - Multiple format generation (AVIF, WebP, PNG).
   * - Responsive size generation for different viewport widths.
   * - Proper statistics tracking across all generated variants.
   * - Integration between path parsing, metadata, and Sharp processing.
   */
  test('should create images in different widths', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const metadataMock = {
      width: 42, // Mock image width for responsive size calculations
    } as unknown as Metadata;

    const { processedCount, savedBytes } = await processImageFormats(
      'blog/img/imagePath.png',
      '/build/dir',
      path.parse('blog/img/imagePath.png'), // Parsed path components
      statsMock,
      metadataMock,
    );

    // Verify that multiple images were processed (responsive sizes + formats).
    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);
  });
});
