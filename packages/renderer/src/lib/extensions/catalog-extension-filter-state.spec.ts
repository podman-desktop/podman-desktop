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

import { SearchTermParser } from '/@/lib/search/search-term-parser';

import { CatalogExtensionFilterState } from './catalog-extension-filter-state';
import { ExtensionsUtils } from './extensions-utils';

function parse(searchTerm: string): SearchTermParser<(typeof ExtensionsUtils.CATALOG_FILTERS)[number]> {
  return new SearchTermParser(searchTerm, ExtensionsUtils.CATALOG_FILTERS);
}

test.each([
  { searchTerm: '', expected: 'all' },
  { searchTerm: 'is:installed', expected: 'installed' },
  { searchTerm: 'not:installed', expected: 'not-installed' },
  { searchTerm: 'not:installed is:installed', expected: 'installed' },
])('gets install status $expected from "$searchTerm"', ({ searchTerm, expected }) => {
  expect(new CatalogExtensionFilterState(searchTerm).installStatus).toBe(expected);
});

test.each([
  { status: 'installed', expectedIs: ['featured', 'installed'], expectedNot: [] },
  { status: 'not-installed', expectedIs: ['featured'], expectedNot: ['installed'] },
  { status: 'all', expectedIs: ['featured'], expectedNot: [] },
])('sets install status $status while preserving other filters', ({ status, expectedIs, expectedNot }) => {
  const state = new CatalogExtensionFilterState('kube not:installed is:featured');

  const parsed = parse(state.withInstallStatus(status));

  expect(parsed.terms).toEqual(['kube']);
  expect(parsed.getFilter('is')).toEqual(expectedIs);
  expect(parsed.getFilter('not')).toEqual(expectedNot);
});

test('ignores an unknown install status', () => {
  const state = new CatalogExtensionFilterState('kube is:installed');

  expect(state.withInstallStatus('unknown')).toBe('kube is:installed');
});

test('removes only the install value from a grouped filter token', () => {
  const state = new CatalogExtensionFilterState('is:installed,featured');

  expect(parse(state.withInstallStatus('all')).getFilter('is')).toEqual(['featured']);
});

test('gets a category using the casing supplied by the caller', () => {
  const state = new CatalogExtensionFilterState('category:kubernetes', ['Cloud', 'Kubernetes']);

  expect(state.category).toBe('Kubernetes');
  expect(state.categoryOptions).toEqual([
    { value: '', label: 'All categories' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'Kubernetes', label: 'Kubernetes' },
  ]);
});

test('sets a quoted category while preserving other filters', () => {
  const state = new CatalogExtensionFilterState('"kube extension" category:Cloud keyword:provider');

  const searchTerm = state.withCategory('Extension Packs');
  const parsed = parse(searchTerm);

  expect(searchTerm).toContain('category:"Extension Packs"');
  expect(parsed.terms).toEqual(['kube extension']);
  expect(parsed.getFilter('category')).toEqual(['extension packs']);
  expect(parsed.getFilter('keyword')).toEqual(['provider']);
});

test('removes every category token', () => {
  const state = new CatalogExtensionFilterState('kube category:Cloud category:Kubernetes');

  const parsed = parse(state.withCategory(''));

  expect(parsed.terms).toEqual(['kube']);
  expect(parsed.getFilter('category')).toEqual([]);
});

test.each([
  { searchTerm: '', expected: false },
  { searchTerm: 'not:featured', expected: false },
  { searchTerm: 'is:featured', expected: true },
])('gets Featured as $expected from "$searchTerm"', ({ searchTerm, expected }) => {
  expect(new CatalogExtensionFilterState(searchTerm).featured).toBe(expected);
});

test('sets Featured while preserving other filters', () => {
  const state = new CatalogExtensionFilterState('kube not:featured is:installed');

  const parsed = parse(state.withFeatured(true));

  expect(parsed.terms).toEqual(['kube']);
  expect(parsed.getFilter('is')).toEqual(['installed', 'featured']);
  expect(parsed.getFilter('not')).toEqual([]);
});

test('removes every Featured token', () => {
  const state = new CatalogExtensionFilterState('kube is:featured not:featured is:installed');

  const parsed = parse(state.withFeatured(false));

  expect(parsed.terms).toEqual(['kube']);
  expect(parsed.getFilter('is')).toEqual(['installed']);
  expect(parsed.getFilter('not')).toEqual([]);
});

test('removes only Featured from a grouped filter token', () => {
  const state = new CatalogExtensionFilterState('is:installed,featured');

  expect(parse(state.withFeatured(false)).getFilter('is')).toEqual(['installed']);
});

test('preserves a quoted text term that resembles a filter token', () => {
  const state = new CatalogExtensionFilterState('"is:featured" is:featured');

  expect(state.withFeatured(false)).toBe('"is:featured"');
});

test('preserves an unmatched quote while updating filters', () => {
  const state = new CatalogExtensionFilterState('"unterminated is:installed');

  expect(state.withInstallStatus('all')).toBe('"unterminated');
});

test('quotes and escapes a category containing double quotes', () => {
  const state = new CatalogExtensionFilterState('');

  expect(parse(state.withCategory('A "quoted" tool')).getFilter('category')).toEqual(['a "quoted" tool']);
});

test.each([
  { searchTerm: '', expected: false },
  { searchTerm: '   ', expected: false },
  { searchTerm: 'kube', expected: true },
  { searchTerm: 'is:installed', expected: true },
])('reports active filters as $expected for "$searchTerm"', ({ searchTerm, expected }) => {
  expect(new CatalogExtensionFilterState(searchTerm).hasActiveFilters).toBe(expected);
});
