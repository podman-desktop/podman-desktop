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

import { CatalogCategoryFilter } from './catalog-category-filter';
import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { CatalogInstallStatusFilter } from './catalog-install-status-filter';

vi.mock(import('search-string'), { spy: true });

beforeEach(() => {
  vi.resetAllMocks();
});

const extensions: CatalogExtensionInfoUI[] = [
  {
    id: 'cloud',
    displayName: 'Cloud tools',
    shortDescription: '',
    publisherDisplayName: 'Publisher',
    categories: ['Cloud', 'Extension Packs', 'cloud', '', '   '],
    keywords: [],
    isInstalled: true,
    isFeatured: false,
    fetchable: true,
    fetchLink: 'cloud-link',
    fetchVersion: '1.0.0',
  },
  {
    id: 'kubernetes',
    displayName: 'Kubernetes tools',
    shortDescription: '',
    publisherDisplayName: 'Publisher',
    categories: ['Kubernetes', 'Cloud'],
    keywords: [],
    isInstalled: false,
    isFeatured: false,
    fetchable: true,
    fetchLink: 'kubernetes-link',
    fetchVersion: '1.0.0',
  },
];

test('collects unique nonblank categories in alphabetical order with metadata labels', () => {
  expect(new CatalogCategoryFilter('', extensions).options).toEqual([
    { value: CatalogCategoryFilter.ALL_CATEGORIES, label: 'All categories' },
    { value: 'category:cloud', label: 'Cloud' },
    { value: 'category:extension packs', label: 'Extension Packs' },
    { value: 'category:kubernetes', label: 'Kubernetes' },
  ]);
});

test('offers All categories when catalog metadata is empty', () => {
  expect(new CatalogCategoryFilter('', []).options).toEqual([
    { value: CatalogCategoryFilter.ALL_CATEGORIES, label: 'All categories' },
  ]);
});

test('a category named All is distinct from the reset choice', () => {
  const catalog = [{ ...extensions[0], categories: ['All'] }];
  const filter = new CatalogCategoryFilter('', catalog);
  const selected = filter.withCategory('category:all');

  expect(selected).toBe('category:All');
  expect(new CatalogCategoryFilter(selected, catalog).value).toBe('category:all');
  expect(new CatalogCategoryFilter(selected, catalog).withCategory(CatalogCategoryFilter.ALL_CATEGORIES)).toBe('');
});

test('keeps an unknown typed category visible without catalog metadata', () => {
  const filter = new CatalogCategoryFilter('category:"Unknown Category"', []);
  expect(filter.value).toBe('category:unknown category');
  expect(filter.options).toContainEqual({ value: 'category:unknown category', label: 'unknown category' });
  expect(filter.withCategory(CatalogCategoryFilter.ALL_CATEGORIES)).toBe('');
});

test.each([
  ['', CatalogCategoryFilter.ALL_CATEGORIES],
  ['hello keyword:cloud is:installed', CatalogCategoryFilter.ALL_CATEGORIES],
  ['CATEGORY:Cloud', 'category:cloud'],
  ['category:"Extension Packs"', 'category:extension packs'],
  [`category:'Extension Packs'`, 'category:extension packs'],
  ['-category:Cloud', CatalogCategoryFilter.ALL_CATEGORIES],
  ['"category:Cloud"', CatalogCategoryFilter.ALL_CATEGORIES],
  ['category:""', CatalogCategoryFilter.ALL_CATEGORIES],
])('reflects typed query %s as %s', (query, expected) => {
  expect(new CatalogCategoryFilter(query, extensions).value).toBe(expected);
});

test.each([
  ['', 'category:cloud', 'category:Cloud'],
  ['mini', 'category:cloud', 'mini category:Cloud'],
  ['mini category:Cloud keyword:cli', 'category:kubernetes', 'mini category:Kubernetes keyword:cli'],
  ['mini category:Cloud keyword:cli', CatalogCategoryFilter.ALL_CATEGORIES, 'mini keyword:cli'],
  ['mini CATEGORY:"Cloud" is:installed', 'category:extension packs', 'mini category:"Extension Packs" is:installed'],
  [`mini category:'Extension Packs' not:installed`, 'category:cloud', 'mini category:Cloud not:installed'],
  ['mini category:Cloud', 'category:cloud', 'mini category:Cloud'],
  ['mini "category:Cloud"', 'category:cloud', 'mini "category:Cloud" category:Cloud'],
  ['mini -category:Cloud', 'category:cloud', 'mini -category:Cloud category:Cloud'],
  ['mini -', 'category:cloud', 'category:Cloud mini -'],
  ['mini category:""', CatalogCategoryFilter.ALL_CATEGORIES, 'mini'],
])('changes %s to category %s preserving common-case source order', (query, category, expected) => {
  const result = new CatalogCategoryFilter(query, extensions).withCategory(category);
  expect(result).toBe(expected);
  expect(new CatalogCategoryFilter(result, extensions).value).toBe(category);
});

test.each([CatalogCategoryFilter.ALL_CATEGORIES, 'category:cloud', 'category:extension packs'])(
  'preserves unrelated parsed content when selecting %s',
  category => {
    const query =
      `"hello world" category:Kubernetes,Cloud keyword:"" unknown:"a,b" ` +
      `is:featured,installed not:installed -category:Cloud "category:Cloud"`;
    const result = new CatalogCategoryFilter(query, extensions).withCategory(category);
    const parsed = SearchString.parse(result);
    expect(parsed.getConditionArray()).toEqual([
      { keyword: 'keyword', value: '', negated: false },
      { keyword: 'unknown', value: 'a,b', negated: false },
      { keyword: 'is', value: 'featured', negated: false },
      { keyword: 'is', value: 'installed', negated: false },
      { keyword: 'not', value: 'installed', negated: false },
      { keyword: 'category', value: 'Cloud', negated: true },
      ...(category !== CatalogCategoryFilter.ALL_CATEGORIES
        ? [{ keyword: 'category', value: category === 'category:cloud' ? 'Cloud' : 'Extension Packs', negated: false }]
        : []),
    ]);
    expect(parsed.getTextSegments()).toEqual([
      { text: 'hello world', negated: false },
      { text: 'category:Cloud', negated: false },
    ]);
    expect(new CatalogCategoryFilter(result, extensions).value).toBe(category);
  },
);

test.each([
  {
    query: `mini category:Clou\\d keyword:"developer's tools"`,
    conditions: [{ keyword: 'keyword', value: `developer's tools`, negated: false }],
  },
  { query: `"a 'b" c' category:Cloud`, conditions: [] },
  {
    query: `mini category:"say \\"hello\\"" unknown:"" constructor:value`,
    conditions: [
      { keyword: 'unknown', value: '', negated: false },
      { keyword: 'constructor', value: 'value', negated: false },
    ],
  },
  { query: 'mini category:Cloud,Cloud', conditions: [] },
])('changes and clears category without losing parser content in $query', ({ query, conditions }) => {
  const expected = SearchString.parse(query);
  for (const category of ['kubernetes', '']) {
    const value = category ? `category:${category}` : CatalogCategoryFilter.ALL_CATEGORIES;
    const result = new CatalogCategoryFilter(query, extensions).withCategory(value);
    const parsed = SearchString.parse(result);
    const selected = parsed.getConditionArray().filter(condition => condition.keyword === 'category');
    expect(selected).toEqual(category ? [{ keyword: 'category', value: 'Kubernetes', negated: false }] : []);
    expect(parsed.getConditionArray()).toEqual([
      ...conditions,
      ...(category ? [{ keyword: 'category', value: 'Kubernetes', negated: false }] : []),
    ]);
    expect(parsed.getTextSegments()).toEqual(expected.getTextSegments());
    expect(new CatalogCategoryFilter(result, extensions).value).toBe(value);
  }
});

test.each([`Developer's Tools`, 'Cloud "Native"', 'Cloud, Native'])(
  'selects metadata category %s without changing its parsed value',
  label => {
    const catalog = [{ ...extensions[0], categories: [label] }];
    const query = 'mini keyword:""';
    const result = new CatalogCategoryFilter(query, catalog).withCategory(`category:${label.toLowerCase()}`);
    expect(SearchString.parse(result).getConditionArray()).toEqual([
      { keyword: 'keyword', value: '', negated: false },
      { keyword: 'category', value: label, negated: false },
    ]);
    expect(new CatalogCategoryFilter(result, catalog).withCategory(CatalogCategoryFilter.ALL_CATEGORIES)).toBe(query);
  },
);

test('leaves the query unchanged if a metadata category cannot round-trip through the parser', () => {
  const catalog = [{ ...extensions[0], categories: ['Cloud\\Native'] }];
  const query = 'mini keyword:""';
  expect(new CatalogCategoryFilter(query, catalog).withCategory('category:cloud\\native')).toBe(query);
});

test.each(['installed', 'not-installed'])('works with the %s dropdown in both directions', status => {
  const query = `mini keyword:cloud`;
  const withCategory = new CatalogCategoryFilter(query, extensions).withCategory('category:extension packs');
  const withStatus = new CatalogInstallStatusFilter(withCategory).withStatus(status);
  expect(new CatalogCategoryFilter(withStatus, extensions).value).toBe('category:extension packs');
  const changed = new CatalogCategoryFilter(withStatus, extensions).withCategory('category:cloud');
  expect(new CatalogInstallStatusFilter(changed).value).toBe(status);
  expect(new CatalogCategoryFilter(changed, extensions).withCategory(CatalogCategoryFilter.ALL_CATEGORIES)).toBe(
    new CatalogInstallStatusFilter(query).withStatus(status),
  );
});

test('refuses an unverified edit', async () => {
  const query = 'mini category:Cloud,Other';
  const { default: actualSearchString } = await vi.importActual<{ default: typeof SearchString }>('search-string');
  const parse = actualSearchString.parse;
  vi.mocked(SearchString.parse).mockImplementation(candidate => parse(candidate === query ? query : 'different text'));
  expect(new CatalogCategoryFilter(query, extensions).withCategory('category:kubernetes')).toBe(query);
});

test('ignores unsupported dropdown values', () => {
  expect(new CatalogCategoryFilter('mini category:Cloud', extensions).withCategory('not-an-option')).toBe(
    'mini category:Cloud',
  );
});
