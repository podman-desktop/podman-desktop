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

import { type NativeImage, nativeImage } from 'electron';

// 5x7 pixel font — uppercase A-Z, 0-9, dash, slash, dot, underscore, space
// Each glyph is 5 wide, 7 tall. '#' = pixel on, '.' = pixel off.
const GLYPHS: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '..##.', '.#...', '#....', '#####'],
  '3': ['.###.', '#...#', '....#', '..##.', '....#', '#...#', '.###.'],
  '4': ['#...#', '#...#', '#...#', '#####', '....#', '....#', '....#'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '####.', '#...#', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '/': ['....#', '...#.', '...#.', '..#..', '.#...', '.#...', '#....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.....', '..#..'],
  _: ['.....', '.....', '.....', '.....', '.....', '.....', '#####'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};
const GLYPH_W = 5;
const GLYPH_H = 7;
const GLYPH_SPACING = 1;

/**
 * Derives a banner hue (0-360) from a hash string, picking from a set of
 * saturated, visually distinct colors that read well on both light and dark.
 */
function bannerColorFromHash(hash: string): { r: number; g: number; b: number } {
  const hue = Number.parseInt(hash.slice(0, 4), 16) % 360;
  // HSL → RGB at S=75%, L=45% — vivid but not neon
  return hslToRgb(hue, 0.75, 0.45);
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb: [number, number, number];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return {
    r: Math.round((rgb[0] + m) * 255),
    g: Math.round((rgb[1] + m) * 255),
    b: Math.round((rgb[2] + m) * 255),
  };
}

// White or black text, whichever has better contrast against the banner color
function textColor(bg: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  const lum = (0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b) / 255;
  return lum > 0.5 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
}

/**
 * Stamps a colored banner with a label onto a base icon image.
 * Banner color is derived from {@link hash}; text is auto-contrasted.
 */
export function buildDevIcon(base: NativeImage, label: string, hash: string): NativeImage {
  const { width, height } = base.getSize();
  if (width <= 0 || height <= 0) return base;

  const bitmap = Buffer.from(base.toBitmap());
  const bg = bannerColorFromHash(hash);
  const fg = textColor(bg);

  const text = label.toUpperCase();

  // Banner geometry — horizontal strip below center
  const scale = Math.max(1, Math.floor(width / 64));
  const charH = GLYPH_H * scale;
  const charW = GLYPH_W * scale;
  const spacing = GLYPH_SPACING * scale;
  const padding = 2 * scale;
  const bannerH = charH + padding * 2;
  const bannerY = Math.floor(height * 0.65);

  // Draw banner rectangle
  for (let y = bannerY; y < Math.min(height, bannerY + bannerH); y++) {
    for (let x = 0; x < width; x++) {
      const off = (y * width + x) * 4;
      bitmap[off] = bg.r;
      bitmap[off + 1] = bg.g;
      bitmap[off + 2] = bg.b;
      bitmap[off + 3] = 230;
    }
  }

  // Render text centered on banner
  const textW = text.length * (charW + spacing) - spacing;
  const startX = Math.floor((width - textW) / 2);
  const startY = bannerY + padding;

  for (let ci = 0; ci < text.length; ci++) {
    const glyph = GLYPHS[text[ci]!] ?? GLYPHS[' ']!;
    const cx = startX + ci * (charW + spacing);
    for (let row = 0; row < GLYPH_H; row++) {
      const pattern = glyph[row]!;
      for (let col = 0; col < GLYPH_W; col++) {
        if (pattern[col] !== '#') continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const x = cx + col * scale + dx;
            const y = startY + row * scale + dy;
            if (x >= width || y >= height) continue;
            const off = (y * width + x) * 4;
            bitmap[off] = fg.r;
            bitmap[off + 1] = fg.g;
            bitmap[off + 2] = fg.b;
            bitmap[off + 3] = 255;
          }
        }
      }
    }
  }

  // Mask to original alpha — clip banner to icon shape
  const origBitmap = base.toBitmap();
  for (let i = 3; i < bitmap.length; i += 4) {
    bitmap[i] = Math.min(bitmap[i]!, origBitmap[i]!);
  }

  return nativeImage.createFromBitmap(bitmap, { width, height });
}
