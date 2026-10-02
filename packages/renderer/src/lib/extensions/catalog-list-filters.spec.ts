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

import { beforeEach, describe, expect, test } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  applyCatalogListFilters,
  getCatalogListFilters,
  getCatalogSearchTerm,
  hasActiveCatalogListFilters,
  resetCatalogListFilters,
  setCatalogCategoryFilter,
  setCatalogInstalledFilter,
  setCatalogSearchTerm,
  toggleCatalogBooleanFilter,
} from './catalog-list-filters.svelte';

function createExtension(overrides: Partial<CatalogExtensionInfoUI> = {}): CatalogExtensionInfoUI {
  return {
    id: 'id',
    displayName: 'Display name',
    isFeatured: false,
    fetchable: true,
    fetchLink: 'oci://link',
    fetchVersion: '1.0.0',
    publisherDisplayName: 'Publisher',
    isInstalled: false,
    shortDescription: 'A short description',
    categories: [],
    keywords: [],
    ...overrides,
  };
}

beforeEach(() => {
  resetCatalogListFilters();
});

describe('reducers', () => {
  test('setCatalogInstalledFilter sets and clears the install status', () => {
    setCatalogInstalledFilter(true);
    expect(getCatalogListFilters().installed).toBe(true);

    setCatalogInstalledFilter(false);
    expect(getCatalogListFilters().installed).toBe(false);

    setCatalogInstalledFilter(undefined);
    expect(getCatalogListFilters().installed).toBeUndefined();
  });

  test('setCatalogCategoryFilter sets and clears the category', () => {
    setCatalogCategoryFilter('Kubernetes');
    expect(getCatalogListFilters().category).toBe('Kubernetes');

    setCatalogCategoryFilter(undefined);
    expect(getCatalogListFilters().category).toBeUndefined();

    setCatalogCategoryFilter('Kubernetes');
    setCatalogCategoryFilter('');
    expect(getCatalogListFilters().category).toBeUndefined();
  });

  test('toggleCatalogBooleanFilter toggles featured', () => {
    toggleCatalogBooleanFilter('featured');
    expect(getCatalogListFilters().featured).toBe(true);

    toggleCatalogBooleanFilter('featured');
    expect(getCatalogListFilters().featured).toBeUndefined();
  });

  test('setCatalogSearchTerm sets and reads the search term', () => {
    expect(getCatalogSearchTerm()).toBe('');
    setCatalogSearchTerm('kube');
    expect(getCatalogSearchTerm()).toBe('kube');
  });

  test('resetCatalogListFilters clears everything', () => {
    setCatalogInstalledFilter(true);
    toggleCatalogBooleanFilter('featured');
    setCatalogCategoryFilter('Kubernetes');
    setCatalogSearchTerm('kube');

    resetCatalogListFilters();
    expect(getCatalogListFilters()).toEqual({});
    expect(getCatalogSearchTerm()).toBe('');
  });

  test('hasActiveCatalogListFilters reflects active state', () => {
    expect(hasActiveCatalogListFilters()).toBe(false);
    setCatalogInstalledFilter(false);
    expect(hasActiveCatalogListFilters()).toBe(true);
    resetCatalogListFilters();
    expect(hasActiveCatalogListFilters()).toBe(false);
    toggleCatalogBooleanFilter('featured');
    expect(hasActiveCatalogListFilters()).toBe(true);
  });
});

describe('applyCatalogListFilters selector', () => {
  const installed = createExtension({ id: 'installed', displayName: 'Installed one', isInstalled: true });
  const notInstalled = createExtension({ id: 'not-installed', displayName: 'Available one', isInstalled: false });
  const featured = createExtension({ id: 'featured', displayName: 'Featured one', isFeatured: true });
  const kubernetes = createExtension({ id: 'k8s', displayName: 'Kube one', categories: ['Kubernetes'] });
  const all = [installed, notInstalled, featured, kubernetes];

  test('no filters returns everything', () => {
    expect(applyCatalogListFilters(all, {})).toEqual(all);
  });

  test('search matches display name, description and publisher (case-insensitive)', () => {
    expect(applyCatalogListFilters(all, {}, 'KUBE')).toEqual([kubernetes]);
    expect(applyCatalogListFilters([createExtension({ publisherDisplayName: 'Red Hat' })], {}, 'red hat')).toHaveLength(
      1,
    );
  });

  test('install status filter', () => {
    expect(applyCatalogListFilters(all, { installed: true })).toEqual([installed]);
    expect(applyCatalogListFilters(all, { installed: false })).toEqual([notInstalled, featured, kubernetes]);
  });

  test('featured filter', () => {
    expect(applyCatalogListFilters(all, { featured: true })).toEqual([featured]);
  });

  test('category filter', () => {
    expect(applyCatalogListFilters(all, { category: 'Kubernetes' })).toEqual([kubernetes]);
  });

  test('filters combine with AND', () => {
    const both = createExtension({ id: 'both', isInstalled: true, isFeatured: true });
    const result = applyCatalogListFilters([installed, featured, both], { installed: true, featured: true });
    expect(result).toEqual([both]);
  });
});
