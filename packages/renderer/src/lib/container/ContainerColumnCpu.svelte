<script lang="ts">
import { trackContainerUsage } from './container-stats.svelte';
import { ContainerUtils } from './container-utils';
import type { ContainerGroupInfoUI, ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  object: ContainerInfoUI | ContainerGroupInfoUI;
}

let { object }: Props = $props();

const containerUtils = new ContainerUtils();
const usage = trackContainerUsage(() => object);
// placeholder until a reading is available, or forever when statistics are disabled
const title = $derived(
  usage.current.cpuPercentage === undefined ? '-' : containerUtils.getCpuUsageTitle(usage.current.cpuPercentage),
);
</script>

{#if usage.running}
  <div class="text-[var(--pd-table-body-text)] text-sm whitespace-nowrap">
    {title}
  </div>
{/if}
