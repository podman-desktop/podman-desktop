<script lang="ts">
import { faList, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { Button, Tooltip } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionFilters from './CatalogExtensionFilters.svelte';
import { getCatalogViewMode, setCatalogViewMode } from './extension-catalog-settings.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  searchTerm?: string;
  /** When false, hides the grid/table view switch (table toolbar above header). */
  showViewSwitch?: boolean;
}

let { catalogExtensions, searchTerm = $bindable(''), showViewSwitch = true }: Props = $props();

const viewMode = $derived.by(() => getCatalogViewMode());
</script>

<div class="flex w-full flex-wrap items-center gap-3">
  <CatalogExtensionFilters {catalogExtensions} bind:searchTerm />
  <div class="min-w-0 flex-1"></div>
  {#if showViewSwitch}
    <div class="relative z-[60] flex shrink-0 items-center gap-1">
      <Tooltip top tip="Grid view">
        <Button
          type="tab"
          icon={faThLarge}
          selected={viewMode === 'grid'}
          title="Grid view"
          aria-label="Grid view"
          onclick={(): void => {
            setCatalogViewMode('grid');
          }} />
      </Tooltip>
      <Tooltip top tip="List view">
        <Button
          type="tab"
          icon={faList}
          selected={viewMode === 'table'}
          title="List view"
          aria-label="List view"
          onclick={(): void => {
            setCatalogViewMode('table');
          }} />
      </Tooltip>
    </div>
  {/if}
</div>
