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

import { stampTrayDevBadge } from './tray-dev-badge.js';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('stampTrayDevBadge', () => {
  test('should return base image unchanged when dimensions are zero', () => {
    const base = {
      getSize: vi.fn().mockReturnValue({ width: 0, height: 0 }),
    } as unknown as NativeImage;

    const result = stampTrayDevBadge(base);

    expect(result).toBe(base);
    expect(nativeImage.createFromBitmap).not.toHaveBeenCalled();
  });

  test('should stamp badge pixels onto a valid image', () => {
    const width = 16;
    const height = 16;
    const bitmap = Buffer.alloc(width * height * 4, 0);
    const stampedImage = { mock: 'stamped' };

    const base = {
      getSize: vi.fn().mockReturnValue({ width, height }),
      toBitmap: vi.fn().mockReturnValue(bitmap),
    } as unknown as NativeImage;

    vi.mocked(nativeImage.createFromBitmap).mockReturnValue(stampedImage as unknown as NativeImage);

    const result = stampTrayDevBadge(base);

    expect(base.toBitmap).toHaveBeenCalledWith({ scaleFactor: 1 });
    expect(nativeImage.createFromBitmap).toHaveBeenCalledWith(expect.any(Buffer), { width, height });
    expect(result).toBe(stampedImage);
  });

  test('should scale badge pixels for retina (scaleFactor 2)', () => {
    const width = 16;
    const height = 16;
    const scaledWidth = width * 2;
    const scaledHeight = height * 2;
    const bitmap = Buffer.alloc(scaledWidth * scaledHeight * 4, 0);
    const stampedImage = { mock: 'retina-stamped' };

    const base = {
      getSize: vi.fn().mockReturnValue({ width, height }),
      toBitmap: vi.fn().mockReturnValue(bitmap),
    } as unknown as NativeImage;

    vi.mocked(nativeImage.createFromBitmap).mockReturnValue(stampedImage as unknown as NativeImage);

    const result = stampTrayDevBadge(base, 2);

    expect(base.toBitmap).toHaveBeenCalledWith({ scaleFactor: 2 });
    expect(nativeImage.createFromBitmap).toHaveBeenCalledWith(expect.any(Buffer), {
      width: scaledWidth,
      height: scaledHeight,
    });
    expect(result).toBe(stampedImage);
  });
});
