<script lang="ts">
import { ExtensionLoaderSettings } from '@desktop-framework/api';
import { Button, FilteredEmptyScreen } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import DevelopmentExtensionListTable from '/@/lib/extensions/dev-mode/table/ListTable.svelte';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';

import type { SelectableExtensionDevelopmentFolderInfoUI } from './development-folder-info-ui';
import DevelopmentExtensionEmptyScreen from './DevelopmentExtensionEmptyScreen.svelte';

interface Props {
  extensionFolders: SelectableExtensionDevelopmentFolderInfoUI[];
  searchTerm?: string;
}

let { extensionFolders, searchTerm = $bindable('') }: Props = $props();

let isDevelopmentModeEnabled = $state(false);

onMount(async () => {
  //
  // Check if development mode is enabled
  isDevelopmentModeEnabled =
    (await window.getConfigurationValue(
      `${ExtensionLoaderSettings.SectionName}.${ExtensionLoaderSettings.DevelopmentMode}`,
    )) ?? false;
});

async function addLocalFolderExtension(): Promise<void> {
  // call the openDialog
  const result = await window.openDialog({
    selectors: ['openDirectory'],
    openLabel: 'Select folder',
    title: 'Track a new extension folder',
  });
  if (result?.[0]) {
    try {
      await window.trackExtensionFolder(result[0]);
    } catch (error: unknown) {
      // show error
      await window.showMessageBox({
        title: 'Add Extension Failed',
        message: String(error),
        type: 'error',
        buttons: ['Dismiss'],
      });
    }
  }
}
</script>

{#if isDevelopmentModeEnabled}
  <div class="grow px-5 py-3">
    <div class="flex flex-col">
      <!-- List all -->
      <div class="bg-(--pd-content-card-bg) rounded-md flex flex-col p-4">
        <div class="flex flex-row w-full pb-2">
          <div class="text font-medium first-letter:uppercase pb-2">Local extension folders being tracked</div>
          <div class="grow flex flex-col items-end">
            <Button on:click={addLocalFolderExtension}>Add a local folder extension...</Button>
          </div>
        </div>

        <!-- List of extensions in development mode -->
        {#if extensionFolders.length === 0}
          {#if searchTerm}
            <FilteredEmptyScreen
              icon={ExtensionIcon}
              kind="extensions"
              searchTerm={searchTerm}
              on:resetFilter={(): string => (searchTerm = '')} />
          {:else}
            <div class="italic">No extension for now</div>
          {/if}
        {:else}
          <div class="mr-5 -ml-5 mb-3">
            <DevelopmentExtensionListTable extensionFolderUIInfos={extensionFolders} />
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <DevelopmentExtensionEmptyScreen />
{/if}
