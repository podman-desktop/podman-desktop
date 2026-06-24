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

import type { InstalledExtensionTableRow } from './installed-extension-table-row';

export type InstalledTableSortColumn = 'Name' | 'Version' | 'Status';

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

function compareRows(
  a: InstalledExtensionTableRow,
  b: InstalledExtensionTableRow,
  column: InstalledTableSortColumn,
): number {
  switch (column) {
    case 'Name':
      return a.name.localeCompare(b.name);
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
    default:
      return 0;
  }
}

export function orderInstalledTableRows(rows: InstalledExtensionTableRow[]): InstalledExtensionTableRow[] {
  const sort = installedTableSortState.value;
  if (!sort) {
    return [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }

  const sorted = [...rows].sort((a, b) => compareRows(a, b, sort.column));
  if (!sort.ascending) {
    sorted.reverse();
  }
  return sorted;
}
