<script lang="ts">
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';

import ProgressBar from '/@/lib/task-manager/ProgressBar.svelte';
import { showFeedbackDialog } from '/@/stores/feedbackForm';
import { tasksInfo } from '/@/stores/tasks';

let runningTasks = $derived($tasksInfo.filter(task => task.state === 'running'));

let title: string | undefined = $derived.by(() => {
  if (runningTasks.length === 0) return undefined;
  if (runningTasks.length === 1) return runningTasks[0].name;
  return `${runningTasks.length} tasks running`;
});

// single task (if only one task is running)
let singleCurrentTask = $derived.by(() => {
  if (runningTasks.length !== 1) return undefined;
  return runningTasks[0];
});

let progress: number | undefined = $derived.by(() => {
  return singleCurrentTask?.progress; // return task's progress value (if there is one)
});

let cancellableToken = $derived.by(() => {
  return singleCurrentTask?.cancellationTokenSourceId && singleCurrentTask?.cancellable
    ? singleCurrentTask.cancellationTokenSourceId
    : undefined;
});

async function toggleTaskManager(): Promise<void> {
  await window.executeCommand('show-task-manager');
}

async function cancelTask(): Promise<void> {
  if (cancellableToken) {
    await window.cancelToken(cancellableToken);
  }
}

function showFeedback(): void {
  // Show the feedback dialog after 2 minutes
  setTimeout(() => showFeedbackDialog('tasks.StatusBar'), 120000);
}
</script>

{#if runningTasks.length > 0}
  <button class="flex items-center" onclick={showFeedback}>
    <Tooltip top tip={title}>
      <button aria-label="Toggle Task Manager" onclick={toggleTaskManager}>
        <div class="flex items-center gap-x-2">
          <span role="status" class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">{title}</span>
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={progress} />
        </div>
      </button>
    </Tooltip>
    {#if cancellableToken}
      <div class="flex items-center ml-0.5">
        <Tooltip top tip="Cancel task {title}">
          <button class="cursor-pointer" onclick={cancelTask} aria-label="Cancel task {title}">
          <Fa size="0.750x" icon={faTimesCircle} />
        </button>
        </Tooltip>
      </div>
    {/if}
  </button>
{/if}

