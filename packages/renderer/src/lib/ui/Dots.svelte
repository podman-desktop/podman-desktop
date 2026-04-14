<script lang="ts">
import type { PodInfoContainerUI } from '/@/lib/pod/PodInfoUI';

import { organizeContainers } from './Dots';
import StatusDot from './StatusDot.svelte';
import { capitalize } from './Util';

// All the possible statuses that will appear for both Pods and Kubernetes
export let containers: PodInfoContainerUI[];

$: organizedContainers = organizeContainers(containers);
</script>

<!-- If containers is more than 10, we will group them and show the number of containers -->
{#if containers.length > 10}
  {#each Object.entries(organizedContainers) as [status, c] (status)}
    {#if c.length > 0}
      <StatusDot status={status} tooltip="{capitalize(status)}: {c.length}" number={c.length} />
    {/if}
  {/each}
{:else}
  {#each Object.entries(organizedContainers) as [status, c] (status)}
    {#each c as container, i (i)}
      <StatusDot status={status} name={container.Names} />
    {/each}
  {/each}
{/if}
