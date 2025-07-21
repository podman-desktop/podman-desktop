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

import { existsSync } from 'node:fs';

import { type Configuration, process } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { PODMAN_INSTALLATION_PATHS } from '../constants';
import { isMultiplePodmanInstalledinMacos } from './podman-cli';

const config: Configuration = {
  get: vi.fn().mockReturnValue(undefined), // Default: no custom binary path
  has: vi.fn().mockReturnValue(false),
  update: vi.fn(),
};

// Mock external dependencies
vi.mock('node:fs');
vi.mock('@podman-desktop/api', () => {
  return {
    configuration: {
      getConfiguration: (): Configuration => config,
    },
    process: {
      exec: vi.fn(),
    },
  };
});

describe('isMultiplePodmanInstalledinMacos', () => {
  const mockExistsSync = vi.mocked(existsSync);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should return false when custom binary path is set', async () => {
    // Setup custom binary path
    vi.mocked(config.get).mockReturnValue('/custom/path/to/podman');

    const result = await isMultiplePodmanInstalledinMacos();

    expect(result).toBe(false);
    expect(vi.mocked(process.exec)).not.toHaveBeenCalled();
    expect(mockExistsSync).not.toHaveBeenCalled();
  });

  test('should return false when podman is not installed via Homebrew', async () => {
    vi.mocked(process.exec).mockRejectedValue(new Error('Command failed'));

    const result = await isMultiplePodmanInstalledinMacos();

    expect(result).toBe(false);
    expect(process.exec).toHaveBeenCalledWith('brew', ['list', '--verbose', 'podman'], {
      env: { HOMEBREW_NO_AUTO_UPDATE: '1', HOMEBREW_NO_ANALYTICS: '1' },
    });
    expect(mockExistsSync).not.toHaveBeenCalled();
  });

  test('should return false when podman is installed via Homebrew but no other installations exist', async () => {
    vi.mocked(process.exec).mockResolvedValue({
      stdout: 'podman info',
      stderr: '',
      command: 'brew list --verbose podman',
    });
    mockExistsSync.mockReturnValue(false);

    const result = await isMultiplePodmanInstalledinMacos();

    expect(result).toBe(false);
    expect(process.exec).toHaveBeenCalledWith('brew', ['list', '--verbose', 'podman'], {
      env: { HOMEBREW_NO_AUTO_UPDATE: '1', HOMEBREW_NO_ANALYTICS: '1' },
    });
    expect(mockExistsSync).toHaveBeenCalledWith(PODMAN_INSTALLATION_PATHS[0]);
    expect(mockExistsSync).toHaveBeenCalledWith(PODMAN_INSTALLATION_PATHS[1]);
  });

  test('should return true when podman is installed via Homebrew and at least one other installation exists', async () => {
    vi.mocked(process.exec).mockResolvedValue({
      stdout: 'podman info',
      stderr: '',
      command: 'brew list --verbose podman',
    });
    mockExistsSync.mockImplementation(path => {
      return path.toString() === PODMAN_INSTALLATION_PATHS[0];
    });

    const result = await isMultiplePodmanInstalledinMacos();

    expect(result).toBe(true);
    expect(process.exec).toHaveBeenCalledWith('brew', ['list', '--verbose', 'podman'], {
      env: { HOMEBREW_NO_AUTO_UPDATE: '1', HOMEBREW_NO_ANALYTICS: '1' },
    });
    expect(mockExistsSync).toHaveBeenCalledWith(PODMAN_INSTALLATION_PATHS[0]);
  });
});
