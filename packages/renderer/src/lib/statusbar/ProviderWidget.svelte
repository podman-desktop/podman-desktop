<script lang="ts">
import { Button, Tooltip } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import type { ProviderInfo } from '/@api/provider-info';

import IconImage from '../appearance/IconImage.svelte';
import { getStatusName } from './ProviderWidgetStatus';
import ProviderWidgetStatus from './ProviderWidgetStatus.svelte';

interface Props {
  entry: ProviderInfo;
  command?: () => void;
  disableTooltip?: boolean;
}

let { entry, command = (): void => router.goto('/preferences/resources'), disableTooltip = false }: Props = $props();

let connections = $derived.by(() => {
  if (entry.containerConnections.length > 0) {
    return entry.containerConnections;
  } else if (entry.kubernetesConnections.length > 0) {
    return entry.kubernetesConnections;
  } else {
    return [entry];
  }
});
</script>

<div >
<Tooltip top class="mb-[20px]">
  <div slot="tip" class="py-2 px-4" hidden={disableTooltip}>
    <div class="flex flex-col">
      {#each connections as connection}
        <div class="flex flex-row items-center h-fit">
          <ProviderWidgetStatus status={connection.status} class="mr-1 mt-1"/>
          {getStatusName(connection.status)}: {connection.name}
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
