<script lang="ts">
import { faPuzzlePiece, faTableCells, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI, CatalogViewMode } from './catalog-extension-info-ui';
import CatalogExtension from './CatalogExtension.svelte';
import CatalogExtensionTable from './CatalogExtensionTable.svelte';
import ChangeVersionModal from './ChangeVersionModal.svelte';

export let catalogExtensions: CatalogExtensionInfoUI[];
export let title: string = 'Available extensions';
export let showEmptyScreen: boolean = true;
export let oninstall: (extensionId: string) => void = () => {};
export let ondetails: (extensionId: string) => void = () => {};

let viewMode: CatalogViewMode = 'grid';
let changeVersionExtension: CatalogExtensionInfoUI | undefined;

function openChangeVersion(extension: CatalogExtensionInfoUI): void {
  changeVersionExtension = extension;
}

function closeChangeVersion(): void {
  changeVersionExtension = undefined;
}
</script>

<div class="flex flex-col grow px-5 py-3">
  {#if catalogExtensions.length > 0}
    <div class="mb-4 flex flex-row items-center">
      <div class="flex items-center text-[var(--pd-content-header)]">{title}</div>
      <div class="flex-1"></div>
      <Button
        type="tab"
        icon={faThLarge}
        selected={viewMode === 'grid'}
        title="Grid view"
        aria-label="Grid view"
        on:click={(): void => {
          viewMode = 'grid';
        }} />
      <Button
        type="tab"
        icon={faTableCells}
        selected={viewMode === 'table'}
        title="Table view"
        aria-label="Table view"
        on:click={(): void => {
          viewMode = 'table';
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
      <div class="flex flex-col w-full">
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
  <ChangeVersionModal extension={changeVersionExtension} closeCallback={closeChangeVersion} />
{/if}
