<script lang="ts">
import {
  faCheckCircle,
  faCircleArrowUp,
  faTriangleExclamation,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Link } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import type { ImageInspectInfo } from 'dockerode';
import { onDestroy, onMount } from 'svelte';
import { get } from 'svelte/store';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import { providerInfos } from '/@/stores/providers';

import { lastPage } from '../../stores/breadcrumb';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';
import { getPushImageTask, type PushImageCallback } from './push-image-task.svelte';

interface Props {
  imageId: string;
  engineId: string;
  base64RepoTag: string;
  taskId?: number;
}

// Fix link for error message if fix is available and all supported fixes
class FixLink {
  static readonly addRegistry = new FixLink('Add a registry now.', () => router.goto('/preferences/registries'));

  public readonly text: string;
  public readonly command: () => void;

  constructor(text: string, command: () => void) {
    this.text = text;
    this.command = command;
  }
}

// Error message class and all possible messages
class ErrorMessage {
  static readonly noRegistry = new ErrorMessage('No registry with push permissions found.', FixLink.addRegistry);
  static readonly noImage = new ErrorMessage(() => `Image with ID ${imageId} does not exist.`);
  static readonly noTag = new ErrorMessage(() => `Tag '${selection}' doesn't exist locally`);
  static readonly noError = new ErrorMessage('', undefined);

  #text: string | (() => string);
  public readonly link?: FixLink;

  constructor(text: string | (() => string), link?: FixLink) {
    this.#text = text;
    this.link = link;
  }

  get message(): string {
    return typeof this.#text === 'function' ? this.#text() : this.#text;
  }
}

// data to render list status icon
class StatusIcon {
  static readonly success = new StatusIcon('pd-state-success', faCheckCircle);
  static readonly warning = new StatusIcon('pd-state-warning', faTriangleExclamation);

  public readonly class: string;
  public readonly icon: IconDefinition;

  constructor(cssVariableName: string, icon: IconDefinition) {
    this.class = `text-[var(--${cssVariableName})]`;
    this.icon = icon;
  }
}

let { imageId, engineId, base64RepoTag, taskId = 0 }: Props = $props();

// There is always parameter represents the tag to push
// and it is selected by default even if it is not in the list of tags
// the error message is shown below the select input control
let selection = $derived.by(() => {
  let result = base64RepoTag;
  try {
    result = atob(base64RepoTag);
  } catch (decodeError) {
    console.error(`Failed to decode base64RepoTag ${base64RepoTag}:`, decodeError);
  }
  return result;
});

// options[] is the list of tags to display in the select input control
let options: string[] = $state([]);

// tags[] is the list of tags of the image
let tags: string[] = $state([]);

// isLoaded is a loading guard to avoid showing the error message about missing tag
let isLoaded = $state(false); // Loading guard

// image info loading error
let imageLoadError = $state(ErrorMessage.noError);

// tagLoadError is the error message about the tag
let tagLoadError = $derived.by(() => {
  // Only compute after data is loaded
  // to avoid showing the error message about missing tag
  // because tags[] is empty until the image info is loaded
  if (!isLoaded) return ErrorMessage.noError;
  if (tags.includes(selection)) {
    return ErrorMessage.noError;
  } else {
    return ErrorMessage.noTag;
  }
});

// authenticationCheckError is the error message about the authentication not configured for the selected tag
let authenticationCheckError = $state(ErrorMessage.noError);

// push image task loading if available
let pushImageTask = $state(getPushImageTask(taskId));

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
    },
    onData: (data: string): void => {
      logsTerminal?.write(data + '\n\r');
    },
    onError: (data: string): void => {
      logsTerminal?.write(data + '\n\r');
    },
    onEnd: (): void => {},
    onReplay: (data: string): void => {
      logsTerminal?.clear();
      logsTerminal?.write(data);
    },
  };
}

async function loadImageInfo(): Promise<void> {
  let inspectInfo: ImageInspectInfo | undefined = undefined;
  try {
    inspectInfo = await window.getImageInspect(engineId, imageId);
    tags = inspectInfo.RepoTags || []; // Keep original tags for existence checking
    imageLoadError = ErrorMessage.noError;
  } catch (error) {
    imageLoadError = ErrorMessage.noImage;
    console.warn(imageLoadError.message);
  }

  options = [...tags];
  // Check if parameter tag exists in the original image tags
  if (selection !== '<none>' && !tags.includes(selection)) {
    // Add parameter tag to display list only, mark as added
    options = [selection, ...options];
    tagLoadError = ErrorMessage.noTag;
  } else {
    tagLoadError = ErrorMessage.noError;
  }
}

async function pushImage(): Promise<void> {
  return pushImageTask.start(engineId, selection, imageId, btoa(selection));
}

function pushImageFinished(): void {
  router.goto(get(lastPage).path);
}

let errors = $derived(
  [imageLoadError, tagLoadError, authenticationCheckError].filter(error => error !== ErrorMessage.noError),
);
let isWarning = $derived(errors.length > 0);
let statusIcon = $derived(isWarning ? StatusIcon.warning : StatusIcon.success);
let selectBorderClass = $derived(`outline-[var(--${isWarning ? 'pd-state-warning' : 'pd-modal-border'})]`);
let isPushButtonDisabled = $derived(pushImageTask.inProgress || isWarning || options.length === 0 || !isLoaded);
let isTerminalHidden = $derived(!pushImageTask.inProgress && !pushImageTask.finished);
let isSelectDisabled = $derived(tags.length === 0 || pushImageTask.inProgress);

onMount(async () => {
  await loadImageInfo();
  isLoaded = true; // Mark as loaded - derived values will now compute
});

$effect(() => {
  if (!isLoaded) return;
  // Check authentication for the selected tag
  window
    .hasAuthconfigForImage(selection)
    .then(result => (authenticationCheckError = result ? ErrorMessage.noError : ErrorMessage.noRegistry))
    .catch((err: unknown) => console.error(`Error getting authentication required for image ${imageId}`, err));
});

onDestroy(() => pushImageTask.disconnectUI());

function onTerminalInit(): void {
  pushImageTask.connectUI(createCallback());
}
</script>

<EngineFormPage
  title="Push image to a registry"
  inProgress={pushImageTask.inProgress}
  showEmptyScreen={providerConnections.length === 0}>
  {#snippet icon()}
    <i class="fas fa-arrow-circle-up fa-2x" aria-hidden="true"></i>
  {/snippet}
  {#snippet content()}
    <div class="space-y-6">
      <div class="w-full">
        <label for="modalImageTag" class="block mb-2 text-sm font-medium text-[var(--pd-modal-text)]">Image tag</label>
        <Fa class="absolute mt-3 ml-1.5 {statusIcon.class}" size="1x" icon={statusIcon.icon} />

        <select
          class="text-sm rounded-lg block w-full p-2.5 bg-[var(--pd-dropdown-bg)] pl-6 border-r-8 border-transparent outline-1 outline {selectBorderClass} placeholder-[var(--pd-content-text)] text-[var(--pd-default-text)]"
          name="imageChoice"
          bind:value={selection}
          disabled={isSelectDisabled}>
          {#each options as imageTag, index (index)}
            <option value={imageTag}>{imageTag}</option>
          {/each}
          {#if options.length === 0}
            <option value="<none>">No tags available</option>
          {/if}
        </select>

        {#each errors as error (error.message)}
          <p class="text-[var(--pd-state-warning)] pt-1 text-sm">
            {error.message}.
            {#if error.link}
              <Link on:click={(): void => error.link?.command?.()}>{error.link?.text}</Link>
            {/if}
          </p>
        {/each}
      </div>

      <div class="h-[185px]" hidden={isTerminalHidden}>
        <TerminalWindow class="h-full" on:init={onTerminalInit} bind:terminal={logsTerminal} disableStdIn />
      </div>
      <div class="flex justify-middle gap-2">
        <Button class="w-auto" type="secondary" on:click={pushImageFinished}
          >{pushImageTask.finished ? `Done` : `Close`}</Button>

        <Button
          class="w-auto"
          icon={faCircleArrowUp}
          disabled={isPushButtonDisabled}
          on:click={pushImage}
          inProgress={pushImageTask.inProgress}>
          Push image
        </Button>
      </div>
    </div>
  {/snippet}
</EngineFormPage>
