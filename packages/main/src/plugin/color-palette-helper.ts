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

/**
 * Helper class for wrapping a color value with an optional alpha (opacity) value.
 * Provides a fluent interface for specifying colors with transparency.
 *
 * @example
 * colorPaletteHelper('#ff0000').withAlpha(0.5)
 *
 * @example
 * this.color('my-color')
 *   .withLight(colorPaletteHelper(white).withAlpha(0.5))
 *   .withDark(colorPaletteHelper(black).withAlpha(0.8))
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
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
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
export function colorPaletteHelper(color: string): ColorPaletteHelper {
  return new ColorPaletteHelper(color);
}
