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

import { AppearanceSettings } from '@desktop-framework/api/appearance';

import type { LanguageDefinition } from './language-definition.js';

/**
 * Resolves which language definition is active for a preference value.
 * - an explicit language id (e.g. 'ja') wins when such a language is registered
 * - 'system' (unset or unknown values behave the same) resolves through the
 *   primary subtag of the OS locale ('ja-JP' → 'ja')
 * - final fallback is the first collected language (ids are sorted, so 'en')
 */
export function resolveActiveLanguage(
  preferred: string | undefined,
  osLocale: string,
  languages: readonly LanguageDefinition[],
): LanguageDefinition | undefined {
  if (languages.length === 0) {
    return undefined;
  }
  const byId = new Map(languages.map(language => [language.id, language]));

  if (preferred && preferred !== AppearanceSettings.SystemEnumValue) {
    const explicit = byId.get(preferred);
    if (explicit) {
      return explicit;
    }
  }

  // OS locales like 'ja-JP' or 'en-US' are matched on their primary subtag
  const primarySubtag = osLocale.toLowerCase().split('-')[0] ?? '';
  const fromOs = byId.get(primarySubtag);
  if (fromOs) {
    return fromOs;
  }

  return languages[0];
}
