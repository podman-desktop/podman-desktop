<script lang="ts">
import { Button, ErrorMessage, Input } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import LegacyDialog from '../dialogs/LegacyDialog.svelte';
import type { ImageInfoUI } from './ImageInfoUI';

export let closeCallback: () => void;
export let detailed = false;
export let imageInfoToRename: ImageInfoUI;

let imageName = '';
let imageTag = '';

let imageNameErrorMessage = '';
let imageTagErrorMessage = '';

$: {
  imageNameErrorMessage = imageName === '' ? 'Please enter a value' : '';
}
$: {
  imageTagErrorMessage = imageTag === '' ? 'Please enter a value' : '';
}

onMount(async () => {
  if (imageInfoToRename.name !== '<none>') {
    imageName = imageInfoToRename.name;
    imageTag = imageInfoToRename.tag;
  }
});

function disableSave(name: string, tag: string): boolean {
  const inputName = `${name}:${tag}`;
  const currentName = `${imageInfoToRename.name}:${imageInfoToRename.tag}`;

  return name.trim() === '' || tag.trim() === '' || inputName === currentName;
}

async function renameImage(imageName: string, imageTag: string): Promise<void> {
  let currentImageNameTag: string;
  let shouldDelete: boolean;
  if (imageInfoToRename.name === '<none>') {
    currentImageNameTag = imageInfoToRename.id;
    shouldDelete = false;
  } else {
    shouldDelete = true;
    currentImageNameTag = `${imageInfoToRename.name}:${imageInfoToRename.tag}`;
  }

  try {
    await window.tagImage(imageInfoToRename.engineId, currentImageNameTag, imageName, imageTag);
    if (shouldDelete) {
      await window.deleteImage(imageInfoToRename.engineId, currentImageNameTag);
    }
    closeCallback();
  } catch (error: unknown) {
    imageNameErrorMessage =
      error && typeof error === 'object' && 'message' in error && error.message ? String(error.message) : String(error);
  }

  if (detailed) {
    router.goto('/images');
  }
}
</script>

<LegacyDialog
  title="Edit Image"
  onclose={closeCallback}>
  <div slot="content" class="w-full">
    <label for="imageName" class="block my-2 text-sm font-bold text-[var(--pd-modal-text)]">Image Name</label>
    <Input
      bind:value={imageName}
      name="imageName"
      id="imageName"
      placeholder="Enter image name (e.g. quay.io/namespace/my-image-name)"
      aria-invalid={imageNameErrorMessage !== ''}
      aria-label="imageName"
      required />
    {#if imageNameErrorMessage}
      <ErrorMessage error={imageNameErrorMessage} />
    {/if}

    <label for="imageTag" class="block my-2 text-sm font-bold text-[var(--pd-modal-text)]">Image Tag</label>
    <Input
      bind:value={imageTag}
      name="imageTag"
      id="imageTag"
      placeholder="Enter image tag (e.g. latest)"
      aria-invalid={imageTagErrorMessage !== ''}
      aria-label="imageTag"
      required />
    {#if imageTagErrorMessage}
      <ErrorMessage error={imageTagErrorMessage} />
    {/if}
  </div>
  <svelte:fragment slot="buttons">
    <Button
      class="pcol-start-3"
      type="link"
      on:click={closeCallback}>Cancel</Button>
    <Button
      class="col-start-4"
      disabled={disableSave(imageName, imageTag)}
      on:click={async (): Promise<void> => {
        await renameImage(imageName, imageTag);
      }}>Save</Button>
  </svelte:fragment>
</LegacyDialog>
