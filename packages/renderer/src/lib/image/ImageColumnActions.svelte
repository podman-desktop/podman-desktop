<script lang="ts">
import ImageActions from './ImageActions.svelte';
import type { ImageInfoUI } from './ImageInfoUI';
import ManifestActions from './ManifestActions.svelte';
import PushManifestModal from './PushManifestModal.svelte';
import RenameImageModal from './RenameImageModal.svelte';

interface Props {
  object: ImageInfoUI;
}

let { object }: Props = $props();

let renameImageModal = $state(false);
let renameImageModalImageInfo: ImageInfoUI | undefined = $state(undefined);
function handleRenameImageModal(imageInfo: ImageInfoUI): void {
  renameImageModalImageInfo = imageInfo;
  renameImageModal = true;
}

let pushManifestModal = $state(false);
let pushManifestModalInfo: ImageInfoUI | undefined = $state(undefined);
function handlePushManifestModal(imageInfo: ImageInfoUI): void {
  pushManifestModalInfo = imageInfo;
  pushManifestModal = true;
}

function closeModals(): void {
  renameImageModal = false;
  pushManifestModal = false;
}
</script>

<!-- There is no support for interacting with manifests yet, so do not show any manifest-related-image-actions. -->

{#if object.isManifest}
  <ManifestActions manifest={object} onPushManifest={handlePushManifestModal} dropdownMenu={true} on:update />

  {#if pushManifestModal && pushManifestModalInfo}
    <PushManifestModal
      manifestInfoToPush={pushManifestModalInfo}
      closeCallback={closeModals} />
  {/if}
{:else}
  <ImageActions
    image={object}
    onRenameImage={handleRenameImageModal}
    dropdownMenu={true}
    on:update />

  {#if renameImageModal && renameImageModalImageInfo}
    <RenameImageModal
      imageInfoToRename={renameImageModalImageInfo}
      closeCallback={closeModals} />
  {/if}
{/if}
