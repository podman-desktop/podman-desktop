<script lang="ts">
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Menu } from '@podman-desktop/core-api';
import { MenuContext } from '@podman-desktop/core-api';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { createEventDispatcher, onMount } from 'svelte';

import ContributionActions from '/@/lib/actions/ContributionActions.svelte';
import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import FlatMenu from '/@/lib/ui/FlatMenu.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import RenameVolumeDialog from './RenameVolumeDialog.svelte';
import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  volume: VolumeInfoUI;
  dropdownMenu?: boolean;
  detailed?: boolean;
}

let { volume, dropdownMenu = false, detailed = false }: Props = $props();

const dispatch = createEventDispatcher<{ update: VolumeInfoUI }>();

let contributions: Menu[] = $state([]);
let showRenameDialog = $state(false);
onMount(async () => {
  try {
    contributions = await window.getContributedMenus(MenuContext.DASHBOARD_VOLUME);
  } catch (error) {
    console.error('Error fetching contributed menus for volumes:', error);
  }
});

async function removeVolume(): Promise<void> {
  volume.status = 'DELETING';
  dispatch('update', volume);

  await window.removeVolume(volume.engineId, volume.name);
}

function confirmRemoveVolume(): void {
  withConfirmation(removeVolume, `delete volume ${volume.name}`, { title: 'Delete Volume?', variant: 'delete' });
}

function openRenameDialog(): void {
  showRenameDialog = true;
}

function closeRenameDialog(): void {
  showRenameDialog = false;
}

// If dropdownMenu = true, we'll change style to the imported dropdownMenu style
// otherwise, leave blank.
let MenuComponent = $derived(dropdownMenu ? DropdownMenu : FlatMenu);
</script>

{#if volume.status === 'UNUSED'}
  {#if volume.canRename}
    <ListItemButtonIcon
      title="Rename Volume"
      onClick={openRenameDialog}
      detailed={detailed}
      icon={faEdit} />
  {/if}
  <ListItemButtonIcon
    title="Delete Volume"
    onClick={confirmRemoveVolume}
    detailed={detailed}
    icon={faTrash} />
{/if}

{#if showRenameDialog}
  <RenameVolumeDialog {volume} onClose={closeRenameDialog} />
{/if}

<MenuComponent>
  <ContributionActions
    args={[volume]}
    contextPrefix="volumeItem"
    dropdownMenu={dropdownMenu}
    contributions={contributions}
    detailed={detailed}
    onError={(errorMessage: string): void => console.error(errorMessage)} />
</MenuComponent>
