<script lang="ts">
import { faCheckCircle, faCircleArrowUp, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Button, Link } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { onDestroy } from 'svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import { providerInfos } from '/@/stores/providers';

import { imagesInfos } from '../../stores/images';
import type { PushImageCallback } from '../../stores/push-images.svelte';
import { getNextTaskId, getPushImageInfo, PushImageInfo } from '../../stores/push-images.svelte';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';
import { ImageUtils } from './image-utils';
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
let imageTags: string[] = $state([]);

let pushImageInfo = $state(new PushImageInfo());
let logsTerminal: Terminal | undefined = $state();

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

const imageUtils = new ImageUtils();

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
  const inspectInfo = await window.getImageInspect(engineId, imageId);
  imageTags = inspectInfo.RepoTags;
  if (imageTags.length > 0) {
    selectedImageTag = imageTags[0];
  }
  let imageInfo = $imagesInfos.find(c => c.Id === imageId && c.engineId === engineId);
  if (imageInfo) {
    image = imageUtils.getImageInfoUI(imageInfo, base64RepoTag, []);
  }
}

async function checkRegistryAuthConfiguration(): Promise<void> {
  if (image) {
    window
      .hasAuthconfigForImage(image.name)
      .then(result => (isAuthenticatedForThisImage = result))
      .catch((err: unknown) => console.error(`Error getting authentication required for image ${imageId}`, err));
  }
}
$effect(() => {
  if (taskId && taskId !== pushImageInfo.taskId) {
    //
    loadBackgroundPush();
  }
  loadImageInfo().catch((err: unknown) => console.log(`Cannot load image info: ${err}`));
  checkRegistryAuthConfiguration().catch((err: unknown) => console.log(`Cannot check auth configuration: ${err}`));
});

async function pushImage(): Promise<void> {
  logsTerminal?.reset();
  pushImageInfo.connectUI(createCallback());
  return pushImageInfo.pushImage(engineId, selectedImageTag, imageId, base64RepoTag, getNextTaskId());
}

async function pushImageFinished(): Promise<void> {
  router.goto('/images');
}

let isAuthenticatedForThisImage = $state(false);

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
    <i class="fas fa-arrow-circle-down fa-2x" aria-hidden="true"></i>
  {/snippet}
  {#snippet content()}
    <div class="space-y-6">
      <div class="w-full">
        <div class="flex-column">
          <div>taskId: {taskId}</div>
          <div>imageId: {imageId}</div>
          <div>engineId: {engineId}</div>
          <div>base64RepoTag: {base64RepoTag}</div>
        </div>
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
          bind:value={selectedImageTag}>
          {#each imageTags as imageTag, index (index)}
            <option value={imageTag}>{imageTag}</option>
          {/each}
        </select>
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
          disabled={!isAuthenticatedForThisImage}
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
