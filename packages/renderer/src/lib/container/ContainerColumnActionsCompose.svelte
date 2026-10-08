<script lang="ts">
import ComposeActions from '/@/lib/compose/ComposeActions.svelte';

import type { ContainerGroupInfoUI } from './ContainerInfoUI';

interface Props {
  object: ContainerGroupInfoUI;
}

let { object }: Props = $props();

let containerInProgress = $derived(object.containers.find(container => container.actionInProgress));
</script>

{#if object.status && object.engineId && object.engineType}
  <ComposeActions
    compose={{
      status: object.status,
      name: object.name,
      engineId: object.engineId,
      engineType: object.engineType,
      actionInProgress: containerInProgress?.actionInProgress ?? false,
      containers: object.containers,
    }}
    dropdownMenu={true}
    on:update />
{/if}
