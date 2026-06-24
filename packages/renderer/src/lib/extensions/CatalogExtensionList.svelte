<script lang="ts">
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { EmptyScreen, FilteredEmptyScreen } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { catalogTableSortState, orderCatalogTableExtensions } from './catalog-extension-table-sort.svelte';
import CatalogExtension from './CatalogExtension.svelte';
import CatalogExtensionTable from './CatalogExtensionTable.svelte';
import CatalogExtensionViewToolbar from './CatalogExtensionViewToolbar.svelte';
import { getCatalogViewMode, refreshNewBadges } from './extension-catalog-settings.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  allCatalogExtensions: CatalogExtensionInfoUI[];
  title?: string;
  showEmptyScreen?: boolean;
  showFilteredEmpty?: boolean;
  searchTerm?: string;
  onResetFilter?: () => void;
  oninstall?: (extensionId: string) => void;
  ondetails?: (extensionId: string) => void;
}

let {
  catalogExtensions,
  allCatalogExtensions,
  title = '',
  showEmptyScreen = true,
  showFilteredEmpty = false,
  searchTerm = $bindable(''),
  onResetFilter = (): void => {},
  oninstall = (): void => {},
  ondetails = (): void => {},
}: Props = $props();

onMount(() => {
  refreshNewBadges();
});

const viewMode = $derived.by(() => getCatalogViewMode());
const hasCatalogData = $derived(allCatalogExtensions.length > 0);
const hasVisibleExtensions = $derived(catalogExtensions.length > 0);
const tableCatalogExtensions = $derived.by(() => {
  catalogTableSortState.value;
  return orderCatalogTableExtensions(catalogExtensions);
});
</script>

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
            <CatalogExtension
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
