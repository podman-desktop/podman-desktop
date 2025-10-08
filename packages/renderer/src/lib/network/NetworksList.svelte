<script lang="ts">
import { NavPage, Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import { providerInfos } from '../../stores/providers';
import NoContainerEngineEmptyScreen from '../image/NoContainerEngineEmptyScreen.svelte';
import { NetworkUtils } from './network-utils';
import NetworkColumnActions from './NetworkColumnActions.svelte';
import NetworkColumnDriver from './NetworkColumnDriver.svelte';
import NetworkColumnId from './NetworkColumnId.svelte';
import NetworkColumnName from './NetworkColumnName.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

let networkUtils = new NetworkUtils();

let networks: NetworkInfoUI[] = $state<NetworkInfoUI[]>([]);

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

onMount(async () => {
  networks = (await window.listNetworks()).map(network => networkUtils.toVolumeInfoUI(network));
});

onDestroy(() => {});

let selectedItemsNumber: number;

let idColumn = new TableColumn<NetworkInfoUI>('Id', {
  width: '100px',
  renderer: NetworkColumnId,
  comparator: (a, b): number => b.id.localeCompare(a.id),
});

let nameColumn = new TableColumn<NetworkInfoUI>('Name', {
  width: '3fr',
  renderer: NetworkColumnName,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let driverColumn = new TableColumn<NetworkInfoUI>('Driver', {
  renderer: NetworkColumnDriver,
  comparator: (a, b): number => a.driver.localeCompare(b.driver),
});

const columns = [
  idColumn,
  nameColumn,
  driverColumn,
  new TableColumn<NetworkInfoUI>('Actions', { align: 'right', renderer: NetworkColumnActions, overflow: true }),
];

const row = new TableRow<NetworkInfoUI>({
  selectable: (): boolean => true,
  disabledText: 'Volume is used by a container',
});
</script>

<NavPage bind:searchTerm={searchTerm} title="networks">

  {#snippet bottomAdditionalActions()}
    {#if selectedItemsNumber > 0}
      
    {/if}
  {/snippet}

  {#snippet content()}
  <div class="flex min-w-full h-full">

    {#if providerConnections.length === 0}
      <NoContainerEngineEmptyScreen />
    {:else}
      <Table
        kind="volume"
        bind:selectedItemsNumber={selectedItemsNumber}
        data={networks}
        columns={columns}
        row={row}
        defaultSortColumn="Name"
        on:update={(): NetworkInfoUI[] => (networks = networks)}>
      </Table>
    {/if}
  </div>
  {/snippet}
</NavPage>
