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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { isLinux } from '/@/util.js';

import { DirectoryStrategy } from './directory-strategy.js';

// Mock the external modules
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

vi.mock('/@/util.js', () => ({
  isLinux: vi.fn(),
}));

const originalProcessEnv = process.env;

let strategy: DirectoryStrategy;

beforeEach(() => {
  // Reset environment variables
  process.env = { ...originalProcessEnv };

  strategy = new DirectoryStrategy();
});

afterEach(() => {
  process.env = originalProcessEnv;
  vi.restoreAllMocks();
});

describe('shouldUseXDGDirectories', () => {
  describe('Linux platform', () => {
    test('should return true when no legacy config exists and no custom env var is set', async () => {
      vi.mocked(isLinux).mockReturnValue(true);

      expect(strategy.shouldUseXDGDirectories()).toBe(true);
    });

    test('should return false when PODMAN_DESKTOP_HOME_DIR is set', async () => {
      vi.mocked(isLinux).mockReturnValue(true);

      const existSyncSpy = vi.mocked(existsSync);
      existSyncSpy.mockImplementation(() => false);

      // biome-ignore lint/complexity/useLiteralKeys: <PODMAN_DESKTOP_HOME_DIR comes from an index signature>
      process.env['PODMAN_DESKTOP_HOME_DIR'] = '/custom/path';

      expect(strategy.shouldUseXDGDirectories()).toBe(false);
    });

    test('should return false when existing configuration is detected', async () => {
      vi.mocked(isLinux).mockReturnValue(true);

      const existSyncSpy = vi.mocked(existsSync);
      existSyncSpy.mockImplementation(() => true);

      expect(strategy.shouldUseXDGDirectories()).toBe(false);
    });
  });

  describe('Non-Linux platforms', () => {
    test('should always return false', async () => {
      vi.mocked(isLinux).mockReturnValue(false);

      expect(strategy.shouldUseXDGDirectories()).toBe(false);
    });
  });
});
