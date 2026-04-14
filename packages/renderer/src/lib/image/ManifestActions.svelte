<script lang="ts">
import { faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { createEventDispatcher } from 'svelte';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
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
    await onError(`Error while deleting manifest: ${String(error)}`);
  }
}

async function onError(error: string): Promise<void> {
  await window.showMessageBox({
    title: 'Something went wrong.',
    message: error,
    type: 'error',
  });
}
</script>

<ListItemButtonIcon
  title="Delete Manifest"
  onClick={(): void => withConfirmation(deleteManifest, `delete manifest ${manifest.name}`)}
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
