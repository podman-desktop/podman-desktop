<script lang="ts">
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';

import ListItemButtonIcon from '../ui/ListItemButtonIcon.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';
import UpdateNetworkDialog from './UpdateNetworkDialog.svelte';

interface Props {
  network: NetworkInfoUI;
  detailed?: boolean;
}

let { network, detailed = false }: Props = $props();

let showUpdateNetworkDialog = $state(false);

async function removeNetwork(): Promise<void> {
  const oldStatus = network.status;
  network.status = 'DELETING';

  try {
    await window.removeNetwork(network.engineId, network.id);
  } catch (error) {
    console.error(`error while removing network ${network.name}`, error);
    network.status = oldStatus;
  }
}

function closeUpdateDialog(): void {
  showUpdateNetworkDialog = false;
}
</script>

<ListItemButtonIcon
  title="Update Network"
  onClick={(): void => {showUpdateNetworkDialog = true;}}
  icon={faEdit}
  detailed={detailed}
  enabled={network.engineType === 'podman'} />

<ListItemButtonIcon
  title="Delete Network"
  onClick={(): void => withConfirmation(removeNetwork, `delete network ${network.name}`)}
  icon={faTrash}
  detailed={detailed}
  enabled={network.status === 'UNUSED'} />

{#if showUpdateNetworkDialog}
  <UpdateNetworkDialog network={network} closeDialog={closeUpdateDialog} />
{/if}
