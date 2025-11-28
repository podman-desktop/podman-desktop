/*********************************************************************
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
 ********************************************************************/

import { existsSync } from 'node:fs';
import { mkdir, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ImageRegistry } from '/@/plugin/image-registry.js';

import product from '../../../product.json' with { type: 'json' };
import type { RemoteExtension } from './download-remote-extensions.js';
import { downloadExtension, main } from './download-remote-extensions.js';

vi.mock(import('node:fs/promises'));
vi.mock(import('node:fs'));
vi.mock(import('node:os'));
vi.mock(import('/@/plugin/image-registry.js'));
vi.mock(import('../../../product.json'));

const TMP_DIR = 'tmp-dir';
const ABS_DEST_DIR = '/dest-dir';
const REMOTE_INFO_MOCK: RemoteExtension = {
  name: 'dummy-extension',
  oci: 'localhost/dummy-extension:latest',
};

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(tmpdir).mockReturnValue(TMP_DIR);
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(product).remoteExtensions = [];
});

describe('downloadExtension', () => {
  test('should call ImageRegistry#downloadAndExtractImage with appropriate argument', async () => {
    await downloadExtension(ABS_DEST_DIR, REMOTE_INFO_MOCK);

    expect(ImageRegistry.prototype.downloadAndExtractImage).toHaveBeenCalledExactlyOnceWith(
      REMOTE_INFO_MOCK.oci,
      expect.stringContaining(TMP_DIR),
      expect.any(Function),
    );
  });

  test('should rename tmp directory to destination', async () => {
    await downloadExtension(ABS_DEST_DIR, REMOTE_INFO_MOCK);

    expect(rename).toHaveBeenCalledExactlyOnceWith(
      join(TMP_DIR, REMOTE_INFO_MOCK.name, 'extension'),
      join(ABS_DEST_DIR, REMOTE_INFO_MOCK.name),
    );
  });

  test('should mkdir the destination directory', async () => {
    await downloadExtension(ABS_DEST_DIR, REMOTE_INFO_MOCK);

    expect(mkdir).toHaveBeenCalledExactlyOnceWith(ABS_DEST_DIR, {
      recursive: true,
    });
  });
});

describe('main', () => {
  test('missing --output should throw an error', async () => {
    await expect(async () => {
      await main([]);
    }).rejects.toThrowError('missing output argument');
  });

  test('non absolute --output should throw an error', async () => {
    await expect(async () => {
      await main(['--output', './foo']);
    }).rejects.toThrowError('the output should be an absolute directory');
  });

  test('empty remoteExtensions in product.json should not call any ImageRegistry#downloadAndExtractImage', async () => {
    expect(ImageRegistry.prototype.downloadAndExtractImage).not.toHaveBeenCalled();

    await main(['--output', ABS_DEST_DIR]);

    expect(ImageRegistry.prototype.downloadAndExtractImage).not.toHaveBeenCalled();
  });

  test('--output argument should be used as destination', async () => {
    vi.mocked(product).remoteExtensions = [REMOTE_INFO_MOCK];

    await main(['--output', ABS_DEST_DIR]);

    expect(rename).toHaveBeenCalledExactlyOnceWith(
      join(TMP_DIR, REMOTE_INFO_MOCK.name, 'extension'),
      join(ABS_DEST_DIR, REMOTE_INFO_MOCK.name),
    );
  });
});
