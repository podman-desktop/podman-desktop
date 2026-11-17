<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';

import type { EngineInfoUI } from './EngineInfoUI';

interface Props {
  type: 'containers' | 'images' | 'pods' | 'volumes'; // Imported type for prune (containers, images, pods, volumes)
  engines: EngineInfoUI[]; // List of engines that the prune will work on
}

let { type, engines }: Props = $props();

const LABEL_IMAGE_UNUSED = $derived(t('management.prune.unusedImages') ?? 'All unused images');
const LABEL_IMAGE_UNTAGGED = $derived(t('management.prune.untaggedImages') ?? 'All untagged images');
const resourceLabel = $derived(t(`management.prune.${type}`) ?? type);

async function openPruneDialog(): Promise<void> {
  let message = 'This action will prune';

  if (type === 'images') {
    message += ' images';
  } else {
    message += ` all unused ${type}`;
  }
  if (engines.length > 1) {
    message += ' from all container engines.';
  } else {
    message += ' from the ' + engines[0].name + ' engine.';
  }

  message =
    t(engines.length > 1 ? 'management.prune.allEngines' : 'management.prune.engine', {
      resource:
        type === 'images'
          ? resourceLabel
          : (t('management.prune.unused', { resource: resourceLabel }) ?? `all unused ${type}`),
      name: engines[0].name,
    }) ?? message;

  const buttons: string[] = [];
  const cancel = t('common.cancel') ?? 'Cancel';
  buttons.push(cancel);
  if (type === 'images') {
    buttons.push(LABEL_IMAGE_UNUSED);
    buttons.push(LABEL_IMAGE_UNTAGGED);
  } else {
    buttons.push(t('management.prune.action') ?? 'Prune');
  }

  const result = await window.showMessageBox({
    title:
      t('management.prune.title', { resource: resourceLabel }) ??
      `Prune ${type.charAt(0).toUpperCase() + type.slice(1)}?`,
    type: 'danger',
    message: message,
    buttons,
  });

  if (result.response !== undefined && result.response !== cancel) {
    await prune(type, result.response);
  }
}

// Function to prune the selected type: containers, pods, images and volumes
async function prune(type: string, selectedItemLabel: string): Promise<void> {
  switch (type) {
    case 'containers':
      for (let engine of engines) {
        try {
          await window.pruneContainers(engine.id);
        } catch (error) {
          console.error(error);
        }
      }
      break;
    case 'pods':
      for (let engine of engines) {
        try {
          await window.prunePods(engine.id);
        } catch (error) {
          console.error(error);
        }
      }
      break;
    case 'volumes':
      for (let engine of engines) {
        try {
          await window.pruneVolumes(engine.id);
        } catch (error) {
          console.error(error);
        }
      }
      break;
    case 'images':
      for (let engine of engines) {
        try {
          await window.pruneImages(engine.id, selectedItemLabel === LABEL_IMAGE_UNUSED);
        } catch (error) {
          console.error(error);
        }
      }
      break;
    default:
      console.error('Prune type not found');
      break;
  }
}
</script>

<Button type="secondary" on:click={openPruneDialog} title={t('management.prune.tooltip', { resource: resourceLabel }) ?? `Remove unused ${type}`} icon={faTrash}>{t('management.prune.action') ?? 'Prune'}</Button>
