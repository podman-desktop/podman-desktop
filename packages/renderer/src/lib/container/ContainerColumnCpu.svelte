<script lang="ts">
import { trackContainerUsage } from './container-usage.svelte';
import type { ContainerGroupInfoUI, ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  object: ContainerInfoUI | ContainerGroupInfoUI;
}

let { object }: Props = $props();

const usage = trackContainerUsage(() => object);
// placeholder until a reading is available, or forever when statistics are disabled
const title = $derived(usage.current.cpuPercentage === undefined ? '-' : `${usage.current.cpuPercentage.toFixed(1)}%`);
</script>

{#if usage.running}
  <div class="text-[var(--pd-table-body-text)] text-sm whitespace-nowrap">
    {title}
  </div>
{/if}
