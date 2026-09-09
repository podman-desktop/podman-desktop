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

import { randomBytes } from 'node:crypto';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as zlib from 'node:zlib';

import { afterEach, beforeEach, expect, test } from 'vitest';

import { decompressZstd } from './zstd.js';

let tmpDir: string;
let compressedFile: string;
let destinationFile: string;

beforeEach(async () => {
  tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'zstd-test-'));
  compressedFile = path.join(tmpDir, 'layer.zst');
  destinationFile = path.join(tmpDir, 'layer.tar');
});

afterEach(async () => {
  await fs.promises.rm(tmpDir, { recursive: true, force: true });
});

test('decompress a zstd file spanning multiple read chunks', async () => {
  // random data does not compress, so the compressed file is bigger than a single read chunk (64KiB)
  const source = randomBytes(256 * 1024);
  await fs.promises.writeFile(compressedFile, zlib.zstdCompressSync(source));

  await decompressZstd(compressedFile, destinationFile);

  const decompressed = await fs.promises.readFile(destinationFile);
  expect(decompressed.equals(source)).toBeTruthy();
});

test('reject a decompression bomb', async () => {
  // a few MB of zeros compress to a few hundred bytes: way above the allowed ratio
  await fs.promises.writeFile(compressedFile, zlib.zstdCompressSync(Buffer.alloc(5 * 1024 * 1024)));

  await expect(decompressZstd(compressedFile, destinationFile)).rejects.toThrow('possible decompression bomb');
});

test('reject invalid zstd content', async () => {
  await fs.promises.writeFile(compressedFile, 'not a zstd file');

  await expect(decompressZstd(compressedFile, destinationFile)).rejects.toThrow();
});
