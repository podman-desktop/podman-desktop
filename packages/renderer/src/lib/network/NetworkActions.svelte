<script lang="ts">
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Menu } from '@podman-desktop/core-api';
import { MenuContext } from '@podman-desktop/core-api';
import { onMount } from 'svelte';

import ContributionActions from '/@/lib/actions/ContributionActions.svelte';
import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { NetworkInfoUI } from './NetworkInfoUI';
import UpdateNetworkDialog from './UpdateNetworkDialog.svelte';

interface Props {
  object: NetworkInfoUI;
  detailed?: boolean;
}

let { object, detailed = false }: Props = $props();

let showUpdateNetworkDialog = $state(false);
let contributions = $state<Menu[]>([]);

onMount(async () => {
  try {
    contributions = await window.getContributedMenus(MenuContext.DASHBOARD_NETWORK);
  } catch (error) {
    console.error(`error while fetching contributed menus for network ${object.name}`, error);
    handleError(String(error));
  }
});

async function removeNetwork(): Promise<void> {
  const oldStatus = object.status;
  object.status = 'DELETING';

  try {
    await window.removeNetwork(object.engineId, object.id);
  } catch (error) {
    console.error(`error while removing network ${object.name}`, error);
    object.status = oldStatus;
  }
}

function closeUpdateDialog(): void {
  showUpdateNetworkDialog = false;
}

function handleError(error: string): void {
  console.error(`error in network actions for ${object.name}`, error);
}
</script>

<ListItemButtonIcon
  title="Update Network"
  onClick={(): void => {showUpdateNetworkDialog = true;}}
  icon={faEdit}
  detailed={detailed}
  enabled={object.engineType === 'podman'} />

<ListItemButtonIcon
  title="Delete Network"
  onClick={(): void => withConfirmation(removeNetwork, `delete network ${object.name}`)}
  icon={faTrash}
  detailed={detailed}
  enabled={object.status === 'UNUSED'} />

<ContributionActions
  args={[object]}
  contextPrefix="networkItem"
  dropdownMenu={false}
  contributions={contributions}
  detailed={detailed}
  onError={handleError} />

{#if showUpdateNetworkDialog}
  <UpdateNetworkDialog network={object} onClose={closeUpdateDialog} />
{/if}
