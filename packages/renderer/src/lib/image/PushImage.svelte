<script lang="ts">
import { faCheckCircle, faCircleArrowUp, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Button, Link } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { onMount, tick } from 'svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import { providerInfos } from '/@/stores/providers';

import { imagesInfos } from '../../stores/images';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';
import { ImageUtils } from './image-utils';
import type { ImageInfoUI } from './ImageInfoUI';

export let imageId: string;
export let engineId: string;
export let base64RepoTag: string;

let image: ImageInfoUI | undefined;
let pushInProgress = false;
let pushFinished = false;
let initTerminal = false;
let logsPush: Terminal;

let selectedImageTag = '';
let imageTags: string[] = [];

$: providerConnections = $providerInfos
  .map(provider => provider.containerConnections)
  .flat()
  .filter(providerContainerConnection => providerContainerConnection.status === 'started');

const imageUtils = new ImageUtils();

onMount(async () => {
  const inspectInfo = await window.getImageInspect(engineId, imageId);
  imageTags = inspectInfo.RepoTags;
  if (imageTags.length > 0) {
    selectedImageTag = imageTags[0];
  }
  let imageInfo = $imagesInfos.find(c => c.Id === imageId && c.engineId === engineId);
  if (imageInfo) {
    image = imageUtils.getImageInfoUI(imageInfo, base64RepoTag, []);
  }
  if (image) {
    window
      .hasAuthconfigForImage(image.name)
      .then(result => (isAuthenticatedForThisImage = result))
      .catch((err: unknown) => console.error(`Error getting authentication required for image ${imageId}`, err));
  }
});

async function pushImage(imageTag: string): Promise<void> {
  gotErrorDuringPush = false;
  initTerminal = true;
  await tick();
  window.dispatchEvent(new Event('resize'));
  logsPush?.reset();

  pushInProgress = true;

  await window.pushImage(engineId, imageTag, callback);
}

let gotErrorDuringPush = false;

async function pushImageFinished(): Promise<void> {
  router.goto('/images');
}
function callback(name: string, data: string): void {
  if (name === 'first-message') {
    // clear on the first message
    logsPush?.clear();
  } else if (name === 'data') {
    // parse JSON message
    const jsonObject = JSON.parse(data);
    if (jsonObject.status) {
      logsPush?.write(jsonObject.status + '\n\r');
    }
  } else if (name === 'error') {
    gotErrorDuringPush = true;
    logsPush?.write(data + '\n\r');
  } else if (name === 'end') {
    if (!gotErrorDuringPush) {
      pushFinished = true;
    }
    pushInProgress = false;
  }
}

let isAuthenticatedForThisImage = false;
</script>
  <EngineFormPage
    title="Push image to a registry"
    inProgress={pushInProgress}
    showEmptyScreen={providerConnections.length === 0}>
    <svelte:fragment slot="icon">
      <i class="fas fa-arrow-circle-down fa-2x" aria-hidden="true"></i>
    </svelte:fragment>
    <div slot="content" class="space-y-6">
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
          bind:value={selectedImageTag}>
          {#each imageTags as imageTag}
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

      <div class="h-[185px]" hidden={initTerminal === false}>
        <TerminalWindow class="h-full" bind:terminal={logsPush} disableStdIn />
      </div>
      {#if !pushInProgress && !pushFinished}
      <Button class="w-auto" type="secondary" on:click={pushImageFinished}>Cancel</Button>
    {/if}
    {#if !pushFinished}
      <Button
        class="w-auto"
        icon={faCircleArrowUp}
        disabled={!isAuthenticatedForThisImage}
        on:click={async (): Promise<void> => {
          await pushImage(selectedImageTag);
        }}
        bind:inProgress={pushInProgress}>
        Push image
      </Button>
    {:else}
      <Button on:click={pushImageFinished} class="w-auto">Done</Button>
    {/if}
    </div>
  </EngineFormPage>