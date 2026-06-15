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

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { getNewBadgeInstalledAt, isNewBadgeActive } from './extension-catalog-settings.svelte';
import { resolveExtensionOriginSortLabel } from './extension-origin-utils';

export type CatalogTableSortColumn = 'Name' | 'Publisher' | 'Version' | 'Status' | 'Origin';

export const catalogTableSortState = $state<{
  value: { column: CatalogTableSortColumn; ascending: boolean } | null;
}>({ value: null });

export function applyCatalogTableSort(column: CatalogTableSortColumn): void {
  const current = catalogTableSortState.value;
  if (current?.column === column) {
    catalogTableSortState.value = { column, ascending: !current.ascending };
    return;
  }
  catalogTableSortState.value = { column, ascending: true };
}

export function resetCatalogTableSort(): void {
  catalogTableSortState.value = null;
}

function resolveOriginLabel(extension: CatalogExtensionInfoUI): string {
  return resolveExtensionOriginSortLabel(extension.installedExtension, {
    isVerified: extension.isVerified,
  });
}

function resolveStatusLabel(extension: CatalogExtensionInfoUI): string {
  if (extension.isInstalled && extension.installedExtension) {
    return extension.installedExtension.state ?? 'installed';
  }
  return 'not installed';
}

function resolveVersionLabel(extension: CatalogExtensionInfoUI): string {
  if (extension.isInstalled) {
    return extension.installedVersion ?? '';
  }
  return extension.fetchVersion ?? '';
}

function compareExtensions(
  a: CatalogExtensionInfoUI,
  b: CatalogExtensionInfoUI,
  column: CatalogTableSortColumn,
): number {
  switch (column) {
    case 'Name':
      return a.displayName.localeCompare(b.displayName);
    case 'Publisher':
      return a.publisherDisplayName.localeCompare(b.publisherDisplayName);
    case 'Version':
      return resolveVersionLabel(a).localeCompare(resolveVersionLabel(b), undefined, { numeric: true });
    case 'Status':
      return resolveStatusLabel(a).localeCompare(resolveStatusLabel(b));
    case 'Origin':
      return resolveOriginLabel(a).localeCompare(resolveOriginLabel(b));
    default:
      return 0;
  }
}

function defaultCatalogOrder(a: CatalogExtensionInfoUI, b: CatalogExtensionInfoUI): number {
  if (a.isFeatured && !b.isFeatured) {
    return -1;
  }
  if (!a.isFeatured && b.isFeatured) {
    return 1;
  }
  return a.displayName.localeCompare(b.displayName);
}

function pinNewlyInstalledExtensions(extensions: CatalogExtensionInfoUI[]): CatalogExtensionInfoUI[] {
  const pinned: CatalogExtensionInfoUI[] = [];
  const rest: CatalogExtensionInfoUI[] = [];

  for (const extension of extensions) {
    if (isNewBadgeActive(extension.id)) {
      pinned.push(extension);
    } else {
      rest.push(extension);
    }
  }

  pinned.sort((a, b) => (getNewBadgeInstalledAt(b.id) ?? 0) - (getNewBadgeInstalledAt(a.id) ?? 0));
  rest.sort(defaultCatalogOrder);

  return [...pinned, ...rest];
}

export function orderCatalogTableExtensions(extensions: CatalogExtensionInfoUI[]): CatalogExtensionInfoUI[] {
  const sort = catalogTableSortState.value;
  if (!sort) {
    return pinNewlyInstalledExtensions(extensions);
  }

  const sorted = [...extensions].sort((a, b) => compareExtensions(a, b, sort.column));
  if (!sort.ascending) {
    sorted.reverse();
  }
  return sorted;
}
