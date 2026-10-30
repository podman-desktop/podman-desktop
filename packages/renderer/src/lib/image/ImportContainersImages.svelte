<script lang="ts">
/* eslint-disable import/no-duplicates */
// https://github.com/import-js/eslint-plugin-import/issues/1479
import type { ProviderContainerConnectionInfo, ProviderInfo } from '@desktop-framework/api';
import { faCircleArrowDown, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, ErrorMessage, Input } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { get } from 'svelte/store';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import { providerInfos } from '/@/stores/providers';

interface Props {
  closeCallback: () => void;
}

let { closeCallback }: Props = $props();

let containersToImport: { imagePath: string; nameWhenImporting: string }[] = $state([]);
let importError: string = $state('');

let providers: ProviderInfo[] = [];
let providerConnections: ProviderContainerConnectionInfo[] = $state([]);
let selectedProvider: ProviderContainerConnectionInfo | undefined = $state(undefined);
let inProgress = $state(false);

let importDisabled = $derived(!selectedProvider || containersToImport.length === 0);

onMount(async () => {
  providers = get(providerInfos);
  providerConnections = providers
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started');

  const selectedProviderConnection = providerConnections.length > 0 ? providerConnections[0] : undefined;
  selectedProvider = !selectedProvider && selectedProviderConnection ? selectedProviderConnection : selectedProvider;
});

async function addContainersToImport(): Promise<void> {
  const images = await window.openDialog({
    title: 'Select Containers Images to import',
    selectors: ['multiSelections', 'openFile'],
  });

  if (!images) {
    return;
  }

  const imagesInfo: { imagePath: string; nameWhenImporting: string }[] = [];
  images.forEach(imgPath => {
    imgPath = imgPath.replace(/\\/g, '/');
    let lastSlashPos = imgPath.lastIndexOf('/') + 1;
    let lastDot: number | undefined = imgPath.lastIndexOf('.');
    if (lastDot === -1 || lastDot < lastSlashPos) {
      lastDot = undefined;
    }
    imagesInfo.push({
      imagePath: imgPath,
      nameWhenImporting: imgPath.substring(lastSlashPos, lastDot),
    });
  });

  containersToImport = [...containersToImport, ...imagesInfo];
}

function deleteContainerToImport(index: number): void {
  containersToImport = containersToImport.filter((_, i) => i !== index);
}

function closeModal(): void {
  // The import API cannot cancel an active operation.
  if (inProgress) {
    return;
  }

  closeCallback();
}

async function importContainers(): Promise<void> {
  importError = '';

  if (!selectedProvider) {
    throw new Error('Select a provider to import');
  }

  inProgress = true;

  for (const containerImage of containersToImport) {
    try {
      await window.importContainer({
        provider: $state.snapshot(selectedProvider),
        archivePath: containerImage.imagePath,
        imageTag: containerImage.nameWhenImporting,
      });
    } catch (e) {
      importError += `Error while importing ${containerImage.imagePath}: ${String(e)}\n`;
    }
  }

  inProgress = false;
  if (importError === '') {
    closeCallback();
  }
}
</script>

<Dialog title="Import Containers" onclose={closeModal} initialButtonFocus="none">
  {#snippet content()}
    <div class="space-y-4">
      {#if providerConnections.length > 1}
        <div>
          <label for="providerChoice" class="block mb-2 font-semibold">Container engine</label>
          <ContainerConnectionDropdown
            id="providerChoice"
            name="providerChoice"
            bind:value={selectedProvider}
            connections={providerConnections}
            disabled={inProgress} />
        </div>
      {/if}

      <div>
        <p class="mb-2 font-semibold">Containers to import</p>
        <Button onclick={addContainersToImport} icon={faPlusCircle} type="link" disabled={inProgress}>Add images to import</Button>
      </div>

      {#if containersToImport.length > 0}
        <!-- Keep file paths and editable image names aligned within the modal. -->
        <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
          <span class="text-sm font-semibold">Image path</span>
          <span class="text-sm font-semibold">Image name</span>
          <span></span>
          {#each containersToImport as containerToImport, index (index)}
            <Input bind:value={containerToImport.imagePath} aria-label="container image path" readonly />
            <Input
              bind:value={containerToImport.nameWhenImporting}
              disabled={inProgress}
              aria-label="container importing name"
              placeholder="quay.io/podman/hello" />
            <Button
              type="link"
              onclick={deleteContainerToImport.bind(undefined, index)}
              disabled={inProgress}
              icon={faMinusCircle}
              aria-label="Remove container" />
          {/each}
        </div>
      {/if}

      {#if importError !== ''}
        <ErrorMessage error={importError} />
      {/if}
    </div>
  {/snippet}
  {#snippet buttons()}
    <Button type="link" onclick={closeModal} disabled={inProgress}>Cancel</Button>
    <Button
      type="primary"
      onclick={importContainers}
      inProgress={inProgress}
      icon={faCircleArrowDown}
      aria-label="Import containers"
      disabled={importDisabled}>
      Import containers
    </Button>
  {/snippet}
</Dialog>
