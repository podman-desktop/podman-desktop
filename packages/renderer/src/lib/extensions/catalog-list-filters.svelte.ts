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

import type { CatalogExtensionInfoUI, CatalogListFilters } from './catalog-extension-info-ui';
import { resolveExtensionCategoryTags } from './extension-tag-utils';

/**
 * Session-only Catalog toolbar filter state.
 *
 * This is a module-level rune, so it lives in memory only and resets on reload: filters intentionally
 * persist for the session but not across app restarts (see issue #18928 DoD). The search term lives
 * here alongside the other filters so the whole toolbar state has one consistent lifetime — it
 * survives leaving and returning to the Catalog tab, unlike component-local state.
 */
export const catalogListFilters = $state<{ value: CatalogListFilters; searchTerm: string }>({
  value: {},
  searchTerm: '',
});

export function getCatalogListFilters(): CatalogListFilters {
  return catalogListFilters.value;
}

export function getCatalogSearchTerm(): string {
  return catalogListFilters.searchTerm;
}

export function setCatalogSearchTerm(searchTerm: string): void {
  catalogListFilters.searchTerm = searchTerm;
}

export function resetCatalogListFilters(): void {
  catalogListFilters.value = {};
  catalogListFilters.searchTerm = '';
}

/** Set the install-status filter. `undefined` clears it (All). */
export function setCatalogInstalledFilter(installed: boolean | undefined): void {
  const next = { ...catalogListFilters.value };
  if (installed === undefined) {
    delete next.installed;
  } else {
    next.installed = installed;
  }
  catalogListFilters.value = next;
}

/** Set the category filter. Empty/undefined clears it (All categories). */
export function setCatalogCategoryFilter(category: string | undefined): void {
  const next = { ...catalogListFilters.value };
  if (!category) {
    delete next.category;
  } else {
    next.category = category;
  }
  catalogListFilters.value = next;
}

/** Toggle a boolean checkbox filter (featured). */
export function toggleCatalogBooleanFilter(key: 'featured'): void {
  const next = { ...catalogListFilters.value };
  if (next[key] === true) {
    delete next[key];
  } else {
    next[key] = true;
  }
  catalogListFilters.value = next;
}

export function hasActiveCatalogListFilters(filters: CatalogListFilters = catalogListFilters.value): boolean {
  return filters.installed !== undefined || filters.featured === true || !!filters.category;
}

/**
 * Pure selector applying the toolbar search term and filters (AND-combined) to the catalog list.
 * Kept side-effect free so each filter can be independently unit tested.
 */
export function applyCatalogListFilters(
  extensions: CatalogExtensionInfoUI[],
  filters: CatalogListFilters,
  searchTerm = '',
): CatalogExtensionInfoUI[] {
  const term = searchTerm.trim().toLowerCase();
  return extensions.filter(extension => {
    if (term.length > 0) {
      const haystack =
        `${extension.displayName} ${extension.shortDescription} ${extension.publisherDisplayName}`.toLowerCase();
      if (!haystack.includes(term)) {
        return false;
      }
    }
    if (filters.installed !== undefined && extension.isInstalled !== filters.installed) {
      return false;
    }
    if (filters.featured === true && !extension.isFeatured) {
      return false;
    }
    if (filters.category) {
      const categories = resolveExtensionCategoryTags(extension.categories);
      if (!categories.includes(filters.category)) {
        return false;
      }
    }
    return true;
  });
}
