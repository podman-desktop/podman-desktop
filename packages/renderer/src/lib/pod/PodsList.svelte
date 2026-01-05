<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  FilteredEmptyScreen,
  Link,
  NavPage,
  Table,
  TableColumn,
  TableDurationColumn,
  TableRow,
} from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import { withBulkConfirmation } from '/@/lib/actions/BulkActions';
import type { EngineInfoUI } from '/@/lib/engine/EngineInfoUI';
import Prune from '/@/lib/engine/Prune.svelte';
import NoContainerEngineEmptyScreen from '/@/lib/image/NoContainerEngineEmptyScreen.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import PodmanKubePlay from '/@/lib/kube/PodmanKubePlay.svelte';
import ContainerEngineEnvironmentColumn from '/@/lib/table/columns/ContainerEngineEnvironmentColumn.svelte';
import { filtered, podsInfos, searchPattern } from '/@/stores/pods';
import { providerInfos } from '/@/stores/providers';
import type { PodInfo } from '/@api/pod-info';

import { PodUtils } from './pod-utils';
import PodColumnActions from './PodColumnActions.svelte';
import PodColumnContainers from './PodColumnContainers.svelte';
import PodColumnName from './PodColumnName.svelte';
import PodColumnStatus from './PodColumnStatus.svelte';
import PodEmptyScreen from './PodEmptyScreen.svelte';
import type { PodInfoUI } from './PodInfoUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = $bindable('') }: Props = $props();

$effect(() => {
  searchPattern.set(searchTerm);
});

let pods: PodInfoUI[] = $state([]);
let enginesList: EngineInfoUI[] = $state([]);

const providerConnections = $derived(
  $providerInfos
    .flatMap(provider => provider.containerConnections)
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

const providerPodmanConnections = $derived(
  $providerInfos
    .flatMap(provider => provider.containerConnections)
    // keep only podman providers as it is not supported by docker
    .filter(providerContainerConnection => providerContainerConnection.type === 'podman')
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

const podUtils = new PodUtils();

onMount(() => {
  return filtered.subscribe(value => {
    const computedPods = value.map((podInfo: PodInfo) => podUtils.getPodInfoUI(podInfo)).flat();

    // Map engineName, engineId and engineType from currentContainers to EngineInfoUI[]
    const engines = computedPods.map(container => {
      return {
        name: container.engineName,
        id: container.engineId,
      };
    });

    // Remove duplicates from engines by name
    // Set the engines to the global variable for the Prune functionality button
    enginesList = engines.filter((engine, index, self) => index === self.findIndex(t => t.name === engine.name));

    // update selected items based on current selected items
    computedPods.forEach(pod => {
      const matchingPod = pods.find(currentPod => currentPod.id === pod.id && currentPod.engineId === pod.engineId);
      if (matchingPod) {
        pod.selected = matchingPod.selected;
      }
    });
    pods = computedPods;
  });
});

// delete the items selected in the list
let bulkDeleteInProgress = $state(false);
async function deleteSelectedPods(): Promise<void> {
  const selectedPods = pods.filter(pod => pod.selected);
  if (selectedPods.length === 0) {
    return;
  }

  // mark pods for deletion
  bulkDeleteInProgress = true;
  selectedPods.forEach(pod => (pod.status = 'DELETING'));
  pods = pods;

  await Promise.all(
    selectedPods.map(async pod => {
      try {
        await window.removePod(pod.engineId, pod.id);
      } catch (e) {
        console.error('error while removing pod', e);
      }
    }),
  );
  bulkDeleteInProgress = false;
}

async function openKubePods(): Promise<void> {
  await window.navigateToRoute('kubernetes', { kind: 'Pod' });
}

let selectedItemsNumber: number = $state(0);

let statusColumn = new TableColumn<PodInfoUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: PodColumnStatus,
  comparator: (a, b): number => b.status.localeCompare(a.status),
});

let nameColumn = new TableColumn<PodInfoUI>('Name', {
  width: '2fr',
  renderer: PodColumnName,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let envColumn = new TableColumn<PodInfoUI>('Environment', {
  renderer: ContainerEngineEnvironmentColumn,
  comparator: (a, b): number => a.engineId.localeCompare(b.engineId),
});

let containersColumn = new TableColumn<PodInfoUI>('Containers', {
  renderer: PodColumnContainers,
  comparator: (a, b): number => a.containers.length - b.containers.length,
  initialOrder: 'descending',
  overflow: true,
});

let ageColumn = new TableColumn<PodInfoUI, Date | undefined>('Age', {
  renderer: TableDurationColumn,
  comparator: (a, b): number => new Date(a.created).getTime() - new Date(b.created).getTime(),
  renderMapping(object): Date | undefined {
    return podUtils.getUpDate(object);
  },
});

const columns = [
  statusColumn,
  nameColumn,
  envColumn,
  containersColumn,
  ageColumn,
  new TableColumn<PodInfoUI>('Actions', { align: 'right', width: '150px', renderer: PodColumnActions, overflow: true }),
];

const row = new TableRow<PodInfoUI>({ selectable: (_pod): boolean => true });

/**
 * Utility function for the Table to get the key to use for each item
 */
function key(pod: PodInfoUI): string {
  return `${pod.engineId}:${pod.id}`;
}
/**
 * Utility function for the Table to get the label to use for each item
 */
function label(pod: PodInfoUI): string {
  return pod.name;
}
</script>

<NavPage bind:searchTerm={searchTerm} title="pods">
  {#snippet additionalActions()}
    {#if $podsInfos.length > 0}
      <Prune type="pods" engines={enginesList} />
    {/if}
    {#if providerPodmanConnections.length > 0}
      <PodmanKubePlay />
    {/if}
  {/snippet}

  {#snippet bottomAdditionalActions()}
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
  {/snippet}

  {#snippet tabs()}
    <div class="flex flex-col gap-3">
      <div class="self-center text-[var(--pd-table-body-text)]">Looking for pods running on a Kubernetes cluster? We have moved them to the <Link on:click={openKubePods}>Kubernetes &gt; Pods</Link> page.</div>

      <div class="flex flex-row">
        <Button
          type="tab"
          on:click={(): void => {
            searchTerm = searchTerm
              .split(' ')
              .filter(pattern => pattern !== 'is:running' && pattern !== 'is:stopped')
              .join(' ');
          }}
          selected={!searchTerm.includes('is:stopped') && !searchTerm.includes('is:running')}>All</Button>
        <Button
          type="tab"
          on:click={(): void => {
            let temp = searchTerm
              .trim()
              .split(' ')
              .filter(term => term !== 'is:stopped' && term !== 'is:running')
              .join(' ')
              .trim();
            searchTerm = temp ? `${temp} is:running` : 'is:running';
          }}
          selected={searchTerm.includes('is:running')}>Running</Button>
        <Button
          type="tab"
          on:click={(): void => {
            let temp = searchTerm
              .trim()
              .split(' ')
              .filter(term => term !== 'is:stopped' && term !== 'is:running')
              .join(' ')
              .trim();
            searchTerm = temp ? `${temp} is:stopped` : 'is:stopped';
          }}
          selected={searchTerm.includes('is:stopped')}>Stopped</Button>
      </div>
    </div>
  {/snippet}

  {#snippet content()}
  <div class="flex min-w-full h-full">

    {#if providerConnections.length === 0}
      <NoContainerEngineEmptyScreen />
    {:else if $filtered.length === 0}
      {#if searchTerm}
        <FilteredEmptyScreen
          icon={PodIcon}
          kind="pods"
          bind:searchTerm={searchTerm}
          on:resetFilter={(e): void => {
            searchTerm = podUtils.filterResetSearchTerm(searchTerm);
            e.preventDefault();
          }} />
      {:else}
        <PodEmptyScreen />
      {/if}
    {:else}
      <Table
        kind="pod"
        bind:selectedItemsNumber={selectedItemsNumber}
        data={pods}
        columns={columns}
        row={row}
        defaultSortColumn="Name"
        enableLayoutConfiguration={true}
        key={key}
        label={label}
        on:update={(): PodInfoUI[] => (pods = pods)}>
      </Table>
    {/if}
  </div>
  {/snippet}
</NavPage>
