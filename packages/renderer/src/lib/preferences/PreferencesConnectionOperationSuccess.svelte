<script lang="ts">
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { operationConnectionsInfo } from '/@/stores/operation-connections';

import { clearTaskLogs } from './preferences-connection-rendering-task';

interface Props {
  taskId?: number;
}

let { taskId }: Props = $props();

let operation = $derived(taskId !== undefined ? $operationConnectionsInfo.get(taskId) : undefined);
let operationLabel = $derived(operation?.connectionInfo ? 'Update' : 'Creation');

// keep the operation so reopening the task still displays the success
function goBackToResources(): void {
  if (operation) {
    clearTaskLogs(operation.operationKey);
  }
  router.goto('/preferences/resources');
}
</script>

<div class="flex flex-col w-full h-full overflow-hidden">
  <EmptyScreen icon={faCubes} title={operationLabel} message="Successful operation">
    <Button class="py-3" on:click={goBackToResources}>Go back to resources</Button>
  </EmptyScreen>
</div>
