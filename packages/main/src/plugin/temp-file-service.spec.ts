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

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { TempFileService } from './temp-file-service.js';

vi.mock('node:fs');
vi.mock('node:os');
vi.mock('node:path');

const mockWriteFile = vi.fn();
const mockUnlink = vi.fn();
const mockTmpDir = vi.fn().mockReturnValue('/tmp');
const mockJoin = vi.fn().mockImplementation((...args) => args.join('/'));

vi.mocked(fs.promises).writeFile = mockWriteFile;
vi.mocked(fs.promises).unlink = mockUnlink;
vi.mocked(os).tmpdir = mockTmpDir;
vi.mocked(path).join = mockJoin;

describe('TempFileService', () => {
  let tempFileService: TempFileService;

  beforeEach(() => {
    vi.clearAllMocks();

    tempFileService = new TempFileService();
  });

  describe('createTempFile', () => {
    test('creates temporary file with default parameters', async () => {
      const content = 'test content';
      const mockPath = '/tmp/temp-123456789-.yaml';

      // Mock Date.now() to return a predictable timestamp
      const mockTimestamp = 123456789;
      vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      mockJoin.mockReturnValue(mockPath);
      mockWriteFile.mockResolvedValue(undefined);

      const result = await tempFileService.createTempFile(content);

      expect(mockTmpDir).toHaveBeenCalled();
      expect(mockJoin).toHaveBeenCalledWith('/tmp', 'temp-123456789.yaml');
      expect(mockWriteFile).toHaveBeenCalledWith(mockPath, content, 'utf-8');
      expect(result).toBe(mockPath);
      expect(tempFileService.getTempFiles()).toContain(mockPath);
    });

    test('creates temporary file with custom prefix and extension', async () => {
      const content = 'custom content';
      const prefix = 'custom';
      const extension = '.json';
      const mockPath = '/tmp/custom-123456789-.json';

      vi.spyOn(Date, 'now').mockReturnValue(123456789);
      mockJoin.mockReturnValue(mockPath);
      mockWriteFile.mockResolvedValue(undefined);

      const result = await tempFileService.createTempFile(content, prefix, extension);

      expect(mockJoin).toHaveBeenCalledWith('/tmp', 'custom-123456789.json');
      expect(mockWriteFile).toHaveBeenCalledWith(mockPath, content, 'utf-8');
      expect(result).toBe(mockPath);
      expect(tempFileService.getTempFiles()).toContain(mockPath);
    });

    test('throws error when file creation fails', async () => {
      const content = 'test content';
      const error = new Error('Permission denied');

      mockWriteFile.mockRejectedValue(error);

      await expect(tempFileService.createTempFile(content)).rejects.toThrow('Permission denied');
    });

    test('tracks multiple temporary files', async () => {
      const content1 = 'content 1';
      const content2 = 'content 2';
      const mockPath1 = '/tmp/temp-111-.yaml';
      const mockPath2 = '/tmp/temp-222-.yaml';

      vi.spyOn(Date, 'now').mockReturnValueOnce(111).mockReturnValueOnce(222);

      mockJoin.mockReturnValueOnce(mockPath1).mockReturnValueOnce(mockPath2);
      mockWriteFile.mockResolvedValue(undefined);

      await tempFileService.createTempFile(content1);
      await tempFileService.createTempFile(content2);

      const trackedFiles = tempFileService.getTempFiles();
      expect(trackedFiles).toContain(mockPath1);
      expect(trackedFiles).toContain(mockPath2);
      expect(trackedFiles).toHaveLength(2);
    });
  });

  describe('createTempKubeFile', () => {
    test('creates Kubernetes YAML file with correct prefix', async () => {
      const yamlContent = 'apiVersion: v1\nkind: Pod';
      const mockPath = '/tmp/kube-123456789-.yaml';

      vi.spyOn(Date, 'now').mockReturnValue(123456789);
      mockJoin.mockReturnValue(mockPath);
      mockWriteFile.mockResolvedValue(undefined);

      const result = await tempFileService.createTempKubeFile(yamlContent);

      expect(mockJoin).toHaveBeenCalledWith('/tmp', 'kube-123456789.yaml');
      expect(mockWriteFile).toHaveBeenCalledWith(mockPath, yamlContent, 'utf-8');
      expect(result).toBe(mockPath);
      expect(tempFileService.getTempFiles()).toContain(mockPath);
    });
  });

  describe('removeTempFile', () => {
    test('removes tracked temporary file successfully', async () => {
      const filePath = '/tmp/test-file.yaml';

      // Add file to tracking first
      mockWriteFile.mockResolvedValue(undefined);
      vi.spyOn(Date, 'now').mockReturnValue(123);
      mockJoin.mockReturnValue(filePath);
      await tempFileService.createTempFile('content');

      mockUnlink.mockResolvedValue(undefined);

      await tempFileService.removeTempFile(filePath);

      expect(mockUnlink).toHaveBeenCalledWith(filePath);
      expect(tempFileService.getTempFiles()).not.toContain(filePath);
    });

    test('does not attempt to remove untracked file', async () => {
      const filePath = '/tmp/untracked-file.yaml';

      await tempFileService.removeTempFile(filePath);

      expect(mockUnlink).not.toHaveBeenCalled();
      expect(tempFileService.getTempFiles()).not.toContain(filePath);
    });

    test('handles file removal error gracefully', async () => {
      const filePath = '/tmp/test-file.yaml';
      const error = new Error('File not found');

      // Add file to tracking first
      mockWriteFile.mockResolvedValue(undefined);
      vi.spyOn(Date, 'now').mockReturnValue(123);
      mockJoin.mockReturnValue(filePath);
      await tempFileService.createTempFile('content');

      mockUnlink.mockRejectedValue(error);

      // Should not throw, but file should remain in tracking since deletion failed
      await expect(tempFileService.removeTempFile(filePath)).resolves.not.toThrow();
      expect(tempFileService.getTempFiles()).toContain(filePath);
    });

    test('logs warning when file removal fails', async () => {
      const filePath = '/tmp/test-file.yaml';
      const error = new Error('Permission denied');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Add file to tracking first
      mockWriteFile.mockResolvedValue(undefined);
      vi.spyOn(Date, 'now').mockReturnValue(123);
      mockJoin.mockReturnValue(filePath);
      await tempFileService.createTempFile('content');

      mockUnlink.mockRejectedValue(error);

      await tempFileService.removeTempFile(filePath);

      expect(consoleSpy).toHaveBeenCalledWith(`Failed to remove temporary file ${filePath}:`, error);

      consoleSpy.mockRestore();
    });
  });

  describe('cleanup', () => {
    test('removes all tracked temporary files', async () => {
      const filePath1 = '/tmp/file1.yaml';
      const filePath2 = '/tmp/file2.yaml';
      const filePath3 = '/tmp/file3.yaml';

      // Add files to tracking
      mockWriteFile.mockResolvedValue(undefined);
      vi.spyOn(Date, 'now').mockReturnValueOnce(111).mockReturnValueOnce(222).mockReturnValueOnce(333);
      mockJoin.mockReturnValueOnce(filePath1).mockReturnValueOnce(filePath2).mockReturnValueOnce(filePath3);

      await tempFileService.createTempFile('content1');
      await tempFileService.createTempFile('content2');
      await tempFileService.createTempFile('content3');

      mockUnlink.mockResolvedValue(undefined);

      await tempFileService.cleanup();

      expect(mockUnlink).toHaveBeenCalledTimes(3);
      expect(mockUnlink).toHaveBeenCalledWith(filePath1);
      expect(mockUnlink).toHaveBeenCalledWith(filePath2);
      expect(mockUnlink).toHaveBeenCalledWith(filePath3);
      expect(tempFileService.getTempFiles()).toHaveLength(0);
    });

    test('handles mixed success and failure during cleanup', async () => {
      const filePath1 = '/tmp/file1.yaml';
      const filePath2 = '/tmp/file2.yaml';
      const error = new Error('Permission denied');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Add files to tracking
      mockWriteFile.mockResolvedValue(undefined);
      vi.spyOn(Date, 'now').mockReturnValueOnce(111).mockReturnValueOnce(222);
      mockJoin.mockReturnValueOnce(filePath1).mockReturnValueOnce(filePath2);

      await tempFileService.createTempFile('content1');
      await tempFileService.createTempFile('content2');

      mockUnlink
        .mockResolvedValueOnce(undefined) // file1 succeeds
        .mockRejectedValueOnce(error); // file2 fails

      await tempFileService.cleanup();

      expect(mockUnlink).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith(`Failed to remove temporary file ${filePath2}:`, error);
      // Only file1 removed from tracking, file2 remains due to failed deletion
      expect(tempFileService.getTempFiles()).toEqual([filePath2]);

      consoleSpy.mockRestore();
    });

    test('handles cleanup when no files are tracked', async () => {
      await tempFileService.cleanup();

      expect(mockUnlink).not.toHaveBeenCalled();
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
      const filePath = '/tmp/test-file.yaml';

      mockWriteFile.mockResolvedValue(undefined);
      vi.spyOn(Date, 'now').mockReturnValue(123);
      mockJoin.mockReturnValue(filePath);
      await tempFileService.createTempFile('content');

      const result1 = tempFileService.getTempFiles();
      const result2 = tempFileService.getTempFiles();

      expect(result1).toEqual([filePath]);
      expect(result2).toEqual([filePath]);
      expect(result1).not.toBe(result2); // Should be different array instances
    });
  });
});
