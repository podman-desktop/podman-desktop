<script lang="ts">
import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import IconImage from '/@/lib/appearance/IconImage.svelte';
import { getConnectionDisplayName, getSystemOverviewStatus } from '/@/stores/dashboard/system-overview.svelte';

interface Props {
  connection?: ProviderConnectionInfo;
  provider: ProviderInfo;
  expanded?: boolean;
}

let { connection, provider, expanded = false }: Props = $props();

let connectionStatus = $derived(connection ? getSystemOverviewStatus(connection.status) : undefined);
let connectionName = $derived(connection ? getConnectionDisplayName(connection) : provider.name);

function getDotClass(status: string): string {
  switch (status) {
    case 'healthy':
      return 'bg-[var(--pd-status-running)]';
    case 'critical':
      return 'bg-[var(--pd-status-terminated)]';
    case 'progressing':
      return 'bg-[var(--pd-status-starting)]';
    default:
      return 'bg-[var(--pd-content-divider)]';
  }
}

function navigateToProvider(): void {
  router.goto(`/preferences/resources?focus=${provider.id}`);
}
</script>

<div class="relative flex-shrink-0 inline-flex">
  <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full {getDotClass(connectionStatus?.status ?? 'stable')} z-10"></span>

  {#if expanded}
    <Button type="secondary" onclick={navigateToProvider} title="Navigate to {connectionName}" aria-label="Navigate to {connectionName}" padding="px-2 py-[3px]">
      <div class="flex items-center gap-1.5">
        <div class="flex-shrink-0 w-7 h-7 flex items-center justify-center">
          <IconImage image={provider.images?.icon} alt={provider.name} class="max-w-7 max-h-7 object-contain" />
        </div>
        <span class="text-xs whitespace-nowrap">{connectionName}</span>
      </div>
    </Button>
  {:else}
    <button 
      class="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-[var(--pd-content-card-bg)] hover:bg-[var(--pd-content-card-carousel-card-hover-bg)] transition-colors"
      onclick={navigateToProvider}
      aria-label="Navigate to {connectionName}"
      title="Navigate to {connectionName}">
      <div class="flex-shrink-0 w-7 h-7 flex items-center justify-center">
        <IconImage image={provider.images?.icon} alt={provider.name} class="max-w-7 max-h-7 object-contain" />
      </div>
    </button>
  {/if}
</div>
