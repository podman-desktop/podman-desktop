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
 *
 * Adapted from Orca — Copyright (c) 2026 Lovecast Inc. — MIT License
 * https://github.com/stablyai/orca/blob/c436df05514f2236de3580c58058655a2ecf7b64/src/main/tray/tray-dev-badge.ts
 ***********************************************************************/

import { type NativeImage, nativeImage } from 'electron';

// 5px-tall pixel-caps "DEV" — smallest text legible in the macOS menu bar.
const DEV_BADGE_ROWS = ['##..###.#.#', '#.#.#...#.#', '#.#.##..#.#', '#.#.#...#.#', '##..###..#.'];
const BADGE_OFFSET_X = 3;
const BADGE_OFFSET_Y = 10;
const BADGE_CLEAR_MARGIN = 1;

/**
 * Returns a copy of a menu-bar template image with a "DEV" pixel-text badge
 * stamped at the bottom center. Badge pixels are template-black (#000 + alpha)
 * so macOS tints them together with the glyph.
 */
export function stampTrayDevBadge(base: NativeImage, scaleFactor = 1): NativeImage {
  const { width, height } = base.getSize();
  if (width <= 0 || height <= 0) {
    return base;
  }

  const bitmap = Buffer.from(base.toBitmap({ scaleFactor }));
  const pixelWidth = width * scaleFactor;
  const pixelHeight = height * scaleFactor;

  const clearLeft = (BADGE_OFFSET_X - BADGE_CLEAR_MARGIN) * scaleFactor;
  const clearTop = (BADGE_OFFSET_Y - BADGE_CLEAR_MARGIN) * scaleFactor;
  const clearRight = (BADGE_OFFSET_X + DEV_BADGE_ROWS[0]!.length + BADGE_CLEAR_MARGIN) * scaleFactor;
  const clearBottom = (BADGE_OFFSET_Y + DEV_BADGE_ROWS.length + BADGE_CLEAR_MARGIN) * scaleFactor;
  for (let y = Math.max(0, clearTop); y < Math.min(pixelHeight, clearBottom); y++) {
    for (let x = Math.max(0, clearLeft); x < Math.min(pixelWidth, clearRight); x++) {
      bitmap.fill(0x00, (y * pixelWidth + x) * 4, (y * pixelWidth + x) * 4 + 4);
    }
  }

  for (let row = 0; row < DEV_BADGE_ROWS.length; row++) {
    const pattern = DEV_BADGE_ROWS[row]!;
    for (let col = 0; col < pattern.length; col++) {
      if (pattern[col] !== '#') {
        continue;
      }
      for (let dy = 0; dy < scaleFactor; dy++) {
        for (let dx = 0; dx < scaleFactor; dx++) {
          const x = (BADGE_OFFSET_X + col) * scaleFactor + dx;
          const y = (BADGE_OFFSET_Y + row) * scaleFactor + dy;
          if (x >= pixelWidth || y >= pixelHeight) {
            continue;
          }
          const offset = (y * pixelWidth + x) * 4;
          bitmap[offset] = 0x00;
          bitmap[offset + 1] = 0x00;
          bitmap[offset + 2] = 0x00;
          bitmap[offset + 3] = 0xff;
        }
      }
    }
  }

  return nativeImage.createFromBitmap(bitmap, { width: pixelWidth, height: pixelHeight });
}
