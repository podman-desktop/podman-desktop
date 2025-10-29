<script lang="ts">
import { faPieChart, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  FilteredEmptyScreen,
  NavPage,
  Table,
  TableColumn,
  TableDurationColumn,
  TableRow,
  TableSimpleColumn,
} from '@podman-desktop/ui-svelte';
import moment from 'moment';
import { router } from 'tinro';

import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

import { providerInfos } from '../../stores/providers';
import { fetchVolumesWithData, filtered, volumeListInfos } from '../../stores/volumes';
import { withBulkConfirmation } from '../actions/BulkActions';
import type { EngineInfoUI } from '../engine/EngineInfoUI';
import Prune from '../engine/Prune.svelte';
import NoContainerEngineEmptyScreen from '../image/NoContainerEngineEmptyScreen.svelte';
import VolumeIcon from '../images/VolumeIcon.svelte';
import { VolumeUtils } from './volume-utils';
import VolumeColumnActions from './VolumeColumnActions.svelte';
import VolumeColumnEnvironment from './VolumeColumnEnvironment.svelte';
import VolumeColumnName from './VolumeColumnName.svelte';
import VolumeColumnStatus from './VolumeColumnStatus.svelte';
import VolumeEmptyScreen from './VolumeEmptyScreen.svelte';
import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

const volumeUtils = new VolumeUtils();

let volumes: VolumeInfoUI[] = $derived(
  $filtered
    .map(volumeListInfo => volumeListInfo.Volumes)
    .flat()
    .map(volume => volumeUtils.toVolumeInfoUI(volume)),
);
let enginesList: EngineInfoUI[] = $derived(
  Array.from(
    volumes
      .reduce((accumulator, current) => {
        if (!accumulator.has(current.engineId)) {
          accumulator.set(current.engineId, {
            id: current.engineId,
            name: current.engineName,
          });
        }
        return accumulator;
      }, new Map<string, EngineInfoUI>())
      .values(),
  ),
);

let providerConnections: ProviderContainerConnectionInfo[] = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

// delete the items selected in the list
let bulkDeleteInProgress = false;
async function deleteSelectedVolumes(): Promise<void> {
  const selectedVolumes = volumes.filter(volume => volume.selected);

  if (selectedVolumes.length === 0) {
    return;
  }

  // mark volumes for deletion
  bulkDeleteInProgress = true;
  selectedVolumes.forEach(volume => (volume.status = 'DELETING'));
  volumes = volumes;

  await Promise.all(
    selectedVolumes.map(async volume => {
      try {
        await window.removeVolume(volume.engineId, volume.name);
      } catch (e) {
        console.error('error while removing volume', e);
      }
    }),
  );
  bulkDeleteInProgress = false;
}

let fetchDataInProgress = $state(false);
async function fetchUsageData(): Promise<void> {
  fetchDataInProgress = true;
  try {
    await fetchVolumesWithData();
  } finally {
    fetchDataInProgress = false;
  }
}

function gotoCreateVolume(): void {
  router.goto('/volumes/create');
}

let selectedItemsNumber: number = $state(0);

let statusColumn = new TableColumn<VolumeInfoUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: VolumeColumnStatus,
  comparator: (a, b): number => b.status.localeCompare(a.status),
});

let nameColumn = new TableColumn<VolumeInfoUI>('Name', {
  width: '3fr',
  renderer: VolumeColumnName,
  comparator: (a, b): number => a.shortName.localeCompare(b.shortName),
});

let envColumn = new TableColumn<VolumeInfoUI>('Environment', {
  renderer: VolumeColumnEnvironment,
  comparator: (a, b): number => a.engineName.localeCompare(b.engineName),
});

let ageColumn = new TableColumn<VolumeInfoUI, Date>('Age', {
  renderMapping: (object): Date => new Date(object.created),
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment().diff(a.created) - moment().diff(b.created),
});

let sizeColumn = new TableColumn<VolumeInfoUI, string>('Size', {
  align: 'right',
  renderMapping: (object): string => object.humanSize,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.size - b.size,
  initialOrder: 'descending',
});

const columns = [
  statusColumn,
  nameColumn,
  envColumn,
  ageColumn,
  sizeColumn,
  new TableColumn<VolumeInfoUI>('Actions', { align: 'right', renderer: VolumeColumnActions, overflow: true }),
];

const row = new TableRow<VolumeInfoUI>({
  selectable: (volume): boolean => volume.status === 'UNUSED',
  disabledText: 'Volume is used by a container',
});
/**
 * Utility function for the Table to get the key to use for each item
 */
function key(obj: VolumeInfoUI): string {
  return `${obj.engineId}:${obj.name}`;
}
</script>

<NavPage bind:searchTerm={searchTerm} title="volumes">
  {#snippet additionalActions()}
    {#if $volumeListInfos.map(volumeInfo => volumeInfo.Volumes).flat().length > 0}
      <Prune type="volumes" engines={enginesList} />

      <Button
        inProgress={fetchDataInProgress}
        on:click={fetchUsageData}
        title="Gather sizes for volumes. It can take a while..."
        icon={faPieChart}
        aria-label="Gather volume sizes">Gather volume sizes</Button>
    {/if}
    {#if providerConnections.length > 0}
      <Button on:click={gotoCreateVolume} icon={faPlusCircle} title="Create a volume" aria-label="Create"
        >Create</Button>
    {/if}
  {/snippet}

  {#snippet bottomAdditionalActions()}
    {#if selectedItemsNumber > 0}
      <Button
        onclick={(): void =>
          withBulkConfirmation(
            deleteSelectedVolumes,
            `delete ${selectedItemsNumber} volume${selectedItemsNumber > 1 ? 's' : ''}`,
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
    {:else if $filtered.map(volumeInfo => volumeInfo.Volumes).flat().length === 0}
      {#if searchTerm}
        <FilteredEmptyScreen icon={VolumeIcon} kind="volumes" bind:searchTerm={searchTerm} />
      {:else}
        <VolumeEmptyScreen />
      {/if}
    {:else}
      <Table
        kind="volume"
        bind:selectedItemsNumber={selectedItemsNumber}
        data={volumes}
        columns={columns}
        row={row}
        defaultSortColumn="Name"
        enableLayoutConfiguration={true}
        key={key}
        on:update={(): VolumeInfoUI[] => (volumes = volumes)}>
      </Table>
    {/if}
  </div>
  {/snippet}
</NavPage>
