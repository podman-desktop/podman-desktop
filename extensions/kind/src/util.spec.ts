/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { getTempDir } from './util';

vi.mock(import('node:fs'));

describe('getTempDir', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv };
    delete process.env['FLATPAK_ID'];
    delete process.env['XDG_CACHE_HOME'];
    vi.mocked(fs.promises.mkdir).mockResolvedValue(undefined);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('returns os.tmpdir() when not running in Flatpak', async () => {
    const result = await getTempDir();
    expect(result).toBe(os.tmpdir());
    expect(fs.promises.mkdir).not.toHaveBeenCalled();
  });

  test('returns XDG_CACHE_HOME/kind-tmp when running in Flatpak with XDG_CACHE_HOME set', async () => {
    process.env['FLATPAK_ID'] = 'io.podman_desktop.PodmanDesktop';
    process.env['XDG_CACHE_HOME'] = '/custom/cache';

    const result = await getTempDir();
    const expected = join('/custom/cache', 'kind-tmp');
    expect(result).toBe(expected);
    expect(fs.promises.mkdir).toHaveBeenCalledWith(expected, { recursive: true });
  });

  test('falls back to ~/.cache/kind-tmp when running in Flatpak without XDG_CACHE_HOME', async () => {
    process.env['FLATPAK_ID'] = 'io.podman_desktop.PodmanDesktop';

    const result = await getTempDir();
    const expected = join(os.homedir(), '.cache', 'kind-tmp');
    expect(result).toBe(expected);
    expect(fs.promises.mkdir).toHaveBeenCalledWith(expected, { recursive: true });
  });
});
