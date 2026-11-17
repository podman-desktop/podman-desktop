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

import { getLanguages } from './language-registry.js';

test('Expect en and ja languages to be collected automatically from ./languages', async () => {
  const languages = getLanguages();
  const byId = new Map(languages.map(language => [language.id, language]));

  expect(byId.get('en')?.label).toBe('English');
  expect(byId.get('ja')?.label).toBe('日本語');
});

test('Expect language ids to be unique', async () => {
  const ids = getLanguages().map(language => language.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test('Expect every language to have a non-empty label and translations', async () => {
  for (const language of getLanguages()) {
    expect(language.label, `language ${language.id} should have a non-empty label`).not.toBe('');
    expect(language.translations, `language ${language.id} should define translations`).toBeDefined();
  }
});

test('Expect languages to be sorted by id ascending', async () => {
  const ids = getLanguages().map(language => language.id);
  expect(ids).toStrictEqual([...ids].toSorted((a, b) => a.localeCompare(b)));
});

test('Expect Japanese screen dictionaries to be delivered as a single language', () => {
  const japanese = getLanguages().find(language => language.id === 'ja');

  expect(japanese?.translations).toMatchObject({
    'navigation.Containers': 'コンテナー',
    'settings.save': '保存',
    'management.logs': 'ログ',
    'kubernetes.resources.summary': '概要',
    'table.column.Name': '名前',
  });
  for (const [key, value] of Object.entries(japanese?.translations ?? {})) {
    expect(value.trim(), `Japanese translation ${key} must not be empty`).not.toBe('');
  }
});
