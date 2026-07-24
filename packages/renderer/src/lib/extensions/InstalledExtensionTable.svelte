<script lang="ts">
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ListOrganizer } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isExtensionPinnedRow } from './extension-catalog-settings.svelte';
import { buildExtensionDetailsPath } from './extension-list';
import {
  buildInstalledGridTemplateColumns,
  ensureExtensionTableViewportListeners,
  extensionTableViewport,
  getOrderedVisibleInstalledColumns,
  handleInstalledColumnOrderChange,
  handleInstalledColumnToggle,
  initInstalledTableColumns,
  type InstalledTableColumnId,
  installedTableColumnItems,
  installedTableColumnOrdering,
  resetInstalledTableColumns,
} from './extension-table-columns.svelte';
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

const currentSort = $derived(installedTableSortState.value);
const userSortApplied = $derived(currentSort !== null);

const orderedOptionalColumns = $derived.by((): InstalledTableColumnId[] => {
  extensionTableViewport.hideVersion;
  extensionTableViewport.compactInstalledStatus;
  installedTableColumnItems;
  installedTableColumnOrdering;
  return getOrderedVisibleInstalledColumns();
});

const gridTemplateColumns = $derived.by(() => {
  extensionTableViewport.hideVersion;
  extensionTableViewport.compactInstalledStatus;
  installedTableColumnItems;
  installedTableColumnOrdering;
  return buildInstalledGridTemplateColumns();
});

const visibleSortableColumns = $derived(['Name', ...orderedOptionalColumns] as InstalledTableSortColumn[]);

onMount(() => {
  setInstalledTableCallbacks({ onChangeVersion });
  ensureExtensionTableViewportListeners();
  initInstalledTableColumns().catch((error: unknown) => {
    console.error(error);
  });
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

<div class="w-full">
  <div role="table" aria-label="installed extensions">
    <div role="rowgroup" class="relative">
      <div
        role="row"
        class="grid w-full gap-x-3 h-7 bg-[var(--pd-content-bg)] pb-1 text-[var(--pd-table-header-text)] uppercase"
        style:grid-template-columns={gridTemplateColumns}>
        <div role="columnheader"></div>
        {#each visibleSortableColumns as column (column)}
          <div
            role="columnheader"
            class="flex min-w-0 items-center gap-1 text-sm font-semibold self-center cursor-pointer select-none {column ===
            'Version'
              ? 'pr-2'
              : ''} {column === 'Status' ? 'pl-1' : ''} {column === 'Name' ? 'pr-2' : ''}"
            onclick={(): void => handleSort(column)}>
            <span>{column}</span>
            <Fa
              icon={sortIcon(column)}
              class="text-xs {isSorted(column) ? 'text-[var(--pd-content-header)]' : 'text-[var(--pd-table-header-unsorted)]'}" />
          </div>
        {/each}
        <!-- gap-0.5 matches Table.svelte column gap between Actions and the pencil. -->
        <div
          role="columnheader"
          class="flex items-center justify-end gap-0.5 self-center text-sm font-semibold">
          <span>Actions</span>
          <ListOrganizer
            items={installedTableColumnItems}
            ordering={installedTableColumnOrdering}
            title="Configure Columns"
            enableReorder={true}
            enableToggle={true}
            onOrderChange={handleInstalledColumnOrderChange}
            onToggle={handleInstalledColumnToggle}
            onReset={resetInstalledTableColumns}
            resetButtonLabel="Reset to default" />
        </div>
      </div>
    </div>

    <div role="rowgroup">
      {#each rows as row (row.extension.id)}
        <div
          class="{EXTENSION_TABLE_ROW_BASE_CLASS} {extensionTableRowBorderClass(isExtensionPinnedRow(row.extension.id, userSortApplied))} w-full items-center"
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
          {#each orderedOptionalColumns as column (column)}
            {#if column === 'Version'}
              <div role="cell" class="self-center min-w-0 py-2 pr-2" onclick={(event): void => event.stopPropagation()}>
                <InstalledExtensionTableVersionColumn object={row} />
              </div>
            {:else if column === 'Status'}
              <div role="cell" class="self-center min-w-0 overflow-hidden py-2 pl-1">
                <InstalledExtensionTableLifecycleColumn object={row} />
              </div>
            {/if}
          {/each}
          <div role="cell" class="self-center flex justify-end py-2" onclick={(event): void => event.stopPropagation()}>
            <InstalledExtensionTableActionsColumn object={row} />
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
