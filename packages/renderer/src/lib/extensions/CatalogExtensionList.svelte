<script lang="ts">
import { faPuzzlePiece, faRotate } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { applyCatalogListFilters, catalogListFilters, resetCatalogListFilters } from './catalog-list-filters.svelte';
import CatalogExtension from './CatalogExtension.svelte';
import CatalogExtensionFilters from './CatalogExtensionFilters.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  title?: string;
  showEmptyScreen?: boolean;
  oninstall?: (extensionId: string) => void;
  ondetails?: (extensionId: string) => void;
}
let {
  catalogExtensions,
  title = 'Available extensions',
  showEmptyScreen = true,
  oninstall = (_extensionId: string): void => {},
  ondetails = (_extensionId: string): void => {},
}: Props = $props();

const visibleExtensions = $derived(
  applyCatalogListFilters(catalogExtensions, catalogListFilters.value, catalogListFilters.searchTerm),
);

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

<div class="flex flex-col grow px-5 pb-3">
  {#if catalogExtensions.length > 0}
    <div class="sticky top-0 z-40 -mx-5 mb-4 flex flex-col gap-3 border-b border-[var(--pd-content-divider)] bg-[var(--pd-content-bg)] px-5 pb-3 pt-3">
      <div class="flex flex-row items-center">
        <div class="flex items-center text-[var(--pd-content-header)]">{title}</div>
        <div class="flex-1 text-right">
          <Button type="link" icon={faRotate} on:click={fetchCatalog}>Refresh catalog</Button>
        </div>
      </div>
      <CatalogExtensionFilters catalogExtensions={catalogExtensions} />
    </div>
  {:else if showEmptyScreen}
    <EmptyScreen
      title="No extensions in the catalog"
      message="No extensions from the catalog. It seems that the internet connection was not available to download the catalog."
      icon={faPuzzlePiece}>
      <div class="flex gap-2 justify-center">
        <Button type="link" icon={faRotate} on:click={fetchCatalog}>Refresh catalog</Button>
      </div>
    </EmptyScreen>
  {/if}

  {#if catalogExtensions.length > 0 && visibleExtensions.length === 0}
    <EmptyScreen
      title="No extensions match your filters"
      message="No extensions match the current search and filters. Try adjusting or clearing them."
      icon={faPuzzlePiece}>
      <div class="flex gap-2 justify-center">
        <Button on:click={resetCatalogListFilters}>Clear filters</Button>
      </div>
    </EmptyScreen>
  {:else}
    <div class="flex flex-col w-full">
      <div
        class="grid min-[920px]:grid-cols-2 min-[1180px]:grid-cols-3 gap-3"
        role="region"
        aria-label="Catalog Extensions">
        {#each visibleExtensions as catalogExtension (catalogExtension.id)}
          <CatalogExtension ondetails={ondetails} oninstall={oninstall} catalogExtensionUI={catalogExtension} />
        {/each}
      </div>
    </div>
  {/if}
</div>
