<script lang="ts">
import { faCheckCircle, faCircleXmark, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { CloseButton, Spinner } from '@podman-desktop/ui-svelte';
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
  canceled: 'Canceled',
};

function hideToast(): void {
  toast.pop(toastId);
}

const closeAction = (): void => {
  hideToast();
  onpop();
};
</script>

<div
  class="flex flex-nowrap min-h-10 cursor-default max-h-30 max-w-[var(--toastWidth)] flex-row p-2 border-[var(--pd-content-divider)] border rounded-md bg-[var(--pd-modal-bg)] gap-2 justify-between text-base"
  title={taskInfo.name}
>
  <div class="flex flex-row gap-1 items-center">
    <div
      class="mr-1 text-[var(--pd-state-info)] w-fit h-fit self-center"
      role="status"
      aria-label={taskInfo.status}
    >
      {#if taskInfo.status === 'in-progress'}
        <Spinner size="1.5em"/>
      {:else if taskInfo.status === 'success'}
        <Fa icon={faCheckCircle} class="text-[var(--pd-state-success)] fa-xl"/>
      {:else if taskInfo.status === 'canceled'}
        <Fa icon={faCircleXmark} class="text-[var(--pd-state-error)] fa-xl"/>
      {:else if taskInfo.status === 'failure'}
        <Fa icon={faTriangleExclamation } class="text-[var(--pd-state-warning)] fa-xl" />
      {/if}
    </div>

    <div class="text-base text-ellipsis text-[var(--pd-card-text)] line-clamp-3 h-fit overflow-hidden break-all">
      {taskStatus[taskInfo.status] ?? ''} {taskInfo.name}
      {#if taskInfo.error}
        <p class="text-[var(--pd-content-text)]">{taskInfo.error}</p>
      {/if}
    </div>
  </div>

  <div class="flex flex-none whitespace-nowrap flex-col self-start w-fit">
    <CloseButton class="text-[var(--pd-modal-text)]" onclick={closeAction} />
  </div>

</div>
