<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Menu } from '@podman-desktop/core-api';
import { MenuContext } from '@podman-desktop/core-api';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { createEventDispatcher, onMount } from 'svelte';

import ContributionActions from '/@/lib/actions/ContributionActions.svelte';
import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import FlatMenu from '/@/lib/ui/FlatMenu.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { VolumeInfoUI } from './VolumeInfoUI';

export let volume: VolumeInfoUI;
export let dropdownMenu = false;
export let detailed = false;

const dispatch = createEventDispatcher<{ update: VolumeInfoUI }>();

let contributions: Menu[] = [];
onMount(async () => {
  try {
    contributions = await window.getContributedMenus(MenuContext.DASHBOARD_VOLUME);
  } catch (error) {
    console.error('Error fetching contributed menus for volumes:', error);
  }
});

function handleError(errorMessage: string): void {
  volume.actionError = errorMessage;
  volume.status = 'ERROR';
  dispatch('update', volume);
}

async function removeVolume(): Promise<void> {
  volume.status = 'DELETING';
  dispatch('update', volume);

  try {
    await window.removeVolume(volume.engineId, volume.name);
  } catch (error) {
    handleError(String(error));
  }
}

// If dropdownMenu = true, we'll change style to the imported dropdownMenu style
// otherwise, leave blank.
$: MenuComponent = dropdownMenu ? DropdownMenu : FlatMenu;
</script>

{#if volume.status === 'UNUSED'}
  <ListItemButtonIcon
    title="Delete Volume"
    onClick={(): void => withConfirmation(removeVolume, `delete volume ${volume.name}`)}
    detailed={detailed}
    icon={faTrash} />
{/if}

<MenuComponent>
  <ContributionActions
    args={[volume]}
    contextPrefix="volumeItem"
    dropdownMenu={dropdownMenu}
    contributions={contributions}
    detailed={detailed}
    onError={handleError} />
</MenuComponent>
