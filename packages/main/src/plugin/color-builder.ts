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

/**
 * Helper class for wrapping a color value with an optional alpha (opacity) value.
 * Provides a fluent interface for specifying colors with transparency.
 *
 * @example
 * colorPalette('#ff0000').withAlpha(0.5)
 *
 * @example
 * colorDefinition('my-color')
 *   .withLight(colorPalette(white).withAlpha(0.5))
 *   .withDark(colorPalette(black).withAlpha(0.8))
 *   .build()
 */
export class ColorPaletteHelper {
  #color: string;
  #alpha = 1;

  constructor(color: string) {
    this.#color = color;
  }

  /**
   * Set the alpha value for the color.
   * @param alpha - The alpha value (0-1), defaults to 1 (fully opaque)
   * @returns This builder for method chaining
   * @throws Error if alpha is not between 0 and 1
   */
  withAlpha(alpha: number): this {
    if (alpha < 0 || alpha > 1) {
      throw new Error(`Alpha value must be between 0 and 1, got ${alpha}`);
    }

    this.#alpha = alpha;

    return this;
  }

  /**
   * Get the color value.
   * @returns The color value
   */
  get color(): string {
    return this.#color;
  }

  /**
   * Get the alpha value.
   * @returns The alpha value
   */
  get alpha(): number {
    return this.#alpha;
  }
}

/**
 * Creates a ColorPaletteHelper for the given color.
 * @param color - The color value
 * @returns A ColorPaletteHelper instance
 */
export function colorPalette(color: string): ColorPaletteHelper {
  return new ColorPaletteHelper(color);
}

/**
 * Builder class for creating color definitions with light and dark theme variants.
 * Accepts either plain color strings or ColorPaletteHelper instances for colors with alpha.
 * Does not register colors directly - call build() to get the color definition object.
 *
 * @example
 * const def = colorDefinition('my-color')
 *   .withLight('#ffffff')
 *   .withDark('#000000')
 *   .build();
 *
 * @example
 * const def = colorDefinition('my-transparent-color')
 *   .withLight(colorPalette(white).withAlpha(0.5))
 *   .withDark(colorPalette(black).withAlpha(0.8))
 *   .build();
 */
export class ColorDefinitionBuilder {
  #id: string;
  #lightColor?: string | ColorPaletteHelper;
  #darkColor?: string | ColorPaletteHelper;

  constructor(id: string) {
    this.#id = id;
  }

  /**
   * Set the light theme color.
   * @param color - The color value or ColorPaletteHelper
   * @returns This builder for method chaining
   */
  withLight(color: string | ColorPaletteHelper): this {
    this.#lightColor = color;

    return this;
  }

  /**
   * Set the dark theme color.
   * @param color - The color value or ColorPaletteHelper
   * @returns This builder for method chaining
   */
  withDark(color: string | ColorPaletteHelper): this {
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

    /**
     * Processes the color value.
     * @param c - The color value or ColorPaletteHelper
     * @returns The color object with color and alpha values
     */
    const processColor = (c: string | ColorPaletteHelper): { color: string; alpha: number } => {
      if (c instanceof ColorPaletteHelper) {
        return { color: c.color, alpha: c.alpha };
      }

      return { color: c, alpha: 1 };
    };

    const light = processColor(this.#lightColor);
    const dark = processColor(this.#darkColor);

    /**
     * Formats the color with opacity.
     * @param c - The color object with color and alpha values
     * @returns The formatted color string
     * @throws Error if color cannot be parsed or formatted
     */
    const formatColor = (c: { color: string; alpha: number }): string => {
      if (c.alpha === 1) {
        return c.color;
      }

      const parsed = parse(c.color);

      if (!parsed) throw new Error(`Failed to parse color ${c.color}`);

      parsed.alpha = c.alpha;

      const formatted = formatCss(parsed);

      if (!formatted) throw new Error(`Failed to format color ${c.color}`);

      return formatted;
    };

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
export function colorDefinition(id: string): ColorDefinitionBuilder {
  return new ColorDefinitionBuilder(id);
}
