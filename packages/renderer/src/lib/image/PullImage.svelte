<script lang="ts">
import { faArrowCircleDown, faCog, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, ErrorMessage, Tooltip } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { onMount, tick } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import type { ImageSearchOptions } from '/@api/image-registry';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';
import type { PullEvent } from '/@api/pull-event';

import { providerInfos } from '../../stores/providers';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';
import type { TypeaheadItem } from '../ui/Typeahead';
import Typeahead from '../ui/Typeahead.svelte';
import WarningMessage from '../ui/WarningMessage.svelte';
import RecommendedRegistry from './RecommendedRegistry.svelte';

const DOCKER_PREFIX = 'docker.io';
const DOCKER_PREFIX_WITH_SLASH = DOCKER_PREFIX + '/';

let logsPull = $state<Terminal>();
let pullError = $state('');
let pullInProgress = $state(false);
let pullFinished = $state(false);
let shortnameImages: string[] = [];
let podmanFQN = $state('');
let usePodmanFQN = $state(false);
let isValidName = $state(true);
let searchResult = $state<TypeaheadItem[]>([]);
let sortResults = $state<(a: string, b: string) => number>();

interface Props {
  imageToPull?: string;
}

let { imageToPull = $bindable() }: Props = $props();

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

let selectedProviderConnection = $state<ProviderContainerConnectionInfo>();

const lineNumberPerId = new SvelteMap<string, number>();
let lineIndex = 0;

async function resolveShortname(): Promise<void> {
  if (selectedProviderConnection?.type !== 'podman') {
    return;
  }
  if (imageToPull && !imageToPull.includes('/')) {
    shortnameImages =
      (await window.resolveShortnameImage($state.snapshot(selectedProviderConnection), imageToPull)) ?? [];
    // not a shortname
  } else {
    podmanFQN = '';
    shortnameImages = [];
    usePodmanFQN = false;
  }
  // checks if there is no FQN that is from dokcer hub
  if (!shortnameImages.find(name => name.includes('docker.io'))) {
    podmanFQN = shortnameImages[0];
  } else {
    podmanFQN = '';
    shortnameImages = [];
    usePodmanFQN = false;
  }
}

function callback(event: PullEvent): void {
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

  if (logsPull) {
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
}

async function pullImage(): Promise<void> {
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
    const selectedProviderConnectionSnapshot = $state.snapshot(selectedProviderConnection);
    if (podmanFQN) {
      usePodmanFQN
        ? await window.pullImage(selectedProviderConnectionSnapshot, podmanFQN.trim(), callback)
        : await window.pullImage(selectedProviderConnectionSnapshot, `docker.io/${imageToPull.trim()}`, callback);
    } else {
      await window.pullImage(selectedProviderConnectionSnapshot, imageToPull.trim(), callback);
    }
    pullInProgress = false;
    pullFinished = true;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error && error.message ? error.message : error;
    pullError = `Error while pulling image from ${selectedProviderConnection.name}: ${errorMessage}`;
    pullInProgress = false;
  }
}

async function pullImageFinished(): Promise<void> {
  router.goto('/images');
}

async function gotoManageRegistries(): Promise<void> {
  router.goto('/preferences/registries');
}

onMount(() => {
  selectedProviderConnection ??= providerConnections.length > 0 ? providerConnections[0] : undefined;
});

let imageNameInvalid = $state<string>();
let imageNameIsInvalid = $state(imageToPull === undefined || imageToPull.trim() === '');
function validateImageName(image: string): void {
  if (image === undefined || image.trim() === '') {
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

let latestTagMessage = $state<string>();
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

async function searchFunction(value: string): Promise<void> {
  try {
    const result = await searchImages(value);
    sortResults = (a: string, b: string): number => {
      const dockerIoValue = `docker.io/${value}`;
      const aStartsWithValue = a.startsWith(value) || a.startsWith(dockerIoValue);
      const bStartsWithValue = b.startsWith(value) || b.startsWith(dockerIoValue);
      if (aStartsWithValue === bStartsWithValue) {
        return a.localeCompare(b);
      } else if (aStartsWithValue && !bStartsWithValue) {
        return -1;
      } else {
        return 1;
      }
    };
    searchResult = result.map(value => ({ value: value }));
  } catch (error: unknown) {
    searchResult = [];
    sortResults = undefined;
  }
}
</script>

<EngineFormPage
  title="Pull image from a registry"
  inProgress={pullInProgress}
  showEmptyScreen={providerConnections.length === 0}>
  {#snippet icon()}
    <i class="fas fa-arrow-circle-down fa-2x" aria-hidden="true"></i>
  {/snippet}

  {#snippet actions()}
    <Button on:click={gotoManageRegistries} icon={faCog}>Manage registries</Button>
  {/snippet}

  {#snippet content()}
  <div class="space-y-6">
    <div class="w-full">
      <label for="imageName" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
        >Image to Pull</label>
      <div class="flex flex-col">
        <Typeahead
          id="imageName"
          name="imageName"
          placeholder="Image name"
          onInputChange={searchFunction}
          resultItems={searchResult}
          compare={sortResults}
          onChange={async (s: string): Promise<void> => {
            validateImageName(s);
            await resolveShortname();
            await searchLatestTag();
          }}
          onEnter={pullImage}
          disabled={pullFinished || pullInProgress}
          error={!isValidName}
          required
          initialFocus />
        {#if selectedProviderConnection?.type === 'podman' && podmanFQN}
          <div class="absolute mt-2 ml-[-18px] self-start">
            <Tooltip tip="Shortname images will be pulled from Docker Hub" topRight>
              <Fa id="shortname-warning" size="1.1x" class="text-[var(--pd-state-warning)]" icon={faTriangleExclamation} />
            </Tooltip>
          </div>
        {/if}
      </div>
      {#if selectedProviderConnection?.type === 'podman' && podmanFQN}
        <Checkbox class="pt-2" bind:checked={usePodmanFQN} title="Use Podman FQN" disabled={podmanFQN === ''}
          >Use Podman FQN for shortname image</Checkbox>
      {/if}
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
          <ContainerConnectionDropdown
            id="providerChoice"
            name="providerChoice"
            bind:value={selectedProviderConnection}
            connections={providerConnections}/>
        </div>
      {/if}
      {#if providerConnections.length === 1}
        <input type="hidden" name="providerChoice" readonly bind:value={selectedProviderConnection} />
      {/if}
    </div>
    <footer>
      <div class="w-full flex flex-col justify-end">
        {#if !pullFinished}
          <Button
            icon={faArrowCircleDown}
            disabled={imageNameIsInvalid}
            on:click={pullImage}
            inProgress={pullInProgress}>
            Pull image
          </Button>
        {:else}
          <Button on:click={pullImageFinished}>Done</Button>
        {/if}
        {#if pullError}
          <ErrorMessage error={pullError} />
        {/if}
        <RecommendedRegistry bind:imageError={pullError} imageName={imageToPull} />
      </div>
    </footer>
    <TerminalWindow bind:terminal={logsPull} />
  </div>
  {/snippet}
</EngineFormPage>
