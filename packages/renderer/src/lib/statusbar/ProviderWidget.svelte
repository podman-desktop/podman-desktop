<script lang="ts">
import type { ProviderConnectionStatus, ProviderStatus } from '@podman-desktop/api';
import { Button, Tooltip } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import type { ProviderInfo } from '/@api/provider-info';

import IconImage from '../appearance/IconImage.svelte';
import ProviderWidgetStatus from './ProviderWidgetStatus.svelte';
import { getStatusName } from './ProviderWidgetStatus.ts';

interface Props {
  entry: ProviderInfo;
  command?: () => void;
}

let { entry, command = (): void => router.goto('/preferences/resources') }: Props = $props();

let connectionsStatuses = $derived.by(() => {
  let statuses: ProviderStatus | ProviderConnectionStatus[];
  let connectionsStatuses: { status: ProviderStatus | ProviderConnectionStatus; connecions: string }[] = [];
  if (entry.containerConnections.length > 0) {
    statuses = [...new Set(entry.containerConnections.map(connection => connection.status))];
    let connections = '';
    for (const status of statuses) {
      connections = entry.containerConnections
        .filter(connection => connection.status === status)
        .map(c => c.name)
        .join(', ');
      connectionsStatuses.push({ status: status, connecions: connections });
    }
  } else if (entry.kubernetesConnections.length > 0) {
    statuses = [...new Set(entry.kubernetesConnections.map(connection => connection.status))];
    let connections = '';
    for (const status of statuses) {
      connections = entry.kubernetesConnections
        .filter(connection => connection.status === status)
        .map(c => c.name)
        .join(', ');
      connectionsStatuses.push({ status: status, connecions: connections });
    }
  } else {
    connectionsStatuses.push({ status: entry.status, connecions: entry.name });
  }
  return connectionsStatuses;
});
</script>

<div >
<Tooltip top class="mb-[20px]">
  <div slot="tip" class="py-2 px-4">
    <div class="flex flex-col">
      {#each connectionsStatuses as status}
        <div class="flex flex-row items-center h-fit">
          <ProviderWidgetStatus status={status.status} class="mr-1 mt-1"/>
          {getStatusName(status.status)}: {status.connecions}
        </div>
      {/each}
    </div>
  </div>
  <Button
    on:click={command}
    class="rounded-none gap-1 flex h-full min-w-fit items-center hover:bg-[var(--pd-statusbar-hover-bg)] hover:cursor-pointer relative text-base text-[var(--pd-button-text)] bg-transparent"
    aria-label={entry.name}
    padding="px-2 py-1">
    
    {#if entry.containerConnections.length > 0 || entry.kubernetesConnections.length > 0 || entry.status }
      <ProviderWidgetStatus entry={entry} />
    {/if}
    {#if entry.images.icon}
      <IconImage image={entry.images.icon} class="max-h-3 grayscale" alt={entry.name}></IconImage>
    {/if}
    {#if entry.name}
      <span class="whitespace-nowrap h-fit">{entry.name}</span>
    {/if}
  </Button>
</Tooltip>
</div>
