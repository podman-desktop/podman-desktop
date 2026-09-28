<script lang="ts">
import { faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';
import { setImageStatus } from '/@/stores/images';

import ActionsWrapper from './ActionsMenu.svelte';
import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  onPushManifest: (manifestInfo: ImageInfoUI) => void;
  manifest: ImageInfoUI;
  dropdownMenu?: boolean;
  detailed?: boolean;
}

let { onPushManifest, manifest = $bindable(), dropdownMenu = false, detailed = false }: Props = $props();

async function pushManifest(): Promise<void> {
  onPushManifest(manifest);
}

async function deleteManifest(): Promise<void> {
  const oldStatus = manifest.status;
  setImageStatus(manifest.engineId, manifest.id, manifest.base64RepoTag, 'DELETING');
  try {
    await window.removeManifest(manifest.engineId, manifest.name);
  } catch (error) {
    setImageStatus(manifest.engineId, manifest.id, manifest.base64RepoTag, oldStatus);
    await onError(`Error while deleting manifest: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function onError(error: string): Promise<void> {
  await window.showMessageBox({
    title: 'Delete Manifest Failed',
    message: error,
    type: 'error',
    buttons: ['Dismiss'],
  });
}
</script>

<ListItemButtonIcon
  title="Delete Manifest"
  onClick={(): void => withConfirmation(deleteManifest, `delete manifest ${manifest.name}`, { title: 'Delete Manifest?', variant: 'delete' })}
  detailed={detailed}
  icon={faTrash}
  enabled={manifest.status === 'UNUSED'} />

<!-- If dropdownMenu is true, use it, otherwise just show the regular buttons -->
<ActionsWrapper dropdownMenu={dropdownMenu}>
  <ListItemButtonIcon
    title="Push Manifest"
    onClick={pushManifest}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faArrowUp} />
</ActionsWrapper>
