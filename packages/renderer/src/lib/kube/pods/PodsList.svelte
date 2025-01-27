<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  FilteredEmptyScreen,
  NavPage,
  Table,
  TableColumn,
  TableDurationColumn,
  TableRow,
} from '@podman-desktop/ui-svelte';
import moment from 'moment';

import KubernetesCurrentContextConnectionBadge from '/@/lib/ui/KubernetesCurrentContextConnectionBadge.svelte';
import { kubernetesCurrentContextPodsFiltered, podSearchPattern } from '/@/stores/kubernetes-contexts-state';

import { withBulkConfirmation } from '../../actions/BulkActions';
import PodIcon from '../../images/PodIcon.svelte';
import PodEmptyScreen from '../../pod/PodEmptyScreen.svelte';
import KubeApplyYamlButton from '../KubeApplyYAMLButton.svelte';
import { PodUtils } from './pod-utils';
import PodColumnActions from './PodColumnActions.svelte';
import PodColumnContainers from './PodColumnContainers.svelte';
import PodColumnName from './PodColumnName.svelte';
import PodColumnStatus from './PodColumnStatus.svelte';
import type { PodUI } from './PodUI';

let {
  searchTerm = '',
}: {
  searchTerm?: string;
} = $props();

$effect(() => {
  podSearchPattern.set(searchTerm);
});

const podUtils = new PodUtils();
const pods = $derived($kubernetesCurrentContextPodsFiltered.map(pod => podUtils.getPodUI(pod)));

// delete the items selected in the list
let bulkDeleteInProgress = $state<boolean>(false);
async function deleteSelectedPods(): Promise<void> {
  const selectedPods = pods.filter(pod => pod.selected);
  if (selectedPods.length === 0) {
    return;
  }

  // mark pods for deletion
  bulkDeleteInProgress = true;
  selectedPods.forEach(pod => (pod.status = 'DELETING'));

  await Promise.all(
    selectedPods.map(async pod => {
      try {
        await window.kubernetesDeletePod(pod.name);
      } catch (e) {
        console.error('error while deleting pod', e);
      }
    }),
  );
  bulkDeleteInProgress = false;
}

let selectedItemsNumber = $state<number>(0);
let table: Table;

let statusColumn = new TableColumn<PodUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: PodColumnStatus,
  comparator: (a, b): number => b.status.localeCompare(a.status),
});

let nameColumn = new TableColumn<PodUI>('Name', {
  width: '2fr',
  renderer: PodColumnName,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let containersColumn = new TableColumn<PodUI>('Containers', {
  renderer: PodColumnContainers,
  comparator: (a, b): number => a.containers.length - b.containers.length,
  initialOrder: 'descending',
  overflow: true,
});

let ageColumn = new TableColumn<PodUI, Date | undefined>('Age', {
  renderMapping: (pod): Date | undefined => pod.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

const columns = [
  statusColumn,
  nameColumn,
  containersColumn,
  ageColumn,
  new TableColumn<PodUI>('Actions', { align: 'right', width: '150px', renderer: PodColumnActions, overflow: true }),
];

const row = new TableRow<PodUI>({ selectable: (_pod): boolean => true });
</script>

<NavPage bind:searchTerm={searchTerm} title="pods">
  <svelte:fragment slot="additional-actions">
    <KubeApplyYamlButton />
  </svelte:fragment>

  <svelte:fragment slot="bottom-additional-actions">
    {#if selectedItemsNumber > 0}
      <Button
        on:click={(): void =>
          withBulkConfirmation(
            deleteSelectedPods,
            `delete ${selectedItemsNumber} pod${selectedItemsNumber > 1 ? 's' : ''}`,
          )}
        title="Delete {selectedItemsNumber} selected items"
        inProgress={bulkDeleteInProgress}
        icon={faTrash} />
      <span>On {selectedItemsNumber} selected items.</span>
    {/if}
    <div class="flex grow justify-end">
      <KubernetesCurrentContextConnectionBadge />
    </div>
  </svelte:fragment>

  <div class="flex min-w-full h-full" slot="content">
    <Table
      kind="pod"
      bind:this={table}
      bind:selectedItemsNumber={selectedItemsNumber}
      data={pods}
      columns={columns}
      row={row}
      defaultSortColumn="Name">
    </Table>

    {#if $kubernetesCurrentContextPodsFiltered.length === 0}
      {#if searchTerm}
        <FilteredEmptyScreen
          icon={PodIcon}
          kind="pods"
          searchTerm={searchTerm}
          on:resetFilter={(): string => (searchTerm = '')} />
      {:else}
        <PodEmptyScreen />
      {/if}
    {/if}
  </div>
</NavPage>
