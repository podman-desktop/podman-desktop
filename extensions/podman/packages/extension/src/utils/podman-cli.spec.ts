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

import { findPodmanInstallations } from './podman-cli';

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
  });

  describe('Windows platform', () => {
    beforeEach(() => {
      vi.mocked(env).isWindows = true;
      vi.mocked(env).isMac = false;
      vi.mocked(env).isLinux = false;
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
    test('should return empty array when type command fails', async () => {
      vi.mocked(process.exec).mockRejectedValue(new Error('Command failed'));

      const result = await findPodmanInstallations();

      expect(result).toEqual([]);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should extract paths from "podman is" format', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: 'podman is /usr/local/bin/podman',
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman']);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should return multiple extracted paths', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `podman is /usr/local/bin/podman
podman is /opt/homebrew/bin/podman`,
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should handle empty stdout', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: '',
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual([]);
      expect(process.exec).toHaveBeenCalledWith('sh', ['-c', 'type -a podman']);
    });

    test('should extract paths using generic parsing (last part)', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `podman is /usr/bin/podman
podman is /opt/podman/bin /podman
podman is /usr/local/bin/podman`,
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/bin/podman', '/opt/podman/bin /podman', '/usr/local/bin/podman']);
    });

    test('should remove duplicates from mixed output', async () => {
      vi.mocked(process.exec).mockResolvedValue({
        stdout: `podman is /usr/local/bin/podman
podman is /usr/local/bin/podman
podman is /opt/homebrew/bin/podman`,
        stderr: '',
        command: 'sh -c type -a podman',
      });

      const result = await findPodmanInstallations();

      expect(result).toEqual(['/usr/local/bin/podman', '/opt/homebrew/bin/podman']);
    });
  });
});
