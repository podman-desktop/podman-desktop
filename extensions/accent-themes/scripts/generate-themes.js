#!/usr/bin/env node
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
 * @file Theme generation script for the accent-themes extension.
 *
 * Reads {@link theme-palette.json}, resolves `$token` references against
 * named palettes, validates all color values, and writes the expanded
 * themes into the `contributes.themes` section of {@link package.json}.
 *
 * Run manually via `pnpm generate-themes`, or automatically as part of
 * `pnpm build` and `pnpm watch` (via a vite plugin in vite.config.js).
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const palettePath = path.join(rootDir, 'theme-palette.json');
const packagePath = path.join(rootDir, 'package.json');

/** Matches hex color values: #RGB, #RGBA, #RRGGBB, #RRGGBBAA */
const VALID_COLOR_RE = /^#([0-9a-f]{3,8})$/i;

/** CSS color keywords accepted as valid literal values. */
const VALID_LITERALS = new Set(['transparent', 'inherit', 'currentColor']);

/** @type {string[]} */
const warnings = [];

/**
 * Records a validation warning for later output.
 * @param {string} context - Identifier for the palette or theme producing the warning.
 * @param {string} message - Description of the issue.
 */
function warn(context, message) {
  warnings.push(`[${context}] ${message}`);
}

/**
 * Checks whether a string is a valid CSS color value.
 * Accepts hex notation (#RGB through #RRGGBBAA) and a small set of
 * CSS keywords (transparent, inherit, currentColor).
 * @param {string} value - The color value to validate.
 * @returns {boolean} True if the value is a recognized color format.
 */
function isValidColor(value) {
  return VALID_COLOR_RE.test(value) || VALID_LITERALS.has(value);
}

/**
 * Validates every token value in all palettes.
 * Emits a warning for any token whose value is not a valid color.
 * @param {Record<string, Record<string, Record<string, string>>>} palettes
 *   Nested palette object: `{ groupName: { variantName: { tokenName: colorValue } } }`.
 */
function validatePaletteTokens(palettes) {
  for (const [group, variants] of Object.entries(palettes)) {
    for (const [variant, tokens] of Object.entries(variants)) {
      for (const [token, value] of Object.entries(tokens)) {
        if (!isValidColor(value)) {
          warn(`${group}.${variant}`, `palette token "${token}" has invalid color: "${value}"`);
        }
      }
    }
  }
}

/**
 * Looks up a palette by its dotted reference (e.g. `"rhbpd.dark"`).
 * @param {string} paletteRef - Dotted reference in the form `"group.variant"`.
 * @param {Record<string, Record<string, Record<string, string>>>} palettes - All palettes.
 * @returns {Record<string, string>} The resolved token map.
 * @throws {Error} If the palette reference does not match any entry.
 */
function resolvePalette(paletteRef, palettes) {
  const [group, variant] = paletteRef.split('.');
  const resolved = palettes[group]?.[variant];
  if (!resolved) {
    throw new Error(`Unknown palette "${paletteRef}"`);
  }
  return resolved;
}

/**
 * Resolves a theme's color map by replacing `$token` references with
 * their palette values. Literal values are passed through unchanged.
 *
 * Emits warnings for:
 * - `$token` references that do not exist in the palette.
 * - Literal values that are not valid CSS colors.
 *
 * Invalid entries are kept in the output (not stripped) so the problem
 * is visible at runtime rather than silently disappearing.
 *
 * @param {string} themeId - Theme identifier, used in warning messages.
 * @param {Record<string, string>} colors - Color map with `$token` refs or literals.
 * @param {Record<string, string>} tokens - Resolved palette tokens.
 * @returns {Record<string, string>} Color map with all `$token` refs expanded.
 */
function resolveColors(themeId, colors, tokens) {
  const resolved = {};
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string' && value.startsWith('$')) {
      const tokenName = value.slice(1);
      if (!(tokenName in tokens)) {
        warn(themeId, `color "${key}" references unknown token "${tokenName}"`);
        resolved[key] = value;
      } else {
        resolved[key] = tokens[tokenName];
      }
    } else if (typeof value === 'string' && !isValidColor(value)) {
      warn(themeId, `color "${key}" has invalid value: "${value}"`);
      resolved[key] = value;
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

// #region Main

const palette = JSON.parse(fs.readFileSync(palettePath, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

validatePaletteTokens(palette.palettes);

const expandedThemes = palette.themes.map(theme => {
  const tokens = resolvePalette(theme.palette, palette.palettes);
  return {
    id: theme.id,
    name: theme.name,
    parent: theme.parent,
    colors: resolveColors(theme.id, theme.colors, tokens),
  };
});

pkg.contributes = pkg.contributes || {};
pkg.contributes.themes = expandedThemes;

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

if (warnings.length > 0) {
  console.warn(`\nTheme generation warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.warn(`  WARNING: ${w}`);
  }
  console.warn('');
}

console.log(`Generated ${expandedThemes.length} theme(s) in package.json`);

// #endregion
