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

import { expect, test } from 'vitest';

import type { LanguageDefinition } from './language-definition.js';
import { resolveActiveLanguage } from './language-resolution.js';

const en: LanguageDefinition = { id: 'en', label: 'English', translations: {} };
const ja: LanguageDefinition = { id: 'ja', label: '日本語', translations: {} };
const languages: readonly LanguageDefinition[] = [en, ja];

test('an explicit registered language id wins', async () => {
  expect(resolveActiveLanguage('ja', 'en', languages)).toBe(ja);
});

test('system resolves through the OS locale primary subtag', async () => {
  expect(resolveActiveLanguage('system', 'ja-JP', languages)).toBe(ja);
});

test('an unset preference behaves like system', async () => {
  expect(resolveActiveLanguage(undefined, 'en-US', languages)).toBe(en);
});

test('an unknown language id falls back to the OS locale', async () => {
  expect(resolveActiveLanguage('xx', 'ja', languages)).toBe(ja);
});

test('an unknown OS locale falls back to the first collected language', async () => {
  expect(resolveActiveLanguage('system', 'fr-FR', languages)).toBe(en);
});

test('no registered languages returns undefined', async () => {
  expect(resolveActiveLanguage('en', 'en', [])).toBeUndefined();
});
