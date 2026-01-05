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

import { applyAlpha, ColorBuilder, ColorDefinitionBuilder, colorDefinitionBuilder } from './color-builder.js';
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

describe('ColorDefinitionBuilder', () => {
  test('should create with id', () => {
    const builder = new ColorDefinitionBuilder('my-color');

    expect(builder).toBeInstanceOf(ColorDefinitionBuilder);
  });

  test('should build color definition with ColorPaletteHelper', () => {
    const result = new ColorDefinitionBuilder('test-color')
      .withLight(colorPaletteHelper('#ffffff'))
      .withDark(colorPaletteHelper('#000000'))
      .build();

    expect(result.id).toBe('test-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  test('should build color definition with ColorPaletteHelper and alpha', () => {
    const result = new ColorDefinitionBuilder('transparent-color')
      .withLight(colorPaletteHelper('#ffffff').withAlpha(0.5))
      .withDark(colorPaletteHelper('#000000').withAlpha(0.8))
      .build();

    expect(result.id).toBe('transparent-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
    // Check that alpha is applied (culori uses color(srgb ... / alpha) format)
    expect(result.light).toMatch(/\/ 0\.5\)?$/);
    expect(result.dark).toMatch(/\/ 0\.8\)?$/);
  });

  test('should throw error when light color is missing', () => {
    const builder = new ColorDefinitionBuilder('incomplete-color').withDark(colorPaletteHelper('#000000'));

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when dark color is missing', () => {
    const builder = new ColorDefinitionBuilder('incomplete-color').withLight(colorPaletteHelper('#ffffff'));

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when both colors are missing', () => {
    const builder = new ColorDefinitionBuilder('empty-color');

    expect(() => builder.build()).toThrow('Color definition for empty-color is incomplete.');
  });

  test('should throw error for invalid color string with alpha', () => {
    const builder = new ColorDefinitionBuilder('invalid-color')
      .withLight(colorPaletteHelper('not-a-color').withAlpha(0.5))
      .withDark(colorPaletteHelper('#000000'));

    expect(() => builder.build()).toThrow('Failed to parse color not-a-color');
  });

  test('should support method chaining', () => {
    const builder = new ColorDefinitionBuilder('chain-test');
    const afterLight = builder.withLight(colorPaletteHelper('#fff'));
    const afterDark = afterLight.withDark(colorPaletteHelper('#000'));

    expect(afterLight).toBe(builder);
    expect(afterDark).toBe(builder);
  });

  test('should handle hex colors correctly', () => {
    const result = new ColorDefinitionBuilder('hex-color')
      .withLight(colorPaletteHelper('#f9fafb'))
      .withDark(colorPaletteHelper('#0f0f11'))
      .build();

    expect(result.id).toBe('hex-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  test('should handle rgb colors correctly', () => {
    const result = new ColorDefinitionBuilder('rgb-color')
      .withLight(colorPaletteHelper('rgb(255, 255, 255)'))
      .withDark(colorPaletteHelper('rgb(0, 0, 0)'))
      .build();

    expect(result.id).toBe('rgb-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });
});

describe('colorDefinitionBuilder', () => {
  test('should create ColorDefinitionBuilder instance', () => {
    const builder = colorDefinitionBuilder('my-color');

    expect(builder).toBeInstanceOf(ColorDefinitionBuilder);
  });

  test('should support full fluent API', () => {
    const result = colorDefinitionBuilder('fluent-color')
      .withLight(colorPaletteHelper('#ffffff'))
      .withDark(colorPaletteHelper('#000000'))
      .build();

    expect(result.id).toBe('fluent-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  test('should work with colorPaletteHelper for alpha colors', () => {
    const result = colorDefinitionBuilder('alpha-color')
      .withLight(colorPaletteHelper('#fff').withAlpha(0.4))
      .withDark(colorPaletteHelper('#000').withAlpha(0.6))
      .build();

    expect(result.id).toBe('alpha-color');
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });
});

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

  test('should build color definition with light and dark colors', () => {
    const result = new ColorBuilder('test-color').withLight('#ffffff').withDark('#000000').build();

    expect(result.id).toBe('test-color');
    expect(result.light).toBe('#ffffff');
    expect(result.dark).toBe('#000000');
  });

  test('should build color definition with alpha values', () => {
    const result = new ColorBuilder('transparent-color').withLight('#ffffff', 0.5).withDark('#000000', 0.8).build();

    expect(result.id).toBe('transparent-color');
    expect(result.light).toMatch(/0\.5/);
    expect(result.dark).toMatch(/0\.8/);
  });

  test('should throw error when light color is missing', () => {
    const builder = new ColorBuilder('incomplete-color').withDark('#000000');

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when dark color is missing', () => {
    const builder = new ColorBuilder('incomplete-color').withLight('#ffffff');

    expect(() => builder.build()).toThrow('Color definition for incomplete-color is incomplete.');
  });

  test('should throw error when both colors are missing', () => {
    const builder = new ColorBuilder('empty-color');

    expect(() => builder.build()).toThrow('Color definition for empty-color is incomplete.');
  });

  test('should support method chaining', () => {
    const builder = new ColorBuilder('chain-test');
    const afterLight = builder.withLight('#fff');
    const afterDark = afterLight.withDark('#000');

    expect(afterLight).toBe(builder);
    expect(afterDark).toBe(builder);
  });

  test('should handle alpha value of 0 in withLight', () => {
    const result = new ColorBuilder('zero-alpha').withLight('#ffffff', 0).withDark('#000000').build();

    expect(result.light).toBeDefined();
  });

  test('should handle alpha value of 1 in withLight', () => {
    const result = new ColorBuilder('one-alpha').withLight('#ffffff', 1).withDark('#000000').build();

    expect(result.light).toBe('#ffffff');
  });

  test('should handle alpha value of 0 in withDark', () => {
    const result = new ColorBuilder('zero-alpha').withLight('#ffffff').withDark('#000000', 0).build();

    expect(result.dark).toBeDefined();
  });

  test('should handle alpha value of 1 in withDark', () => {
    const result = new ColorBuilder('one-alpha').withLight('#ffffff').withDark('#000000', 1).build();

    expect(result.dark).toBe('#000000');
  });

  test('should throw error for alpha value below 0 in withLight', () => {
    const builder = new ColorBuilder('invalid-alpha');

    expect(() => builder.withLight('#ffffff', -0.1)).toThrow('Alpha value must be between 0 and 1, got -0.1');
  });

  test('should throw error for alpha value above 1 in withLight', () => {
    const builder = new ColorBuilder('invalid-alpha');

    expect(() => builder.withLight('#ffffff', 1.5)).toThrow('Alpha value must be between 0 and 1, got 1.5');
  });

  test('should throw error for alpha value below 0 in withDark', () => {
    const builder = new ColorBuilder('invalid-alpha');

    expect(() => builder.withDark('#000000', -0.1)).toThrow('Alpha value must be between 0 and 1, got -0.1');
  });

  test('should throw error for alpha value above 1 in withDark', () => {
    const builder = new ColorBuilder('invalid-alpha');

    expect(() => builder.withDark('#000000', 1.5)).toThrow('Alpha value must be between 0 and 1, got 1.5');
  });

  test('should handle hex colors correctly', () => {
    const result = new ColorBuilder('hex-color').withLight('#f9fafb').withDark('#0f0f11').build();

    expect(result.id).toBe('hex-color');
    expect(result.light).toBe('#f9fafb');
    expect(result.dark).toBe('#0f0f11');
  });

  test('should handle rgb colors correctly', () => {
    const result = new ColorBuilder('rgb-color').withLight('rgb(255, 255, 255)').withDark('rgb(0, 0, 0)').build();

    expect(result.id).toBe('rgb-color');
    expect(result.light).toBe('rgb(255, 255, 255)');
    expect(result.dark).toBe('rgb(0, 0, 0)');
  });
});
