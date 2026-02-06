<script lang="ts">
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import SystemOverviewProviderCardDetailed from '/@/lib/dashboard/SystemOverviewProviderCardDetailed.svelte';
import SystemOverviewProviderCardMinimal from '/@/lib/dashboard/SystemOverviewProviderCardMinimal.svelte';
import {
  convertProviderStatusToSystemOverviewStatus,
  getSystemOverviewStatus,
  getSystemOverviewText,
  type Status,
} from '/@/stores/dashboard/system-overview.svelte';
import { providerInfos } from '/@/stores/providers';
import type { ProviderConnectionInfo, ProviderInfo } from '/@api/provider-info';

let providers = $derived($providerInfos);

let status: Status = $derived(getSystemOverviewStatus());
let statusText = $derived(getSystemOverviewText(status));

// Get all connections from all providers with their provider info
let allConnectionsWithProvider = $derived.by(() => {
  const connections: Array<{ connection: ProviderConnectionInfo; provider: ProviderInfo }> = [];

  // Add all container connections first
  providers.forEach(provider => {
    provider.containerConnections.forEach(conn => {
      connections.push({ connection: conn, provider });
    });
  });

  // Then add all kubernetes connections
  providers.forEach(provider => {
    provider.kubernetesConnections.forEach(conn => {
      connections.push({ connection: conn, provider });
    });
  });

  // Finally add all VM connections
  providers.forEach(provider => {
    provider.vmConnections.forEach(conn => {
      connections.push({ connection: conn, provider });
    });
  });

  return connections;
});

// Separate minimal (healthy non-podman) and detailed connections
let minimalConnections = $derived(
  allConnectionsWithProvider.filter(({ connection, provider }) => {
    const status = convertProviderStatusToSystemOverviewStatus(connection.status);
    return status.status === 'healthy' && provider.id !== 'podman';
  }),
);

let detailedConnections = $derived(
  allConnectionsWithProvider.filter(({ connection, provider }) => {
    const status = convertProviderStatusToSystemOverviewStatus(connection.status);
    return !(status.status === 'healthy' && provider.id !== 'podman');
  }),
);

function navigateToResources(): void {
  router.goto('/preferences/resources');
}

function setupPodmanContainerEngine(): void {
  router.goto(`/preferences/provider/podman`);
}
</script>

<div class="pt-2">
  <button
    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border border-transparent"
    class:text-[var(--pd-system-overview-healthy-text)]={status.status === 'healthy'}
    class:text-[var(--pd-system-overview-stable-text)]={status.status === 'stable'}
    class:text-[var(--pd-system-overview-critical-text)]={status.status === 'critical'}
    class:text-[var(--pd-system-overview-progressing-text)]={status.status === 'progressing'}
    class:bg-[var(--pd-system-overview-healthy-bg)]={status.status === 'healthy'}
    class:bg-[var(--pd-system-overview-stable-bg)]={status.status === 'stable'}
    class:bg-[var(--pd-system-overview-critical-bg)]={status.status === 'critical'}
    class:bg-[var(--pd-system-overview-progressing-bg)]={status.status === 'progressing'}
    aria-label="System Overview - Navigate to resources"
    onclick={navigateToResources}>
    <!-- Force re-render the icon when the status changes -->
    {#key status.status}
      <Icon icon={status.icon} size={status.status === 'progressing' ? '1.25em' : 'lg'} />
    {/key}
    <span class="text-sm leading-none">{statusText}</span>
    <Icon icon={faChevronRight} size="sm" />
  </button>

  <div class="flex flex-col gap-2 pt-2">
    <!-- Detailed connections (vertical stack) -->
    {#each detailedConnections as { connection, provider }, index (index)}
      <SystemOverviewProviderCardDetailed connection={connection} provider={provider} />
    {/each}
    
    <!-- Minimal connections (horizontal wrap) -->
    {#if minimalConnections.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each minimalConnections as { connection, provider }, index (index)}
          <SystemOverviewProviderCardMinimal {connection} {provider} />
        {/each}
      </div>
    {/if}

    <!-- Show message if no connections and no providers -->
    {#if allConnectionsWithProvider.length === 0}
      <div class="p-2 text-center bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg">
        {#if !providers.some(p => p.id === 'podman') || providers.filter(p => p.id === 'podman').every(p => p.containerConnections.length === 0)}
          <span class="text-[var(--pd-content-text-sub)]">No Podman container engine available</span>
          <div class="mt-2">
            <Button type="primary" onclick={setupPodmanContainerEngine}>
              Set up Podman container engine
            </Button>
          </div>
        {:else}
          <span class="text-[var(--pd-content-text-sub)]">No connections available</span>
          <div class="mt-2">
            <Button type="primary" onclick={navigateToResources}>
              Set up connections
            </Button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>