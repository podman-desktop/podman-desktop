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
import { beforeEach, expect, test, vi } from 'vitest';

import { CatalogInstallStatusFilter } from './catalog-install-status-filter';

vi.mock(import('search-string'), { spy: true });

beforeEach(() => {
  vi.resetAllMocks();
});

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
  if (option.value === 'installed') {
    expect(result).toBe(searchTerm);
    return;
  }

  const parsed = SearchString.parse(result);
  expect(parsed.getConditionArray()).toEqual([
    { keyword: 'category', value: 'Extension Packs', negated: false },
    { keyword: 'keyword', value: 'cloud', negated: false },
    { keyword: 'is', value: 'featured', negated: false },
    { keyword: 'is', value: 'installed', negated: true },
    { keyword: 'unknown', value: 'a,b', negated: false },
    { keyword: 'keyword', value: '', negated: false },
    ...(option.keyword ? [{ keyword: option.keyword, value: 'installed', negated: false }] : []),
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
  expect(result).toBe(searchTerm);
  expect(SearchString.parse(result).getConditionArray()).toEqual(SearchString.parse(searchTerm).getConditionArray());
  expect(SearchString.parse(result).getTextSegments()).toEqual(SearchString.parse(searchTerm).getTextSegments());
});

test.each([
  ['mini category:Cloud', 'installed', 'mini category:Cloud is:installed'],
  ['mini category:Cloud', 'all', 'mini category:Cloud'],
  ['mini category:Cloud is:installed', 'all', 'mini category:Cloud'],
  ['mini is:installed category:Cloud', 'not-installed', 'mini not:installed category:Cloud'],
  ['mini not:installed category:Cloud', 'all', 'mini category:Cloud'],
  ['is:installed mini category:Cloud', 'not-installed', 'not:installed mini category:Cloud'],
  ['mini  category:"Cloud Native"', 'installed', 'mini  category:"Cloud Native" is:installed'],
  ['  mini  category:Cloud ', 'installed', '  mini  category:Cloud is:installed'],
  ['"is:installed" category:Cloud', 'installed', '"is:installed" category:Cloud is:installed'],
  ['category:"is:installed" mini', 'installed', 'category:"is:installed" mini is:installed'],
  ['mini IS:"Installed" category:Cloud', 'not-installed', 'mini not:installed category:Cloud'],
  ['mini is:featured,installed category:Cloud', 'all', 'mini is:featured category:Cloud'],
  ['mini is:installed not:installed is:installed category:Cloud', 'all', 'mini category:Cloud'],
  ['mini -is:installed category:Cloud', 'installed', 'mini -is:installed category:Cloud is:installed'],
  ['mini "unclosed category:Cloud', 'installed', 'mini "unclosed category:Cloud is:installed'],
  ['mini category:"say \\"is:installed\\"" is:installed', 'all', 'mini category:"say \\"is:installed\\""'],
  ['mini is:installed,installed category:Cloud', 'all', 'mini category:Cloud'],
  [`world" developer's world" developer's not:installed`, 'all', `world" developer's world" developer's not:installed`],
])('updates %s to %s without rewriting unrelated source', (searchTerm, status, expected) => {
  expect(new CatalogInstallStatusFilter(searchTerm).withStatus(status)).toBe(expected);
});

test.each([
  ['mini is:installed,featured category:Cloud', 'not-installed', 'mini is:featured category:Cloud not:installed'],
  ['mini not:installed,featured category:Cloud', 'installed', 'mini not:featured category:Cloud is:installed'],
  [':is:installed,featured', 'all', 'is:featured'],
  ['mini is:instal\\led category:Cloud', 'not-installed', 'mini category:Cloud not:installed'],
])('normalizes %s only when an in-place edit cannot be verified', (searchTerm, status, expected) => {
  const result = new CatalogInstallStatusFilter(searchTerm).withStatus(status);
  expect(result).toBe(expected);
  expect(new CatalogInstallStatusFilter(result).value).toBe(status);
});

test.each(['mini is:installed category:Cloud', 'category:Cloud is:installed mini', 'not:installed is:installed'])(
  'leaves an already selected status unchanged in %s',
  searchTerm => {
    expect(new CatalogInstallStatusFilter(searchTerm).withStatus('installed')).toBe(searchTerm);
  },
);

test('refuses a normalization that the parser cannot verify', async () => {
  const searchTerm = 'mini is:installed,featured';
  const { default: actualSearchString } = await vi.importActual<{ default: typeof SearchString }>('search-string');
  const parse = actualSearchString.parse;
  vi.mocked(SearchString.parse).mockImplementation(query => parse(query === searchTerm ? query : 'different text'));

  expect(new CatalogInstallStatusFilter(searchTerm).withStatus('not-installed')).toBe(searchTerm);
});

test.each([
  {
    searchTerm: 'is:installed__catalog_statu\\s__ category:Cloud is:installed',
    conditions: [
      { keyword: 'is', value: 'installed__catalog_status__', negated: false },
      { keyword: 'category', value: 'Cloud', negated: false },
    ],
    terms: [],
  },
  {
    searchTerm: ':is:installed,featured',
    conditions: [{ keyword: 'is', value: 'featured', negated: false }],
    terms: [],
  },
  {
    searchTerm: `'"' is:installed,featured"`,
    conditions: [{ keyword: 'is', value: 'featured', negated: false }],
    terms: [{ text: '"', negated: false }],
  },
])('preserves unrelated parser content for every status in $searchTerm', ({ searchTerm, conditions, terms }) => {
  for (const option of CatalogInstallStatusFilter.OPTIONS) {
    const result = new CatalogInstallStatusFilter(searchTerm).withStatus(option.value);
    const parsed = SearchString.parse(result);
    const expected = [
      ...conditions,
      ...(option.keyword ? [{ keyword: option.keyword, value: 'installed', negated: false }] : []),
    ];

    expect(parsed.getConditionArray()).toHaveLength(expected.length);
    expect(parsed.getConditionArray()).toEqual(expect.arrayContaining(expected));
    expect(parsed.getTextSegments()).toEqual(terms);
    expect(new CatalogInstallStatusFilter(result).value).toBe(option.value);
    expect(new CatalogInstallStatusFilter(result).withStatus(option.value)).toBe(result);
  }
});

test('selecting and clearing a status leaves the original search text in order', () => {
  const searchTerm = `mini  category:'Cloud Native' keyword:"" "is:installed"`;
  const installed = new CatalogInstallStatusFilter(searchTerm).withStatus('installed');
  expect(installed).toBe(`${searchTerm} is:installed`);
  expect(new CatalogInstallStatusFilter(installed).withStatus('all')).toBe(searchTerm);
});

test.each(CatalogInstallStatusFilter.OPTIONS)('preserves full-query quote context when selecting $label', option => {
  const text = `"a 'b" c' not:installed`;
  const searchTerm = `is:installed ${text}`;
  const result = new CatalogInstallStatusFilter(searchTerm).withStatus(option.value);

  expect(result).toBe(option.keyword ? `${option.keyword}:installed ${text}` : text);
  expect(new CatalogInstallStatusFilter(result).value).toBe(option.value);
  expect(SearchString.parse(result).getTextSegments()).toEqual(SearchString.parse(searchTerm).getTextSegments());
});

test.each([
  [`developer's world" tools' keyword:"" not:installed`, `developer's world" tools' keyword:""`],
  [
    `tools' world" developer's category:"Cloud Native" not:installed`,
    `tools' world" developer's category:"Cloud Native"`,
  ],
])('removes only the status when quoted fragments interact in %s', (searchTerm, expected) => {
  expect(new CatalogInstallStatusFilter(searchTerm).withStatus('all')).toBe(expected);
});

test.each([
  ['installed', 'is:installed'],
  ['not-installed', 'not:installed'],
])('activates %s after an unfinished negation without rewriting the original search', (status, token) => {
  const searchTerm = 'mini -';
  const result = new CatalogInstallStatusFilter(searchTerm).withStatus(status);

  expect(result).toBe(`${token} ${searchTerm}`);
  expect(new CatalogInstallStatusFilter(result).value).toBe(status);
  expect(new CatalogInstallStatusFilter(result).withStatus('all')).toBe(searchTerm);
  expect(SearchString.parse(result).getTextSegments()).toEqual(SearchString.parse(searchTerm).getTextSegments());
});

test('ignores unsupported status values', () => {
  const searchTerm = 'hello is:installed';
  expect(new CatalogInstallStatusFilter(searchTerm).withStatus('unsupported')).toBe(searchTerm);
});
