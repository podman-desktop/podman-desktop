/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { applyAlpha, ColorBuilder } from './color-builder.js';
import { colorPaletteHelper } from './color-palette-helper.js';

describe('applyAlpha', () => {
  test('should return original color when alpha is 1', () => {
    const result = applyAlpha('#ff0000', 1);

    expect(result).toBe('#ff0000');
  });

  test('should apply alpha to hex color', () => {
    const result = applyAlpha('#ff0000', 0.5);

    expect(result).toBeDefined();
    expect(result).toMatch(/0\.5/);
  });

  test('should apply alpha to rgb color', () => {
    const result = applyAlpha('rgb(255, 0, 0)', 0.7);

    expect(result).toBeDefined();
    expect(result).toMatch(/0\.7/);
  });

  test('should handle alpha value of 0', () => {
    const result = applyAlpha('#ff0000', 0);

    expect(result).toBeDefined();
  });

  test('should throw error for alpha value below 0', () => {
    expect(() => applyAlpha('#ff0000', -0.1)).toThrow('Alpha value must be between 0 and 1, got -0.1');
  });

  test('should throw error for alpha value above 1', () => {
    expect(() => applyAlpha('#ff0000', 1.5)).toThrow('Alpha value must be between 0 and 1, got 1.5');
  });

  test('should throw error for invalid color string', () => {
    expect(() => applyAlpha('not-a-color', 0.5)).toThrow('Failed to parse color not-a-color');
  });
});

describe('ColorBuilder', () => {
  test('should create with colorId', () => {
    const builder = new ColorBuilder('my-color');

    expect(builder).toBeInstanceOf(ColorBuilder);
  });

  test('should build color definition with ColorPaletteHelper', () => {
    const result = new ColorBuilder('test-color')
      .withLight(colorPaletteHelper('#ffffff'))
      .withDark(colorPaletteHelper('#000000'))
      .build();

    expect(result.id).toBe('test-color');
    expect(result.light).toBe('#ffffff');
    expect(result.dark).toBe('#000000');
  });

  test('should build color definition with alpha values', () => {
    const result = new ColorBuilder('transparent-color')
      .withLight(colorPaletteHelper('#ffffff').withAlpha(0.5))
      .withDark(colorPaletteHelper('#000000').withAlpha(0.8))
      .build();

    expect(result.id).toBe('transparent-color');
    expect(result.light).toMatch(/0\.5/);
    expect(result.dark).toMatch(/0\.8/);
  });

  test('should throw error when light color is missing', () => {
    const builder = new ColorBuilder('incomplete-color').withDark(colorPaletteHelper('#000000'));

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when dark color is missing', () => {
    const builder = new ColorBuilder('incomplete-color').withLight(colorPaletteHelper('#ffffff'));

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when both colors are missing', () => {
    const builder = new ColorBuilder('empty-color');

    expect(() => builder.build()).toThrow('Color definition for empty-color is incomplete.');
  });

  test('should support method chaining', () => {
    const builder = new ColorBuilder('chain-test');
    const afterLight = builder.withLight(colorPaletteHelper('#fff'));
    const afterDark = afterLight.withDark(colorPaletteHelper('#000'));

    expect(afterLight).toBe(builder);
    expect(afterDark).toBe(builder);
  });

  test('should handle hex colors correctly', () => {
    const result = new ColorBuilder('hex-color')
      .withLight(colorPaletteHelper('#f9fafb'))
      .withDark(colorPaletteHelper('#0f0f11'))
      .build();

    expect(result.id).toBe('hex-color');
    expect(result.light).toBe('#f9fafb');
    expect(result.dark).toBe('#0f0f11');
  });

  test('should handle rgb colors correctly', () => {
    const result = new ColorBuilder('rgb-color')
      .withLight(colorPaletteHelper('rgb(255, 255, 255)'))
      .withDark(colorPaletteHelper('rgb(0, 0, 0)'))
      .build();

    expect(result.id).toBe('rgb-color');
    expect(result.light).toBe('rgb(255, 255, 255)');
    expect(result.dark).toBe('rgb(0, 0, 0)');
  });

  test('should throw error for invalid color string with alpha', () => {
    const builder = new ColorBuilder('invalid-color')
      .withLight(colorPaletteHelper('not-a-color').withAlpha(0.5))
      .withDark(colorPaletteHelper('#000000'));

    expect(() => builder.build()).toThrow('Failed to parse color not-a-color');
  });
});
