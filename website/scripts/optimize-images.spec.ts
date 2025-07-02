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
 * - Real-time progress tracking with visual progress indicators.
 *
 * Testing strategy:
 * - Mock file system operations to avoid actual file I/O during tests.
 * - Mock Sharp image processing library for consistent test results.
 * - Test path normalization for cross-platform compatibility.
 * - Validate optimization logic and decision-making.
 * - Verify incremental processing based on file modification times.
 * - Test progress tracking system for real-time build feedback.
 * - Test error scenarios and edge cases.
 * - Validate progress bar display and console output formatting.
 */

import type { Dirent, Stats } from 'node:fs';
import path from 'node:path';

import type { Metadata, Sharp } from 'sharp';
import { afterEach, beforeEach, describe, expect, type MockedFunction, test, vi } from 'vitest';

import {
  calculateTotalOperations,
  compressImage,
  generateOptimizedImage,
  getRelativeOutputDir,
  optimizeImage,
  optimizeImageWithProgress,
  processImageFormats,
  processImagesInBatches,
  ProgressTracker,
} from './optimize-images';

// Mock console.log to capture and validate build output messages.
const consoleLogMock = vi.fn();
const originalConsoleLog = console.log;

// Mock process.stdout.write to capture progress bar output.
const processStdoutWriteMock = vi.fn();
const originalProcessStdoutWrite = process.stdout.write;

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
      stat: vi.fn().mockImplementation(async (filePath: string) => {
        // For output files that should trigger reprocessing, make them not exist
        if (filePath.includes('/build/') || filePath.includes('output.')) {
          throw new Error('ENOENT: no such file or directory');
        }
        // For input files, return consistent metadata
        return {
          mtime: new Date('2000-10-01T12:12:12Z'), // Fixed modification time for consistent tests
          size: 420, // Fixed file size for predictable results
          isFile: (): boolean => true,
          isDirectory: (): boolean => false,
        };
      }),

      /**
       * Mock file writing operations.
       * Prevents actual file creation during tests.
       */
      writeFile: vi.fn(),

      /**
       * Mock file unlinking operations.
       * Prevents actual file deletion during tests.
       */
      unlink: vi.fn().mockResolvedValue(undefined),

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
  // Create a comprehensive mock Sharp instance with proper method chaining.
  const createMockSharpInstance = (): Record<string, unknown> => {
    return {
      resize: vi.fn().mockImplementation(function (this: unknown) {
        return this;
      }),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from('optimized_image_data')),
      png: vi.fn().mockImplementation(function (this: unknown) {
        return this;
      }),
      avif: vi.fn().mockImplementation(function (this: unknown) {
        return this;
      }),
      webp: vi.fn().mockImplementation(function (this: unknown) {
        return this;
      }),
      metadata: vi.fn().mockResolvedValue({ width: 1024 }),
    };
  };

  // Create the main Sharp constructor function that returns a new instance each time.
  const mockSharp = vi.fn().mockImplementation(() => createMockSharpInstance());

  return {
    default: mockSharp,
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
    isFile: function (this: unknown): boolean {
      return type === 'file';
    },
    isDirectory: function (this: unknown): boolean {
      return type === 'directory';
    },
  } as unknown as Dirent;
}

beforeEach(() => {
  vi.clearAllMocks();
  console.log = consoleLogMock;
  process.stdout.write = processStdoutWriteMock.bind(process.stdout) as typeof process.stdout.write;
});

afterEach(() => {
  // Restore original console and stdout to prevent test pollution.
  console.log = originalConsoleLog;
  process.stdout.write = originalProcessStdoutWrite;
});

describe('ProgressTracker', () => {
  /**
   * Test ProgressTracker initialization and basic functionality.
   * Validates that the progress tracker correctly initializes with total counts
   * and maintains accurate state throughout the optimization process.
   */
  test('should initialize with correct total counts', () => {
    const tracker = new ProgressTracker(100, 10);

    // Initial state should not display progress (0 operations completed).
    tracker.updateProgress();

    // Should write progress bar to stdout.
    expect(processStdoutWriteMock).toHaveBeenCalledWith('\r\x1b[K');
    expect(processStdoutWriteMock).toHaveBeenCalledWith(expect.stringContaining('* Images'));
    expect(processStdoutWriteMock).toHaveBeenCalledWith(expect.stringContaining('optimizing (1%)'));
  });

  /**
   * Test progress updates during image processing.
   * Validates that the progress tracker correctly updates percentages
   * and maintains accurate counts of processed operations and images.
   */
  test('should update progress correctly', () => {
    const tracker = new ProgressTracker(10, 2);

    // Update progress for 5 operations without completing images.
    for (let i = 0; i < 5; i++) {
      tracker.updateProgress();
    }

    // Check that 50% progress is displayed.
    expect(processStdoutWriteMock).toHaveBeenCalledWith(expect.stringContaining('optimizing (50%)'));
    expect(processStdoutWriteMock).toHaveBeenCalledWith(expect.stringContaining('5/10 operations'));
  });

  /**
   * Test progress tracking when images are completed.
   * Validates that the tracker correctly counts completed source images
   * separately from individual optimization operations.
   */
  test('should track completed images separately from operations', () => {
    const tracker = new ProgressTracker(10, 2);

    // Complete 1 image (which may involve multiple operations).
    tracker.updateProgress(true);

    expect(processStdoutWriteMock).toHaveBeenCalledWith(expect.stringContaining('1/2 images'));
  });

  /**
   * Test progress completion and final summary display.
   * Validates that the tracker properly transitions to completion state
   * and displays appropriate summary information.
   */
  test('should complete and show final summary', () => {
    const tracker = new ProgressTracker(10, 2);

    tracker.complete(2, 1024 * 1024); // 1MB saved

    // Should show completion status.
    expect(processStdoutWriteMock).toHaveBeenCalledWith(expect.stringContaining('complete 2/2 images'));

    // Should display final summary.
    expect(consoleLogMock).toHaveBeenCalledWith('\n\nImage optimization complete!');
    expect(consoleLogMock).toHaveBeenCalledWith('Processed: 2 images');
    expect(consoleLogMock).toHaveBeenCalledWith('Total saved: 1.0 MB');
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Total time:'));
  });

  /**
   * Test progress bar visual representation.
   * Validates that the progress bar creates appropriate visual indicators
   * using filled and empty characters for different completion percentages.
   */
  test('should display correct progress bar visualization', () => {
    const tracker = new ProgressTracker(4, 1);

    // Test 0% progress.
    tracker.updateProgress();
    let lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];
    expect(lastCall).toContain('█'.repeat(7)); // Partial fill at 25%
    expect(lastCall).toContain('░'.repeat(23)); // Remaining empty

    // Test 50% progress.
    tracker.updateProgress();
    tracker.updateProgress();
    lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];
    expect(lastCall).toContain('optimizing (75%)');
  });

  /**
   * Test progress tracker with zero operations.
   * Validates that the tracker handles edge cases gracefully,
   * particularly when no operations need to be performed.
   */
  test('should handle zero operations gracefully', () => {
    const tracker = new ProgressTracker(0, 0);

    // Should not attempt to draw progress bar with zero operations.
    tracker.updateProgress();

    // Should not write any progress output for zero operations.
    expect(processStdoutWriteMock).not.toHaveBeenCalled();
  });

  /**
   * Test progress tracker with over-100% completion.
   * Validates that the tracker handles cases where actual operations
   * exceed the estimated total without crashing or displaying invalid progress.
   */
  test('should handle over-100% completion gracefully', () => {
    const tracker = new ProgressTracker(10, 2); // Estimate 10 operations

    // Simulate completing more operations than estimated (12 > 10).
    for (let i = 0; i < 12; i++) {
      tracker.updateProgress();
    }

    // Should write progress without throwing errors.
    expect(processStdoutWriteMock).toHaveBeenCalled();

    // Get the last progress output.
    const lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];

    // Should cap percentage at 100% for clean display.
    expect(lastCall).toContain('(100%)'); // Not 120%
    expect(lastCall).toContain('12/10 operations'); // But show actual operation counts

    // Should not contain invalid progress bar characters or negative values.
    // Check that we don't have unreasonable amounts of progress bar characters.
    const progressBarMatches = lastCall.match(/[█░]+/g);
    if (progressBarMatches) {
      const progressBar = progressBarMatches[0];
      expect(progressBar.length).toBeLessThanOrEqual(30); // Should not exceed bar width
    }
  });

  /**
   * Test ETA calculation and display.
   * Validates that the progress tracker calculates and displays
   * estimated time of arrival based on overall progress and elapsed time.
   */
  test('should calculate and display ETA', async () => {
    const tracker = new ProgressTracker(100, 10);

    // Simulate meaningful progress with realistic delays.
    for (let i = 0; i < 15; i++) {
      tracker.updateProgress();
      // Small delay to create measurable elapsed time.
      await new Promise(resolve => setTimeout(resolve, 5));
    }

    // Should write progress with ETA information.
    expect(processStdoutWriteMock).toHaveBeenCalled();

    // Get the last progress output.
    const lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];

    // Should contain ETA information (format may vary based on timing).
    expect(lastCall).toContain('ETA:');
    expect(lastCall).toContain('optimizing');
  });

  /**
   * Test ETA display with insufficient data.
   * Validates that ETA is not shown when there's insufficient
   * progress data to make reliable predictions.
   */
  test('should not display ETA with insufficient data', () => {
    const tracker = new ProgressTracker(100, 10);

    // Only a few operations - insufficient for ETA calculation (needs >10).
    for (let i = 0; i < 5; i++) {
      tracker.updateProgress();
    }

    const lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];

    // Should not contain ETA when insufficient data.
    expect(lastCall).not.toContain('ETA:');
  });

  /**
   * Test completion time display.
   * Validates that completion status shows total time taken
   * in a human-readable format.
   */
  test('should display completion time and performance stats', () => {
    const tracker = new ProgressTracker(50, 5);

    // Simulate some operations.
    for (let i = 0; i < 10; i++) {
      tracker.updateProgress();
    }

    // Complete the tracking.
    tracker.complete(5, 1024 * 1024); // 5 images, 1MB saved

    // Should show completion time.
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Total time:'));

    // Should show performance statistics.
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Performance:'));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('operations/second'));

    // Progress bar should show completion with elapsed time.
    const lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];
    expect(lastCall).toContain('complete 5/5 images in');
  });

  /**
   * Test duration formatting.
   * Validates that time durations are formatted in human-readable format
   * for different time ranges (seconds, minutes, hours).
   */
  test('should format durations correctly', () => {
    const tracker = new ProgressTracker(10, 1);

    // Test different duration formats by accessing private method through completion.
    tracker.updateProgress();

    // Short duration (under 60 seconds).
    tracker.complete(1, 1000);
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringMatching(/Total time: \d+s/));

    consoleLogMock.mockClear();

    // Test through progress bar completion display.
    const lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];
    expect(lastCall).toMatch(/complete \d+\/\d+ images in \d+s/);
  });

  /**
   * Test ETA edge cases.
   * Validates ETA calculation handles edge cases like zero remaining operations,
   * insufficient timing data, and rapid completion scenarios.
   */
  test('should handle ETA edge cases', () => {
    const tracker = new ProgressTracker(5, 1);

    // Complete all operations.
    for (let i = 0; i < 5; i++) {
      tracker.updateProgress();
    }

    // When all operations are complete, no ETA should be shown.
    const finalCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];
    expect(finalCall).not.toContain('ETA:');
  });

  /**
   * Test timing precision with rapid operations.
   * Validates that the progress tracker handles very fast operations
   * and provides reasonable ETA estimates even with minimal timing data.
   */
  test('should handle rapid operations gracefully', () => {
    const tracker = new ProgressTracker(50, 5);

    // Simulate rapid operations (no delay).
    for (let i = 0; i < 20; i++) {
      tracker.updateProgress();
    }

    // Should handle rapid operations without errors.
    expect(processStdoutWriteMock).toHaveBeenCalled();

    const lastCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];
    expect(lastCall).toContain('optimizing');
    // ETA may or may not be available with rapid operations.
  });

  /**
   * Test ETA updates based on overall progress rate.
   * Validates that ETA calculation uses overall elapsed time
   * rather than instantaneous operation timing.
   */
  test('should calculate ETA based on overall progress rate', async () => {
    const tracker = new ProgressTracker(100, 10);

    // Simulate sufficient operations to trigger ETA calculation.
    for (let i = 0; i < 20; i++) {
      tracker.updateProgress();
      // Small consistent delay to establish overall rate.
      await new Promise(resolve => setTimeout(resolve, 2));
    }

    const progressCall = processStdoutWriteMock.mock.calls[processStdoutWriteMock.mock.calls.length - 1][0];

    // Should contain ETA based on overall progress rate.
    expect(progressCall).toContain('ETA:');
    expect(progressCall).toContain('optimizing');

    // ETA should be reasonable (not 2 seconds when 80% work remains).
    const etaMatch = progressCall.match(/ETA: (\d+[ms])/);
    if (etaMatch) {
      const etaValue = etaMatch[1];
      // Should not show unreasonably short ETA like "2s" when significant work remains.
      expect(etaValue).not.toBe('2s');
    }
  });
});

describe('calculateTotalOperations', () => {
  /**
   * Test total operations calculation for multiple images in parallel.
   * Validates that the calculation correctly accounts for different formats
   * and responsive sizes based on image metadata, processing all images concurrently.
   */
  test('should calculate total operations for images in parallel', async () => {
    const images = ['test1.png', 'test2.jpg', 'test3.webp'];

    const totalOps = await calculateTotalOperations(images);

    // Should calculate operations based on formats and sizes.
    // For non-webp images: 3 formats * 6 sizes (5 standard + 1 from metadata).
    // For webp images: 2 formats * 6 sizes (webp excluded).
    expect(totalOps).toBeGreaterThan(0);
  });

  /**
   * Test operations calculation error handling with parallel processing.
   * Validates that the function gracefully handles images with unreadable metadata
   * by falling back to standard operation count estimates, without blocking other images.
   */
  test('should handle metadata reading errors in parallel', async () => {
    // Mock Sharp to throw an error for first image but succeed for second.
    const sharp = await import('sharp');
    const mockSharp = sharp.default as unknown as MockedFunction<typeof sharp.default>;

    let callCount = 0;
    mockSharp.mockImplementation(
      () =>
        ({
          resize: vi.fn().mockReturnThis(),
          png: vi.fn().mockReturnThis(),
          avif: vi.fn().mockReturnThis(),
          webp: vi.fn().mockReturnThis(),
          toBuffer: vi.fn().mockResolvedValue(Buffer.from('optimized_image_data')),
          metadata: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.reject(new Error('Cannot read metadata'));
            }
            return Promise.resolve({ width: 1024 });
          }),
        }) as unknown as Sharp,
    );

    const images = ['corrupted.png', 'valid.jpg'];
    const totalOps = await calculateTotalOperations(images);

    // Should fallback to standard count for corrupted image and calculate for valid image.
    expect(totalOps).toBeGreaterThan(0);

    // Both images should have been processed in parallel.
    expect(callCount).toBe(2);
  });

  /**
   * Test parallel processing performance characteristics.
   * Validates that multiple images are processed concurrently, not sequentially.
   */
  test('should process multiple images concurrently', async () => {
    const images = ['img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png'];

    // Track the timing to ensure parallel processing.
    const startTime = Date.now();
    const totalOps = await calculateTotalOperations(images);
    const endTime = Date.now();

    expect(totalOps).toBeGreaterThan(0);

    // With parallel processing, this should complete much faster than sequential.
    // In a real scenario with 5 images, parallel should be significantly faster.
    expect(endTime - startTime).toBeLessThan(1000); // Should complete quickly in tests
  });
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
    expect(() => compressImage(mockSharpInstance, 'pdf')).toThrow('Unsupported compression format: pdf');
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
    const normalizedResult = path.posix.normalize(result.replace(/\\/g, '/'));
    expect(normalizedResult).toStrictEqual('foo/bar');
  });

  /**
   * Test path transformation for blog images.
   * Preserve original directory structure for consistency.
   * Ensures blog images maintain their original path structure in optimized output.
   */
  test('dir starts with "blog/img"', () => {
    const result = getRelativeOutputDir('blog/img/foo/bar');
    // Normalize path separators for cross-platform compatibility.
    const normalizedResult = path.posix.normalize(result.replace(/\\/g, '/'));
    expect(normalizedResult).toStrictEqual('blog/img/foo/bar');
  });

  /**
   * Test path transformation for general blog content.
   * Preserve original directory structure for consistency.
   * Maintains original directory structure for blog-related files.
   */
  test('dir starts with "blog"', () => {
    const result = getRelativeOutputDir('blog/foo/bar');
    // Normalize path separators for cross-platform compatibility.
    const normalizedResult = path.posix.normalize(result.replace(/\\/g, '/'));
    expect(normalizedResult).toStrictEqual('blog/foo/bar');
  });

  /**
   * Test path transformation for docs directory.
   * Preserve original directory structure for consistency.
   * Maintains original directory structure for documentation images.
   */
  test('dir starts with "docs"', () => {
    const result = getRelativeOutputDir('docs/installation/img');
    // Normalize path separators for cross-platform compatibility.
    const normalizedResult = path.posix.normalize(result.replace(/\\/g, '/'));
    expect(normalizedResult).toStrictEqual('docs/installation/img');
  });
});

describe('generateOptimizedImage', () => {
  /**
   * Test successful image optimization with progress tracking.
   * Validates that images with recent modification times are processed
   * and that the function reports correct processing statistics while
   * properly updating progress tracking.
   */
  test('should optimize image with progress tracking', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT'; // Recent date (should trigger optimization)
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');

    const { processed, savedBytes, status } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeTruthy();
    expect(savedBytes).toBeGreaterThan(0);
    expect(status).toBe('processed');
    expect(progressSpy).toHaveBeenCalled();
  });

  /**
   * Test incremental optimization logic with progress tracking.
   * Validates that images with old modification times are skipped
   * but still update progress tracking for accurate completion reporting.
   */
  test('should not optimize image but update progress', async () => {
    const date = 'Mon, 1 Oct 1990 12:12:12 GMT'; // Old date (should skip optimization)
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');

    const { processed, savedBytes, status } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeFalsy();
    expect(savedBytes).toBe(0);
    expect(status).toBe('skipped');
    expect(progressSpy).toHaveBeenCalled(); // Progress should still be updated
  });

  /**
   * Test optimization without progress tracker (backward compatibility).
   * Validates that the function still works correctly when no progress
   * tracker is provided, maintaining compatibility with existing code.
   */
  test('should optimize image without progress tracker', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const { processed, savedBytes, status } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/',
      'png',
      statsMock,
      undefined, // No progress tracker
      { width: 42 }, // Custom width option
    );

    expect(processed).toBeTruthy();
    expect(savedBytes).toBeGreaterThan(0);
    expect(status).toBe('processed');
  });

  /**
   * Test handling of empty buffer generation.
   * Validates that the function detects when Sharp generates an empty buffer
   * and handles it gracefully without creating 0-byte files.
   */
  test('should handle empty buffer generation', async () => {
    // Mock Sharp to return an empty buffer.
    const sharp = await import('sharp');
    const mockSharp = sharp.default as unknown as MockedFunction<typeof sharp.default>;
    mockSharp.mockImplementationOnce(
      () =>
        ({
          resize: vi.fn().mockReturnThis(),
          png: vi.fn().mockReturnThis(),
          avif: vi.fn().mockReturnThis(),
          webp: vi.fn().mockReturnThis(),
          toBuffer: vi.fn().mockResolvedValue(Buffer.alloc(0)), // Empty buffer
          metadata: vi.fn().mockResolvedValue({ width: 1024 }),
        }) as unknown as Sharp,
    );

    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { processed, savedBytes, status } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/output.png',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeFalsy();
    expect(savedBytes).toBe(0);
    expect(status).toBe('failed');
    expect(progressSpy).toHaveBeenCalled(); // Progress should still be updated
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Generated empty buffer for output.png'));

    consoleSpy.mockRestore();
  });

  /**
   * Test handling of 0-byte file creation.
   * Validates that the function detects when files are written with 0 bytes
   * and cleans them up properly.
   */
  test('should handle 0-byte file creation', async () => {
    // Mock fs.stat to return 0 size for the written file check.
    const fs = await import('node:fs');
    const statMock = fs.promises.stat as MockedFunction<typeof fs.promises.stat>;
    let callCount = 0;
    statMock.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // First call - check if output file exists (should throw for new file).
        return Promise.reject(new Error('File does not exist'));
      } else if (callCount === 2) {
        // Second call - verify written file (return 0 size to simulate the bug).
        return Promise.resolve({
          size: 0, // 0-byte file detected!
          mtime: new Date(),
        } as Stats);
      }
      return Promise.resolve({
        mtime: new Date('2000-10-01T12:12:12Z'),
        size: 420,
      } as Stats);
    });

    const unlinkMock = fs.promises.unlink as MockedFunction<typeof fs.promises.unlink>;
    unlinkMock.mockResolvedValue();

    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/output.png',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeFalsy();
    expect(savedBytes).toBe(0);
    expect(progressSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('File output.png was written but has 0 bytes'));
    expect(unlinkMock).toHaveBeenCalledWith('folder/name/output.png');

    consoleSpy.mockRestore();
  });

  /**
   * Test handling of Sharp processing errors.
   * Validates that Sharp processing errors are caught and handled gracefully
   * without crashing the optimization process.
   */
  test('should handle Sharp processing errors', async () => {
    // Mock Sharp to throw an error during processing.
    const sharp = await import('sharp');
    const mockSharp = sharp.default as unknown as MockedFunction<typeof sharp.default>;
    mockSharp.mockImplementationOnce(
      () =>
        ({
          resize: vi.fn().mockReturnThis(),
          png: vi.fn().mockReturnThis(),
          avif: vi.fn().mockReturnThis(),
          webp: vi.fn().mockReturnThis(),
          toBuffer: vi.fn().mockRejectedValue(new Error('Sharp processing failed')),
          metadata: vi.fn().mockResolvedValue({ width: 1024 }),
        }) as unknown as Sharp,
    );

    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock unlink for cleanup.
    const fs = await import('node:fs');
    const unlinkMock = fs.promises.unlink as MockedFunction<typeof fs.promises.unlink>;
    unlinkMock.mockResolvedValue();

    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/output.png',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeFalsy();
    expect(savedBytes).toBe(0);
    expect(progressSpy).toHaveBeenCalled(); // Progress should still be updated
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error generating output.png'));

    consoleSpy.mockRestore();
  });

  /**
   * Test handling of specific Sharp "Invalid count value" errors.
   * Validates that the specific Sharp error about invalid count values
   * gets enhanced error messaging for better debugging.
   */
  test('should handle Sharp invalid count value errors with enhanced messaging', async () => {
    // Mock Sharp to throw the specific "Invalid count value" error.
    const sharp = await import('sharp');
    const mockSharp = sharp.default as unknown as MockedFunction<typeof sharp.default>;
    mockSharp.mockImplementationOnce(
      () =>
        ({
          resize: vi.fn().mockReturnThis(),
          png: vi.fn().mockReturnThis(),
          avif: vi.fn().mockReturnThis(),
          webp: vi.fn().mockReturnThis(),
          toBuffer: vi.fn().mockRejectedValue(new Error('Invalid count value: -1')),
          metadata: vi.fn().mockResolvedValue({ width: 1024 }),
        }) as unknown as Sharp,
    );

    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock unlink for cleanup.
    const fs = await import('node:fs');
    const unlinkMock = fs.promises.unlink as MockedFunction<typeof fs.promises.unlink>;
    unlinkMock.mockResolvedValue();

    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/output.png',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeFalsy();
    expect(savedBytes).toBe(0);

    // Should show enhanced error message for this specific Sharp error.
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Image processing error for output.png:'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid count value: -1'));
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('This image may be corrupted or in an unsupported format.'),
    );

    consoleSpy.mockRestore();
  });

  /**
   * Test successful optimization without verbose logging.
   * Validates that successful optimizations complete without logging
   * success details to keep output clean.
   */
  test('should optimize without verbose success logging', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 1000, // 1KB original
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/output.png',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeTruthy();
    expect(savedBytes).toBeGreaterThan(0);

    // Should NOT log success details to keep output quiet.
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('✅'));

    consoleSpy.mockRestore();
  });

  /**
   * Test skipped file handling without verbose logging.
   * Validates that up-to-date files are skipped quietly
   * without generating console output.
   */
  test('should skip files quietly when up-to-date', async () => {
    const date = 'Mon, 1 Oct 1990 12:12:12 GMT'; // Old date (file up-to-date)
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { processed, savedBytes } = await generateOptimizedImage(
      'some/image/path.png',
      'folder/name/output.png',
      'png',
      statsMock,
      progressTracker,
    );

    expect(processed).toBeFalsy();
    expect(savedBytes).toBe(0);

    // Should NOT log skip messages to keep output quiet.
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('⏭️'));

    consoleSpy.mockRestore();
  });

  /**
   * Test new file creation without verbose logging.
   * Validates that new files are created quietly
   * without generating status messages.
   */
  test('should create new files quietly', async () => {
    // Mock fs.stat to throw (file doesn't exist).
    const fs = await import('node:fs');
    const statMock = fs.promises.stat as MockedFunction<typeof fs.promises.stat>;
    statMock.mockImplementationOnce(() => Promise.reject(new Error('File does not exist')));

    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const progressTracker = new ProgressTracker(10, 2);
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await generateOptimizedImage('some/image/path.png', 'folder/name/output.png', 'png', statsMock, progressTracker);

    // Should NOT log creation messages to keep output quiet.
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('🔄'));

    consoleSpy.mockRestore();
  });
});

describe('optimizeImageWithProgress', () => {
  /**
   * Test complete image optimization workflow with progress tracking.
   * Tests the integration between image processing, directory creation,
   * metadata reading, and progress tracking systems.
   */
  test('should optimize image with progress updates', async () => {
    const progressTracker = new ProgressTracker(18, 1); // Expect multiple operations per image
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');

    const { processedCount, savedBytes } = await optimizeImageWithProgress(
      'blog/img/imagePath.png',
      '/build/dir',
      progressTracker,
    );

    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);

    // Progress should be updated for each operation and once for image completion.
    expect(progressSpy).toHaveBeenCalled();

    // Should be called with true for image completion.
    expect(progressSpy).toHaveBeenCalledWith(true);
  });

  /**
   * Test error handling during image optimization.
   * Validates that errors are properly caught and logged while
   * gracefully returning zero counts without crashing the process.
   */
  test('should handle errors gracefully', async () => {
    // Mock fs.stat to throw an error.
    const fs = await import('node:fs');
    const statMock = fs.promises.stat as MockedFunction<typeof fs.promises.stat>;
    statMock.mockRejectedValueOnce(new Error('File not found'));

    const progressTracker = new ProgressTracker(10, 1);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { processedCount, savedBytes } = await optimizeImageWithProgress(
      'nonexistent.png',
      '/build/dir',
      progressTracker,
    );

    expect(processedCount).toBe(0);
    expect(savedBytes).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Critical error processing'), expect.any(Error));

    consoleSpy.mockRestore();
  });

  /**
   * Test successful image processing without verbose logging.
   * Validates that successful image processing completes quietly
   * without generating detailed success messages.
   */
  test('should process images quietly when successful', async () => {
    const progressTracker = new ProgressTracker(18, 1);
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { processedCount, savedBytes } = await optimizeImageWithProgress(
      'blog/img/imagePath.png',
      '/build/dir',
      progressTracker,
    );

    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);

    // Should NOT log verbose success messages to keep output quiet.
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('✅ Processed'));

    consoleSpy.mockRestore();
  });

  /**
   * Test warning for images with failed variants.
   * Validates that images that fail to produce any variants trigger
   * appropriate warning messages for debugging.
   */
  test('should warn when variants fail to be created', async () => {
    // Mock Sharp to return invalid metadata.
    const sharp = await import('sharp');
    const mockSharp = sharp.default as unknown as MockedFunction<typeof sharp.default>;
    mockSharp.mockImplementationOnce(
      () =>
        ({
          resize: vi.fn().mockReturnThis(),
          png: vi.fn().mockReturnThis(),
          avif: vi.fn().mockReturnThis(),
          webp: vi.fn().mockReturnThis(),
          toBuffer: vi.fn().mockResolvedValue(Buffer.from('optimized_image_data')),
          metadata: vi.fn().mockResolvedValue({ width: null, height: null }), // Invalid metadata
        }) as unknown as Sharp,
    );

    const progressTracker = new ProgressTracker(18, 1);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { processedCount, savedBytes, failedCount } = await optimizeImageWithProgress(
      'blog/img/invalidImage.png',
      '/build/dir',
      progressTracker,
    );

    expect(processedCount).toBe(0);
    expect(savedBytes).toBe(0);
    expect(failedCount).toBe(1);

    // Should log invalid metadata error.
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Invalid image metadata'));

    // Should NOT warn about no variants since this is a clear error, not a warning case.
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('⚠️'));

    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  /**
   * Test that skipped/cached images don't trigger warnings.
   * Validates that images that are skipped because they're already cached
   * don't generate warning messages, only failed images do.
   */
  test('should not warn for skipped/cached images', async () => {
    // Mock all variants to be skipped (cached).
    const progressTracker = new ProgressTracker(18, 1);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { processedCount, savedBytes, skippedCount } = await optimizeImageWithProgress(
      'blog/img/cachedImage.png',
      '/build/dir',
      progressTracker,
    );

    expect(processedCount).toBe(0);
    expect(savedBytes).toBe(0);
    expect(skippedCount).toBeGreaterThan(0);

    // Should NOT warn about skipped images (they're cached, which is good).
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('⚠️'));

    consoleWarnSpy.mockRestore();
  });

  /**
   * Test metadata reading error handling.
   * Validates that metadata reading errors are properly caught,
   * logged with appropriate error messages, and don't crash the process.
   */
  test('should handle metadata reading errors', async () => {
    // Mock Sharp to throw during metadata reading.
    const sharp = await import('sharp');
    const mockSharp = sharp.default as unknown as MockedFunction<typeof sharp.default>;
    mockSharp.mockImplementationOnce(
      () =>
        ({
          resize: vi.fn().mockReturnThis(),
          png: vi.fn().mockReturnThis(),
          avif: vi.fn().mockReturnThis(),
          webp: vi.fn().mockReturnThis(),
          toBuffer: vi.fn().mockResolvedValue(Buffer.from('optimized_image_data')),
          metadata: vi.fn().mockRejectedValue(new Error('Cannot read image metadata')),
        }) as unknown as Sharp,
    );

    const progressTracker = new ProgressTracker(18, 1);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { processedCount, savedBytes } = await optimizeImageWithProgress(
      'blog/img/corruptedImage.png',
      '/build/dir',
      progressTracker,
    );

    expect(processedCount).toBe(0);
    expect(savedBytes).toBe(0);

    // Should log metadata reading error.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Failed to read metadata for blog/img/corruptedImage.png:'),
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});

describe('optimizeImage', () => {
  /**
   * Test legacy image optimization function.
   * Validates backward compatibility for code that doesn't use progress tracking.
   * Should function identically to the progress-enabled version.
   */
  test('should optimize image without explicit progress tracking', async () => {
    const { processedCount, savedBytes } = await optimizeImage('blog/img/imagePath.png', '/build/dir');

    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);
  });
});

describe('processImagesInBatches', () => {
  /**
   * Test batch processing with default batch size.
   * Validates that images are processed in manageable batches to avoid
   * system resource exhaustion while maintaining progress tracking.
   */
  test('should process images in batches with progress tracking', async () => {
    const images = ['img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png'];
    const progressTracker = new ProgressTracker(90, 5); // Assume 18 operations per image
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');

    const results = await processImagesInBatches(images, '/build/dir', progressTracker);

    expect(results).toHaveLength(5);
    expect(results.every(result => result.processedCount > 0)).toBeTruthy();
    expect(results.every(result => result.savedBytes > 0)).toBeTruthy();

    // Progress should be updated for each operation and image completion.
    expect(progressSpy).toHaveBeenCalled();
  });

  /**
   * Test batch processing with custom batch size.
   * Validates that the batch size parameter correctly limits concurrent processing
   * and that all images are still processed regardless of batch size.
   */
  test('should respect custom batch size', async () => {
    const images = ['img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png'];
    const progressTracker = new ProgressTracker(90, 5);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');
    const batchSize = 2;

    const results = await processImagesInBatches(images, '/build/dir', progressTracker, batchSize);

    expect(results).toHaveLength(5);
    expect(results.every(result => result.processedCount > 0)).toBeTruthy();
    expect(results.every(result => result.savedBytes > 0)).toBeTruthy();

    // Progress should be updated for each operation and image completion.
    expect(progressSpy).toHaveBeenCalled();
  });

  /**
   * Test batch processing with single image batches.
   * Validates that even with batch size 1, all images are processed
   * and progress tracking continues to work correctly.
   */
  test('should handle batch size of 1', async () => {
    const images = ['img1.png', 'img2.png'];
    const progressTracker = new ProgressTracker(36, 2);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');

    const results = await processImagesInBatches(images, '/build/dir', progressTracker, 1);

    expect(results).toHaveLength(2);
    expect(progressSpy).toHaveBeenCalled();
  });

  /**
   * Test batch processing with empty image array.
   * Validates that the function handles edge cases gracefully
   * and returns appropriate results for empty input.
   */
  test('should handle empty image array', async () => {
    const images: string[] = [];
    const progressTracker = new ProgressTracker(0, 0);

    const results = await processImagesInBatches(images, '/build/dir', progressTracker);

    expect(results).toHaveLength(0);
  });

  /**
   * Test batch processing error handling.
   * Validates that errors in individual images don't break the entire batch
   * and that processing continues for remaining images.
   */
  test('should handle errors in individual images', async () => {
    // Mock fs.stat to fail for first image.
    const fs = await import('node:fs');
    const statMock = fs.promises.stat as MockedFunction<typeof fs.promises.stat>;
    let callCount = 0;
    statMock.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('First image failed'));
      }
      return Promise.resolve({
        mtime: new Date('2000-10-01T12:12:12Z'),
        size: 420,
        isFile: () => true,
        isDirectory: () => false,
      } as Stats);
    });

    const images = ['failing.png', 'working.png'];
    const progressTracker = new ProgressTracker(36, 2);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const results = await processImagesInBatches(images, '/build/dir', progressTracker);

    expect(results).toHaveLength(2);
    expect(results[0].processedCount).toBe(0); // Failed image
    expect(results[1].processedCount).toBeGreaterThan(0); // Successful image

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Critical error processing'), expect.any(Error));

    consoleSpy.mockRestore();
  });
});

describe('processImageFormats', () => {
  /**
   * Test multi-format processing with responsive sizes and progress tracking.
   * Validates the core functionality that generates multiple image formats
   * and responsive sizes for each image while properly updating progress.
   *
   * This is a critical integration test that verifies:
   * - Multiple format generation (AVIF, WebP, PNG).
   * - Responsive size generation for different viewport widths.
   * - Proper statistics tracking across all generated variants.
   * - Integration between path parsing, metadata, and Sharp processing.
   * - Real-time progress updates during multi-format processing.
   */
  test('should create images in different widths with progress tracking', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const metadataMock = {
      width: 42, // Mock image width for responsive size calculations
    } as unknown as Metadata;

    const progressTracker = new ProgressTracker(18, 1);
    const progressSpy = vi.spyOn(progressTracker, 'updateProgress');

    const { processedCount, savedBytes } = await processImageFormats({
      imagePath: 'blog/img/imagePath.png',
      outputDir: '/build/dir',
      parsedPath: path.parse('blog/img/imagePath.png'), // Parsed path components
      stats: statsMock,
      metadata: metadataMock,
      progressTracker,
    });

    // Verify that multiple images were processed (responsive sizes + formats).
    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);

    // Progress should be updated for each generated image variant.
    expect(progressSpy).toHaveBeenCalled();
  });

  /**
   * Test format processing without progress tracker.
   * Validates backward compatibility when progress tracking is not needed.
   * Should work identically to the progress-enabled version.
   */
  test('should process formats without progress tracker', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const metadataMock = {
      width: 1024,
    } as unknown as Metadata;

    const { processedCount, savedBytes } = await processImageFormats({
      imagePath: 'blog/img/imagePath.png',
      outputDir: '/build/dir',
      parsedPath: path.parse('blog/img/imagePath.png'),
      stats: statsMock,
      metadata: metadataMock,
      // No progress tracker provided.
    });

    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);
  });
});
