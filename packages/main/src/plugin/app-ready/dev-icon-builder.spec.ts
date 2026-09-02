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
import type { NativeImage } from 'electron';
import { nativeImage } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { buildDevIcon } from './dev-icon-builder.js';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('buildDevIcon', () => {
  test('should return base image unchanged when dimensions are zero', () => {
    const base = {
      getSize: vi.fn().mockReturnValue({ width: 0, height: 0 }),
    } as unknown as NativeImage;

    const result = buildDevIcon(base, 'main', 'abcd1234');

    expect(result).toBe(base);
    expect(nativeImage.createFromBitmap).not.toHaveBeenCalled();
  });

  test('should stamp banner onto a valid image', () => {
    const width = 128;
    const height = 128;
    const bitmap = Buffer.alloc(width * height * 4, 0);
    // Give some pixels non-zero alpha so they survive the mask
    for (let i = 3; i < bitmap.length; i += 4) {
      bitmap[i] = 255;
    }
    const stampedImage = { mock: 'stamped' };

    const base = {
      getSize: vi.fn().mockReturnValue({ width, height }),
      toBitmap: vi.fn().mockReturnValue(bitmap),
    } as unknown as NativeImage;

    vi.mocked(nativeImage.createFromBitmap).mockReturnValue(stampedImage as unknown as NativeImage);

    const result = buildDevIcon(base, 'my-branch', 'abcd1234');

    expect(nativeImage.createFromBitmap).toHaveBeenCalledWith(expect.any(Buffer), { width, height });
    expect(result).toBe(stampedImage);
  });

  test('should produce different banner colors for different hashes', () => {
    const width = 128;
    const height = 128;
    const bitmap = Buffer.alloc(width * height * 4, 0);
    for (let i = 3; i < bitmap.length; i += 4) {
      bitmap[i] = 255;
    }

    const base = {
      getSize: vi.fn().mockReturnValue({ width, height }),
      toBitmap: vi.fn().mockReturnValue(bitmap),
    } as unknown as NativeImage;

    vi.mocked(nativeImage.createFromBitmap).mockReturnValue({} as NativeImage);

    buildDevIcon(base, 'DEV', '00001234');
    const call1Bitmap = vi.mocked(nativeImage.createFromBitmap).mock.calls[0]![0] as Buffer;

    vi.mocked(nativeImage.createFromBitmap).mockClear();
    buildDevIcon(base, 'DEV', 'ffff1234');
    const call2Bitmap = vi.mocked(nativeImage.createFromBitmap).mock.calls[0]![0] as Buffer;

    // Banner starts at y = floor(128 * 0.65) = 83, first banner pixel at offset (83*128+0)*4
    const bannerOffset = 83 * 128 * 4;
    const color1 = [call1Bitmap[bannerOffset], call1Bitmap[bannerOffset + 1], call1Bitmap[bannerOffset + 2]];
    const color2 = [call2Bitmap[bannerOffset], call2Bitmap[bannerOffset + 1], call2Bitmap[bannerOffset + 2]];

    expect(color1).not.toEqual(color2);
  });

  test('should mask banner to original alpha (transparent areas stay transparent)', () => {
    const width = 128;
    const height = 128;
    const bitmap = Buffer.alloc(width * height * 4, 0);

    const base = {
      getSize: vi.fn().mockReturnValue({ width, height }),
      toBitmap: vi.fn().mockReturnValue(bitmap),
    } as unknown as NativeImage;

    vi.mocked(nativeImage.createFromBitmap).mockReturnValue({} as NativeImage);

    buildDevIcon(base, 'DEV', 'abcd1234');

    const resultBitmap = vi.mocked(nativeImage.createFromBitmap).mock.calls[0]![0] as Buffer;
    for (let i = 3; i < resultBitmap.length; i += 4) {
      expect(resultBitmap[i]).toBe(0);
    }
  });

  test('should preserve partial alpha on anti-aliased edges', () => {
    const width = 128;
    const height = 128;
    const bitmap = Buffer.alloc(width * height * 4, 0);
    // Set a pixel in the banner zone to partial alpha (anti-aliased edge)
    const bannerY = Math.floor(height * 0.65);
    const partialAlpha = 100;
    const off = (bannerY * width + 10) * 4;
    bitmap[off + 3] = partialAlpha;

    const base = {
      getSize: vi.fn().mockReturnValue({ width, height }),
      toBitmap: vi.fn().mockReturnValue(bitmap),
    } as unknown as NativeImage;

    vi.mocked(nativeImage.createFromBitmap).mockReturnValue({} as NativeImage);

    buildDevIcon(base, 'DEV', 'abcd1234');

    const resultBitmap = vi.mocked(nativeImage.createFromBitmap).mock.calls[0]![0] as Buffer;
    // Banner would set alpha to 230, but partial source alpha (100) should win via Math.min
    expect(resultBitmap[off + 3]).toBe(partialAlpha);
  });
});
