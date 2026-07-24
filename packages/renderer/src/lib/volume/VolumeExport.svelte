<script lang="ts">
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Button, ErrorMessage, Input } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import { Uri } from '/@/lib/uri/Uri';
import { volumeListInfos } from '/@/stores/volumes';

import { VolumeUtils } from './volume-utils';
import type { VolumeInfoUI } from './VolumeInfoUI';

export let volumeName: string;
export let engineId: string;

let volume: VolumeInfoUI | undefined = undefined;

let invalidFolder = true;
let outputTarget = '';
let outputUri: Uri;
let exportError = '';
let inProgress = false;

const volumeUtils = new VolumeUtils();

onMount(() => {
  let volumesLoaded = false;

  return volumeListInfos.subscribe(value => {
    if (value.length === 0 && !volumesLoaded) {
      return;
    }
    volumesLoaded = true;

    const allVolumes = value.map(v => v.Volumes).flat();
    const matchingVolume = allVolumes.find(v => v.Name === volumeName && v.engineId === engineId);
    if (matchingVolume) {
      volume = volumeUtils.toVolumeInfoUI(matchingVolume);
    } else if (volumesLoaded) {
      router.goto('/volumes');
    }
  });
});

function handleOutputPathKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    selectOutputPath().catch((error: unknown) => {
      console.error(error);
    });
  }
}

async function selectOutputPath(): Promise<void> {
  if (!volume) return;

  const result = await window.saveDialog({
    title: 'Select the directory where to export the volume content',
    defaultUri: {
      fsPath: `${volume.shortName}.tar`,
      path: `${volume.shortName}.tar`,
      scheme: 'file',
    } as Uri,
  });
  if (!result) {
    if (!outputTarget) {
      invalidFolder = true;
    }
    return;
  }
  const uriAPI = Uri.revive(result);
  outputUri = uriAPI;
  outputTarget = uriAPI.fsPath;
  invalidFolder = false;
}

async function exportVolume(): Promise<void> {
  if (!volume) return;

  exportError = '';
  inProgress = true;

  try {
    await window.exportVolume(volume.engineId, {
      volumeName: volume.name,
      outputTarget: outputUri.fsPath,
    });
    router.goto('/volumes');
  } catch (error) {
    exportError = String(error);
  } finally {
    inProgress = false;
  }
}
</script>

{#if volume}
  <EngineFormPage title="Export volume {volume.shortName}">
    {#snippet icon()}
      <i class="fas fa-download fa-2x" aria-hidden="true"></i>
    {/snippet}

    {#snippet content()}
      {#if volume}
        <div class="space-y-2">
          <div>
            <label for="modalSelectTarget" class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
              >Export to:</label>
            <div class="flex w-full">
              <div
                class="grow mr-2 cursor-pointer"
                role="button"
                tabindex="0"
                title="Open dialog to select the output file"
                aria-label="Select output file"
                on:click={selectOutputPath}
                on:keydown={handleOutputPathKeydown}>
                <Input
                  class="w-full"
                  inputClass="cursor-pointer"
                  name={volume.name}
                  readonly
                  value={outputTarget}
                  id="input-export-volume-name"
                  placeholder="Select a destination file..."
                  aria-invalid={invalidFolder} />
              </div>
              <Button
                on:click={selectOutputPath}
                title="Open dialog to select the output file"
                aria-label="Select output file">Browse...</Button>
            </div>
            <Button
              on:click={exportVolume}
              class="w-full mt-5"
              icon={faDownload}
              inProgress={inProgress}
              disabled={invalidFolder}
              aria-label="Export volume">
              Export Volume
            </Button>
            <div aria-label="exportError">
              {#if exportError}
                <ErrorMessage class="py-2 text-sm" error={exportError} />
              {/if}
            </div>
          </div>
        </div>
      {/if}
    {/snippet}
  </EngineFormPage>
{/if}
