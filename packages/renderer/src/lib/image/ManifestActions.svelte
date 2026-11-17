<script lang="ts">
import { faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { createEventDispatcher } from 'svelte';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import ActionsWrapper from './ActionsMenu.svelte';
import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  onPushManifest: (manifestInfo: ImageInfoUI) => void;
  manifest: ImageInfoUI;
  dropdownMenu?: boolean;
  detailed?: boolean;
}

let { onPushManifest, manifest = $bindable(), dropdownMenu = false, detailed = false }: Props = $props();

const dispatch = createEventDispatcher<{ update: ImageInfoUI }>();

async function pushManifest(): Promise<void> {
  onPushManifest(manifest);
}

async function deleteManifest(): Promise<void> {
  manifest.status = 'DELETING';
  dispatch('update', manifest);
  try {
    await window.removeManifest(manifest.engineId, manifest.name);
  } catch (error) {
    await onError(
      t('resources.manifest-delete-error', { error: error instanceof Error ? error.message : String(error) }) ??
        `Error while deleting manifest: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function onError(error: string): Promise<void> {
  await window.showMessageBox({
    title: t('resources.delete-manifest-failed') ?? 'Delete Manifest Failed',
    message: error,
    type: 'error',
    buttons: [t('resources.dismiss') ?? 'Dismiss'],
  });
}
</script>

<ListItemButtonIcon
  title={t('resources.delete-manifest') ?? 'Delete Manifest'}
  onClick={(): void => withConfirmation(deleteManifest, `delete manifest ${manifest.name}`, {
    title: t('resources.delete-manifest') ?? 'Delete Manifest?', variant: 'delete',
    message: t('resources.confirm-delete-manifest', { name: manifest.name }) ?? `Are you sure you want to delete manifest ${manifest.name}?`,
  })}
  detailed={detailed}
  icon={faTrash}
  enabled={manifest.status === 'UNUSED'} />

<!-- If dropdownMenu is true, use it, otherwise just show the regular buttons -->
<ActionsWrapper dropdownMenu={dropdownMenu}>
  <ListItemButtonIcon
    title={t('resources.push-manifest') ?? 'Push Manifest'}
    onClick={pushManifest}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faArrowUp} />
</ActionsWrapper>
