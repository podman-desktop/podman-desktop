<script lang="ts">
import { faArrowCircleDown, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Button, Dropdown, ErrorMessage } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { onMount, tick } from 'svelte';
import { router } from 'tinro';

import { lastPage } from '/@/stores/breadcrumb';
import { runImageInfo } from '/@/stores/run-image-store';
import type { ImageSearchOptions } from '/@api/image-registry';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';
import type { PullEvent } from '/@api/pull-event';

import { providerInfos } from '../../stores/providers';
import { ImageUtils } from '../image/image-utils';
import ImageIcon from '../images/ImageIcon.svelte';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';
import Typeahead from '../ui/Typeahead.svelte';
import WarningMessage from '../ui/WarningMessage.svelte';

const DOCKER_PREFIX = 'docker.io';
const DOCKER_PREFIX_WITH_SLASH = DOCKER_PREFIX + '/';

const imageUtils = new ImageUtils();

let logsPull: Terminal;
let pullError = '';
let pullInProgress = false;
let pullFinished = false;
let isValidName = true;
let matchingLocalImages: string[] = [];

let imageToPull: string = '';

$: providerConnections = $providerInfos
  .map(provider => provider.containerConnections)
  .flat()
  .filter(providerContainerConnection => providerContainerConnection.status === 'started');

let selectedProviderConnection: ProviderContainerConnectionInfo | undefined;

const lineNumberPerId = new Map<string, number>();
let lineIndex = 0;

function callback(event: PullEvent) {
  let lineIndexToWrite;
  if (event.status && event.id) {
    const lineNumber = lineNumberPerId.get(event.id);
    if (lineNumber) {
      lineIndexToWrite = lineNumber;
    } else {
      lineIndex++;
      lineIndexToWrite = lineIndex;
      lineNumberPerId.set(event.id, lineIndex);
    }
  }
  // no index, append
  if (!lineIndexToWrite) {
    lineIndex++;
    lineIndexToWrite = lineIndex;
  }

  if (event.status) {
    // move cursor to the home
    logsPull.write(`\u001b[${lineIndexToWrite};0H`);
    // erase the line
    logsPull.write('\u001B[2K');
    // do we have id ?
    if (event.id) {
      logsPull.write(`${event.id}: `);
    }
    logsPull.write(event.status);
    // do we have progress ?
    if (event.progress && event.progress !== '') {
      logsPull.write(event.progress);
    } else if (event?.progressDetail?.current && event?.progressDetail?.total) {
      logsPull.write(` ${Math.round((event.progressDetail.current / event.progressDetail.total) * 100)}%`);
    }
    // write end of line
    logsPull.write('\n\r');
  } else if (event.error) {
    logsPull.write(event.error.replaceAll('\n', '\n\r') + '\n\r');
  }
}

async function pullImage() {
  if (!selectedProviderConnection) {
    pullError = 'No current provider connection';
    return;
  }

  if (!imageToPull) {
    pullError = 'No image to pull';
    return;
  }

  lineNumberPerId.clear();
  lineIndex = 0;
  await tick();
  logsPull?.reset();

  // reset error
  pullError = '';

  pullInProgress = true;
  try {
    await window.pullImage(selectedProviderConnection, imageToPull.trim(), callback);
    pullInProgress = false;
    pullFinished = true;
  } catch (error: any) {
    const errorMessage = error.message ? error.message : error;
    pullError = `Error while pulling image from ${selectedProviderConnection.name}: ${errorMessage}`;
    pullInProgress = false;
  }
}

onMount(() => {
  if (!selectedProviderConnection) {
    selectedProviderConnection = providerConnections.length > 0 ? providerConnections[0] : undefined;
  }
});

let imageNameInvalid: string | undefined = undefined;
let imageNameIsInvalid = imageToPull === undefined || imageToPull.trim() === '';
function validateImageName(image: string): void {
  if (imageToPull && (image === undefined || image.trim() === '')) {
    imageNameIsInvalid = true;
    imageNameInvalid = 'Please enter a value';
  } else {
    imageNameIsInvalid = false;
    imageNameInvalid = undefined;
  }
  imageToPull = image;
}

// allTags is defined if last search was a query to search tags of an image
let allTags: string[] | undefined = undefined;
async function searchImages(value: string): Promise<string[]> {
  if (value.includes(':')) {
    if (allTags !== undefined) {
      return allTags.filter(i => i.startsWith(value));
    }
    const parts = value.split(':');
    const originalImage = parts[0];
    let image = parts[0];
    if (image.startsWith(DOCKER_PREFIX_WITH_SLASH)) {
      image = image.slice(DOCKER_PREFIX_WITH_SLASH.length);
    }
    const tags = await window.listImageTagsInRegistry({ image });
    allTags = tags.map(t => `${originalImage}:${t}`);
    return allTags.filter(i => i.startsWith(value));
  }
  allTags = undefined;
  if (value === undefined || value.trim() === '') {
    return [];
  }
  const options: ImageSearchOptions = {
    query: '',
  };
  if (!value.includes('/')) {
    options.registry = DOCKER_PREFIX;
    options.query = value;
  } else {
    const [registry, ...rest] = value.split('/');
    options.registry = registry;
    options.query = rest.join('/');
  }
  let result: string[];
  const searchResult = await window.searchImageInRegistry(options);
  result = searchResult.map(r => {
    return [options.registry, r.name].join('/');
  });
  return result;
}

async function searchLocalImages(value: string): Promise<string[]> {
  const listImages = await window.listImages();
  const localImagesNames = listImages.map(image => {
    if (image.RepoTags) {
      return image.RepoTags;
    }
    return [];
  });
  matchingLocalImages = localImagesNames.flat().filter(image => image.includes(value) && image !== '');
  return matchingLocalImages;
}

let latestTagMessage: string | undefined = undefined;
async function searchLatestTag(): Promise<void> {
  if (imageNameIsInvalid || !imageToPull) {
    latestTagMessage = undefined;
    return;
  }
  try {
    let image = imageToPull;
    if (image.startsWith(DOCKER_PREFIX_WITH_SLASH)) {
      image = image.slice(DOCKER_PREFIX_WITH_SLASH.length);
    }
    const tags = await window.listImageTagsInRegistry({ image });
    if (imageToPull.includes(':')) {
      latestTagMessage = undefined;
      checkIfTagExist(image, tags);
      return;
    }
    isValidName = Boolean(tags);
    const latestFound = tags.includes('latest');
    if (!latestFound) {
      latestTagMessage = '"latest" tag not found. You can search a tag by appending ":" to the image name';
      isValidName = false;
    } else {
      latestTagMessage = undefined;
    }
  } catch {
    isValidName = false;
    latestTagMessage = undefined;
  }
}

function checkIfTagExist(image: string, tags: string[]): void {
  const tag = image.split(':')[1];

  isValidName = tags.some(t => t === tag);
}

async function buildContainerFromImage(): Promise<void> {
  const localImages = (await window.listImages()).filter(
    image => (image.RepoTags?.filter(repoTag => repoTag.includes(imageToPull)) ?? []).length > 0,
  );
  console.log(localImages);
  if (localImages.length > 0) {
    const chosenImage = imageUtils.getImagesInfoUI(localImages[0], []);
    if (chosenImage.length > 0) {
      runImageInfo.set(chosenImage[0]);
      router.goto('/image/run/basic');
    }
  }
}
</script>

<EngineFormPage title="Select an image">
  <svelte:fragment slot="icon">
    <ImageIcon />
  </svelte:fragment>
  <div slot="content" class="space-y-2 flex flex-col">
    <Typeahead
      id="imageName"
      name="imageName"
      placeholder="Select am exisiting image"
      searchFunctions={[searchLocalImages, searchImages]}
      headings={['Local Images', 'Registry Images']}
      onChange={async (s: string) => {
        validateImageName(s);
        await searchLatestTag();
      }}
      disabled={pullFinished || pullInProgress}
      error={!isValidName}
      required
      initialFocus />
    {#if imageNameInvalid}
      <ErrorMessage error={imageNameInvalid} />
    {/if}
    {#if latestTagMessage}
      <WarningMessage error={latestTagMessage} />
    {/if}

    {#if providerConnections.length > 1}
      <div class="pt-4">
        <label for="providerChoice" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
          >Container Engine</label>
        <Dropdown
          id="providerChoice"
          name="providerChoice"
          bind:value={selectedProviderConnection}
          options={providerConnections.map(providerConnection => ({
            label: providerConnection.name,
            value: providerConnection,
          }))}>
        </Dropdown>
      </div>
    {/if}
    {#if providerConnections.length === 1}
      <input type="hidden" name="providerChoice" readonly bind:value={selectedProviderConnection} />
    {/if}
  
    <footer>
      <div class="w-full flex flex-row justify-end gap-3 my-3">
        <Button type="secondary" class="mr-3 w-full" on:click={() => router.goto($lastPage.path)}>Cancel</Button>
        {#if !matchingLocalImages.includes(imageToPull) && imageToPull !== ''}
          {#if !pullFinished}
            <Button
              icon={faArrowCircleDown}
              class="w-full"
              bind:disabled={imageNameIsInvalid}
              on:click={() => pullImage()}
              bind:inProgress={pullInProgress}>
              Pull image {console.log('pull image ' + imageToPull)}
            </Button>
          {:else}
            <Button class="w-full" on:click={() => buildContainerFromImage()}>Select image</Button>
          {/if}
        {:else}
          <Button icon={faCircleCheck} class="w-full" on:click={() => buildContainerFromImage()}>Select image {console.log('select image ' + imageToPull)}</Button>
        {/if}
        {#if pullError}
          <ErrorMessage error={pullError} />
        {/if}
      </div>
    </footer>
    <TerminalWindow bind:terminal={logsPull} />
  </div>
</EngineFormPage>

