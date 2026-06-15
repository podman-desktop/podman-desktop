<script lang="ts">
import { faPuzzlePiece, faTableCells, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtension from './CatalogExtension.svelte';
import CatalogExtensionTable from './CatalogExtensionTable.svelte';
import ChangeVersionModal from './ChangeVersionModal.svelte';
import { catalogViewMode } from './extension-catalog-settings.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  title?: string;
  showEmptyScreen?: boolean;
  oninstall?: (extensionId: string) => void;
  ondetails?: (extensionId: string) => void;
}

let {
  catalogExtensions,
  title = '',
  showEmptyScreen = true,
  oninstall = (): void => {},
  ondetails = (): void => {},
}: Props = $props();

// Use persistent view mode that survives tab switches - access the reactive object directly
const viewMode = $derived(catalogViewMode.mode);
let changeVersionExtension: CatalogExtensionInfoUI | undefined = $state(undefined);
let changeVersionPreferredVersion: string | undefined = $state(undefined);

function openChangeVersion(extension: CatalogExtensionInfoUI, preferredVersion?: string): void {
  changeVersionExtension = extension;
  changeVersionPreferredVersion = preferredVersion;
}

function closeChangeVersion(): void {
  changeVersionExtension = undefined;
  changeVersionPreferredVersion = undefined;
}
</script>

<div class="flex flex-col grow py-3">
  {#if catalogExtensions.length > 0}
    <div class="mb-4 flex flex-row items-center px-5">
      {#if title}
        <div class="flex items-center text-[var(--pd-content-header)]">{title}</div>
        <div class="flex-1"></div>
      {:else}
        <div class="flex-1"></div>
      {/if}
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
  {:else if showEmptyScreen}
    <EmptyScreen
      title="No extensions in the catalog"
      message="No extensions from the catalog. It seems that the internet connection was not available to download the catalog."
      icon={faPuzzlePiece} />
  {/if}

  {#if catalogExtensions.length > 0}
    {#if viewMode === 'grid'}
      <div class="flex flex-col w-full px-5">
        <div
          class="grid min-[920px]:grid-cols-2 min-[1180px]:grid-cols-3 gap-3"
          role="region"
          aria-label="Catalog Extensions">
          {#each catalogExtensions as catalogExtension (catalogExtension.id)}
            <CatalogExtension
              onChangeVersion={openChangeVersion}
              ondetails={ondetails}
              oninstall={oninstall}
              catalogExtensionUI={catalogExtension} />
          {/each}
        </div>
      </div>
    {:else}
      <CatalogExtensionTable
        catalogExtensions={catalogExtensions}
        oninstall={oninstall}
        onChangeVersion={openChangeVersion} />
    {/if}
  {/if}
</div>

{#if changeVersionExtension}
  <ChangeVersionModal
    extension={changeVersionExtension}
    preferredVersion={changeVersionPreferredVersion}
    closeCallback={closeChangeVersion} />
{/if}
