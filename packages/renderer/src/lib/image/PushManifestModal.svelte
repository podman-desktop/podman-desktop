<script lang="ts">
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { tick } from 'svelte';
import { router } from 'tinro';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import TerminalWindow from '/@/lib/ui/TerminalWindow.svelte';

import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  closeCallback: () => void;
  manifestInfoToPush: ImageInfoUI;
}

let { closeCallback, manifestInfoToPush }: Props = $props();

let pushInProgress = $state(false);
let pushFinished = $state(false);
let initTerminal = $state(false);
let logsPush = $state<Terminal>();

async function pushManifest(): Promise<void> {
  initTerminal = true;
  await tick();
  window.dispatchEvent(new Event('resize'));
  logsPush?.reset();

  pushInProgress = true;

  try {
    logsPush?.write(`Pushing manifest ${manifestInfoToPush.name} ...\n\r`);
    await window.pushManifest({ name: manifestInfoToPush.name, destination: manifestInfoToPush.name });
    logsPush?.write('Manifest pushed successfully\n\r');
    pushFinished = true;
  } catch (err) {
    logsPush?.write(err + '\n\r');
    pushFinished = true;
    console.error(err);
  }
}

async function pushManifestFinished(): Promise<void> {
  closeCallback();
  router.goto('/images');
}
</script>

<Dialog
  title="Push manifest"
  onclose={(): void => {
    closeCallback();
    logsPush?.dispose();
  }}>
  {#snippet content()}
    <div  class="flex flex-col leading-5 space-y-5">
      {#if !pushInProgress}
        <p class="text-sm">
          Push manifest {manifestInfoToPush.name}

          {#if manifestInfoToPush.children && manifestInfoToPush.children.length > 0}
            with {manifestInfoToPush.children.length} associated images
          {/if}
        </p>
      {/if}
      <div class="h-[185px]" hidden={initTerminal === false}>
        <TerminalWindow class="h-full" bind:terminal={logsPush} disableStdIn />
      </div>
    </div>
  {/snippet}

  {#snippet buttons()}
  
      {#if !pushInProgress && !pushFinished}
        <Button class="w-auto" type="secondary" on:click={closeCallback}>Cancel</Button>
      {/if}
      {#if !pushFinished}
        <Button
          class="w-auto"
          icon={faCircleArrowUp}
          on:click={pushManifest}
          inProgress={pushInProgress}>
          Push manifest
        </Button>
      {:else}
        <Button on:click={pushManifestFinished} class="w-auto">Done</Button>
      {/if}
    
  {/snippet}
</Dialog>
