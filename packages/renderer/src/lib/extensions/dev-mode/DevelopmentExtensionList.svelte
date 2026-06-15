<script lang="ts">
import type { ExtensionDevelopmentFolderInfo, ExtensionInfo } from '@podman-desktop/core-api';
import { ExtensionLoaderSettings } from '@podman-desktop/core-api';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import DevelopmentExtensionListTable from '/@/lib/extensions/dev-mode/table/ListTable.svelte';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import { extensionDevelopmentFolders } from '/@/stores/extensionDevelopmentFolders';
import { extensionInfos } from '/@/stores/extensions';

import type { SelectableExtensionDevelopmentFolderInfoUI } from './development-folder-info-ui';
import DevelopmentExtensionEmptyScreen from './DevelopmentExtensionEmptyScreen.svelte';

let isDevelopmentModeEnabled = $state(false);

const unsubscribers: Unsubscriber[] = [];

let currentExtFolders: ExtensionDevelopmentFolderInfo[] = $state([]);
let currentExtensionInfos: ExtensionInfo[] = $state([]);

const selectableExtensionDevelopmentFolders: SelectableExtensionDevelopmentFolderInfoUI[] = $derived(
  currentExtFolders.map(folder => {
    // do we have a matching extension
    const matchingExtension = currentExtensionInfos.find(ext => ext.path === folder.path);
    let extension = undefined;
    if (matchingExtension) {
      extension = { name: matchingExtension.name, state: matchingExtension.state, id: matchingExtension.id };
    }

    return { ...folder, selected: false, name: folder.path, extension };
  }),
);

onMount(async () => {
  //
  // Check if development mode is enabled
  isDevelopmentModeEnabled =
    (await window.getConfigurationValue(
      `${ExtensionLoaderSettings.SectionName}.${ExtensionLoaderSettings.DevelopmentMode}`,
    )) ?? false;

  // subscribe to extension changes
  unsubscribers.push(
    extensionInfos.subscribe(value => {
      currentExtensionInfos = value;
    }),
  );
  unsubscribers.push(
    extensionDevelopmentFolders.subscribe(value => {
      currentExtFolders = value;
    }),
  );
});

onDestroy(() => {
  for (const unsubscriber of unsubscribers) {
    unsubscriber();
  }
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

{#if !isDevelopmentModeEnabled}
  <div class="flex flex-1 w-full items-center justify-center">
    <DevelopmentExtensionEmptyScreen />
  </div>
{:else if selectableExtensionDevelopmentFolders.length === 0}
  <div class="flex flex-1 w-full items-center justify-center">
    <EmptyScreen
      icon={ExtensionIcon}
      title="No local extensions tracked"
      message="Add a folder on your machine to load and test an extension during development."
      detail="Tracked folders appear here with load status and actions.">
      <Button type="primary" on:click={addLocalFolderExtension}>Add a local folder extension...</Button>
    </EmptyScreen>
  </div>
{:else}
  <div class="flex flex-col grow px-5 py-3">
    <div class="mb-4 flex flex-row items-center justify-end">
      <Button on:click={addLocalFolderExtension}>Add a local folder extension...</Button>
    </div>
    <DevelopmentExtensionListTable extensionFolderUIInfos={selectableExtensionDevelopmentFolders} />
  </div>
{/if}
