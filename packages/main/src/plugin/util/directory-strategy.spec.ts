/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import * as util from '/@/util.js';

import { shouldUseXDGDirectories } from './directory-strategy.js';

const originalProcessEnv = process.env;

beforeEach(() => {
  // Reset environment variables to clean state
  process.env = { ...originalProcessEnv };

  // Mock file system
  vi.mock('node:fs');
  vi.spyOn(fs, 'existsSync').mockReturnValue(false);
});

afterEach(() => {
  process.env = originalProcessEnv;
  vi.restoreAllMocks();
});

describe('shouldUseXDGDirectories', () => {
  describe('Linux platform', () => {
    beforeEach(() => {
      vi.spyOn(util, 'isLinux').mockReturnValue(true);
    });

    test('should return true when no legacy config exists and no custom env var is set', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(shouldUseXDGDirectories()).toBe(true);
    });

    test('should return false when PODMAN_DESKTOP_HOME_DIR is set', () => {
      // biome-ignore lint/complexity/useLiteralKeys: <PODMAN_DESKTOP_HOME_DIR comes from an index signature>
      process.env['PODMAN_DESKTOP_HOME_DIR'] = '/custom/path';

      expect(shouldUseXDGDirectories()).toBe(false);
    });

    test('should return false when existing configuration is detected', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      expect(shouldUseXDGDirectories()).toBe(false);
    });
  });

  describe('Non-Linux platforms', () => {
    test('should always return false', () => {
      vi.spyOn(util, 'isLinux').mockReturnValue(false);
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);

      expect(shouldUseXDGDirectories()).toBe(false);
    });
  });
});
