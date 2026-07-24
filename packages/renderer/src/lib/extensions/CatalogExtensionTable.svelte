<script lang="ts">
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ListOrganizer } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { setCatalogTableCallbacks } from './catalog-extension-table-context';
import {
  applyCatalogTableSort,
  type CatalogTableSortColumn,
  catalogTableSortState,
} from './catalog-extension-table-sort.svelte';
import CatalogExtensionActions from './CatalogExtensionActions.svelte';
import CatalogExtensionIcon from './CatalogExtensionIcon.svelte';
import { isExtensionPinnedRow } from './extension-catalog-settings.svelte';
import { buildExtensionDetailsPath } from './extension-list';
import {
  buildCatalogGridTemplateColumns,
  type CatalogTableColumnId,
  catalogTableColumnItems,
  catalogTableColumnOrdering,
  extensionTableViewport,
  getOrderedVisibleCatalogColumns,
  handleCatalogColumnOrderChange,
  handleCatalogColumnToggle,
  initCatalogTableColumns,
  resetCatalogTableColumns,
} from './extension-table-columns.svelte';
import { EXTENSION_TABLE_ROW_BASE_CLASS, extensionTableRowBorderClass } from './extension-table-styles';
import {
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  getOptimisticInstalledVersion,
  isExtensionVersionUpdating,
} from './extension-version-update.svelte';
import ExtensionLifecycleStatus from './ExtensionLifecycleStatus.svelte';
import ExtensionPublisherLabel from './ExtensionPublisherLabel.svelte';
import ExtensionUpdateVersionLink from './ExtensionUpdateVersionLink.svelte';
import ExtensionVersionUpdateStatus from './ExtensionVersionUpdateStatus.svelte';
import CatalogExtensionTableNameColumn from './table/CatalogExtensionTableNameColumn.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  oninstall: (extensionId: string) => void;
  onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void;
}

let { catalogExtensions, oninstall, onChangeVersion }: Props = $props();

const catalogTableColumnLabels: Record<CatalogTableSortColumn, string> = {
  Name: 'Name',
  Publisher: 'Publisher',
  Version: 'Version',
  Status: 'Status',
};

const currentSort = $derived(catalogTableSortState.value);
const userSortApplied = $derived(currentSort !== null);

let uiRevision = $state(0);

const orderedOptionalColumns = $derived.by((): CatalogTableColumnId[] => {
  extensionTableViewport.hidePublisher;
  extensionTableViewport.hideVersion;
  catalogTableColumnItems;
  catalogTableColumnOrdering;
  return getOrderedVisibleCatalogColumns();
});

const gridTemplateColumns = $derived.by(() => {
  extensionTableViewport.hidePublisher;
  extensionTableViewport.hideVersion;
  catalogTableColumnItems;
  catalogTableColumnOrdering;
  return buildCatalogGridTemplateColumns();
});

const visibleSortableColumns = $derived(['Name', ...orderedOptionalColumns] as CatalogTableSortColumn[]);

onMount(() => {
  setCatalogTableCallbacks({ oninstall, onChangeVersion });
  initCatalogTableColumns().catch((error: unknown) => {
    console.error(error);
  });
  const handler = (): void => {
    uiRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  };
});

function openDetails(extension: CatalogExtensionInfoUI, event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, [role="menu"], [role="link"], [data-extension-dropdown-menu]')) {
    return;
  }
  router.goto(buildExtensionDetailsPath(extension.id, 'catalog'));
}

function handleSort(column: CatalogTableSortColumn): void {
  applyCatalogTableSort(column);
}

function sortIcon(column: CatalogTableSortColumn): typeof faSort {
  if (currentSort?.column !== column) {
    return faSort;
  }
  return currentSort.ascending ? faSortUp : faSortDown;
}

function isSorted(column: CatalogTableSortColumn): boolean {
  return currentSort?.column === column;
}
</script>

<div class="w-full">
  <div role="table" aria-label="extensions">
    <div role="rowgroup" class="relative">
      <div
        role="row"
        class="grid gap-x-4 h-7 pb-1 text-[var(--pd-table-header-text)] uppercase"
        style:grid-template-columns={gridTemplateColumns}>
        <div role="columnheader"></div>
        {#each visibleSortableColumns as column (column)}
          <div
            role="columnheader"
            class="flex items-center gap-1 text-sm font-semibold self-center cursor-pointer select-none {column ===
            'Version'
              ? 'pr-6'
              : ''} {column === 'Status' ? 'pl-2' : ''}"
            onclick={(): void => handleSort(column)}>
            <span>{catalogTableColumnLabels[column]}</span>
            <Fa
              icon={sortIcon(column)}
              class="text-xs {isSorted(column) ? 'text-[var(--pd-content-header)]' : 'text-[var(--pd-table-header-unsorted)]'}" />
          </div>
        {/each}
        <!-- gap-0.5 matches Table.svelte column gap between Actions and the pencil. -->
        <div
          role="columnheader"
          class="flex items-center justify-self-end gap-0.5 self-center text-sm font-semibold">
          <span>Actions</span>
          <ListOrganizer
            items={catalogTableColumnItems}
            ordering={catalogTableColumnOrdering}
            title="Configure Columns"
            enableReorder={true}
            enableToggle={true}
            onOrderChange={handleCatalogColumnOrderChange}
            onToggle={handleCatalogColumnToggle}
            onReset={resetCatalogTableColumns}
            resetButtonLabel="Reset to default" />
        </div>
      </div>
    </div>

    <div role="rowgroup">
      {#each catalogExtensions as extension (extension.id)}
        <div
          class="{EXTENSION_TABLE_ROW_BASE_CLASS} {extensionTableRowBorderClass(isExtensionPinnedRow(extension.id, userSortApplied))} grid items-center"
          style:grid-template-columns={gridTemplateColumns}
          role="row"
          aria-label={extension.displayName}
          onclick={(event): void => openDetails(extension, event)}>
          <div role="cell" class="pl-3 pr-1 py-2">
            <CatalogExtensionIcon iconHref={extension.iconHref} displayName={extension.displayName} />
          </div>
          <div role="cell" class="min-w-0 py-2 pr-2">
            <CatalogExtensionTableNameColumn {extension} />
          </div>
          {#each orderedOptionalColumns as column (column)}
            {#if column === 'Publisher'}
              <div role="cell" class="min-w-0 py-2 text-sm text-[var(--pd-content-text)]">
                <ExtensionPublisherLabel
                  publisherName={extension.publisherDisplayName}
                  isVerified={extension.isVerified} />
              </div>
            {:else if column === 'Version'}
              <div role="cell" class="min-w-0 overflow-hidden py-2 pr-6">
                <div class="flex flex-col gap-1 text-sm text-[var(--pd-content-text)] min-w-0">
                  <span class="whitespace-nowrap">
                    {#if extension.isInstalled}
                      {#key uiRevision}
                        {@const actualVersion = extension.installedVersion}
                        {@const normalizedActual = actualVersion?.replace(/^v/i, '').trim()}
                        {@const optimistic = getOptimisticInstalledVersion(extension.id)}
                        {@const displayInstalledVersion =
                          isExtensionVersionUpdating(extension.id)
                            ? actualVersion
                            : optimistic && optimistic !== normalizedActual
                              ? optimistic
                              : actualVersion}
                        {displayInstalledVersion ? `v${displayInstalledVersion}` : `v${extension.installedVersion}`}
                        <ExtensionVersionUpdateStatus
                          extensionId={extension.id}
                          extensionState={extension.installedExtension?.state} />
                      {/key}
                    {:else}
                      {extension.fetchVersion ? `v${extension.fetchVersion}` : 'N/A'}
                    {/if}
                  </span>
                  {#if extension.isInstalled}
                    <ExtensionUpdateVersionLink extension={extension} />
                  {/if}
                </div>
              </div>
            {:else if column === 'Status'}
              <div role="cell" class="min-w-0 overflow-hidden py-2 pl-2">
                {#if extension.isInstalled && extension.installedExtension}
                  <ExtensionLifecycleStatus
                    extension={extension.installedExtension}
                    catalogExtension={extension}
                    catalogInstalledPresence={true} />
                {:else}
                  <span class="text-sm text-[var(--pd-table-header-text)] truncate">Not installed</span>
                {/if}
              </div>
            {/if}
          {/each}
          <div role="cell" class="justify-self-end py-2" onclick={(event): void => event.stopPropagation()}>
            <div class="flex shrink-0 items-center justify-end gap-1">
              {#if extension.fetchable && !extension.isInstalled}
                <FeaturedExtensionDownload {oninstall} extension={extension} />
              {/if}
              <CatalogExtensionActions {extension} returnScreen="catalog" />
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
