<script lang="ts">
import { CloseButton, NavPage } from '@podman-desktop/ui-svelte';
import { SvelteSet } from 'svelte/reactivity';

import { filtered, searchPattern } from '/@/stores/tasks';

import TaskManagerBulkDeleteButton from './button/TaskManagerBulkDeleteButton.svelte';
import TaskManagerClearAllButton from './button/TaskManagerClearAllButton.svelte';
import TaskManagerNoFilteredTasks from './screen/TaskManagerNoFilteredTasks.svelte';
import TaskManagerTable from './table/TaskManagerTable.svelte';
import TaskManagerBottomArrow from './TaskManagerBottomArrow.svelte';
import TaskManagerTabs from './TaskManagerTabs.svelte';
import TaskManagerWindowEvents from './TaskManagerWindowEvents.svelte';

interface Props {
  searchTerm?: string;
}

let { searchTerm = $bindable('') }: Props = $props();

let selected: SvelteSet<string> = new SvelteSet();

// display or not the tasks manager (defaut is false)
let showTaskManager = $state(false);

// to filter
let outsideWindow: HTMLDivElement | undefined = $state();

// hide the task manager
function hide(): void {
  showTaskManager = false;
}

// update the search pattern store when the variable is updated
$effect(() => {
  searchPattern.set(searchTerm);
});

// task or tasks depending on the number of selected items
const taskWordPlural = $derived(selected.size > 1 ? 'tasks' : 'task');
</script>

<!-- track keys like "ESC" or clicking outside the window, etc. -->
<TaskManagerWindowEvents bind:showTaskManager={showTaskManager} bind:outsideWindow={outsideWindow} />
{#if showTaskManager}
  <div
    bind:this={outsideWindow}
    class="fixed bottom-8 right-4 bg-[var(--pd-modal-bg)] min-h-96 h-3/4 w-[calc(100%-52px-(var(--spacing-leftnavbar)))] z-40 border border-[var(--pd-modal-border)] rounded-md  shadow-xl shadow-black">
    <NavPage title="Tasks" bind:searchTerm={searchTerm}>
      {#snippet additionalActions()}
        <TaskManagerClearAllButton />
        <CloseButton onclick={hide} />
      {/snippet}

      {#snippet tabs()}
        <TaskManagerTabs bind:searchTerm={searchTerm} />
      {/snippet}

      {#snippet bottomAdditionalActions()}
        {#if selected.size > 0}
          <TaskManagerBulkDeleteButton
            selected={selected}
            title="Delete {selected.size} selected {taskWordPlural}"
            bulkOperationTitle="delete {selected.size} {taskWordPlural}" />
          <span>On {selected.size} selected {taskWordPlural}.</span>
        {/if}
      {/snippet}

      {#snippet content()}
      <div class="flex min-w-full h-full">
        <TaskManagerTable bind:selected={selected} tasks={$filtered} />
        {#if $filtered.length === 0}
          <TaskManagerNoFilteredTasks bind:searchTerm={searchTerm} />
        {/if}
      </div>
      {/snippet}
    </NavPage>
  </div>
  <TaskManagerBottomArrow />

{/if}
