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

/**
 * @file Entry point for the accent-themes extension.
 *
 * Themes are registered declaratively via `contributes.themes` in
 * `package.json`. This module validates the source palette at activation
 * time and logs warnings to the Electron developer console for any
 * malformed colors or unresolved `$token` references found in
 * `theme-palette.json`.
 *
 * Validation runs on every activation, including HMR reloads during
 * `pnpm watch`, so palette errors surface immediately during development.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type * as extensionApi from '@podman-desktop/api';

/** Matches hex color values: #RGB, #RGBA, #RRGGBB, #RRGGBBAA. */
const VALID_COLOR_RE = /^#[0-9a-f]{3,8}$/i;

/** CSS color keywords accepted as valid literal values. */
const VALID_LITERALS = new Set(['transparent', 'inherit', 'currentColor']);

/** Map of semantic token names to their resolved color values. */
interface ThemePaletteTokens {
  [token: string]: string;
}

/** Structure of the `theme-palette.json` file. */
interface ThemePalette {
  palettes: Record<string, Record<string, ThemePaletteTokens>>;
  themes: Array<{
    id: string;
    palette: string;
    colors: Record<string, string>;
  }>;
}

/**
 * Checks whether a string is a valid CSS color value.
 * @param value - The color value to validate.
 * @returns True if the value is a recognized hex or keyword color.
 */
function isValidColor(value: string): boolean {
  return VALID_COLOR_RE.test(value) || VALID_LITERALS.has(value);
}

/**
 * Reads and validates `theme-palette.json` from the extension directory.
 *
 * Checks for:
 * - Palette token values that are not valid CSS colors.
 * - Theme color entries referencing unknown `$token` names.
 * - Theme color entries with malformed literal values.
 *
 * All warnings are logged to `console.warn` so they appear in the
 * Electron developer console.
 *
 * @param extensionDir - Absolute path to the extension root directory.
 */
function validateThemePalette(extensionDir: string): void {
  const palettePath = join(extensionDir, 'theme-palette.json');

  let palette: ThemePalette;
  try {
    palette = JSON.parse(readFileSync(palettePath, 'utf8'));
  } catch {
    return;
  }

  const warnings: string[] = [];

  for (const [group, variants] of Object.entries(palette.palettes)) {
    for (const [variant, tokens] of Object.entries(variants)) {
      for (const [token, value] of Object.entries(tokens)) {
        if (!isValidColor(value)) {
          warnings.push(`palette "${group}.${variant}" token "${token}" has invalid color: "${value}"`);
        }
      }
    }
  }

  for (const theme of palette.themes) {
    const [group, variant] = theme.palette.split('.');
    const tokens = palette.palettes[group]?.[variant] ?? {};

    for (const [key, value] of Object.entries(theme.colors)) {
      if (value.startsWith('$')) {
        const tokenName = value.slice(1);
        if (!(tokenName in tokens)) {
          warnings.push(`theme "${theme.id}" color "${key}" references unknown token "${tokenName}"`);
        }
      } else if (!isValidColor(value)) {
        warnings.push(`theme "${theme.id}" color "${key}" has invalid value: "${value}"`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`[accent-themes] ${warnings.length} validation warning(s):`);
    for (const w of warnings) {
      console.warn(`[accent-themes]   ${w}`);
    }
  }
}

/**
 * Called when the extension is activated.
 * Validates `theme-palette.json` and logs any issues to the console.
 */
export async function activate(extensionContext: extensionApi.ExtensionContext): Promise<void> {
  validateThemePalette(extensionContext.extensionUri.fsPath);
}

/** Called when the extension is deactivated. */
export function deactivate(): void {
  // Nothing to clean up
}
