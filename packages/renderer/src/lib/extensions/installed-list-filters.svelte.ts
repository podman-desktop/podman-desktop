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

export interface InstalledListFilters {
  verified?: boolean;
  hasUpdate?: boolean;
  featured?: boolean;
  builtIn?: boolean;
  category?: string;
}

export const installedListFilters = $state<{ value: InstalledListFilters }>({ value: {} });

export function resetInstalledListFilters(): void {
  installedListFilters.value = {};
}

export function toggleInstalledBooleanFilter(key: 'verified' | 'hasUpdate' | 'featured' | 'builtIn'): void {
  if (installedListFilters.value[key] === true) {
    const next = { ...installedListFilters.value };
    delete next[key];
    installedListFilters.value = next;
    return;
  }

  installedListFilters.value = {
    ...installedListFilters.value,
    [key]: true,
  };
}

export function setInstalledCategoryFilter(category: string | undefined): void {
  if (!category) {
    const next = { ...installedListFilters.value };
    delete next.category;
    installedListFilters.value = next;
    return;
  }

  installedListFilters.value = {
    ...installedListFilters.value,
    category,
  };
}

export function hasActiveInstalledListFilters(): boolean {
  const filters = installedListFilters.value;
  return (
    filters.verified === true ||
    filters.hasUpdate === true ||
    filters.featured === true ||
    filters.builtIn === true ||
    !!filters.category
  );
}
