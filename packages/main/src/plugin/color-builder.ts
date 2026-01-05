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

import { formatCss, parse } from 'culori';

import type { ColorDefinition } from '/@api/color-info.js';

import type { ColorPaletteHelper } from './color-palette-helper.js';

/**
 * Builder class for creating color definitions with light and dark theme variants.
 * Accepts ColorPaletteHelper instances for colors (with optional alpha).
 * Does not register colors directly - call build() to get the color definition object.
 *
 * @example
 * const def = colorDefinitionBuilder('my-color')
 *   .withLight(colorPaletteHelper('#ffffff'))
 *   .withDark(colorPaletteHelper('#000000'))
 *   .build();
 *
 * @example
 * const def = colorDefinitionBuilder('my-transparent-color')
 *   .withLight(colorPaletteHelper(white).withAlpha(0.5))
 *   .withDark(colorPaletteHelper(black).withAlpha(0.8))
 *   .build();
 */
export class ColorDefinitionBuilder {
  #id: string;
  #lightColor?: ColorPaletteHelper;
  #darkColor?: ColorPaletteHelper;

  constructor(id: string) {
    this.#id = id;
  }

  /**
   * Set the light theme color.
   * @param color - The ColorPaletteHelper instance
   * @returns This builder for method chaining
   */
  withLight(color: ColorPaletteHelper): this {
    this.#lightColor = color;

    return this;
  }

  /**
   * Set the dark theme color.
   * @param color - The ColorPaletteHelper instance
   * @returns This builder for method chaining
   */
  withDark(color: ColorPaletteHelper): this {
    this.#darkColor = color;

    return this;
  }

  /**
   * Build the color definition.
   * @returns The color definition with id
   */
  build(): ColorDefinition & { id: string } {
    if (!this.#lightColor || !this.#darkColor) {
      throw new Error(`Color definition for ${this.#id} is incomplete.`);
    }

    const light = this.#lightColor;
    const dark = this.#darkColor;

    /**
     * Formats the color with opacity using applyAlpha.
     * @param c - The ColorPaletteHelper instance
     * @returns The formatted color string
     */
    const formatColor = (c: ColorPaletteHelper): string => applyAlpha(c.color, c.alpha);

    return {
      id: this.#id,
      light: formatColor(light),
      dark: formatColor(dark),
    };
  }
}

/**
 * Creates a ColorDefinitionBuilder for the given color ID.
 * @param id - The color ID
 * @returns A ColorDefinitionBuilder instance
 */
export function colorDefinitionBuilder(id: string): ColorDefinitionBuilder {
  return new ColorDefinitionBuilder(id);
}

/**
 * Apply alpha to a color string and return the formatted CSS color.
 * @param color - The color string to apply alpha to
 * @param alphaValue - The alpha value (0-1)
 * @returns The formatted CSS color string
 * @throws Error if alpha is not between 0 and 1
 * @throws Error if the color cannot be parsed or formatted
 */
export function applyAlpha(color: string, alphaValue: number): string {
  if (alphaValue < 0 || alphaValue > 1) {
    throw new Error(`Alpha value must be between 0 and 1, got ${alphaValue}`);
  }

  if (alphaValue === 1) {
    return color;
  }

  const parsed = parse(color);
  if (!parsed) throw new Error(`Failed to parse color ${color}`);
  parsed.alpha = alphaValue;

  const formatted = formatCss(parsed);
  if (!formatted) throw new Error(`Failed to format color ${color}`);
  return formatted;
}

/**
 * Builder class for fluent color definition creation.
 * Does not register colors directly - call build() to get the color definition object,
 * then pass it to registerColorDefinition().
 * Supports optional alpha (opacity) values for each theme variant.
 *
 * @example
 * this.registerColorDefinition(
 *   this.color('my-color').withLight('#ffffff').withDark('#000000').build()
 * );
 *
 * @example
 * this.registerColorDefinition(
 *   this.color('my-transparent-color').withLight('#ffffff', 0.5).withDark('#000000', 0.8).build()
 * );
 */
export class ColorBuilder {
  #colorId: string;
  #lightColor?: string;
  #lightAlpha = 1;
  #darkColor?: string;
  #darkAlpha = 1;

  constructor(colorId: string) {
    this.#colorId = colorId;
  }

  /**
   * Set the light theme color and optional opacity.
   * @param color - The color string for light theme
   * @param alpha - The alpha value (0-1), defaults to 1 (fully opaque)
   * @returns This builder for method chaining
   * @throws Error if alpha is not between 0 and 1
   */
  withLight(color: string, alpha = 1): this {
    if (alpha < 0 || alpha > 1) {
      throw new Error(`Alpha value must be between 0 and 1, got ${alpha}`);
    }

    this.#lightColor = color;
    this.#lightAlpha = alpha;

    return this;
  }

  /**
   * Set the dark theme color and optional opacity.
   * @param color - The color string for dark theme
   * @param alpha - The alpha value (0-1), defaults to 1 (fully opaque)
   * @returns This builder for method chaining
   * @throws Error if alpha is not between 0 and 1
   */
  withDark(color: string, alpha = 1): this {
    if (alpha < 0 || alpha > 1) {
      throw new Error(`Alpha value must be between 0 and 1, got ${alpha}`);
    }

    this.#darkColor = color;
    this.#darkAlpha = alpha;

    return this;
  }

  /**
   * Build the color definition object.
   * Applies alpha values to colors if specified.
   * @returns The color definition with id, light, and dark values
   * @throws Error if light or dark color is not set
   */
  build(): ColorDefinition & { id: string } {
    if (!this.#lightColor || !this.#darkColor) {
      throw new Error(`Color definition for ${this.#colorId} is incomplete.`);
    }

    return {
      id: this.#colorId,
      light: applyAlpha(this.#lightColor, this.#lightAlpha),
      dark: applyAlpha(this.#darkColor, this.#darkAlpha),
    };
  }
}
