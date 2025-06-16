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

const consoleLogMock = vi.fn();
const originalConsoleLog = console.log;

const startDir = 'start-dir';
const imagesDir = path.join(startDir, 'images');
const nestedDir = path.join(imagesDir, 'nested');
const docsDir = path.join(startDir, 'docs');

const mockFsStructure: Record<string, Dirent[]> = {
  [startDir]: [
    createDirent('images', 'directory'),
    createDirent('docs', 'directory'),
    createDirent('root-image.png', 'file'),
  ],
  [imagesDir]: [
    createDirent('nested', 'directory'),
    createDirent('photo.avif', 'file'),
    createDirent('icon.webp', 'file'),
    createDirent('archive.zip', 'file'),
  ],
  [nestedDir]: [createDirent('final.png', 'file')],
  [docsDir]: [createDirent('readme.md', 'file')],
};

vi.mock('node:fs', async () => {
  return {
    promises: {
      readdir: vi.fn(async (dirPath: string) => {
        if (mockFsStructure[dirPath]) {
          return mockFsStructure[dirPath];
        }
        return [];
      }),
      stat: vi.fn().mockResolvedValue({
        mtime: new Date('2000-10-01T12:12:12Z'),
        size: 420,
        isFile: () => true,
        isDirectory: () => false,
      }),
      writeFile: vi.fn(),
      mkdir: vi.fn().mockRejectedValueOnce(vi.fn()).mockResolvedValue(vi.fn()),
    },
  };
});

vi.mock('sharp', () => {
  const mockSharpInstance = {
    resize: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('foo.bar')),
    png: vi.fn().mockReturnThis(),
    avif: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    metadata: vi.fn().mockResolvedValue({}),
  } as unknown as Sharp;

  return {
    default: vi.fn(() => {
      return mockSharpInstance;
    }),
  };
});

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
  console.log = originalConsoleLog;
});

describe('compressImage', () => {
  const mockSharpInstance = {
    png: vi.fn(),
    avif: vi.fn(),
    webp: vi.fn(),
  } as unknown as Sharp;

  test('compressImage should compress valid image format', () => {
    compressImage(mockSharpInstance, 'png');
    expect(mockSharpInstance.png).toBeCalled();
  });

  test('compressImage should throw error for invalid image format', () => {
    expect(() => compressImage(mockSharpInstance, 'pdf')).toThrow('Unsupported image format: pdf');
    expect(mockSharpInstance.png).not.toBeCalled();
    expect(mockSharpInstance.avif).not.toBeCalled();
    expect(mockSharpInstance.webp).not.toBeCalled();
  });
});

describe('getRelativeOutputDir', () => {
  test('dir starts with "static"', () => {
    const path = getRelativeOutputDir('static/foo/bar');
    expect(path).toStrictEqual('foo/bar');
  });

  test('dir starts with "blog/img"', () => {
    const path = getRelativeOutputDir('blog/img/foo/bar');
    expect(path).toStrictEqual('img/blog/foo/bar');
  });

  test('dir starts with "blog"', () => {
    const path = getRelativeOutputDir('blog/foo/bar');
    expect(path).toStrictEqual('foo/bar');
  });
});

describe('generateOptimizedImage', () => {
  test('should optimize image', async () => {
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
    );

    expect(processed).toBeTruthy();
    expect(savedBytes).toBeGreaterThan(0);
  });

  test('should not optimize image', async () => {
    const date = 'Mon, 1 Oct 1990 12:12:12 GMT';
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

  test('should optimize image custon options', async () => {
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
      { width: 42 },
    );

    expect(processed).toBeTruthy();
    expect(savedBytes).toBeGreaterThan(0);
  });
});

describe('optimizeImage', () => {
  test('should not optimize image', async () => {
    const { processedCount, savedBytes } = await optimizeImage('blog/img/imagePath.png', '/build/dir');
    expect(processedCount).toBe(0);
    expect(savedBytes).toBe(0);
  });

  test('should optimize image', async () => {
    const { processedCount, savedBytes } = await optimizeImage('blog/img/imagePath.png', '/build/dir');
    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);
  });
});

describe('processImageFormats', () => {
  test('should create images in different widths', async () => {
    const date = 'Mon, 1 Oct 2010 12:12:12 GMT';
    const statsMock = {
      mtime: new Date(date),
      size: 420,
    } as unknown as Stats;

    const metadataMock = {
      width: 42,
    } as unknown as Metadata;
    const { processedCount, savedBytes } = await processImageFormats(
      'blog/img/imagePath.png',
      '/build/dir',
      path.parse('blog/img/imagePath.png'),
      statsMock,
      metadataMock,
    );

    expect(processedCount).toBeGreaterThan(0);
    expect(savedBytes).toBeGreaterThan(0);
  });
});
