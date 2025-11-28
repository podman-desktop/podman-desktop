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

import { colorDefinition, ColorDefinitionBuilder, colorPalette, ColorPaletteHelper } from './color-builder.js';

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
});

describe('colorPalette', () => {
  test('should create ColorPaletteHelper instance', () => {
    const helper = colorPalette('#ff0000');

    expect(helper).toBeInstanceOf(ColorPaletteHelper);
    expect(helper.color).toBe('#ff0000');
    expect(helper.alpha).toBe(1);
  });

  test('should support chaining with withAlpha()', () => {
    const helper = colorPalette('#ff0000').withAlpha(0.7);

    expect(helper.color).toBe('#ff0000');
    expect(helper.alpha).toBe(0.7);
  });
});

describe('ColorDefinitionBuilder', () => {
  test('should create with id', () => {
    const builder = new ColorDefinitionBuilder('my-color');

    expect(builder).toBeInstanceOf(ColorDefinitionBuilder);
  });

  test('should build color definition with string colors', () => {
    const result = new ColorDefinitionBuilder('test-color').withLight('#ffffff').withDark('#000000').build();

    expect(result.id).toBe('test-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  test('should build color definition with ColorPaletteHelper', () => {
    const result = new ColorDefinitionBuilder('transparent-color')
      .withLight(colorPalette('#ffffff').withAlpha(0.5))
      .withDark(colorPalette('#000000').withAlpha(0.8))
      .build();

    expect(result.id).toBe('transparent-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
    // Check that alpha is applied (culori uses color(srgb ... / alpha) format)
    expect(result.light).toMatch(/\/ 0\.5\)?$/);
    expect(result.dark).toMatch(/\/ 0\.8\)?$/);
  });

  test('should support mixed string and ColorPaletteHelper', () => {
    const result = new ColorDefinitionBuilder('mixed-color')
      .withLight('#ffffff')
      .withDark(colorPalette('#000000').withAlpha(0.5))
      .build();

    expect(result.id).toBe('mixed-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  test('should throw error when light color is missing', () => {
    const builder = new ColorDefinitionBuilder('incomplete-color').withDark('#000000');

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when dark color is missing', () => {
    const builder = new ColorDefinitionBuilder('incomplete-color').withLight('#ffffff');

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when both colors are missing', () => {
    const builder = new ColorDefinitionBuilder('empty-color');

    expect(() => builder.build()).toThrow('Color definition for empty-color is incomplete.');
  });

  test('should throw error for invalid color string with alpha', () => {
    const builder = new ColorDefinitionBuilder('invalid-color')
      .withLight(colorPalette('not-a-color').withAlpha(0.5))
      .withDark('#000000');

    expect(() => builder.build()).toThrow('Failed to parse color not-a-color');
  });

  test('should support method chaining', () => {
    const builder = new ColorDefinitionBuilder('chain-test');
    const afterLight = builder.withLight('#fff');
    const afterDark = afterLight.withDark('#000');

    expect(afterLight).toBe(builder);
    expect(afterDark).toBe(builder);
  });

  test('should handle hex colors correctly', () => {
    const result = new ColorDefinitionBuilder('hex-color').withLight('#f9fafb').withDark('#0f0f11').build();

    expect(result.id).toBe('hex-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  test('should handle rgb colors correctly', () => {
    const result = new ColorDefinitionBuilder('rgb-color')
      .withLight('rgb(255, 255, 255)')
      .withDark('rgb(0, 0, 0)')
      .build();

    expect(result.id).toBe('rgb-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });
});

describe('colorDefinition', () => {
  test('should create ColorDefinitionBuilder instance', () => {
    const builder = colorDefinition('my-color');

    expect(builder).toBeInstanceOf(ColorDefinitionBuilder);
  });

  test('should support full fluent API', () => {
    const result = colorDefinition('fluent-color').withLight('#ffffff').withDark('#000000').build();

    expect(result.id).toBe('fluent-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  test('should work with colorPalette for alpha colors', () => {
    const result = colorDefinition('alpha-color')
      .withLight(colorPalette('#fff').withAlpha(0.4))
      .withDark(colorPalette('#000').withAlpha(0.6))
      .build();

    expect(result.id).toBe('alpha-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });
});
