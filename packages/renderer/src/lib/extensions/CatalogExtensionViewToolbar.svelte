<script lang="ts">
import { faTableCells, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionFilters from './CatalogExtensionFilters.svelte';
import { catalogViewMode } from './extension-catalog-settings.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  searchTerm?: string;
  /** When false, hides the grid/table view switch (table toolbar above header). */
  showViewSwitch?: boolean;
}

let { catalogExtensions, searchTerm = $bindable(''), showViewSwitch = true }: Props = $props();

const viewMode = $derived(catalogViewMode.mode);
</script>

<div class="flex w-full flex-wrap items-center gap-3">
  <CatalogExtensionFilters {catalogExtensions} bind:searchTerm />
  <div class="min-w-0 flex-1"></div>
  {#if showViewSwitch}
    <div class="flex shrink-0 items-center gap-1">
      <Button
        type="tab"
        icon={faThLarge}
        selected={viewMode === 'grid'}
        title="Grid view"
        aria-label="Grid view"
        on:click={(): void => {
          catalogViewMode.mode = 'grid';
        }} />
      <Button
        type="tab"
        icon={faTableCells}
        selected={viewMode === 'table'}
        title="Table view"
        aria-label="Table view"
        on:click={(): void => {
          catalogViewMode.mode = 'table';
        }} />
    </div>
  {/if}
</div>
