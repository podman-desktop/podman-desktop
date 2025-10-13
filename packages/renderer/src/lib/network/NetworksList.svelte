<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, FilteredEmptyScreen, NavPage, Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy } from 'svelte';

import { filtered, searchPattern } from '/@/stores/networks';

import { providerInfos } from '../../stores/providers';
import { withBulkConfirmation } from '../actions/BulkActions';
import NoContainerEngineEmptyScreen from '../image/NoContainerEngineEmptyScreen.svelte';
import { NetworkUtils } from './network-utils';
import NetworkColumnActions from './NetworkColumnActions.svelte';
import NetworkColumnDriver from './NetworkColumnDriver.svelte';
import NetworkColumnId from './NetworkColumnId.svelte';
import NetworkColumnName from './NetworkColumnName.svelte';
import NetworkEmptyScreen from './NetworkEmptyScreen.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

$effect(() => {
  $searchPattern = searchTerm;
});

let networkUtils = new NetworkUtils();

let networks: NetworkInfoUI[] = $derived($filtered.map(network => networkUtils.toNetworkInfoUI(network)));

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

onDestroy(() => {});

let selectedItemsNumber: number = $state(0);

let bulkDeleteInProgress = $state(false);
async function deleteSelectedNetworks(): Promise<void> {
  const selectedNetworks = networks.filter(network => network.selected);

  if (selectedNetworks.length === 0) {
    return;
  }

  // mark networks for deletion
  bulkDeleteInProgress = true;
  selectedNetworks.forEach(network => (network.status = 'DELETING'));

  await Promise.all(
    selectedNetworks.map(async network => {
      try {
        await window.removeNetwork(network.engineId, network.id);
      } catch (error) {
        console.error(`error while removing network ${network.name}`, error);
      }
    }),
  );
  bulkDeleteInProgress = false;
}

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
  selectable: (network): boolean => network.status === 'UNUSED',
  disabledText: 'Network is used by a container',
});
</script>

<NavPage bind:searchTerm={searchTerm} title="networks">

  {#snippet bottomAdditionalActions()}
    {#if selectedItemsNumber > 0}
      <Button
        on:click={(): void =>
          withBulkConfirmation(
            deleteSelectedNetworks,
            `delete ${selectedItemsNumber} network${selectedItemsNumber > 1 ? 's' : ''}`,
          )}
        title="Delete {selectedItemsNumber} selected items"
        inProgress={bulkDeleteInProgress}
        icon={faTrash} />
      <span>On {selectedItemsNumber} selected items.</span>
    {/if}
  {/snippet}

  {#snippet content()}
  <div class="flex min-w-full h-full">

    {#if providerConnections.length === 0}
      <NoContainerEngineEmptyScreen />
    {:else if networks.length === 0}
      {#if searchTerm}
          <FilteredEmptyScreen icon={ContainerIcon} kind="networks" bind:searchTerm={searchTerm} />
        {:else}
          <NetworkEmptyScreen />
        {/if}
    {:else}
      <Table
        kind="network"
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
