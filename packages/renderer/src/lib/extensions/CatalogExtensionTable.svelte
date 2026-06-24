<script lang="ts">
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
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
import { EXTENSION_TABLE_ROW_BASE_CLASS, extensionTableRowBorderClass } from './extension-table-styles';
import {
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  getOptimisticInstalledVersion,
  isExtensionVersionUpdating,
} from './extension-version-update.svelte';
import ExtensionLifecycleStatus from './ExtensionLifecycleStatus.svelte';
import ExtensionPublisherLabel from './ExtensionPublisherLabel.svelte';
import ExtensionVersionUpdateStatus from './ExtensionVersionUpdateStatus.svelte';
import CatalogExtensionTableNameColumn from './table/CatalogExtensionTableNameColumn.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  oninstall: (extensionId: string) => void;
  onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void;
}

let { catalogExtensions, oninstall, onChangeVersion }: Props = $props();

const sortableColumns: CatalogTableSortColumn[] = ['Name', 'Publisher', 'Version', 'Status'];

const catalogTableColumnLabels: Record<CatalogTableSortColumn, string> = {
  Name: 'Name',
  Publisher: 'Published by',
  Version: 'Version',
  Status: 'Status',
};

const gridTemplateColumns = '56px minmax(0, 2fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) 140px';

const currentSort = $derived(catalogTableSortState.value);
const userSortApplied = $derived(currentSort !== null);

let uiRevision = $state(0);

onMount(() => {
  setCatalogTableCallbacks({ oninstall, onChangeVersion });
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

<div class="w-full" role="table" aria-label="extensions">
  <div
    role="rowgroup"
    class="grid gap-x-4 h-7 pb-1 text-[var(--pd-table-header-text)] uppercase"
    style:grid-template-columns={gridTemplateColumns}>
    <div role="columnheader"></div>
    {#each sortableColumns as column (column)}
      <div
        role="columnheader"
        class="flex items-center gap-1 text-sm font-semibold self-center cursor-pointer select-none"
        onclick={(): void => handleSort(column)}>
        <span>{catalogTableColumnLabels[column]}</span>
        <Fa
          icon={sortIcon(column)}
          class="text-xs {isSorted(column) ? 'text-[var(--pd-content-header)]' : 'text-[var(--pd-table-header-unsorted)]'}" />
      </div>
    {/each}
    <div role="columnheader" class="text-sm font-semibold self-center justify-self-end">Actions</div>
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
        <div role="cell" class="min-w-0 py-2 text-sm text-[var(--pd-content-text)]">
          <ExtensionPublisherLabel
            publisherName={extension.publisherDisplayName}
            isVerified={extension.isVerified}
            isSupportedByRedHat={extension.isSupportedByRedHat} />
        </div>
        <div role="cell" class="min-w-0 overflow-hidden py-2">
          <div class="text-sm text-[var(--pd-content-text)]">
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
                <span>{displayInstalledVersion ? `v${displayInstalledVersion}` : `v${extension.installedVersion}`}</span>
                <ExtensionVersionUpdateStatus
                  extensionId={extension.id}
                  extensionState={extension.installedExtension?.state} />
              {/key}
            {:else}
              <span>{extension.fetchVersion ? `v${extension.fetchVersion}` : 'N/A'}</span>
            {/if}
          </div>
        </div>
        <div role="cell" class="min-w-0 overflow-hidden py-2">
          {#if extension.isInstalled && extension.installedExtension}
            <ExtensionLifecycleStatus extension={extension.installedExtension} />
          {:else}
            <span class="text-sm text-[var(--pd-table-header-text)]">Not installed</span>
          {/if}
        </div>
        <div role="cell" class="justify-self-end py-2" onclick={(event): void => event.stopPropagation()}>
          <div class="flex shrink-0 items-center justify-end gap-1">
            {#if !extension.isInstalled && extension.fetchable}
              <FeaturedExtensionDownload {oninstall} extension={extension} />
            {/if}
            <CatalogExtensionActions
              {extension}
              returnScreen="catalog" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
