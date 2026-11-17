<script lang="ts">
import { Button, Input } from '@podman-desktop/ui-svelte';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  network: NetworkInfoUI;
  onClose: () => void;
}

let { network, onClose = (): void => {} }: Props = $props();

let addDNSServers = $state('');

let removeDNSServers = $state('');

async function updateNetwork(): Promise<void> {
  const addList = addDNSServers ? addDNSServers.trim().split(' ') : [];
  const removeList = removeDNSServers ? removeDNSServers.trim().split(' ') : [];
  await window.updateNetwork(network.engineId, network.id, addList, removeList);
  addDNSServers = '';
  removeDNSServers = '';
  onClose();
}
</script>
<Dialog
  title={t('resources.update-network-name', { name: network.name }) ?? `Update network ${network.name}`}
  onclose={onClose}>
  {#snippet content()}
    <div  class="flex flex-col text-[var(--pd-modal-text)] space-y-5">
      <div>
        <div>{t('resources.dns-servers-to-add-for-multiple-servers-separate-with-a-space') ?? 'DNS servers to add (for multiple servers, separate with a space)'}</div>
        <Input placeholder="8.8.8.8 1.1.1.1" bind:value={addDNSServers}></Input>
      </div>

      <div>
        <div>{t('resources.dns-servers-to-drop-for-multiple-servers-separate-with-a-space') ?? 'DNS servers to drop (for multiple servers, separate with a space)'}</div>
        <Input placeholder="8.8.8.8 1.1.1.1" bind:value={removeDNSServers}></Input>
      </div>

    </div>
  {/snippet}
  {#snippet buttons()}
    
    <Button type="link" onclick={onClose}>{t('resources.cancel') ?? 'Cancel'}</Button>
    <Button
      type="primary"
      disabled={!addDNSServers.trim() &&
        !removeDNSServers.trim()}
      onclick={updateNetwork}>{t('resources.update') ?? 'Update'}</Button>
  {/snippet}
</Dialog>
