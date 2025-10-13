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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { Directories } from './directories.js';
import { LegacyDirectories } from './directories-legacy.js';

const originalProcessEnv = process.env;

beforeEach(() => {
  // Reset environment variables to clean state
  process.env = { ...originalProcessEnv };

  // Mock file system
  vi.mock('node:fs');
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'mkdirSync').mockImplementation(() => '');
});

afterEach(() => {
  process.env = originalProcessEnv;
  vi.restoreAllMocks();
});

describe('LegacyDirectories', () => {
  let provider: Directories;

  describe('Default Directory Structure', () => {
    beforeEach(() => {
      provider = new LegacyDirectories();
    });

    test('should use default legacy base directory', () => {
      const expectedBaseDir = path.resolve(os.homedir(), '.local', 'share', 'containers', 'podman-desktop');
      expect(provider.getDataDirectory()).toBe(expectedBaseDir);
    });

    test('should place all directories under same base directory', () => {
      const baseDir = provider.getDataDirectory();
      const configDir = provider.getConfigurationDirectory();

      expect(configDir).toBe(path.resolve(baseDir, 'configuration'));

      expect(provider.getPluginsDirectory()).toBe(path.resolve(baseDir, 'plugins'));
      expect(provider.getPluginsScanDirectory()).toBe(path.resolve(baseDir, 'plugins-scanning'));
      expect(provider.getExtensionsStorageDirectory()).toBe(path.resolve(baseDir, 'extensions-storage'));
      expect(provider.getContributionStorageDir()).toBe(path.resolve(baseDir, 'contributions'));
      expect(provider.getSafeStorageDirectory()).toBe(path.resolve(baseDir, 'safe-storage'));
    });
  });

  describe('Custom Directory Override', () => {
    test('should respect PODMAN_DESKTOP_HOME_DIR environment variable', () => {
      const customPath = '/custom/podman/directory';
      // biome-ignore lint/complexity/useLiteralKeys: <PODMAN_DESKTOP_HOME_DIR comes from an index signature>
      process.env['PODMAN_DESKTOP_HOME_DIR'] = customPath;

      // Create new instance to pick up environment variable
      provider = new LegacyDirectories();

      expect(provider.getDataDirectory()).toBe(customPath);
      expect(provider.getConfigurationDirectory()).toBe(path.resolve(customPath, 'configuration'));
      expect(provider.getPluginsDirectory()).toBe(path.resolve(customPath, 'plugins'));
    });

    test('should override default path completely when custom env var is set', () => {
      const customPath = '/custom/env/path';
      // biome-ignore lint/complexity/useLiteralKeys: <PODMAN_DESKTOP_HOME_DIR comes from an index signature>
      process.env['PODMAN_DESKTOP_HOME_DIR'] = customPath;

      provider = new LegacyDirectories();

      const dataDir = provider.getDataDirectory();

      // Should NOT use default path
      expect(dataDir).not.toContain(os.homedir());
      expect(dataDir).not.toContain(path.join('.local', 'share'));

      // Should use custom path exactly
      expect(dataDir).toBe(customPath);
    });
  });

  describe('Directory Creation', () => {
    test('should create base directory when it does not exist', () => {
      const mkdirSpy = vi.spyOn(fs, 'mkdirSync');
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);

      provider = new LegacyDirectories();

      expect(mkdirSpy).toHaveBeenCalled();
    });
  });
});
