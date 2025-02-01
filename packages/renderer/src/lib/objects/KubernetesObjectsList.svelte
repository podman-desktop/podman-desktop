<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import type { KubernetesObject } from '@kubernetes/client-node';
import type { TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { Button, FilteredEmptyScreen, NavPage, Table } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount, type Snippet } from 'svelte';
import { type Readable, type Unsubscriber, type Writable } from 'svelte/store';

import type { IDisposable } from '../../../../main/src/plugin/types/disposable';
import { withBulkConfirmation } from '../actions/BulkActions';
import KubeActions from '../kube/KubeActions.svelte';
import { listenResources } from '../kube/resources-listen';
import KubernetesCurrentContextConnectionBadge from '../ui/KubernetesCurrentContextConnectionBadge.svelte';

export interface Kind {
  resource: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer: (o: KubernetesObject) => any;
  delete: (name: string) => Promise<void>;
  searchPatternStore: Writable<string>;
  legacyObjectStore: Readable<KubernetesObject[]>;
}

interface Props {
  kind: Kind;
  searchTerm: string;
  singular: string;
  plural: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: TableColumn<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: TableRow<any>;

  emptySnippet: Snippet;
}

let { kind, singular, plural, icon, searchTerm, columns, row, emptySnippet }: Props = $props();

let resources = $state<KubernetesObject[] | undefined>(undefined);
let resourceListener: IDisposable | undefined;
let legacyUnsubscriber: Unsubscriber;

const objects = $derived(resources?.map(object => kind.transformer(object)) ?? []);

$effect(() => {
  kind.searchPatternStore.set(searchTerm);
});

onMount(async () => {
  resourceListener = await listenResources(
    kind.resource,
    {
      searchTermStore: kind.searchPatternStore,
    },
    (updatedResources: KubernetesObject[]) => {
      resources = updatedResources;
    },
  );

  legacyUnsubscriber = kind.legacyObjectStore.subscribe(o => (resources = o));
});

onDestroy(() => {
  resourceListener?.dispose();
  legacyUnsubscriber?.();
});

// delete the items selected in the list
let bulkDeleteInProgress = $state<boolean>(false);
async function deleteSelectedObjects(): Promise<void> {
  const selectedObjects = objects.filter(object => object.selected);
  if (selectedObjects.length === 0) {
    return;
  }

  // mark objects for deletion
  bulkDeleteInProgress = true;
  selectedObjects.forEach(image => (image.status = 'DELETING'));

  await Promise.all(
    selectedObjects.map(async object => {
      try {
        await kind.delete(object.name);
      } catch (e) {
        console.error(`error while deleting ${singular}`, e);
      }
    }),
  );
  bulkDeleteInProgress = false;
}

let selectedItemsNumber = $state<number>(0);

let table: Table;
</script>

<NavPage bind:searchTerm={searchTerm} title={plural}>
  <svelte:fragment slot="additional-actions">
    <KubeActions />
  </svelte:fragment>

  <svelte:fragment slot="bottom-additional-actions">
    {#if selectedItemsNumber > 0}
      <Button
        on:click={(): void =>
          withBulkConfirmation(
            deleteSelectedObjects,
            `delete ${selectedItemsNumber} ${selectedItemsNumber > 1 ? plural : singular}`,
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
      kind={singular}
      bind:this={table}
      bind:selectedItemsNumber={selectedItemsNumber}
      data={objects}
      columns={columns}
      row={row}
      defaultSortColumn="Name">
    </Table>

    {#if objects.length === 0}
      {#if searchTerm}
        <FilteredEmptyScreen
          icon={icon}
          kind={plural}
          searchTerm={searchTerm}
          on:resetFilter={(): string => (searchTerm = '')} />
      {:else}
        {@render emptySnippet()}
      {/if}
    {/if}
  </div>
</NavPage>
