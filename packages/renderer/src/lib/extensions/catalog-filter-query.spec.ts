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

import SearchString, { type Condition } from 'search-string';
import { beforeEach, expect, test, vi } from 'vitest';

import { CatalogFilterQuery } from './catalog-filter-query';

vi.mock(import('search-string'), { spy: true });

const labelPattern = /(?<=^| )label:alpha(?= |$)/g;

function isAlphaLabel({ keyword, value, negated }: Condition): boolean {
  return keyword === 'label' && value === 'alpha' && !negated;
}

beforeEach(() => {
  vi.resetAllMocks();
});

test.each([
  ['label:alpha mini keyword:cloud', 'label:beta mini keyword:cloud'],
  ['mini label:alpha keyword:cloud', 'mini label:beta keyword:cloud'],
  ['mini keyword:cloud label:alpha', 'mini keyword:cloud label:beta'],
  ['"keep label:alpha here" label:alpha mini', '"keep label:alpha here" label:beta mini'],
  ['mini label:alpha label:alpha keyword:cloud', 'mini keyword:cloud label:beta'],
])('replaces matching conditions without rewriting unrelated source in %s', (searchTerm, expected) => {
  expect(
    new CatalogFilterQuery(searchTerm).replace(isAlphaLabel, labelPattern, { keyword: 'label', value: 'beta' }),
  ).toBe(expected);
});

test.each([
  ['', 'label:alpha'],
  ['mini  keyword:cloud', 'mini  keyword:cloud label:alpha'],
  ['  mini  keyword:cloud ', '  mini  keyword:cloud label:alpha'],
  ['"label:alpha" keyword:cloud', '"label:alpha" keyword:cloud label:alpha'],
  ['unknown:"label:alpha" mini', 'unknown:"label:alpha" mini label:alpha'],
  ['mini -label:alpha', 'mini -label:alpha label:alpha'],
  ['mini -', 'label:alpha mini -'],
])('adds an effective condition while preserving full-query context in %s', (searchTerm, expected) => {
  const result = new CatalogFilterQuery(searchTerm).replace(isAlphaLabel, labelPattern, {
    keyword: 'label',
    value: 'alpha',
  });

  expect(result).toBe(expected);
  expect(SearchString.parse(result).getConditionArray()).toContainEqual({
    keyword: 'label',
    value: 'alpha',
    negated: false,
  });
  expect(SearchString.parse(result).getTextSegments()).toEqual(SearchString.parse(searchTerm).getTextSegments());
});

test.each([
  ['label:alpha', ''],
  ['label:alpha mini keyword:cloud', 'mini keyword:cloud'],
  ['mini label:alpha keyword:cloud', 'mini keyword:cloud'],
  ['mini keyword:cloud label:alpha', 'mini keyword:cloud'],
  ['mini label:alpha label:alpha keyword:cloud', 'mini keyword:cloud'],
  ['mini label:other,alpha keyword:cloud', 'mini label:other keyword:cloud'],
  ['mini -label:alpha "label:alpha"', 'mini -label:alpha "label:alpha"'],
])('removes only matching conditions in %s', (searchTerm, expected) => {
  expect(new CatalogFilterQuery(searchTerm).replace(isAlphaLabel, labelPattern)).toBe(expected);
});

test.each([
  ['mini label:alpha,other keyword:cloud', 'mini label:other keyword:cloud label:beta'],
  ['mini label:al\\pha keyword:cloud', 'mini keyword:cloud label:beta'],
])('normalizes %s when raw edits cannot express the intended change', (searchTerm, expected) => {
  expect(
    new CatalogFilterQuery(searchTerm).replace(isAlphaLabel, labelPattern, { keyword: 'label', value: 'beta' }),
  ).toBe(expected);
});

test('preserves quoted text, empty values, negation and unknown keywords during normalization', () => {
  const searchTerm =
    `"hello world" -"excluded phrase" unknown:"a,b" keyword:"" -label:alpha label:alpha,other ` +
    `-unknown:"" "label:alpha"`;
  const result = new CatalogFilterQuery(searchTerm).replace(isAlphaLabel, labelPattern, {
    keyword: 'label',
    value: 'beta',
  });
  const parsed = SearchString.parse(result);

  expect(parsed.getTextSegments()).toEqual(SearchString.parse(searchTerm).getTextSegments());
  expect(parsed.getConditionArray()).toEqual([
    { keyword: 'unknown', value: 'a,b', negated: false },
    { keyword: 'keyword', value: '', negated: false },
    { keyword: 'label', value: 'alpha', negated: true },
    { keyword: 'label', value: 'other', negated: false },
    { keyword: 'unknown', value: '', negated: true },
    { keyword: 'label', value: 'beta', negated: false },
  ]);
});

test.each([
  ['beta', 'label:beta'],
  ['', 'label:""'],
  ['two words', 'label:"two words"'],
  ['a,b', 'label:"a,b"'],
  ['a:b', 'label:"a:b"'],
  ['-excluded', 'label:"-excluded"'],
  [`developer's tools`, `label:"developer's tools"`],
  ['say "hello"', 'label:"say \\"hello\\""'],
])('quotes replacement value %s so it parses as a single condition', (value, expected) => {
  const result = new CatalogFilterQuery('label:alpha').replace(isAlphaLabel, labelPattern, {
    keyword: 'label',
    value,
  });

  expect(result).toBe(expected);
  expect(SearchString.parse(result).getConditionArray()).toEqual([{ keyword: 'label', value, negated: false }]);
});

test('refuses a replacement value that does not survive parsing', () => {
  const searchTerm = 'mini label:alpha';

  expect(
    new CatalogFilterQuery(searchTerm).replace(isAlphaLabel, labelPattern, { keyword: 'label', value: 'be\\ta' }),
  ).toBe(searchTerm);
});

test('refuses edits when no candidate preserves the full parsed query', async () => {
  const searchTerm = 'mini label:alpha,other';
  const { default: actualSearchString } = await vi.importActual<{ default: typeof SearchString }>('search-string');
  const parse = actualSearchString.parse;
  vi.mocked(SearchString.parse).mockImplementation(query => parse(query === searchTerm ? query : 'different text'));

  const result = new CatalogFilterQuery(searchTerm).replace(isAlphaLabel, labelPattern, {
    keyword: 'label',
    value: 'beta',
  });
  expect(result).toBe(searchTerm);
});
