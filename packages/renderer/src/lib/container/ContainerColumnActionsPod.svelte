<script lang="ts">
import PodActions from '/@/lib/pod/PodActions.svelte';

import type { ContainerGroupInfoUI } from './ContainerInfoUI';

interface Props {
  object: ContainerGroupInfoUI;
}

let { object }: Props = $props();
</script>

{#if object.engineId && object.id && object.shortId && object.status && object.engineName && object.humanCreationDate && object.created}
  <PodActions
    pod={{
      id: object.id,
      shortId: object.shortId,
      status: object.status,
      name: object.name,
      engineId: object.engineId,
      engineName: object.engineName,
      age: object.humanCreationDate,
      created: object.created,
      selected: false,
      containers: object.containers.map(container => ({
        Id: container.id,
        Names: container.name,
        Status: container.state,
      })),
    }}
    dropdownMenu={true} />
{/if}
