<script lang="ts">
import { faPlay, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { ContainerInfo } from '@podman-desktop/core-api';
import { NavigationPage } from '@podman-desktop/core-api';
import {
  Button,
  FilteredEmptyScreen,
  NavPage,
  Table,
  TableColumn,
  TableDurationColumn,
  TableRow,
} from '@podman-desktop/ui-svelte';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';
import moment from 'moment';
import { router } from 'tinro';

import { withBulkConfirmation } from '/@/lib/actions/BulkActions';
import Dialog from '/@/lib/dialogs/Dialog.svelte';
import Prune from '/@/lib/engine/Prune.svelte';
import NoContainerEngineEmptyScreen from '/@/lib/image/NoContainerEngineEmptyScreen.svelte';
import SolidPodIcon from '/@/lib/images/SolidPodIcon.svelte';
import { PodUtils } from '/@/lib/pod/pod-utils';
import ContainerEngineEnvironmentColumn from '/@/lib/table/columns/ContainerEngineEnvironmentColumn.svelte';
import { CONTAINER_LIST_VIEW } from '/@/lib/view/views';
import { handleNavigation } from '/@/navigation';
import { containersInfos } from '/@/stores/containers';
import { context } from '/@/stores/context';
import { podCreationHolder } from '/@/stores/creation-from-containers-store';
import { podsInfos } from '/@/stores/pods';
import { providerInfos } from '/@/stores/providers';
import { findMatchInLeaves } from '/@/stores/search-util';
import { viewsContributions } from '/@/stores/views';

import { ContainerUtils } from './container-utils';
import ContainerColumnActions from './ContainerColumnActions.svelte';
import ContainerColumnImage from './ContainerColumnImage.svelte';
import ContainerColumnName from './ContainerColumnName.svelte';
import ContainerColumnStatus from './ContainerColumnStatus.svelte';
import ContainerEmptyScreen from './ContainerEmptyScreen.svelte';
import { ContainerGroupInfoTypeUI, type ContainerGroupInfoUI, type ContainerInfoUI } from './ContainerInfoUI';

const containerUtils = new ContainerUtils();
let openChoiceModal = $state(false);

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

function fromExistingImage(): void {
  openChoiceModal = false;
  handleNavigation({ page: NavigationPage.EXISTING_IMAGE_CREATE_CONTAINER });
}

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

// filter containers by group type pod
function filterContainersByGroupTypePod(): ContainerGroupInfoUI[] {
  return containerGroups.filter(group => group.type === ContainerGroupInfoTypeUI.POD).filter(pod => pod.selected);
}

// filter containers by group type different than pod
function filterContainersByGroupTypeNotPod(): ContainerInfoUI[] {
  return containerGroups
    .filter(group => group.type !== ContainerGroupInfoTypeUI.POD)
    .flatMap(group => group.containers)
    .filter(container => container.selected);
}

// delete the items selected in the list
let bulkDeleteInProgress = $state(false);
async function deleteSelectedContainers(): Promise<void> {
  const podGroups = filterContainersByGroupTypePod();
  const selectedContainers = filterContainersByGroupTypeNotPod();
  if (podGroups.length + selectedContainers.length === 0) {
    return;
  }

  // mark pods and containers for deletion
  bulkDeleteInProgress = true;
  podGroups.forEach(pod => (pod.status = 'DELETING'));
  selectedContainers.forEach(container => (container.state = 'DELETING'));
  containerGroups = [...containerGroups];

  // delete pods first if any
  if (podGroups.length > 0) {
    await Promise.all(
      podGroups.map(async podGroup => {
        if (podGroup.engineId && podGroup.id) {
          try {
            await window.removePod(podGroup.engineId, podGroup.id);
          } catch (e) {
            console.error('error while removing pod', e);
          }
        }
      }),
    );
  }

  // then containers (that are not inside a pod)
  if (selectedContainers.length > 0) {
    await Promise.all(
      selectedContainers.map(async container => {
        container.actionInProgress = true;
        // reset error when starting task
        container.actionError = '';
        containerGroups = [...containerGroups];
        try {
          await window.deleteContainer(container.engineId, container.id);
        } catch (e) {
          console.log('error while removing container', e);
          container.actionError = String(e);
          container.state = 'ERROR';
        } finally {
          container.actionInProgress = false;
          containerGroups = [...containerGroups];
        }
      }),
    );
  }
  bulkDeleteInProgress = false;
}

// run the items selected in the list
let bulkRunInProgress = $state(false);
async function runSelectedContainers(): Promise<void> {
  const podGroups = filterContainersByGroupTypePod();
  const selectedContainers = filterContainersByGroupTypeNotPod();
  if (podGroups.length + selectedContainers.length === 0) {
    return;
  }
  bulkRunInProgress = true;
  podGroups.forEach(pod => {
    if (pod.status !== 'RUNNING') pod.status = 'STARTING';
  });
  selectedContainers.forEach(container => {
    if (container.state !== 'RUNNING') container.state = 'STARTING';
  });
  containerGroups = [...containerGroups];

  // runs pods first if any
  if (podGroups.length > 0) {
    await Promise.all(
      podGroups.map(async podGroup => {
        if (podGroup.engineId && podGroup.id && podGroup.status !== 'RUNNING') {
          try {
            await window.startPod(podGroup.engineId, podGroup.id);
            podGroup.status = 'RUNNING';
          } catch (e) {
            console.error('error while running pod', e);
          }
        }
      }),
    );
  }

  // then containers (that are not inside a pod)
  if (selectedContainers.length > 0) {
    await Promise.all(
      selectedContainers.map(async container => {
        if (container.state === 'RUNNING') {
          return; // skip already running containers
        }
        container.actionInProgress = true;
        // reset error when starting task
        container.actionError = '';
        containerGroups = [...containerGroups];
        try {
          await window.startContainer(container.engineId, container.id);
          container.state = 'RUNNING';
        } catch (e) {
          console.log('error while runnings container', e);
          container.actionError = String(e);
          container.state = 'ERROR';
        } finally {
          container.actionInProgress = false;
          containerGroups = [...containerGroups];
        }
      }),
    );
  }
  bulkRunInProgress = false;
}

function createPodFromContainers(): void {
  const selectedContainers = containerGroups
    .map(group => group.containers)
    .flat()
    .filter(container => container.selected);

  const podUtils = new PodUtils();

  const podCreation = {
    name: podUtils.calculateNewPodName($podsInfos),
    containers: selectedContainers.map(container => {
      return { id: container.id, name: container.name, engineId: container.engineId, ports: container.ports };
    }),
  };

  // update the store
  podCreationHolder.set(podCreation);

  // redirect to pod creation page
  router.goto('/pod-create-from-containers');
}

let currentContainers = $derived.by(() => {
  const viewContributions = $viewsContributions.filter(view => view.viewId === CONTAINER_LIST_VIEW);

  return $containersInfos.map((containerInfo: ContainerInfo) => {
    return containerUtils.getContainerInfoUI(containerInfo, $context, viewContributions);
  });
});

let enginesList = $derived.by(() => {
  // Map engineName, engineId and engineType from currentContainers to EngineInfoUI[]
  const engines = currentContainers.map(container => {
    return {
      name: container.engineName,
      id: container.engineId,
    };
  });

  // Remove duplicates from engines by name
  return engines.filter((engine, index, self) => index === self.findIndex(t => t.name === engine.name));
});

// groups of containers that will be displayed
let containerGroups = $derived.by(() => {
  let computedContainerGroups = containerUtils.getContainerGroups(currentContainers);

  // Filter containers in groups
  computedContainerGroups.forEach(group => {
    group.containers = group.containers
      .filter(containerInfo =>
        findMatchInLeaves(containerInfo, containerUtils.filterSearchTerm(searchTerm).toLowerCase()),
      )
      .filter(containerInfo => {
        if (containerUtils.filterIsRunning(searchTerm)) {
          return containerInfo.state === 'RUNNING';
        }
        if (containerUtils.filterIsStopped(searchTerm)) {
          return containerInfo.state !== 'RUNNING';
        }
        return true;
      });
  });
  // Remove groups with all containers filtered
  computedContainerGroups = computedContainerGroups.filter(group => group.containers.length > 0);

  // update selected items based on current selected items
  computedContainerGroups.forEach(group => {
    const matchingGroup = computedContainerGroups.find(currentGroup => currentGroup.name === group.name);
    if (matchingGroup) {
      group.selected = matchingGroup.selected;
      group.expanded = matchingGroup.expanded;
      group.containers.forEach(container => {
        const matchingContainer = matchingGroup.containers.find(
          currentContainer => currentContainer.id === container.id,
        );
        if (matchingContainer) {
          container.actionError = matchingContainer.actionError;
          container.selected = matchingContainer.selected;
        }
      });
    }
  });

  return computedContainerGroups;
});

function toggleCreateContainer(): void {
  openChoiceModal = !openChoiceModal;
}

function fromDockerfile(): void {
  openChoiceModal = false;
  router.goto('/images/build');
}

function resetRunningFilter(): void {
  searchTerm = containerUtils.filterResetRunning(searchTerm);
}

function setRunningFilter(): void {
  searchTerm = containerUtils.filterSetRunning(searchTerm);
}

function setStoppedFilter(): void {
  searchTerm = containerUtils.filterSetStopped(searchTerm);
}

let selectedItemsNumber = $state<number>();

let statusColumn = new TableColumn<ContainerInfoUI | ContainerGroupInfoUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: ContainerColumnStatus,
  comparator: (a, b): number => {
    const bStatus = ('status' in b ? b.status : 'state' in b ? b.state : '') ?? '';
    const aStatus = ('status' in a ? a.status : 'state' in a ? a.state : '') ?? '';
    return bStatus.localeCompare(aStatus);
  },
});

let nameColumn = new TableColumn<ContainerInfoUI | ContainerGroupInfoUI>('Name', {
  width: '2fr',
  renderer: ContainerColumnName,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let envColumn = new TableColumn<ContainerInfoUI | ContainerGroupInfoUI>('Environment', {
  renderer: ContainerEngineEnvironmentColumn,
  comparator: (a, b): number => (a.engineId ?? '').localeCompare(b.engineId ?? ''),
});

let imageColumn = new TableColumn<ContainerInfoUI | ContainerGroupInfoUI>('Image', {
  width: '3fr',
  renderer: ContainerColumnImage,
  comparator: (a, b): number => {
    const aImage = 'image' in a ? a.image : '';
    const bImage = 'image' in b ? b.image : '';
    return aImage.localeCompare(bImage);
  },
});

let uptimeColumn = new TableColumn<ContainerInfoUI | ContainerGroupInfoUI, Date | undefined>('Uptime', {
  renderer: TableDurationColumn,
  renderMapping(object): Date | undefined {
    if (containerUtils.isContainerInfoUI(object)) {
      return containerUtils.getUpDate(object);
    }
    return undefined;
  },
  comparator: (a, b): number => {
    const aTime = containerUtils.isContainerInfoUI(a) && a.state === 'RUNNING' ? (moment().diff(a.startedAt) ?? 0) : 0;
    const bTime = containerUtils.isContainerInfoUI(b) && b.state === 'RUNNING' ? (moment().diff(b.startedAt) ?? 0) : 0;
    return aTime - bTime;
  },
});

const columns = [
  statusColumn,
  nameColumn,
  envColumn,
  imageColumn,
  uptimeColumn,
  new TableColumn<ContainerInfoUI | ContainerGroupInfoUI>('Actions', {
    align: 'right',
    width: '150px',
    renderer: ContainerColumnActions,
    overflow: true,
  }),
];

const row = new TableRow<ContainerGroupInfoUI | ContainerInfoUI>({
  selectable: (_container): boolean => true,
  children: (object): ContainerInfoUI[] => {
    if ('type' in object && object.type !== ContainerGroupInfoTypeUI.STANDALONE) {
      return object.containers;
    } else {
      return [];
    }
  },
});

let containersAndGroups: (ContainerGroupInfoUI | ContainerInfoUI)[] = $derived(
  containerGroups.map(group => (group?.type === ContainerGroupInfoTypeUI.STANDALONE ? group.containers[0] : group)),
);

function key(item: ContainerGroupInfoUI | ContainerInfoUI): string {
  return item.id;
}
function label(item: ContainerGroupInfoUI | ContainerInfoUI): string {
  return item.name;
}
</script>

<NavPage bind:searchTerm={searchTerm} title="containers">
  {#snippet additionalActions()}
    <!-- Only show if there are containers-->
    {#if $containersInfos.length > 0}
      <Prune type="containers" engines={enginesList} />
    {/if}
    <Button on:click={toggleCreateContainer} icon={faPlusCircle} title="Create a container">Create</Button>
  {/snippet}
  {#snippet bottomAdditionalActions()}
    {#if selectedItemsNumber && selectedItemsNumber > 0}
      <div class="inline-flex space-x-2">
        <Button
          on:click={(): Promise<void> =>
          runSelectedContainers()}
          aria-label="Run selected containers and pods"
          title="Run {selectedItemsNumber} selected items"
          inProgress={bulkRunInProgress}
          icon={faPlay}>
        </Button>
        <Button
          on:click={(): void => {
            if (selectedItemsNumber !== undefined) {
              withBulkConfirmation(
                deleteSelectedContainers,
                `delete ${selectedItemsNumber} container${selectedItemsNumber > 1 ? 's' : ''}`,
              );
            }
          }}
          aria-label="Delete selected containers and pods"
          title="Delete {selectedItemsNumber} selected items"
          inProgress={bulkDeleteInProgress}
          icon={faTrash}>
        </Button>

        <Button
          on:click={createPodFromContainers}
          title="Create Pod with {selectedItemsNumber} selected items"
          icon={SolidPodIcon}>
          Create Pod
        </Button>
      </div>
      <span>On {selectedItemsNumber} selected items.</span>
    {/if}
  {/snippet}

  {#snippet tabs()}
    <Button type="tab" on:click={resetRunningFilter} selected={containerUtils.filterIsAll(searchTerm)}
      >All</Button>
    <Button type="tab" on:click={setRunningFilter} selected={containerUtils.filterIsRunning(searchTerm)}
      >Running</Button>
    <Button type="tab" on:click={setStoppedFilter} selected={containerUtils.filterIsStopped(searchTerm)}
      >Stopped</Button>
  {/snippet}

  {#snippet content()}
    <div class="flex min-w-full h-full">
      {#if providerConnections.length === 0}
        <NoContainerEngineEmptyScreen />
      {:else if containerGroups.length === 0}
        {#if containerUtils.filterSearchTerm(searchTerm)}
          <FilteredEmptyScreen
            icon={ContainerIcon}
            kind="containers"
            on:resetFilter={(e): void => {
              searchTerm = containerUtils.filterResetSearchTerm(searchTerm);
              e.preventDefault();
            }}
            searchTerm={containerUtils.filterSearchTerm(searchTerm)} />
        {:else}
          <ContainerEmptyScreen
            runningOnly={containerUtils.filterIsRunning(searchTerm)}
            stoppedOnly={containerUtils.filterIsStopped(searchTerm)} />
        {/if}
      {:else}
        <Table
          kind="container"
          bind:selectedItemsNumber={selectedItemsNumber}
          data={containersAndGroups}
          columns={columns}
          row={row}
          defaultSortColumn="Name"
          key={key}
          label={label}
          enableLayoutConfiguration={true}
          on:update={(): ContainerGroupInfoUI[] => (containerGroups = [...containerGroups])}>
        </Table>
      {/if}
    </div>
  {/snippet}
</NavPage>

{#if openChoiceModal}
  <Dialog
    title="Create a new container"
    onclose={(): void => {
      openChoiceModal = false;
    }}>
    {#snippet content()}
        <div  class="h-full flex flex-col justify-items-center text-[var(--pd-modal-text)]">
        <span class="pb-3">Choose the following:</span>
        <ul class="list-disc ml-8 space-y-2">
          <li>Create a container from a Containerfile</li>
          <li>Create a container from an existing image stored in the local registry</li>
        </ul>
      </div>
      {/snippet}
    {#snippet buttons()}

        <Button type="primary" on:click={fromDockerfile}>Containerfile or Dockerfile</Button>
        <Button type="secondary" on:click={fromExistingImage}>Existing image</Button>

      {/snippet}
  </Dialog>
{/if}
