<script lang="ts">
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Input } from '@podman-desktop/ui-svelte';
import { createEventDispatcher } from 'svelte';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';

import Dialog from '../dialogs/Dialog.svelte';
import ListItemButtonIcon from '../ui/ListItemButtonIcon.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  network: NetworkInfoUI;
  detailed: boolean;
}

let { network, detailed }: Props = $props();

let showUpdateNetworkDialog = $state(false);

let addDNSServers = $state('');

let removeDNSServers = $state('');

const dispatch = createEventDispatcher<{ update: NetworkInfoUI }>();

async function removeNetwork(): Promise<void> {
  network.status = 'DELETING';
  dispatch('update', network);

  await window.removeNetwork(network.engineId, network.id);
}

async function updateNetwork(): Promise<void> {
  const addList = addDNSServers ? addDNSServers.split(' ') : [];
  const removeList = removeDNSServers ? removeDNSServers.split(' ') : [];
  await window.updateNetwork(network.engineId, network.id, addList, removeList);
  addDNSServers = '';
  removeDNSServers = '';
  showUpdateNetworkDialog = false;
}
</script>

{#if network.status === 'UNUSED'}
  <ListItemButtonIcon
    title="Delete Network"
    onClick={(): void => withConfirmation(removeNetwork, `delete network ${network.name}`)}
    detailed={detailed}
    icon={faTrash} />
{/if}
{#if network.engineType === 'podman'}
  <ListItemButtonIcon
    title="Update Network"
    onClick={(): void => {showUpdateNetworkDialog = true;}}
    detailed={detailed}
    icon={faEdit} />
{/if}

{#if showUpdateNetworkDialog}
  <Dialog
    title={`Edit Network ${network.name}`}
    onclose={(): void => {
      showUpdateNetworkDialog = false;
    }}>
    {#snippet content()}
      <div  class="flex flex-col text-[var(--pd-modal-text)] space-y-5">
        <div>
          <div>DNS servers to add (for multiple servers, separate with a space)</div>
          <Input placeholder="8.8.8.8 1.1.1.1" bind:value={addDNSServers}></Input>
        </div>

        <div>
          <div>DNS servers to drop (for multiple servers, separate with a space)</div>
          <Input placeholder="8.8.8.8 1.1.1.1" bind:value={removeDNSServers}></Input>
        </div>

      </div>
    {/snippet}
    {#snippet buttons()}
      
      <Button type="link" onclick={(): boolean => (showUpdateNetworkDialog = false)}>Cancel</Button>
      <Button
        type="primary"
        disabled={!addDNSServers.trim() &&
          !removeDNSServers.trim()}
        onclick={updateNetwork}>Add</Button>
    {/snippet}
  </Dialog>
{/if}