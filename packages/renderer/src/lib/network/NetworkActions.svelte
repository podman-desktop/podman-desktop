<script lang="ts">
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Menu } from '@podman-desktop/core-api';
import { MenuContext } from '@podman-desktop/core-api';

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

async function getContributionsWithErrorHandling(): Promise<Menu[]> {
  try {
    return await window.getContributedMenus(MenuContext.DASHBOARD_NETWORK);
  } catch (error) {
    console.error(`error while fetching contributed menus for network ${object.name}`, error);
    return [];
  }
}

const contributions = $derived(await getContributionsWithErrorHandling());

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
  object.actionError = error;
  object.status = 'ERROR';
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
