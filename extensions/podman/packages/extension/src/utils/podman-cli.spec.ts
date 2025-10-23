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

import { type Configuration, env, process } from '@podman-desktop/api';
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
      lstatSync: vi.fn(),
    },
  };
});

// Mock external dependencies
vi.mock('@podman-desktop/api', () => {
  return {
    configuration: {
      getConfiguration: (): Configuration => config,
    },
    process: {
      exec: vi.fn(),
    },
    env: {
      isWindows: false,
      isMac: true,
      isLinux: false,
    },
  };
});

describe('findPodmanInstallations', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(env).isWindows = false;
    vi.mocked(env).isMac = true;
    vi.mocked(env).isLinux = false;

    // Setup default fs mocks
    vi.mocked(fs.lstatSync).mockReturnValue({
      isFile: vi.fn().mockReturnValue(true),
      isSymbolicLink: vi.fn().mockReturnValue(false),
      // Cast through 'unknown' because fs.Stats has many properties we don't need to mock
      // We only mock the methods actually used in the implementation (isFile, isSymbolicLink)
    } as unknown as fs.Stats);
  });

  describe('Windows platform', () => {
    beforeEach(() => {
      vi.mocked(env).isWindows = true;
      vi.mocked(env).isMac = false;
      vi.mocked(env).isLinux = false;

      // Reset fs mocks to defaults for Windows tests
      vi.mocked(fs.lstatSync).mockReturnValue({
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

    test('should extract paths using generic parsing (last part)', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/bin/podman
/opt/podman/bin /podman
/usr/local/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/bin/podman', '/opt/podman/bin /podman', '/usr/local/bin/podman']);
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

    test('should filter out symbolic links', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/local/bin/podman
/usr/bin/podman-symlink
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      // Mock lstatSync to return different results for different paths
      vi.mocked(fs.lstatSync).mockImplementation(path => {
        const mockStats = {
          isFile: vi.fn().mockReturnValue(true),
          isSymbolicLink: vi.fn(),
        };

        // Simulate that the symlink path returns true for isSymbolicLink
        if (String(path) === '/usr/bin/podman-symlink') {
          mockStats.isSymbolicLink.mockReturnValue(true);
        } else {
          mockStats.isSymbolicLink.mockReturnValue(false);
        }

        // Cast through 'unknown' to satisfy TypeScript - fs.Stats has 20+ properties
        // but we only need to mock isFile() and isSymbolicLink() methods for this test
        return mockStats as unknown as fs.Stats;
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
      expect(fs.lstatSync).toHaveBeenCalledWith('/usr/local/bin/podman');
      expect(fs.lstatSync).toHaveBeenCalledWith('/usr/bin/podman-symlink');
      expect(fs.lstatSync).toHaveBeenCalledWith('/opt/homebrew/bin/podman');
    });

    test('should filter out non-files (directories)', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/local/bin/podman
/usr/bin/podman-dir
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      // Mock lstatSync to return different results for different paths
      vi.mocked(fs.lstatSync).mockImplementation(path => {
        const mockStats = {
          isFile: vi.fn(),
          isSymbolicLink: vi.fn().mockReturnValue(false),
        };

        // Simulate that the directory returns false for isFile
        if (String(path) === '/usr/bin/podman-dir') {
          mockStats.isFile.mockReturnValue(false);
        } else {
          mockStats.isFile.mockReturnValue(true);
        }

        // Cast through 'unknown' to satisfy TypeScript - fs.Stats has 20+ properties
        // but we only need to mock isFile() and isSymbolicLink() methods for this test
        return mockStats as unknown as fs.Stats;
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
      expect(fs.lstatSync).toHaveBeenCalledWith('/usr/local/bin/podman');
      expect(fs.lstatSync).toHaveBeenCalledWith('/usr/bin/podman-dir');
      expect(fs.lstatSync).toHaveBeenCalledWith('/opt/homebrew/bin/podman');
    });

    test('should filter out paths when lstatSync throws an error', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `/usr/local/bin/podman
/inaccessible/path/podman
/opt/homebrew/bin/podman`,
        stderr: '',
        command: 'which -a podman',
      });

      // Mock lstatSync to throw an error for the inaccessible path
      vi.mocked(fs.lstatSync).mockImplementation(path => {
        if (String(path) === '/inaccessible/path/podman') {
          throw new Error('Permission denied');
        }

        return {
          isFile: vi.fn().mockReturnValue(true),
          isSymbolicLink: vi.fn().mockReturnValue(false),
        } as unknown as fs.Stats;
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
      expect(fs.lstatSync).toHaveBeenCalledWith('/usr/local/bin/podman');
      expect(fs.lstatSync).toHaveBeenCalledWith('/inaccessible/path/podman');
      expect(fs.lstatSync).toHaveBeenCalledWith('/opt/homebrew/bin/podman');
    });
  });
});
