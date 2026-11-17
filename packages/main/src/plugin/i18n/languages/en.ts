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

import type { LanguageDefinition } from '/@/plugin/i18n/language-definition.js';

export default {
  id: 'en',
  label: 'English',
  // Configuration keys use stable IDs; navigation keys localize display text only.
  translations: {
    'preferences.appearance.description':
      'Select light, dark, high-contrast light, high-contrast dark, or use your system setting.',
    'preferences.language.description': 'Select the display language, or use your system setting.',
  },
} satisfies LanguageDefinition;
