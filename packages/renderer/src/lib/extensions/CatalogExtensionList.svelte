<script lang="ts">
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen, FilteredEmptyScreen } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { catalogTableSortState, orderCatalogTableExtensions } from './catalog-extension-table-sort.svelte';
import CatalogExtension from './CatalogExtension.svelte';
import CatalogExtensionTable from './CatalogExtensionTable.svelte';
import CatalogExtensionViewToolbar from './CatalogExtensionViewToolbar.svelte';
import { getCatalogViewMode, refreshNewBadges } from './extension-catalog-settings.svelte';
import SuggestionCatalogExtension from './SuggestionCatalogExtension.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  allCatalogExtensions?: CatalogExtensionInfoUI[];
  title?: string;
  showEmptyScreen?: boolean;
  showFilteredEmpty?: boolean;
  searchTerm?: string;
  suggestionScope?: boolean;
  onResetFilter?: () => void;
  oninstall?: (extensionId: string) => void;
  ondetails?: (extensionId: string) => void;
}

let {
  catalogExtensions,
  allCatalogExtensions = catalogExtensions,
  title = '',
  showEmptyScreen = true,
  showFilteredEmpty = false,
  searchTerm = $bindable(''),
  suggestionScope = true,
  onResetFilter = (): void => {},
  oninstall = (): void => {},
  ondetails = (): void => {},
}: Props = $props();

onMount(() => {
  if (suggestionScope) {
    refreshNewBadges();
  }
});

const viewMode = $derived.by(() => getCatalogViewMode());
const hasCatalogData = $derived(allCatalogExtensions.length > 0);
const hasVisibleExtensions = $derived(catalogExtensions.length > 0);
const tableCatalogExtensions = $derived.by(() => {
  catalogTableSortState.value;
  return orderCatalogTableExtensions(catalogExtensions);
});

async function fetchCatalog(): Promise<void> {
  try {
    await window.refreshCatalogExtensions();
  } catch (error) {
    await window.showMessageBox({
      type: 'error',
      title: 'Refresh Catalog Failed',
      message: 'Failed to refresh the catalog',
      detail: String(error),
      buttons: ['Dismiss'],
    });
  }
}
</script>

{#if suggestionScope}
  <div class="flex grow flex-col py-3">
    {#if title}
      <div class="mb-3 px-5 text-[var(--pd-content-header)]">{title}</div>
    {/if}

    {#if hasCatalogData}
      <div class="sticky top-0 z-20 bg-[var(--pd-content-bg)] px-5 pb-4 pt-1">
        <CatalogExtensionViewToolbar catalogExtensions={allCatalogExtensions} bind:searchTerm />
      </div>
    {/if}

    <div class="grow px-5">
      {#if showFilteredEmpty}
        <div class="flex min-h-[40vh] flex-1 items-center justify-center">
          <FilteredEmptyScreen icon={ExtensionIcon} kind="extensions" bind:searchTerm {onResetFilter} />
        </div>
      {:else if hasVisibleExtensions}
        {#if viewMode === 'grid'}
          <div
            class="grid min-[920px]:grid-cols-2 min-[1180px]:grid-cols-3 gap-3"
            role="region"
            aria-label="Catalog Extensions">
            {#each catalogExtensions as catalogExtension (catalogExtension.id)}
              <SuggestionCatalogExtension
                ondetails={ondetails}
                oninstall={oninstall}
                catalogExtensionUI={catalogExtension} />
            {/each}
          </div>
        {:else}
          <CatalogExtensionTable
            catalogExtensions={tableCatalogExtensions}
            {oninstall}
            onChangeVersion={(): void => {}} />
        {/if}
      {:else if showEmptyScreen}
        <EmptyScreen
          title="No extensions in the catalog"
          message="No extensions from the catalog. It seems that the internet connection was not available to download the catalog."
          icon={faPuzzlePiece} />
      {/if}
    </div>
  </div>
{:else}
  <div class="flex grow flex-col px-5 py-3">
    {#if catalogExtensions.length > 0}
      <div class="mb-4 flex flex-row items-center justify-end">
        <Button title="Refresh the catalog" aria-label="Refresh the catalog" on:click={fetchCatalog}>
          Refresh the catalog
        </Button>
      </div>
    {:else if showEmptyScreen}
      <EmptyScreen
        title="No extensions in the catalog"
        message="No extensions from the catalog. It seems that the internet connection was not available to download the catalog."
        icon={faPuzzlePiece}>
        <Button title="Refresh the catalog" aria-label="Refresh the catalog" on:click={fetchCatalog}>
          Refresh the catalog
        </Button>
      </EmptyScreen>
    {/if}

    {#if catalogExtensions.length > 0}
      <div
        class="grid min-[920px]:grid-cols-2 min-[1180px]:grid-cols-3 gap-3"
        role="region"
        aria-label="Catalog Extensions">
        {#each catalogExtensions as catalogExtension (catalogExtension.id)}
          <CatalogExtension ondetails={ondetails} oninstall={oninstall} catalogExtensionUI={catalogExtension} />
        {/each}
      </div>
    {/if}
  </div>
{/if}
