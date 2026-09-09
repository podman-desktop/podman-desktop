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

import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import * as fzstd from 'fzstd';

// maximum allowed decompressed/compressed size ratio (same default as the tar library for gzip)
export const MAX_DECOMPRESSION_RATIO = 1000;

/**
 * Decompress a zstd file using streams to avoid loading the whole content in memory.
 * Rejects if the decompressed size grows beyond MAX_DECOMPRESSION_RATIO times the compressed size (decompression bomb).
 */
export async function decompressZstd(compressedFile: string, destinationFile: string): Promise<void> {
  const { size: compressedSize } = await stat(compressedFile);
  let decompressedSize = 0;

  const decompressor = new fzstd.Decompress();
  // fzstd calls ondata synchronously from push(), so errors thrown by ondata surface here
  const transform = new Transform({
    transform(chunk: Buffer, _encoding, callback): void {
      try {
        decompressor.push(chunk);
        callback();
      } catch (error: unknown) {
        callback(error instanceof Error ? error : new Error(String(error)));
      }
    },
    flush(callback): void {
      try {
        decompressor.push(new Uint8Array(0), true);
        callback();
      } catch (error: unknown) {
        callback(error instanceof Error ? error : new Error(String(error)));
      }
    },
  });
  decompressor.ondata = (data: Uint8Array): void => {
    decompressedSize += data.length;
    if (decompressedSize > compressedSize * MAX_DECOMPRESSION_RATIO) {
      throw new Error(
        `Decompression ratio of ${compressedFile} exceeds the limit of ${MAX_DECOMPRESSION_RATIO}: possible decompression bomb`,
      );
    }
    transform.push(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
  };

  await pipeline(createReadStream(compressedFile), transform, createWriteStream(destinationFile));
}
