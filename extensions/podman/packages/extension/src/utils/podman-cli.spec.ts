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

import fs from 'node:fs';

import { type Configuration, configuration, env, process } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { findPodmanInstallations } from './podman-cli';

const config: Configuration = {
  get: vi.fn().mockReturnValue(undefined), // Default: no custom binary path
  has: vi.fn().mockReturnValue(false),
  update: vi.fn(),
};

// Mock fs module
vi.mock('node:fs', () => {
  return {
    default: {
      realpathSync: vi.fn(),
      statSync: vi.fn(),
    },
  };
});

describe('findPodmanInstallations', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(configuration.getConfiguration).mockReturnValue(config);
    vi.mocked(env).isWindows = false;
    vi.mocked(env).isMac = true;
    vi.mocked(env).isLinux = false;

    const fileMap: Record<string, { ino: number; isFile: boolean; targetLocation?: string }> = {
      '/hardlink/podman': { ino: 12345, isFile: true },
      '/opt/podman/bin/podman': { ino: 12345, isFile: true },
      '/usr/bin/podman-dir': { ino: 10000, isFile: false },
      '/inaccessible/path/podman': { ino: 10001, isFile: false },
      '/usr/local/bin/podman': { ino: 10002, isFile: true },
      '/opt/homebrew/bin/podman': { ino: 10003, isFile: true },
      '/symlink/podman': { ino: 10004, isFile: true, targetLocation: '/opt/podman/bin/podman' },
      '/usr/bin/podman': { ino: 10005, isFile: true },
      '/opt/local/bin/podman': { ino: 10006, isFile: true },
      '/homebrew/bin/podman': { ino: 10007, isFile: true },
      '/usr/podman/bin/podman': { ino: 10008, isFile: true },
    };

    vi.mocked(fs.realpathSync).mockImplementation(path => {
      const entry = fileMap[path as string];
      if (entry?.targetLocation) {
        return entry.targetLocation;
      }
      return path as string; // not a symlink, return as-is
    });

    vi.mocked(fs.statSync).mockImplementation(path => {
      const entry = fileMap[path as string];
      return {
        ino: entry.ino,
        isFile: () => entry.isFile,
      } as unknown as fs.Stats;
    });
  });

  describe('Windows platform', () => {
    beforeEach(() => {
      vi.mocked(env).isWindows = true;
      vi.mocked(env).isMac = false;
      vi.mocked(env).isLinux = false;

      // Reset fs mocks to defaults for Windows tests
      vi.mocked(fs.statSync).mockReturnValue({
        isFile: vi.fn().mockReturnValue(true),
        isSymbolicLink: vi.fn().mockReturnValue(false),
        // Cast through 'unknown' because fs.Stats has many properties we don't need to mock
        // We only mock the methods actually used in the implementation (isFile, isSymbolicLink)
      } as unknown as fs.Stats);
    });

    test('should return empty array when where command fails', async () => {
      vi.mocked(process.exec).mockRejectedValue(new Error('Command failed'));

      const result = await findPodmanInstallations();

      expect(result).toEqual([]);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });

    test('should return single installation when only one found', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: 'C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe',
        stderr: '',
        command: 'where podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe']);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });

    test('should return multiple installations when multiple found', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe
C:\\tools\\podman\\podman.exe`,
        stderr: '',
        command: 'where podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe', 'C:\\tools\\podman\\podman.exe']);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });

    test('should handle empty stdout', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: '',
        stderr: '',
        command: 'where podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual([]);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });

    test('should remove duplicates', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe
C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe
C:\\tools\\podman\\podman.exe`,
        stderr: '',
        command: 'where podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe', 'C:\\tools\\podman\\podman.exe']);
    });
  });

  describe('Linux/macOS platform', () => {
    test('should return empty array when which command fails', async () => {
      vi.mocked(process.exec).mockRejectedValue(new Error('Command failed'));

      const result = await findPodmanInstallations();

      expect(result).toEqual([]);
      expect(process.exec).toHaveBeenCalledWith('which', ['-a', 'podman']);
    });

    test('should return single installation path', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: '/usr/local/bin/podman',
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman']);
      expect(process.exec).toHaveBeenCalledWith('which', ['-a', 'podman']);
    });

    test('should return multiple extracted paths', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/local/bin/podman
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
      expect(process.exec).toHaveBeenCalledWith('which', ['-a', 'podman']);
    });

    test('should handle empty stdout', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: '',
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual([]);
      expect(process.exec).toHaveBeenCalledWith('which', ['-a', 'podman']);
    });

    test('should remove duplicates from mixed output', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/local/bin/podman
/usr/local/bin/podman
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
    });

    test('should filter out symbolic links that have equivalent in PATH', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/opt/podman/bin/podman
/symlink/podman
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/opt/podman/bin/podman', '/opt/homebrew/bin/podman']);
    });

    test('should not filter out symbolic links that do not have equivalent in PATH', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `
/symlink/podman
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/symlink/podman', '/opt/homebrew/bin/podman']);
    });

    test('should filter out hard links that have equivalent in PATH', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `
/opt/podman/bin/podman
/hardlink/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/opt/podman/bin/podman']);
    });

    test('should not filter out hard links that do not have equivalent in PATH', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `
/usr/podman/bin/podman
/homebrew/bin/podman
/hardlink/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/podman/bin/podman', '/homebrew/bin/podman', '/hardlink/podman']);
    });

    test('should filter out non-files (directories)', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/local/bin/podman
/usr/bin/podman-dir
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
      expect(fs.statSync).toHaveBeenCalledWith('/usr/local/bin/podman');
      expect(fs.statSync).toHaveBeenCalledWith('/usr/bin/podman-dir');
      expect(fs.statSync).toHaveBeenCalledWith('/opt/homebrew/bin/podman');
    });

    test('should filter out paths when statSync throws an error', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/local/bin/podman
/inaccessible/path/podman
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
    });
  });
});
