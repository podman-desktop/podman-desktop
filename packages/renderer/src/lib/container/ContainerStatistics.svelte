<script lang="ts">
import type { ContainerStatsInfo } from '@podman-desktop/core-api';
import { onDestroy, onMount } from 'svelte';

import Donut from '/@/lib/donut/Donut.svelte';

import { ContainerUtils } from './container-utils';
import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  container: ContainerInfoUI;
}
let { container }: Props = $props();

const containerUtils = new ContainerUtils();

// percentage
let cpuUsagePercentage = $state(-1);
let memoryUsagePercentage = $state(-1);

// id to cancel the streaming
let fetchStatsId: number;

// need two samples to compute stats
let firstIteration = true;

// title to use on
let cpuUsage: string = $state('');
let memoryUsage: string = $state('');

export async function updateStatistics(containerStats: ContainerStatsInfo): Promise<void> {
  // we need enough data to compute the CPU usage
  if (firstIteration) {
    firstIteration = false;
    return;
  }

  const usedMemory = containerUtils.getUsedMemory(containerStats.memory_stats);
  const availableMemory = containerStats.memory_stats.limit;
  memoryUsagePercentage = (usedMemory / availableMemory) * 100.0;
  memoryUsage = containerUtils.getMemoryUsageTitle(usedMemory);

  const cpuPercentage = containerUtils.getCpuUsagePercentage(containerStats.cpu_stats, containerStats.precpu_stats);
  if (cpuPercentage !== undefined) {
    cpuUsagePercentage = cpuPercentage;
    cpuUsage = cpuUsagePercentage.toFixed(1) + '%';
  }
}

onMount(async () => {
  if (container.state !== 'RUNNING') {
    return;
  }
  // grab stats result from the container
  fetchStatsId = await window.getContainerStats(container.engineId, container.id, containerStats => {
    updateStatistics(containerStats).catch((err: unknown) =>
      console.error(`Error getting container statistics for container ${container.id}`, err),
    );
  });
});

onDestroy(async () => {
  // unsubscribe from the store
  if (fetchStatsId) {
    await window.stopContainerStats(fetchStatsId);
  }
});
</script>

{#if container.state === 'RUNNING'}
  <div class="flex flex-row gap-1">
    <Donut title="vCPUs" size={45} value={cpuUsage} percent={cpuUsagePercentage} />
    <Donut title="MEM" size={45} value={memoryUsage} percent={memoryUsagePercentage} />
  </div>
{/if}
