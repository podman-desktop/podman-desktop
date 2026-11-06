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

import SearchString from 'search-string';
import { expect, test } from 'vitest';

import { CatalogInstallStatusFilter } from './catalog-install-status-filter';

test.each([
  ['', 'all'],
  ['hello category:Cloud is:featured', 'all'],
  ['is:installed', 'installed'],
  ['not:installed', 'not-installed'],
  ['IS:"Installed"', 'installed'],
  ['NOT:INSTALLED', 'not-installed'],
  ['is:featured,installed', 'installed'],
  ['not:installed is:installed', 'installed'],
  ['-is:installed', 'all'],
  ['"is:installed"', 'all'],
])('reflects %s as %s', (searchTerm, expected) => {
  expect(new CatalogInstallStatusFilter(searchTerm).value).toBe(expected);
});

test.each(CatalogInstallStatusFilter.OPTIONS)('selects $label and preserves unrelated search content', option => {
  const searchTerm =
    `"hello world" category:"Extension Packs" keyword:cloud is:featured,installed ` +
    `not:installed IS:INSTALLED is:installed -is:installed unknown:"a,b" keyword:"" "is:installed"`;
  const result = new CatalogInstallStatusFilter(searchTerm).withStatus(option.value);
  expect(new CatalogInstallStatusFilter(result).value).toBe(option.value);

  const parsed = SearchString.parse(result);
  const installed = parsed
    .getConditionArray()
    .filter(
      condition =>
        !condition.negated &&
        ['is', 'not'].includes(condition.keyword.toLowerCase()) &&
        condition.value.toLowerCase() === 'installed',
    );
  expect(installed).toEqual(option.keyword ? [{ keyword: option.keyword, value: 'installed', negated: false }] : []);
  expect(parsed.getConditionArray().filter(condition => !installed.includes(condition))).toEqual([
    { keyword: 'category', value: 'Extension Packs', negated: false },
    { keyword: 'keyword', value: 'cloud', negated: false },
    { keyword: 'is', value: 'featured', negated: false },
    { keyword: 'is', value: 'installed', negated: true },
    { keyword: 'unknown', value: 'a,b', negated: false },
    { keyword: 'keyword', value: '', negated: false },
  ]);
  expect(parsed.getTextSegments()).toEqual([
    { text: 'hello world', negated: false },
    { text: 'is:installed', negated: false },
  ]);
});

test.each([
  `"developer's tools" keyword:"developer's tools"`,
  '"say \\"hello\\"" category:"Cloud Native"',
  'foo -bar constructor:value',
])('preserves parsed search content in %s', searchTerm => {
  const result = new CatalogInstallStatusFilter(searchTerm).withStatus('all');
  expect(SearchString.parse(result).getConditionArray()).toEqual(SearchString.parse(searchTerm).getConditionArray());
  expect(SearchString.parse(result).getTextSegments()).toEqual(SearchString.parse(searchTerm).getTextSegments());
});

test('ignores unsupported status values', () => {
  const searchTerm = 'hello is:installed';
  expect(new CatalogInstallStatusFilter(searchTerm).withStatus('unsupported')).toBe(searchTerm);
});
