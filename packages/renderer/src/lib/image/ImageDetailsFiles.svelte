<script lang="ts">
import type { ImageInfo } from '@podman-desktop/api';
import type { ImageFilesInfo, ImageFilesystemLayersUI, ImageFilesystemLayerUI } from '@podman-desktop/core-api';
import { Button, Checkbox } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import { imageFilesProviders } from '/@/stores/image-files-providers';

import FilesystemLayerView from './FilesystemLayerView.svelte';
import ImageDetailsFilesLayers from './ImageDetailsFilesLayers.svelte';

interface Props {
  engineId: string;
  imageId: string;
}
let { engineId, imageId }: Props = $props();

// the image files API takes the raw ImageInfo, which the images store no longer holds
async function getImageInfo(): Promise<ImageInfo | undefined> {
  const images = await window.listImages();
  return images.find(image => image.engineId === engineId && image.Id === imageId);
}

let imageLayers = $state<ImageFilesystemLayersUI>();
let selectedLayer = $state<ImageFilesystemLayerUI>();
let loading = $state<boolean>(false);
let error = $state<string>('');
let showLayerOnly = $state<boolean>(false);
let showFetchButton = $state<boolean>(false);

let filesProvidersUnsubscribe: Unsubscriber;
let filesProvider: ImageFilesInfo | undefined = undefined;
let cancellableTokenId: number = 0;
let askFetchLayers: boolean = true;

function onSelectedLayer(event: CustomEvent<ImageFilesystemLayerUI>): void {
  selectedLayer = event.detail;
}

async function fetchImageLayers(provider: ImageFilesInfo, img: ImageInfo): Promise<void> {
  try {
    loading = true;
    cancellableTokenId = await window.getCancellableTokenSource();
    imageLayers = await window.imageGetFilesystemLayers(provider.id, $state.snapshot(img), cancellableTokenId);
  } catch (err: unknown) {
    error = String(err);
  } finally {
    loading = false;
  }
}

async function onFetchLayers(): Promise<void> {
  showFetchButton = false;
  const imageInfo = await getImageInfo();
  if (filesProvider !== undefined && imageInfo !== undefined) {
    await fetchImageLayers(filesProvider, imageInfo);
  }
}

onMount(async () => {
  try {
    const value = await window.getConfigurationValue<boolean>('userConfirmation.fetchImageFiles');
    if (value !== undefined) {
      askFetchLayers = value;
    }
  } finally {
    // we do this after trying to get the configuration, to be sure we are using the right configuration
    filesProvidersUnsubscribe = imageFilesProviders.subscribe(providers => {
      if (providers.length === 1) {
        filesProvider = providers[0];
        if (askFetchLayers) {
          showFetchButton = true;
        } else {
          onFetchLayers().catch((err: unknown) => console.error(`Error fetching image layers ${imageId}`, err));
        }
      }
    });
  }
});

onDestroy(async () => {
  await window.cancelToken(cancellableTokenId);
  filesProvidersUnsubscribe?.();
});
</script>

{#if loading}
  <div class="p-4">Layers are being loaded. This can take a while for large images, please wait...</div>
{/if}
{#if showFetchButton}
  <div aria-label="fetch" class="p-4"><Button on:click={onFetchLayers}>Fetch Layers</Button></div>
{/if}
{#if error}
  <div class="p-4 text-[var(--pd-state-error)]">
    {error}
  </div>
{:else if imageLayers}
  <div class="flex flex-col w-full h-full p-8 pr-0 text-[var(--pd-content-text)] bg-[var(--pd-content-bg)]">
    <div class="mb-2 flex flex-row pr-12 pb-2">
      <span class="grow">Layers</span>
      <span><Checkbox bind:checked={showLayerOnly}>Show layer only</Checkbox></span>
    </div>
    <div class="h-full flex flex-row space-x-8">
      <div role="list" aria-label="layers" class="h-full overflow-y-auto w-3/4">
        <ImageDetailsFilesLayers on:selected={onSelectedLayer} layers={imageLayers.layers} />
      </div>
      <div aria-label="tree" class="h-full w-full pr-4 overflow-y-auto pb-16">
        {#if selectedLayer}
          <div class="grid grid-cols-[90px_60px_70px_1fr]">
            <FilesystemLayerView
              tree={showLayerOnly ? selectedLayer.layerTree.root : selectedLayer.stackTree.root}
              layerMode={showLayerOnly} />
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
