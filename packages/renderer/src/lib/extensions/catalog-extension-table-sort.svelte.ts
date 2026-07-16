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

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { hasExtensionCompatibilityIssues } from './extension-compatibility';
import { getExtensionStatusSeverityRank } from './extension-lifecycle-status';

export type CatalogTableSortColumn = 'Name' | 'Publisher' | 'Version' | 'Status';

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

function resolveVersionLabel(extension: CatalogExtensionInfoUI): string {
  if (extension.isInstalled) {
    return extension.installedVersion ?? '';
  }
  return extension.fetchVersion ?? '';
}

function resolveCatalogStatusRank(
  extension: CatalogExtensionInfoUI,
  installedExtensions: CombinedExtensionInfoUI[],
): number {
  const installed = extension.isInstalled ? extension.installedExtension : undefined;
  return getExtensionStatusSeverityRank({
    isInstalled: !!installed,
    state: installed?.state,
    type: installed?.type,
    hasCompatibilityIssue: !!installed && hasExtensionCompatibilityIssues(extension, installedExtensions),
  });
}

function compareExtensions(
  a: CatalogExtensionInfoUI,
  b: CatalogExtensionInfoUI,
  column: CatalogTableSortColumn,
  statusRankById: ReadonlyMap<string, number>,
): number {
  switch (column) {
    case 'Name':
      return a.displayName.localeCompare(b.displayName);
    case 'Publisher':
      return a.publisherDisplayName.localeCompare(b.publisherDisplayName);
    case 'Version':
      return resolveVersionLabel(a).localeCompare(resolveVersionLabel(b), undefined, { numeric: true });
    case 'Status': {
      const rankDiff = (statusRankById.get(a.id) ?? 50) - (statusRankById.get(b.id) ?? 50);
      if (rankDiff !== 0) {
        return rankDiff;
      }
      return a.displayName.localeCompare(b.displayName);
    }
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

export function orderCatalogTableExtensions(extensions: CatalogExtensionInfoUI[]): CatalogExtensionInfoUI[] {
  const sort = catalogTableSortState.value;
  if (!sort) {
    return [...extensions].sort(defaultCatalogOrder);
  }

  const installedExtensions = extensions
    .map(extension => extension.installedExtension)
    .filter((extension): extension is CombinedExtensionInfoUI => !!extension);
  const statusRankById = new Map(
    extensions.map(extension => [extension.id, resolveCatalogStatusRank(extension, installedExtensions)]),
  );

  const sorted = [...extensions].sort((a, b) => compareExtensions(a, b, sort.column, statusRankById));
  if (!sort.ascending) {
    sorted.reverse();
  }
  return sorted;
}
