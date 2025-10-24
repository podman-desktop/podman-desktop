<script lang="ts">
import { Button, Input } from '@podman-desktop/ui-svelte';

import Dialog from '../dialogs/Dialog.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  network: NetworkInfoUI;
  closeDialog: () => void;
}

let { network, closeDialog = (): void => {} }: Props = $props();

let addDNSServers = $state('');

let removeDNSServers = $state('');

async function updateNetwork(): Promise<void> {
  const addList = addDNSServers ? addDNSServers.trim().split(' ') : [];
  const removeList = removeDNSServers ? removeDNSServers.trim().split(' ') : [];
  await window.updateNetwork(network.engineId, network.id, addList, removeList);
  addDNSServers = '';
  removeDNSServers = '';
  closeDialog();
}
</script>
<Dialog
  title={`Edit Network ${network.name}`}
  onclose={closeDialog}>
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
    
    <Button type="link" onclick={closeDialog}>Cancel</Button>
    <Button
      type="primary"
      disabled={!addDNSServers.trim() &&
        !removeDNSServers.trim()}
      onclick={updateNetwork}>Update</Button>
  {/snippet}
</Dialog>
