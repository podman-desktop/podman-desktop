/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import { z } from 'zod';

import type { FontDefinition } from './font-info.js';

export interface IconDefinition {
  description?: string;
  font?: FontDefinition;
  fontCharacter: string;
}

export interface IconInfo {
  id: string;
  definition: IconDefinition;
}

// values below are written into a stylesheet by the renderer: they must not be able to end a CSS string or selector

// letters, digits, '-' and '_'
export const IconIdSchema = z.string().regex(/^[\w-]+$/, 'icon id may only contain letters, digits, "-" and "_"');

export const IconContributionSchema = z.object({
  description: z.string().optional(),
  default: z
    .object({
      // letters, digits, spaces, '-', '_', '.' and '/'
      fontPath: z
        .string()
        .regex(/^[\w ./-]+$/, 'fontPath may only contain letters, digits, spaces, "-", "_", "." and "/"')
        .optional(),
      // a CSS escape such as \EA01, or a single character other than a backslash, a quote or a control character
      fontCharacter: z.string().regex(
        // control characters are listed on purpose, to reject them
        // eslint-disable-next-line no-control-regex
        /^(?:\\[0-9a-fA-F]{1,6}|[^\\'"\u0000-\u001f\u007f])$/,
        'fontCharacter must be a CSS escape such as \\EA01 or a single character',
      ),
    })
    .optional(),
});

export const IconsContributionSchema = z.record(IconIdSchema, IconContributionSchema);

export type IconsContribution = z.output<typeof IconsContributionSchema>;
