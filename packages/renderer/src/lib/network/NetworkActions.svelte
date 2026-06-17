<script lang="ts">
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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

async function removeNetwork(): Promise<void> {
  const oldStatus = object.status;
  object.status = 'DELETING';

  try {
    await window.removeNetwork(object.engineId, object.id);
  } catch (error) {
    object.status = oldStatus;
    await window.showMessageBox({
      title: 'Delete Network Failed',
      message: `Error while deleting network ${object.name}: ${error instanceof Error ? error.message : String(error)}`,
      type: 'error',
      buttons: ['Dismiss'],
    });
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
  enabled={object.engineType === 'podman'} />

<ListItemButtonIcon
  title="Delete Network"
  onClick={(): void => withConfirmation(removeNetwork, `delete network ${object.name}`, { title: 'Delete Network?', variant: 'delete' })}
  icon={faTrash}
  detailed={detailed}
  enabled={object.status === 'UNUSED'} />

{#if showUpdateNetworkDialog}
  <UpdateNetworkDialog network={object} onClose={closeUpdateDialog} />
{/if}
