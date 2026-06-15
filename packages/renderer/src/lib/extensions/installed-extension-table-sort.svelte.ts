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

import { getNewBadgeInstalledAt, isNewBadgeActive } from './extension-catalog-settings.svelte';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';
import { USE_CASE_EXTENSION_IDS } from './extension-prototype-use-cases';
import type { ExtensionsUtils } from './extensions-utils';
import type { InstalledExtensionTableRow } from './installed-extension-table-row';

export type InstalledTableSortColumn = 'Name' | 'Publisher' | 'Version' | 'Status' | 'Origin';

export const installedTableSortState = $state<{
  value: { column: InstalledTableSortColumn; ascending: boolean } | null;
}>({ value: null });

export function getInstalledTableSort(): typeof installedTableSortState.value {
  return installedTableSortState.value;
}

export function applyInstalledTableSort(column: InstalledTableSortColumn): void {
  const current = installedTableSortState.value;
  if (current?.column === column) {
    installedTableSortState.value = { column, ascending: !current.ascending };
    return;
  }
  installedTableSortState.value = { column, ascending: true };
}

export function resetInstalledTableSort(): void {
  installedTableSortState.value = null;
}

function resolveOriginLabel(row: InstalledExtensionTableRow): string {
  const extension = row.extension;
  if (extension.type === 'dd') {
    return 'Docker Desktop extension';
  }
  if (extension.devMode) {
    return 'DevMode extension';
  }
  if (!extension.removable) {
    return 'Built-in extension';
  }
  return row.catalogExtension.isVerified ? 'Community Verified' : 'Community';
}

function compareRows(
  a: InstalledExtensionTableRow,
  b: InstalledExtensionTableRow,
  column: InstalledTableSortColumn,
  extensionsUtils: ExtensionsUtils,
): number {
  switch (column) {
    case 'Name':
      return a.name.localeCompare(b.name);
    case 'Publisher':
      return extensionsUtils
        .resolvePublisherDisplayName(a.extension, a.catalogExtension.publisherDisplayName)
        .localeCompare(
          extensionsUtils.resolvePublisherDisplayName(b.extension, b.catalogExtension.publisherDisplayName),
        );
    case 'Version':
      return (a.catalogExtension.installedVersion ?? '').localeCompare(
        b.catalogExtension.installedVersion ?? '',
        undefined,
        {
          numeric: true,
        },
      );
    case 'Status':
      return (a.extension.state ?? '').localeCompare(b.extension.state ?? '');
    case 'Origin':
      return resolveOriginLabel(a).localeCompare(resolveOriginLabel(b));
    default:
      return 0;
  }
}

function pinInstalledTableRows(rows: InstalledExtensionTableRow[]): InstalledExtensionTableRow[] {
  const manualUpdate: InstalledExtensionTableRow[] = [];
  const pinned: InstalledExtensionTableRow[] = [];
  const rest: InstalledExtensionTableRow[] = [];

  for (const row of rows) {
    if (extensionRequiresManualUpdate(row.catalogExtension)) {
      manualUpdate.push(row);
    } else if (isNewBadgeActive(row.extension.id)) {
      pinned.push(row);
    } else {
      rest.push(row);
    }
  }

  manualUpdate.sort((a, b) => {
    if (a.catalogExtension.id === USE_CASE_EXTENSION_IDS.communityActiveWithUpdate) {
      return -1;
    }
    if (b.catalogExtension.id === USE_CASE_EXTENSION_IDS.communityActiveWithUpdate) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  });

  pinned.sort((a, b) => (getNewBadgeInstalledAt(b.extension.id) ?? 0) - (getNewBadgeInstalledAt(a.extension.id) ?? 0));
  rest.sort((a, b) => a.name.localeCompare(b.name));

  return [...manualUpdate, ...pinned, ...rest];
}

export function orderInstalledTableRows(
  rows: InstalledExtensionTableRow[],
  extensionsUtils: ExtensionsUtils,
): InstalledExtensionTableRow[] {
  const sort = installedTableSortState.value;
  if (!sort) {
    return pinInstalledTableRows(rows);
  }

  const sorted = [...rows].sort((a, b) => compareRows(a, b, sort.column, extensionsUtils));
  if (!sort.ascending) {
    sorted.reverse();
  }
  return sorted;
}
