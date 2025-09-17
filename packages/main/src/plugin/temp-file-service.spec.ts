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

import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { TempFileService } from './temp-file-service.js';

vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(),
  unlink: vi.fn(),
}));

vi.mock('node:os', () => ({
  tmpdir: vi.fn().mockReturnValue('/tmp'),
}));

vi.mock('node:path', () => ({
  join: vi.fn().mockImplementation((...args) => args.join('/')),
}));

const originalConsoleWarn = console.warn;

class TestTempFileService extends TempFileService {
  override async createTempFile(content: string, extension: string = 'yaml'): Promise<string> {
    return super.createTempFile(content, extension);
  }

  override async removeTempFile(filePath: string): Promise<void> {
    return super.removeTempFile(filePath);
  }

  override async cleanup(): Promise<void> {
    return super.cleanup();
  }

  override getTempFiles(): string[] {
    return super.getTempFiles();
  }
}

let tempFileService: TestTempFileService;
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(Date.UTC(2012, 11, 21, 0, 0, 0)));

  console.warn = vi.fn();

  vi.mocked(tmpdir).mockReturnValue('/tmp');
  vi.mocked(writeFile).mockResolvedValue(undefined);
  vi.mocked(join).mockImplementation((...args) => args.join('/'));
  tempFileService = new TestTempFileService();
});

afterEach(() => {
  vi.useRealTimers();
  console.warn = originalConsoleWarn;
});

describe('createTempFile', () => {
  test('creates temporary file with default parameters', async () => {
    const content = 'test content';
    const expectedPath = '/tmp/temp-1356048000000.yaml';

    const result = await tempFileService.createTempFile(content);

    expect(vi.mocked(tmpdir)).toHaveBeenCalled();
    expect(vi.mocked(join)).toHaveBeenCalledWith('/tmp', 'temp-1356048000000.yaml');
    expect(vi.mocked(writeFile)).toHaveBeenCalledWith(expectedPath, content, 'utf-8');
    expect(result).toBe(expectedPath);
    expect(tempFileService.getTempFiles()).toContain(expectedPath);
  });

  test('creates temporary file with custom prefix and extension', async () => {
    const content = 'custom content';
    const extension = 'json';
    const mockPath = '/tmp/temp-1356048000000.json';

    const result = await tempFileService.createTempFile(content, extension);

    expect(vi.mocked(join)).toHaveBeenCalledWith('/tmp', 'temp-1356048000000.json');
    expect(vi.mocked(writeFile)).toHaveBeenCalledWith(mockPath, content, 'utf-8');
    expect(result).toBe(mockPath);
    expect(tempFileService.getTempFiles()).toContain(mockPath);
  });

  test('throws error when file creation fails', async () => {
    const content = 'test content';
    const error = new Error('Permission denied');

    vi.mocked(writeFile).mockRejectedValue(error);

    await expect(tempFileService.createTempFile(content)).rejects.toThrow('Permission denied');
  });

  test('tracks multiple temporary files', async () => {
    const content1 = 'content 1';
    const content2 = 'content 2';
    const expectedPath1 = '/tmp/temp-1356048000000.yaml';
    const expectedPath2 = '/tmp/temp-1356048001000.yaml';

    await tempFileService.createTempFile(content1);
    // Advance time by 1ms for the second file
    vi.setSystemTime(new Date(Date.UTC(2012, 11, 21, 0, 0, 1)));
    await tempFileService.createTempFile(content2);

    const trackedFiles = tempFileService.getTempFiles();
    expect(trackedFiles).toContain(expectedPath1);
    expect(trackedFiles).toContain(expectedPath2);
    expect(trackedFiles).toHaveLength(2);
  });
});

describe('removeTempFile', () => {
  test('removes tracked temporary file successfully', async () => {
    // Create a file and get its actual path
    const filePath = await tempFileService.createTempFile('content');

    vi.mocked(unlink).mockResolvedValue(undefined);

    await tempFileService.removeTempFile(filePath);

    expect(vi.mocked(unlink)).toHaveBeenCalledWith(filePath);
    expect(tempFileService.getTempFiles()).not.toContain(filePath);
  });

  test('does not attempt to remove untracked file', async () => {
    const filePath = '/tmp/untracked-file.yaml';

    await tempFileService.removeTempFile(filePath);

    expect(vi.mocked(unlink)).not.toHaveBeenCalled();
    expect(tempFileService.getTempFiles()).not.toContain(filePath);
  });

  test('handles file removal error gracefully', async () => {
    const error = new Error('File not found');

    // Create a file and get its actual path
    const filePath = await tempFileService.createTempFile('content');

    vi.mocked(unlink).mockRejectedValue(error);

    // Should not throw, but file should remain in tracking since deletion failed
    await expect(tempFileService.removeTempFile(filePath)).resolves.not.toThrow();
    expect(tempFileService.getTempFiles()).toContain(filePath);
  });

  test('logs warning when file removal fails', async () => {
    const error = new Error('Permission denied');

    // Create a file and get its actual path
    const filePath = await tempFileService.createTempFile('content');

    vi.mocked(unlink).mockRejectedValue(error);

    await tempFileService.removeTempFile(filePath);

    expect(console.warn).toHaveBeenCalledWith(`Failed to remove temporary file ${filePath}:`, error);
  });
});

describe('cleanup', () => {
  test('removes all tracked temporary files', async () => {
    const expectedPath1 = '/tmp/temp-1356048000000.yaml';
    const expectedPath2 = '/tmp/temp-1356048001000.yaml';
    const expectedPath3 = '/tmp/temp-1356048002000.yaml';

    // Add files to tracking
    await tempFileService.createTempFile('content1');
    // Advance time for different timestamps
    vi.setSystemTime(new Date(Date.UTC(2012, 11, 21, 0, 0, 1)));
    await tempFileService.createTempFile('content2');
    vi.setSystemTime(new Date(Date.UTC(2012, 11, 21, 0, 0, 2)));
    await tempFileService.createTempFile('content3');

    vi.mocked(unlink).mockResolvedValue(undefined);

    await tempFileService.cleanup();

    expect(vi.mocked(unlink)).toHaveBeenCalledTimes(3);
    expect(vi.mocked(unlink)).toHaveBeenCalledWith(expectedPath1);
    expect(vi.mocked(unlink)).toHaveBeenCalledWith(expectedPath2);
    expect(vi.mocked(unlink)).toHaveBeenCalledWith(expectedPath3);
    expect(tempFileService.getTempFiles()).toHaveLength(0);
  });

  test('handles mixed success and failure during cleanup', async () => {
    const expectedPath1 = '/tmp/temp-1356048000000.yaml';
    const expectedPath2 = '/tmp/temp-1356048001000.yaml';
    const error = new Error('Permission denied');

    // Add files to tracking
    await tempFileService.createTempFile('content1');
    // Advance time for different timestamp
    vi.setSystemTime(new Date(Date.UTC(2012, 11, 21, 0, 0, 1)));

    await tempFileService.createTempFile('content2');

    vi.mocked(unlink)
      .mockResolvedValueOnce(undefined) // file1 succeeds
      .mockRejectedValueOnce(error); // file2 fails

    await tempFileService.cleanup();

    expect(vi.mocked(unlink)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(unlink)).toHaveBeenCalledWith(expectedPath1);
    expect(vi.mocked(unlink)).toHaveBeenCalledWith(expectedPath2);
    expect(console.warn).toHaveBeenCalledWith(`Failed to remove temporary file ${expectedPath2}:`, error);
    // Only file1 removed from tracking, file2 remains due to failed deletion
    expect(tempFileService.getTempFiles()).toEqual([expectedPath2]);
  });

  test('handles cleanup when no files are tracked', async () => {
    await tempFileService.cleanup();

    expect(vi.mocked(unlink)).not.toHaveBeenCalled();
    expect(tempFileService.getTempFiles()).toHaveLength(0);
  });
});

describe('getTempFiles', () => {
  test('returns empty array when no files are tracked', () => {
    const result = tempFileService.getTempFiles();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  test('returns copy of tracked files array', async () => {
    const expectedPath = '/tmp/temp-1356048000000.yaml';
    await tempFileService.createTempFile('content');
    const result = tempFileService.getTempFiles();
    expect(result).toEqual([expectedPath]);
  });
});
