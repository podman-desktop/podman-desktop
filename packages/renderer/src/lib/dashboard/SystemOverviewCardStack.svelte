<script lang="ts">
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { CONNECTIONS_EXPANDED_CONFIGURATION_KEY } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import { router } from 'tinro';

import SystemOverviewProviderCardCompact from '/@/lib/dashboard/SystemOverviewProviderCardCompact.svelte';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';

interface Props {
  connections: Array<{ connection: ProviderConnectionInfo; provider: ProviderInfo }>;
  showAddButton?: boolean;
}

let { connections, showAddButton = true }: Props = $props();

let expanded = $state(false);

const listener: EventListener = (obj: object) => {
  if ('detail' in obj) {
    const detail = obj.detail as { key: string; value: boolean };
    if (CONNECTIONS_EXPANDED_CONFIGURATION_KEY === detail?.key) {
      expanded = detail.value;
    }
  }
};

onMount(async () => {
  onDidChangeConfiguration.addEventListener(CONNECTIONS_EXPANDED_CONFIGURATION_KEY, listener);
  expanded = (await window.getConfigurationValue<boolean>(CONNECTIONS_EXPANDED_CONFIGURATION_KEY)) ?? true;
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener(CONNECTIONS_EXPANDED_CONFIGURATION_KEY, listener);
});

async function toggle(): Promise<void> {
  expanded = !expanded;
  await window.updateConfigurationValue(CONNECTIONS_EXPANDED_CONFIGURATION_KEY, expanded);
}

function goToResources(): void {
  router.goto('/preferences/resources');
}
</script>

<div class="flex items-start gap-2 w-full">
  <div class="flex flex-wrap items-center gap-2 flex-1 min-w-0">
    {#each connections as { connection, provider } (provider.id + ':' + connection.name)}
      <SystemOverviewProviderCardCompact {connection} {provider} {expanded} />
    {/each}

    {#if showAddButton}
      <Button type="secondary" onclick={goToResources} aria-label="Go to Resources" title="Go to Resources" icon={faPlus} padding="p-1" class="rounded-full w-7 h-7" />
    {/if}
  </div>

  <Button type="secondary" onclick={toggle} aria-label={expanded ? 'Collapse connections' : 'Expand connections'} title={expanded ? 'Collapse' : 'Expand'} icon={expanded ? faChevronLeft : faChevronRight} padding="p-1 mt-1" class="rounded-full w-7 h-7" />
</div>
