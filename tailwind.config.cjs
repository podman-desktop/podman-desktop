/**********************************************************************
 * Copyright (C) 2022-2024 Red Hat, Inc.
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

const tailwindColors = require('tailwindcss/colors');
const colorPalette = require('./tailwind-color-palette.json');
const typographyPlugin = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'packages/renderer/index.html',
    'packages/renderer/src/**/*.{svelte,ts,css}',
    'packages/ui/src/**/*.{svelte,ts,css}',
  ],
  darkMode: 'class',
  theme: {
    fontSize: {
      xs: '10px',
      sm: '11px',
      base: '12px',
      lg: '14px',
      xl: '16px',
      '2xl': '18px',
      '3xl': '20px',
      '4xl': '24px',
      '5xl': '30px',
      '6xl': '36px',
    },
    colors: {
      // import colors from the color palette
      ...colorPalette,

      // The remaining colors below are not part of our palette and are only here
      // to maintain existing code. No new use.
      zinc: {
        100: tailwindColors.zinc[100],
        200: tailwindColors.zinc[200],
        300: tailwindColors.zinc[300],
        700: tailwindColors.zinc[700],
      },
    },
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-links': 'var(--pd-link)',
            '--tw-prose-invert-links': 'var(--pd-link)',

            p: {
              fontSize: '12px',
            },

            ul: {
              fontSize: '12px',
            },

            ol: {
              fontSize: '12px',
            },

            h1: {
              fontWeight: '200',
            },

            h2: {
              fontWeight: '300',
              letterSpacing: '0.03em',
            },

            h3: {
              fontWeight: '300',
              letterSpacing: '0.03em',
            },

            h4: {
              fontSize: '10px',
            },

            a: {
              fontWeight: '400',
            },
          },
        },

        // The typography plugin's `sm` modifier (applied via `prose-sm` in Markdown.svelte)
        // defines its own `code` font-size, which otherwise wins over the DEFAULT override above.
        sm: {
          css: {
            code: {
              fontSize: '12px',
              fontWeight: '400',
            },
          },
        },
      }),
    },
  },
  plugins: [typographyPlugin],
};
