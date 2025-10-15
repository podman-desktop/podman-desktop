<script lang="ts">
import { faCheckCircle, faCircleArrowUp, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Button, Link } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import type { ImageInspectInfo } from 'dockerode';
import { onDestroy, onMount } from 'svelte';
import { get } from 'svelte/store';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import { providerInfos } from '/@/stores/providers';

import { lastPage } from '../../stores/breadcrumb';
import type { PushImageCallback } from '../../stores/push-images.svelte';
import { getNextTaskId, getPushImageInfo, PushImageInfo } from '../../stores/push-images.svelte';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';
import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  imageId: string;
  engineId: string;
  base64RepoTag: string;
  taskId?: number;
}

let { imageId, engineId, base64RepoTag, taskId = 0 }: Props = $props();

let image: ImageInfoUI | undefined;
let selectedImageTag = $state('');
let displayTags: string[] = $state([]);
let imageLoadError = $state('');
let imageTags: string[] = $state([]);
let tagCheckError = $state('');

let pushImageInfo = $state(new PushImageInfo());
let logsTerminal: Terminal | undefined = $state();

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

function createCallback(): PushImageCallback {
  return {
    onFirstMessage: (): void => {
      logsTerminal?.clear();
      window.dispatchEvent(new Event('resize'));
    },
    onData: (data: string): void => {
      logsTerminal?.write(data + '\n\r');
    },
    onError: (data: string): void => {
      logsTerminal?.write(data + '\n\r');
    },
    onEnd: (): void => {
      pushImageInfo.disconnectUI();
    },
  };
}

function loadBackgroundPush(): void {
  // switching from previous push image dialog which can be finished or still running
  if (pushImageInfo.inProgress) {
    pushImageInfo.disconnectUI();
  }
  logsTerminal?.reset();
  const bgPushImageInfo = getPushImageInfo(taskId);
  if (bgPushImageInfo) {
    if (bgPushImageInfo.inProgress) {
      pushImageInfo = bgPushImageInfo;
    } else {
      pushImageInfo.inProgress = $state.snapshot(bgPushImageInfo.inProgress);
      pushImageInfo.finished = $state.snapshot(bgPushImageInfo.finished);
      pushImageInfo.error = $state.snapshot(bgPushImageInfo.error);
      pushImageInfo.taskId = $state.snapshot(bgPushImageInfo.taskId);
      pushImageInfo.replay = $state.snapshot(bgPushImageInfo.replay);
    }
    pushImageInfo.connectUI(createCallback());
    logsTerminal?.write(pushImageInfo.replay);
  }
}

async function loadImageInfo(): Promise<void> {
  let inspectInfo: ImageInspectInfo | undefined = undefined;
  try {
    inspectInfo = await window.getImageInspect(engineId, imageId);
    imageTags = inspectInfo.RepoTags || []; // Keep original tags for existence checking
    imageLoadError = '';
  } catch (error) {
    imageLoadError = `Image with ID ${imageId} does not exist.`;
    console.warn(imageLoadError);
  }

  try {
    selectedImageTag = atob(base64RepoTag);
  } catch (decodeError) {
    console.error('Failed to decode base64RepoTag:', decodeError);
    selectedImageTag = base64RepoTag;
  }

  displayTags = [...imageTags];
  // Check if parameter tag exists in the original image tags
  if (!imageTags.includes(selectedImageTag)) {
    // Add parameter tag to display list only, mark as added
    displayTags = [selectedImageTag, ...displayTags];
    tagCheckError = `Tag '${selectedImageTag}' doesn't exist locally`;
  }
}

function onChangeImageTag(): void {
  if (imageTags.includes(selectedImageTag)) {
    tagCheckError = '';
  } else {
    tagCheckError = `Tag '${selectedImageTag}' doesn't exist locally`;
  }
}

async function checkRegistryAuthConfiguration(): Promise<void> {
  const imageName = image ? image.name : atob(base64RepoTag);
  window
    .hasAuthconfigForImage(imageName)
    .then(result => (isAuthenticatedForThisImage = result))
    .catch((err: unknown) => console.error(`Error getting authentication required for image ${imageId}`, err));
}

async function pushImage(): Promise<void> {
  logsTerminal?.reset();
  pushImageInfo.connectUI(createCallback());
  return pushImageInfo.pushImage(engineId, selectedImageTag, imageId, base64RepoTag, getNextTaskId());
}

function pushImageFinished(): void {
  router.goto(get(lastPage).path);
}
let isAuthenticatedForThisImage = $state(false);

onMount(() => {
  loadBackgroundPush();
  $effect(() => {
    if (taskId && taskId !== pushImageInfo.taskId) {
      //
      loadBackgroundPush();
    }
    loadImageInfo()
      .catch((err: unknown) => console.log(`Cannot load image info: ${err}`))
      .then(() => checkRegistryAuthConfiguration())
      .catch((err: unknown) => console.log(`Cannot check auth configuration: ${err}`));
  });
});

onDestroy(() => {
  pushImageInfo.disconnectUI();
});

function onInit(): void {
  logsTerminal?.write(pushImageInfo.replay);
}
</script>

<EngineFormPage
  title="Push image to a registry"
  inProgress={pushImageInfo.inProgress}
  showEmptyScreen={providerConnections.length === 0}>
  {#snippet icon()}
    <i class="fas fa-arrow-circle-up fa-2x" aria-hidden="true"></i>
  {/snippet}
  {#snippet content()}
    <div class="space-y-6">
      <div class="w-full">
        <label for="modalImageTag" class="block mb-2 text-sm font-medium text-[var(--pd-modal-text)]">Image tag</label>
        {#if isAuthenticatedForThisImage}
          <Fa class="absolute mt-3 ml-1.5 text-[var(--pd-state-success)]" size="1x" icon={faCheckCircle} />
        {:else}
          <Fa class="absolute mt-3 ml-1.5 text-[var(--pd-state-warning)]" size="1x" icon={faTriangleExclamation} />
        {/if}

        <select
          class="text-sm rounded-lg block w-full p-2.5 bg-[var(--pd-dropdown-bg)] pl-6 border-r-8 border-transparent outline-1 outline {isAuthenticatedForThisImage
            ? 'outline-[var(--pd-modal-border)]'
            : 'outline-[var(--pd-state-warning)]'} placeholder-[var(--pd-content-text)] text-[var(--pd-default-text)]"
          name="imageChoice"
          bind:value={selectedImageTag}
          onchange={onChangeImageTag}
          disabled={displayTags.length === 0}>
          {#each displayTags as imageTag, index (index)}
            <option value={imageTag}>{imageTag}{imageTags.includes(imageTag)? '' : ' (loaded from parameters)'}</option>
          {/each}
          {#if displayTags.length === 0}
            <option value="" disabled>No tags available</option>
          {/if}
        </select>
        
        <!-- Additional warning for missing image -->
        {#if imageLoadError}
          <p class="text-[var(--pd-state-warning)] pt-1 text-sm">
              {imageLoadError}.
          </p>
        {/if}
        {#if !imageLoadError && tagCheckError}
          <p class="text-[var(--pd-state-warning)] pt-1 text-sm">
            {tagCheckError}.
          </p>
        {/if}
       
        <!-- If the image is UNAUTHENTICATED, show a warning that the image is unable to be pushed
        and to click to go to the registries page -->
        {#if !isAuthenticatedForThisImage}
          <p class="text-[var(--pd-state-warning)] pt-1">
            No registry with push permissions found. <Link on:click={(): void => router.goto('/preferences/registries')}
              >Add a registry now.</Link>
          </p>
        {/if}
      </div>

      <div class="h-[185px]" hidden={!pushImageInfo.inProgress && !pushImageInfo.finished}>
        <TerminalWindow class="h-full" on:init={onInit} bind:terminal={logsTerminal} disableStdIn />
      </div>
      {#if !pushImageInfo.inProgress && !pushImageInfo.finished}
        <Button class="w-auto" type="secondary" on:click={pushImageFinished}>Cancel</Button>
      {/if}
      {#if !pushImageInfo.finished}
        <Button
          class="w-auto"
          icon={faCircleArrowUp}
          disabled={!isAuthenticatedForThisImage || displayTags.length === 0}
          on:click={pushImage}
          inProgress={pushImageInfo.inProgress}>
          Push image
        </Button>
      {:else}
        <Button on:click={pushImageFinished} class="w-auto">Done</Button>
      {/if}
    </div>
  {/snippet}
</EngineFormPage>
