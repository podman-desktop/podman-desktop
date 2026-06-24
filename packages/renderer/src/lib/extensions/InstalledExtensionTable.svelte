<script lang="ts">
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { onMount } from 'svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isExtensionPinnedRow } from './extension-catalog-settings.svelte';
import { buildExtensionDetailsPath } from './extension-list';
import { EXTENSION_TABLE_ROW_BASE_CLASS, extensionTableRowBorderClass } from './extension-table-styles';
import { setInstalledTableCallbacks } from './installed-extension-table-context';
import type { InstalledExtensionTableRow } from './installed-extension-table-row';
import {
  applyInstalledTableSort,
  type InstalledTableSortColumn,
  installedTableSortState,
} from './installed-extension-table-sort.svelte';
import InstalledExtensionTableActionsColumn from './table/InstalledExtensionTableActionsColumn.svelte';
import InstalledExtensionTableIconColumn from './table/InstalledExtensionTableIconColumn.svelte';
import InstalledExtensionTableLifecycleColumn from './table/InstalledExtensionTableLifecycleColumn.svelte';
import InstalledExtensionTableNameColumn from './table/InstalledExtensionTableNameColumn.svelte';
import InstalledExtensionTableVersionColumn from './table/InstalledExtensionTableVersionColumn.svelte';

interface Props {
  rows: InstalledExtensionTableRow[];
  onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void;
}

let { rows, onChangeVersion }: Props = $props();

const sortableColumns: InstalledTableSortColumn[] = ['Name', 'Version', 'Status'];

const gridTemplateColumns = '56px 2fr 1.35fr minmax(9rem, 1.25fr) 140px';

const currentSort = $derived(installedTableSortState.value);
const userSortApplied = $derived(currentSort !== null);

onMount(() => {
  setInstalledTableCallbacks({ onChangeVersion });
});

function openDetails(row: InstalledExtensionTableRow, event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, [role="menu"], [role="link"], [data-extension-dropdown-menu]')) {
    return;
  }
  router.goto(buildExtensionDetailsPath(row.extension.id, 'installed'));
}

function handleSort(column: InstalledTableSortColumn): void {
  applyInstalledTableSort(column);
}

function sortIcon(column: InstalledTableSortColumn): typeof faSort {
  if (currentSort?.column !== column) {
    return faSort;
  }
  return currentSort.ascending ? faSortUp : faSortDown;
}

function isSorted(column: InstalledTableSortColumn): boolean {
  return currentSort?.column === column;
}
</script>

<div class="w-full" role="table" aria-label="installed extensions">
  <div
    role="rowgroup"
    class="grid gap-x-4 h-7 bg-[var(--pd-content-bg)] pb-1 text-[var(--pd-table-header-text)] uppercase"
    style:grid-template-columns={gridTemplateColumns}>
    <div role="columnheader"></div>
    {#each sortableColumns as column (column)}
      <div
        role="columnheader"
        class="flex items-center gap-1 text-sm font-semibold self-center cursor-pointer select-none"
        onclick={(): void => handleSort(column)}>
        <span>{column}</span>
        <Fa
          icon={sortIcon(column)}
          class="text-xs {isSorted(column) ? 'text-[var(--pd-content-header)]' : 'text-[var(--pd-table-header-unsorted)]'}" />
      </div>
    {/each}
    <div role="columnheader" class="text-sm font-semibold self-center justify-self-end">Actions</div>
  </div>

  <div role="rowgroup">
    {#each rows as row (row.extension.id)}
      <div
        class="{EXTENSION_TABLE_ROW_BASE_CLASS} {extensionTableRowBorderClass(isExtensionPinnedRow(row.extension.id, userSortApplied))} grid items-center"
        style:grid-template-columns={gridTemplateColumns}
        role="row"
        aria-label={row.name}
        onclick={(event): void => openDetails(row, event)}>
        <div role="cell" class="self-center pl-3 pr-1 py-2">
          <InstalledExtensionTableIconColumn object={row} />
        </div>
        <div role="cell" class="self-center min-w-0 py-2 pr-2">
          <InstalledExtensionTableNameColumn object={row} />
        </div>
        <div role="cell" class="self-center py-2 pr-4 min-w-0" onclick={(event): void => event.stopPropagation()}>
          <InstalledExtensionTableVersionColumn object={row} />
        </div>
        <div role="cell" class="self-center py-2 min-w-0 overflow-hidden">
          <InstalledExtensionTableLifecycleColumn object={row} />
        </div>
        <div role="cell" class="self-center justify-self-end py-2" onclick={(event): void => event.stopPropagation()}>
          <InstalledExtensionTableActionsColumn object={row} />
        </div>
      </div>
    {/each}
  </div>
</div>
