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

import type { CatalogListFilters } from './catalog-extension-info-ui';

export const catalogListFilters = $state<{ value: CatalogListFilters }>({ value: {} });

export function getCatalogListFilters(): CatalogListFilters {
  return catalogListFilters.value;
}

export function resetCatalogListFilters(): void {
  catalogListFilters.value = {};
}

export function toggleCatalogBooleanFilter(key: 'verified' | 'hasUpdate' | 'featured'): void {
  if (catalogListFilters.value[key] === true) {
    const next = { ...catalogListFilters.value };
    delete next[key];
    catalogListFilters.value = next;
    return;
  }

  catalogListFilters.value = {
    ...catalogListFilters.value,
    [key]: true,
  };
}

export function toggleCatalogInstalledFilter(installed: boolean): void {
  if (catalogListFilters.value.installed === installed) {
    const next = { ...catalogListFilters.value };
    delete next.installed;
    catalogListFilters.value = next;
    return;
  }

  catalogListFilters.value = {
    ...catalogListFilters.value,
    installed,
  };
}

export function setCatalogInstalledFilter(installed: boolean | undefined): void {
  if (installed === undefined) {
    const next = { ...catalogListFilters.value };
    delete next.installed;
    catalogListFilters.value = next;
    return;
  }

  catalogListFilters.value = {
    ...catalogListFilters.value,
    installed,
  };
}

export function setCatalogCategoryFilter(category: string | undefined): void {
  if (!category) {
    const next = { ...catalogListFilters.value };
    delete next.category;
    catalogListFilters.value = next;
    return;
  }

  catalogListFilters.value = {
    ...catalogListFilters.value,
    category,
  };
}

export function hasActiveCatalogListFilters(): boolean {
  const filters = catalogListFilters.value;
  return (
    filters.installed !== undefined ||
    filters.verified === true ||
    filters.hasUpdate === true ||
    filters.featured === true ||
    !!filters.category
  );
}
