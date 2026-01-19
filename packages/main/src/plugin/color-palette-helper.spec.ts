/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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

import { describe, expect, test } from 'vitest';

import { ColorPaletteHelper, colorPaletteHelper } from './color-palette-helper.js';

describe('ColorPaletteHelper', () => {
  test('should create with default alpha of 1', () => {
    const helper = new ColorPaletteHelper('#ff0000');

    expect(helper.color).toBe('#ff0000');
    expect(helper.alpha).toBe(1);
  });

  test('should set alpha with withAlpha()', () => {
    const helper = new ColorPaletteHelper('#ff0000').withAlpha(0.5);

    expect(helper.color).toBe('#ff0000');
    expect(helper.alpha).toBe(0.5);
  });

  test('should support method chaining', () => {
    const helper = new ColorPaletteHelper('#00ff00');
    const result = helper.withAlpha(0.3);

    expect(result).toBe(helper);
  });

  test('should overwrite alpha with successive withAlpha() calls', () => {
    const helper = new ColorPaletteHelper('#ff0000').withAlpha(0.3).withAlpha(0.7);

    expect(helper.alpha).toBe(0.7);
    expect(helper.color).toBe('#ff0000');
  });

  test('should handle alpha value of 0', () => {
    const helper = new ColorPaletteHelper('#0000ff').withAlpha(0);

    expect(helper.alpha).toBe(0);
  });

  test('should handle alpha value of 1', () => {
    const helper = new ColorPaletteHelper('#0000ff').withAlpha(1);

    expect(helper.alpha).toBe(1);
  });

  test('should throw error for alpha value below 0', () => {
    const helper = new ColorPaletteHelper('#0000ff');

    expect(() => helper.withAlpha(-0.1)).toThrow('Alpha value must be between 0 and 1, got -0.1');
  });

  test('should throw error for alpha value above 1', () => {
    const helper = new ColorPaletteHelper('#0000ff');

    expect(() => helper.withAlpha(1.5)).toThrow('Alpha value must be between 0 and 1, got 1.5');
  });

  test('should throw error for NaN alpha value', () => {
    const helper = new ColorPaletteHelper('#0000ff');

    expect(() => helper.withAlpha(Number.NaN)).toThrow('Alpha value must be between 0 and 1');
  });

  test('should throw error for Infinity alpha value', () => {
    const helper = new ColorPaletteHelper('#0000ff');

    expect(() => helper.withAlpha(Number.POSITIVE_INFINITY)).toThrow('Alpha value must be between 0 and 1');
  });
});

describe('colorPaletteHelper', () => {
  test('should create ColorPaletteHelper instance', () => {
    const helper = colorPaletteHelper('#ff0000');

    expect(helper).toBeInstanceOf(ColorPaletteHelper);
    expect(helper.color).toBe('#ff0000');
    expect(helper.alpha).toBe(1);
  });

  test('should support chaining with withAlpha()', () => {
    const helper = colorPaletteHelper('#ff0000').withAlpha(0.7);

    expect(helper.color).toBe('#ff0000');
    expect(helper.alpha).toBe(0.7);
  });
});
