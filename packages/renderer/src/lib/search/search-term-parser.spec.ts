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

import { describe, expect, test } from 'vitest';

import { SearchTermParser } from './search-term-parser';

describe('SearchTermParser', () => {
  const FILTERS = ['category', 'keyword', 'is', 'not'] as const;
  type Filter = (typeof FILTERS)[number];

  test.each<{
    input: string;
    terms: string[];
    filters?: Record<string, string[]>;
  }>([
    {
      input: 'foo bar baz',
      terms: ['foo', 'bar', 'baz'],
    },
    {
      input: '',
      terms: [],
    },
    {
      input: '   ',
      terms: [],
    },
    {
      input: 'podman',
      terms: ['podman'],
    },
    {
      input: '"multi word search"',
      terms: ['multi word search'],
    },
    {
      input: 'category:containers keyword:docker',
      terms: [],
      filters: { category: ['containers'], keyword: ['docker'] },
    },
    {
      input: 'category:"Extension Packs"',
      terms: [],
      filters: { category: ['extension packs'] },
    },
    {
      input: 'category:"Extension Packs" keyword:"Vulnerability Scanner"',
      terms: [],
      filters: { category: ['extension packs'], keyword: ['vulnerability scanner'] },
    },
    {
      input: 'foo category:"Extension Packs" bar keyword:simple',
      terms: ['foo', 'bar'],
      filters: { category: ['extension packs'], keyword: ['simple'] },
    },
    {
      input: 'category:"Extension Packs" is:installed',
      terms: [],
      filters: { category: ['extension packs'], is: ['installed'] },
    },
    {
      input: 'category:""',
      terms: [],
      filters: { category: [''] },
    },
    {
      input: 'unknown:value category:test',
      terms: ['unknown:value'],
      filters: { category: ['test'] },
    },
    {
      input: 'category:a category:b',
      terms: [],
      filters: { category: ['a', 'b'] },
    },
    {
      input: 'FOO category:Containers keyword:"My Key"',
      terms: ['FOO'],
      filters: { category: ['containers'], keyword: ['my key'] },
    },
    {
      input: `category:'Extension Packs'`,
      terms: [],
      filters: { category: ['extension packs'] },
    },
    {
      input: `foo category:'My Category' bar`,
      terms: ['foo', 'bar'],
      filters: { category: ['my category'] },
    },
  ])('parses "$input"', ({ input, terms, filters = {} }) => {
    const parsed = new SearchTermParser(input, FILTERS);
    expect(parsed.terms).toEqual(terms);
    for (const [name, values] of Object.entries(filters)) {
      expect(parsed.getFilter(name as Filter)).toEqual(values);
    }
  });

  test('initializes all allowed filters even when unused', () => {
    const parsed = new SearchTermParser('foo', FILTERS);
    for (const filter of FILTERS) {
      expect(parsed.getFilter(filter)).toEqual([]);
    }
  });
});
