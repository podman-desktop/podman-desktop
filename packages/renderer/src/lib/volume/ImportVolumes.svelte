<script lang="ts">
import { faPlusCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import type { ProviderContainerConnectionInfo, ProviderInfo, VolumeInfo } from '@podman-desktop/core-api';
import { Button, ErrorMessage, Input } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import { providerInfos } from '/@/stores/providers';
import { fetchVolumesWithData, volumeListInfos } from '/@/stores/volumes';

type TargetMode = 'existing' | 'new';

let archivePath: string = $state('');
let targetMode: TargetMode = $state('existing');
let selectedExistingVolume: string = $state('');
let newVolumeName: string = $state('');
let importError: string = $state('');

let providers: ProviderInfo[] = [];
let providerConnections: ProviderContainerConnectionInfo[] = $state([]);
let selectedProvider: ProviderContainerConnectionInfo | undefined = $state(undefined);
let inProgress = $state(false);

let existingVolumes: VolumeInfo[] = $state([]);

let targetVolumeName = $derived(targetMode === 'existing' ? selectedExistingVolume : newVolumeName);
let importDisabled = $derived(!selectedProvider || !archivePath || !targetVolumeName);

onMount(async () => {
  providers = get(providerInfos);
  providerConnections = providers
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started');

  const selectedProviderConnection = providerConnections.length > 0 ? providerConnections[0] : undefined;
  selectedProvider = !selectedProvider && selectedProviderConnection ? selectedProviderConnection : selectedProvider;

  const volumeInfos = get(volumeListInfos);
  existingVolumes = volumeInfos.map(v => v.Volumes).flat();

  if (existingVolumes.length === 0) {
    targetMode = 'new';
  } else {
    selectedExistingVolume = existingVolumes[0].Name;
  }
});

async function selectArchiveFile(): Promise<void> {
  const files = await window.openDialog({
    title: 'Select volume archive to import',
    selectors: ['openFile'],
  });

  if (!files || files.length === 0) {
    return;
  }

  archivePath = files[0].replace(/\\/g, '/');

  if (targetMode === 'new' && !newVolumeName) {
    let lastSlashPos = archivePath.lastIndexOf('/') + 1;
    let lastDot: number | undefined = archivePath.lastIndexOf('.');
    if (lastDot === -1 || lastDot < lastSlashPos) {
      lastDot = undefined;
    }
    newVolumeName = archivePath.substring(lastSlashPos, lastDot);
  }
}

async function importVolume(): Promise<void> {
  importError = '';

  if (!selectedProvider) {
    importError = 'Select a container engine to import into';
    return;
  }

  inProgress = true;

  try {
    if (targetMode === 'new') {
      await window.createVolume($state.snapshot(selectedProvider), { Name: newVolumeName });
    }

    await window.importVolume({
      provider: $state.snapshot(selectedProvider),
      volumeName: targetVolumeName,
      archivePath: archivePath,
    });

    await fetchVolumesWithData();
    router.goto('/volumes');
  } catch (e) {
    importError = String(e);
  } finally {
    inProgress = false;
  }
}
</script>

<EngineFormPage title="Import Volume">
  {#snippet icon()}
    <i class="fas fa-upload fa-2x" aria-hidden="true"></i>
  {/snippet}
  {#snippet content()}
  <div class="space-y-4">
    {#if providerConnections.length > 1}
    <div>
      <label for="providerChoice" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
        >Container engine</label>
      <ContainerConnectionDropdown
        id="providerChoice"
        name="providerChoice"
        bind:value={selectedProvider}
        connections={providerConnections}/>
    </div>
    {/if}

    <div>
      <label for="archiveFile" class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
        >Archive file:</label>
      <div class="flex w-full gap-2">
        <Input
          class="grow"
          name="archiveFile"
          readonly
          value={archivePath}
          id="input-import-volume-archive"
          placeholder="Select a .tar archive file..."
          aria-invalid={!archivePath} />
        <Button
          on:click={selectArchiveFile}
          icon={faPlusCircle}
          title="Open dialog to select an archive file"
          aria-label="Select archive file">Browse...</Button>
      </div>
    </div>

    <div>
      <label for="targetVolumeMode" class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
        >Target volume:</label>
      <div class="flex gap-4 mb-3">
        <label class="flex items-center gap-2 text-sm text-[var(--pd-content-card-text)] cursor-pointer">
          <input
            type="radio"
            name="targetVolumeMode"
            value="existing"
            bind:group={targetMode}
            disabled={existingVolumes.length === 0}
            class="accent-[var(--pd-button-primary-bg)]" />
          Select existing volume
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--pd-content-card-text)] cursor-pointer">
          <input
            type="radio"
            name="targetVolumeMode"
            value="new"
            bind:group={targetMode}
            class="accent-[var(--pd-button-primary-bg)]" />
          Create new volume
        </label>
      </div>

      {#if targetMode === 'existing'}
        <select
          bind:value={selectedExistingVolume}
          id="input-import-volume-existing"
          aria-label="Select existing volume"
          class="w-full rounded-sm bg-[var(--pd-input-field-bg)] text-[var(--pd-input-field-focused-text)]
                 border border-[var(--pd-input-field-stroke)] px-3 py-2 text-sm
                 focus:outline-none focus:ring-1 focus:ring-[var(--pd-input-field-stroke-focused)]">
          {#each existingVolumes as vol (vol.Name)}
            <option value={vol.Name}>{vol.Name}</option>
          {/each}
        </select>
        <p class="mt-1 text-xs text-[var(--pd-content-card-text)]">
          The existing volume contents will be overwritten with the imported archive.
        </p>
      {:else}
        <Input
          bind:value={newVolumeName}
          name="newVolumeName"
          id="input-import-volume-new"
          placeholder="Enter volume name (e.g. my-data)"
          aria-label="New volume name" />
        <p class="mt-1 text-xs text-[var(--pd-content-card-text)]">
          A new volume will be created and the archive contents imported into it.
        </p>
      {/if}
    </div>

    <div class="pt-2">
      <Button
        on:click={importVolume}
        inProgress={inProgress}
        class="w-full"
        icon={faUpload}
        aria-label="Import volume"
        disabled={importDisabled}>
        Import Volume
      </Button>
      <div aria-label="importError">
        {#if importError !== ''}
          <ErrorMessage class="py-2 text-sm" error={importError} />
        {/if}
      </div>
    </div>
  </div>
  {/snippet}
</EngineFormPage>
