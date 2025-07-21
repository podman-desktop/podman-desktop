<script lang="ts">
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { CloseButton, Link, Spinner } from '@podman-desktop/ui-svelte';
import { toast } from '@zerodevx/svelte-toast';
import Fa from 'svelte-fa';

import type { TaskInfo } from '/@api/taskInfo';

interface Props {
  toastId: number;
  taskInfo: TaskInfo;
  onpop?: () => void;
}

let { toastId, taskInfo, onpop = (): void => {} }: Props = $props();

const taskStatus: { [taskInfo.status]: string } = {
  failure: 'Error',
  canceled: 'Cancelled',
};

function hideToast(): void {
  toast.pop(toastId);
}

const closeAction = (): void => {
  hideToast();
  onpop();
};

const executeAction = async (): Promise<void> => {
  hideToast();
  await window.executeTask(taskInfo.id);
};
</script>

<div
  class="flex flex-nowrap min-h-10 cursor-default max-h-30 max-w-[var(--toastWidth)] flex-row p-2 border-[var(--pd-content-divider)] border rounded-md bg-[var(--pd-modal-bg)] gap-2"
  title={taskInfo.name}
>
  <div
    class="mr-1 text-[var(--pd-state-info)] w-fit h-fit self-center"
    role="status"
    aria-label={taskInfo.status}
  >
    {#if taskInfo.status === 'in-progress'}
      <Spinner size="2em"/>
    {:else if taskInfo.status === 'success'}
      <Fa icon={faCheckCircle} class="text-[var(--pd-state-success)] fa-xl"/>
    {:else if taskInfo.status === 'canceled'}
      <Fa icon={faCircleXmark} class="text-[var(--pd-state-error)] fa-xl"/>
    {:else if taskInfo.status === 'failure'}
      <Fa icon={faTriangleExclamation } class=" fa fa-exclamation-triangle text-[var(--pd-state-warning)] fa-xl" />
    {/if}
  </div>

  <div class="flex flex-col h-full max-w-[85%]">
    <div class="mb-1 flex flex-row h-full gap-1">
        <p class="flex flex-wrap text-base text-ellipsis overflow-hidden text-[var(--pd-modal-text)]">
          {taskStatus[taskInfo.status] ?? ''} {taskInfo.name}
        </p>
      <div class="flex flex-none whitespace-nowrap flex-col self-start w-fit">
        <CloseButton class="text-[var(--pd-modal-text)]" onclick={closeAction} />
      </div>
    </div>
    {#if taskInfo.action}
      <div class="text-right text-xs text-[var(--pd-content-text)]">
        <Link onclick={executeAction}>{taskInfo.action}</Link>
      </div>
    {/if}
  </div>
</div>
