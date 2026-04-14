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

import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import product from '/@product.json' with { type: 'json' };

import type { Directories } from './directories.js';
import { LinuxXDGDirectories } from './directories-linux-xdg.js';

const originalProcessEnv = process.env;

beforeEach(() => {
  // Reset environment variables to clean state
  process.env = { ...originalProcessEnv };

  // Clear XDG environment variables for clean tests
  // biome-ignore lint/complexity/useLiteralKeys: XDG_CONFIG_HOME comes from an index signature
  delete process.env['XDG_CONFIG_HOME'];
  // biome-ignore lint/complexity/useLiteralKeys: XDG_DATA_HOME comes from an index signature
  delete process.env['XDG_DATA_HOME'];
  // biome-ignore lint/complexity/useLiteralKeys: FLATPAK_ID comes from an index signature
  delete process.env['FLATPAK_ID'];
});

afterEach(() => {
  process.env = originalProcessEnv;
  vi.restoreAllMocks();
});

describe('LinuxXDGDirectories', () => {
  let provider: Directories;

  describe('Default XDG Paths', () => {
    beforeEach(() => {
      provider = new LinuxXDGDirectories();
    });

    test('should use default XDG configuration directory', () => {
      const expectedConfigDir = path.resolve(os.homedir(), '.config', 'containers', 'podman-desktop');

      expect(provider.getConfigurationDirectory()).toBe(expectedConfigDir);
    });

    test('should use default XDG data directory', () => {
      const expectedDataDir = path.resolve(os.homedir(), '.local', 'share', 'containers', 'podman-desktop');

      expect(provider.getDataDirectory()).toBe(expectedDataDir);
    });

    test('should separate configuration and data directories', () => {
      const configDir = provider.getConfigurationDirectory();
      const dataDir = provider.getDataDirectory();

      // Key XDG principle: config ≠ data
      expect(configDir).not.toBe(dataDir);
      expect(configDir).toContain('.config');
      expect(dataDir).toContain(path.join('.local', 'share'));
    });

    test('should place all data-related directories under data directory', () => {
      const dataDir = provider.getDataDirectory();

      expect(provider.getPluginsDirectory()).toBe(path.resolve(dataDir, 'plugins'));
      expect(provider.getPluginsScanDirectory()).toBe(path.resolve(dataDir, 'plugins-scanning'));
      expect(provider.getExtensionsStorageDirectory()).toBe(path.resolve(dataDir, 'extensions-storage'));
      expect(provider.getContributionStorageDir()).toBe(path.resolve(dataDir, 'contributions'));
      expect(provider.getSafeStorageDirectory()).toBe(path.resolve(dataDir, 'safe-storage'));
    });
  });

  describe('Custom XDG Environment Variables', () => {
    test('should respect both custom XDG variables', () => {
      const customConfigHome = '/my/config';
      const customDataHome = '/my/data';

      // biome-ignore lint/complexity/useLiteralKeys: XDG_CONFIG_HOME comes from an index signature
      process.env['XDG_CONFIG_HOME'] = customConfigHome;
      // biome-ignore lint/complexity/useLiteralKeys: XDG_DATA_HOME comes from an index signature
      process.env['XDG_DATA_HOME'] = customDataHome;

      provider = new LinuxXDGDirectories();

      const configDir = provider.getConfigurationDirectory();
      const dataDir = provider.getDataDirectory();

      expect(configDir).toBe(path.resolve(customConfigHome, 'containers', 'podman-desktop'));
      expect(dataDir).toBe(path.resolve(customDataHome, 'containers', 'podman-desktop'));
    });

    test('should use custom paths for data subdirectories', () => {
      const customDataHome = '/totally/custom/data';
      // biome-ignore lint/complexity/useLiteralKeys: XDG_DATA_HOME comes from an index signature
      process.env['XDG_DATA_HOME'] = customDataHome;

      provider = new LinuxXDGDirectories();

      const expectedDataDir = path.resolve(customDataHome, 'containers', 'podman-desktop');

      expect(provider.getPluginsDirectory()).toBe(path.resolve(expectedDataDir, 'plugins'));
      expect(provider.getExtensionsStorageDirectory()).toBe(path.resolve(expectedDataDir, 'extensions-storage'));
    });
  });

  describe('getManagedDefaultsDirectory', () => {
    test('should return linux managed folder path when not running in Flatpak', () => {
      provider = new LinuxXDGDirectories();

      expect(provider.getManagedDefaultsDirectory()).toBe(product.paths.managed.linux);
    });

    test('should return flatpak managed folder path when running in Flatpak', () => {
      // biome-ignore lint/complexity/useLiteralKeys: FLATPAK_ID comes from an index signature
      process.env['FLATPAK_ID'] = 'io.podman_desktop.PodmanDesktop';

      provider = new LinuxXDGDirectories();

      expect(provider.getManagedDefaultsDirectory()).toBe(product.paths.managed.flatpak);
    });
  });
});
