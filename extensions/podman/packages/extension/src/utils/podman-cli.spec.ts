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

import { type Configuration, env, process } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isMultiplePodmanInstalled } from './podman-cli';

const config: Configuration = {
  get: vi.fn().mockReturnValue(undefined), // Default: no custom binary path
  has: vi.fn().mockReturnValue(false),
  update: vi.fn(),
};

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
      isWindows: false, // Default to Linux/macOS
    },
  };
});

describe('isMultiplePodmanInstalled', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset to Linux/macOS by default
    vi.mocked(env).isWindows = false;
  });

  describe('Custom binary path', () => {
    test('should return false when custom binary path is set', async () => {
      // Setup custom binary path
      vi.mocked(config.get).mockReturnValue('/custom/path/to/podman');

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(false);
      expect(vi.mocked(process.exec)).not.toHaveBeenCalled();
    });
  });

  describe('Windows platform', () => {
    beforeEach(() => {
      vi.mocked(env).isWindows = true;
    });

    test('should return false when where command fails', async () => {
      vi.mocked(process.exec).mockRejectedValue(new Error('Command failed'));

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(false);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });

    test('should return false when only one installation found', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: 'C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe',
        stderr: '',
        command: 'where podman',
      });

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(false);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });

    test('should return true when multiple installations found', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `C:\\Program Files\\RedHat\\Podman\\bin\\podman.exe
C:\\tools\\podman\\podman.exe`,
        stderr: '',
        command: 'where podman',
      });

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(true);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });

    test('should handle empty stdout', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: '',
        stderr: '',
        command: 'where podman',
      });

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(false);
      expect(process.exec).toHaveBeenCalledWith('where', ['podman']);
    });
  });

  describe('Linux/macOS platform', () => {
    test('should return false when type command fails', async () => {
      vi.mocked(process.exec).mockRejectedValue(new Error('Command failed'));

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(false);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should return false when only one installation found', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: 'podman is /usr/local/bin/podman',
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(false);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should return true when multiple installations found', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `podman is /usr/local/bin/podman
podman is /opt/homebrew/bin/podman`,
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(true);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should handle empty stdout', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: '',
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(false);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should handle mixed format output and extract paths correctly', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `podman is /usr/local/bin/podman
podman is /opt/homebrew/bin/podman
podman is /usr/bin/podman`,
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await isMultiplePodmanInstalled();

      expect(result).toBe(true);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });
  });
});
