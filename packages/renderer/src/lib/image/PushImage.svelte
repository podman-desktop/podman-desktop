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
import type { PushImageCallback } from '../../stores/push-images.svelte';
import { getNextTaskId, getPushImageInfo, PushImageInfo } from '../../stores/push-images.svelte';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';

interface Props {
  imageId: string;
  engineId: string;
  base64RepoTag: string;
  taskId?: number;
}

class FixLink {
  static readonly addRegistry = new FixLink('Add a registry now.', () => router.goto('/preferences/registries'));
  public readonly text: string;
  public readonly command: () => void;
  constructor(text: string, command: () => void) {
    this.text = text;
    this.command = command;
  }
}

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

let selection = $derived.by(() => {
  try {
    return atob(base64RepoTag);
  } catch (decodeError) {
    console.error(`Failed to decode base64RepoTag ${base64RepoTag}:`, decodeError);
    return base64RepoTag;
  }
});
let option: string[] = $state([]);
let tags: string[] = $state([]);
let isLoaded = $state(false); // Loading guard
let imageLoadError = $state(ErrorMessage.noError);
let tagLoadError = $derived.by(() => {
  // Only compute after data is loaded
  if (!isLoaded) return ErrorMessage.noError;

  if (tags.includes(selection)) {
    return ErrorMessage.noError;
  } else {
    return ErrorMessage.noTag;
  }
});
let authenticationCheckError = $state(ErrorMessage.noError);

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

function loadBackgroundPush(bgTaskId: number): void {
  const bgPushImageInfo = getPushImageInfo(bgTaskId);
  if (bgPushImageInfo) {
    // switching from previous push image dialog which can be finished or still running
    if (pushImageInfo.inProgress) {
      pushImageInfo.disconnectUI();
    }
    if (bgPushImageInfo.inProgress) {
      pushImageInfo = bgPushImageInfo;
      logsTerminal?.reset();
      logsTerminal?.write(bgPushImageInfo.replay);
      pushImageInfo.connectUI(createCallback());
    } else {
      const clonePushImageInfo = new PushImageInfo();
      clonePushImageInfo.inProgress = $state.snapshot(bgPushImageInfo.inProgress);
      clonePushImageInfo.finished = $state.snapshot(bgPushImageInfo.finished);
      clonePushImageInfo.error = $state.snapshot(bgPushImageInfo.error);
      clonePushImageInfo.replay = $state.snapshot(bgPushImageInfo.replay);
      pushImageInfo = clonePushImageInfo;
      logsTerminal?.reset();
      logsTerminal?.write(bgPushImageInfo.replay);
    }
  }
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

  option = [...tags];
  // Check if parameter tag exists in the original image tags
  if (selection !== '<none>' && !tags.includes(selection)) {
    // Add parameter tag to display list only, mark as added
    option = [selection, ...option];
    tagLoadError = ErrorMessage.noTag;
  } else {
    tagLoadError = ErrorMessage.noError;
  }
}

async function pushImage(): Promise<void> {
  logsTerminal?.reset();
  pushImageInfo.connectUI(createCallback());
  const selectedBase64RepoTag = btoa(selection);
  return pushImageInfo.pushImage(engineId, selection, imageId, selectedBase64RepoTag, getNextTaskId());
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

onMount(async () => {
  console.log('onMount');
  loadBackgroundPush(taskId);
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

onDestroy(() => pushImageInfo.disconnectUI());

function onTerminalInit(): void {
  logsTerminal?.write(pushImageInfo.replay);
  window.dispatchEvent(new Event('resize'));
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
        <Fa class="absolute mt-3 ml-1.5 {statusIcon.class}" size="1x" icon={statusIcon.icon} />

        <select
          class="text-sm rounded-lg block w-full p-2.5 bg-[var(--pd-dropdown-bg)] pl-6 border-r-8 border-transparent outline-1 outline {selectBorderClass} placeholder-[var(--pd-content-text)] text-[var(--pd-default-text)]"
          name="imageChoice"
          bind:value={selection}
          disabled={tags.length === 0 || pushImageInfo.inProgress}>
          {#each option as imageTag, index (index)}
            <option value={imageTag}>{imageTag}</option>
          {/each}
          {#if option.length === 0}
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

      <div class="h-[185px]" hidden={!pushImageInfo.inProgress && !pushImageInfo.finished}>
        <TerminalWindow class="h-full" on:init={onTerminalInit} bind:terminal={logsTerminal} disableStdIn />
      </div>
      <div class="flex justify-middle gap-2">
        <Button class="w-auto" type="secondary" on:click={pushImageFinished}
          >{pushImageInfo.finished ? `Done` : `Close`}</Button>

        <Button
          class="w-auto"
          icon={faCircleArrowUp}
          disabled={pushImageInfo.inProgress || isWarning || option.length === 0 || !isLoaded}
          on:click={pushImage}
          inProgress={pushImageInfo.inProgress}>
          Push image
        </Button>
      </div>
    </div>
  {/snippet}
</EngineFormPage>
