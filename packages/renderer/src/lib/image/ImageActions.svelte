<script lang="ts">
import {
  faArrowUp,
  faDownload,
  faEdit,
  faLayerGroup,
  faPlay,
  faSync,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { Menu } from '@podman-desktop/core-api';
import { MenuContext, NavigationPage } from '@podman-desktop/core-api';
import { createEventDispatcher, onMount } from 'svelte';
import { router } from 'tinro';

import ContributionActions from '/@/lib/actions/ContributionActions.svelte';
import { ContextUI } from '/@/lib/context/context';
import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';
import { handleNavigation } from '/@/navigation';
import { context } from '/@/stores/context';
import { saveImagesInfo } from '/@/stores/save-images-store';

import ActionsWrapper from './ActionsMenu.svelte';
import { ImageUtils } from './image-utils';
import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  onPushImage: (imageInfo: ImageInfoUI) => void;
  onRenameImage: (imageInfo: ImageInfoUI) => void;
  image: ImageInfoUI;
  dropdownMenu?: boolean;
  detailed?: boolean;
  groupContributions?: boolean;
}

let {
  onPushImage,
  onRenameImage,
  image = $bindable(),
  dropdownMenu = false,
  detailed = false,
  groupContributions = false,
}: Props = $props();

const imageUtils = new ImageUtils();

let contributions: Menu[] = $state([]);

let groupingContributions = $derived(groupContributions && !dropdownMenu && contributions.length > 1);
let globalContext: ContextUI = $derived.by(() => {
  const ctx = new ContextUI();
  const allValues = $context.collectAllValues();
  for (const k in allValues) {
    ctx.setValue(k, allValues[k]);
  }

  const labels = image.labels ? Object.keys(image.labels) : [];
  ctx.setValue('imageLabelKeys', labels);
  return ctx;
});

const dispatch = createEventDispatcher<{ update: ImageInfoUI }>();

onMount(async () => {
  contributions = await window.getContributedMenus(MenuContext.DASHBOARD_IMAGE);
});

async function runImage(): Promise<void> {
  handleNavigation({
    page: NavigationPage.IMAGE_RUN,
    parameters: {
      id: image.id,
      engineId: image.engineId,
      tag: image.tag ? `${image.name}:${image.tag}` : image.name,
    },
  });
}

async function deleteImage(): Promise<void> {
  image.status = 'DELETING';
  dispatch('update', image);

  try {
    await imageUtils.deleteImage(image);
  } catch (error) {
    await onError(
      `Error while deleting image: ${error instanceof Error ? error.message : String(error)}`,
      'Delete Image Failed',
    );
  }
}

async function renameImage(imageInfo: ImageInfoUI): Promise<void> {
  onRenameImage(imageInfo);
}

async function pushImage(imageInfo: ImageInfoUI): Promise<void> {
  onPushImage(imageInfo);
}

async function showLayersImage(): Promise<void> {
  router.goto(`/images/${image.id}/${image.engineId}/${image.base64RepoTag}/history`);
}

async function onError(error: string, title = 'Image Operation Failed'): Promise<void> {
  await window.showMessageBox({
    title,
    message: error,
    type: 'error',
    buttons: ['Dismiss'],
  });
}

function saveImage(): void {
  saveImagesInfo.set([image]);
  router.goto('/images/save');
}

async function updateImage(): Promise<void> {
  if (!isUpdateCandidate(image)) {
    return;
  }

  const previousStatus = image.status;
  image.status = 'UPDATING';
  dispatch('update', image);

  try {
    const results = await imageUtils.updateImages([image]);
    const result = results[0];
    if (result && !result.updated) {
      console.info(`${image.name}:${image.tag}: ${result.message}`);
    }
    image.status = previousStatus;
  } catch (error) {
    image.status = previousStatus;
    await onError(`Error while updating image: ${String(error)}`);
  } finally {
    image.selected = false;
    dispatch('update', image);
  }
}

function confirmUpdateImage(): void {
  withConfirmation(updateImage, `update image ${image.name}:${image.tag} to latest build`, {
    title: 'Update Image?',
    buttonLabel: 'Update',
  });
}

function isUpdateCandidate(imageInfo: ImageInfoUI): boolean {
  return imageInfo.name !== '<none>' && imageInfo.status === 'UNUSED' && Boolean(imageInfo.digest);
}
</script>

<ListItemButtonIcon title="Run Image" onClick={runImage} detailed={detailed} icon={faPlay} />

<ListItemButtonIcon
  title="Delete Image"
  onClick={(): void => withConfirmation(deleteImage, `delete image ${image.name}:${image.tag}`, { title: 'Delete Image?', variant: 'delete' })}
  detailed={detailed}
  icon={faTrash}
  enabled={image.status === 'UNUSED'} />

<!-- If dropdownMenu is true, use it, otherwise just show the regular buttons -->
<ActionsWrapper
  dropdownMenu={dropdownMenu}
  onBeforeToggle={(): void => {
    globalContext?.setValue('selectedImageId', image.id);
  }}>
  <ListItemButtonIcon
    title="Push Image"
    onClick={(): Promise<void> => pushImage(image)}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faArrowUp} />

  <ListItemButtonIcon
    title="Edit Image"
    onClick={(): Promise<void> => renameImage(image)}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faEdit} />

  {#if !detailed}
    <ListItemButtonIcon
      title="Show History"
      onClick={showLayersImage}
      menu={dropdownMenu}
      detailed={detailed}
      icon={faLayerGroup} />
  {/if}
  <ListItemButtonIcon
    title="Save Image"
    tooltip="Save image to a local directory"
    onClick={saveImage}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faDownload} />

  <ListItemButtonIcon
    title="Update Image"
    tooltip="Update image to the latest build"
    onClick={confirmUpdateImage}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faSync}
    enabled={isUpdateCandidate(image)} />

  <ActionsWrapper dropdownMenu={groupingContributions} dropdownMenuAsMenuActionItem={groupingContributions}>
    <ContributionActions
      args={[image]}
      dropdownMenu={groupingContributions ? true : dropdownMenu}
      contributions={contributions}
      contextPrefix="imageItem"
      detailed={detailed}
      onError={onError}
      contextUI={globalContext} />
  </ActionsWrapper>
</ActionsWrapper>
