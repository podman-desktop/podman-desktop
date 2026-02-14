<script lang="ts">
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import SystemOverviewProviderCardDetailed from '/@/lib/dashboard/SystemOverviewProviderCardDetailed.svelte';
import SystemOverviewProviderCardMinimal from '/@/lib/dashboard/SystemOverviewProviderCardMinimal.svelte';
import SystemOverviewProviderConfigured from '/@/lib/dashboard/SystemOverviewProviderConfigured.svelte';
import SystemOverviewProviderInstalled from '/@/lib/dashboard/SystemOverviewProviderInstalled.svelte';
import SystemOverviewResourceUsage from '/@/lib/dashboard/SystemOverviewResourceUsage.svelte';
import {
  convertProviderStatusToSystemOverviewStatus,
  getSystemOverviewStatus,
  getSystemOverviewText,
  type Status,
} from '/@/stores/dashboard/system-overview.svelte';
import { providerInfos } from '/@/stores/providers';
import type { ProviderConnectionInfo, ProviderInfo } from '/@api/provider-info';

import SystemOverviewProviderNotInstalled from './SystemOverviewProviderNotInstalled.svelte';

let providers = $derived($providerInfos);

let status: Status = $derived(getSystemOverviewStatus());
let statusText: string = $derived(getSystemOverviewText(status));

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

// Check Podman provider states
let providersNotInstalled = $derived(providers.filter(p => p.status === 'not-installed'));
let providersInstalled = $derived(providers.filter(p => p.status === 'installed'));
let providersConfigured = $derived(providers.filter(p => p.status === 'configured'));

function navigateToResources(): void {
  router.goto('/preferences/resources');
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
    <!-- Podman provider states: not installed or needs machine creation -->
    {#each providersNotInstalled as provider, index (index)}
      <SystemOverviewProviderNotInstalled {provider} />
    {/each}
    {#each providersInstalled as provider, index (index)}
      <SystemOverviewProviderInstalled {provider} />
    {/each}

    {#each providersConfigured as provider, index (index)}
      <SystemOverviewProviderConfigured {provider} />
    {/each}

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

    <!-- Podman Resource Usage -->
    <SystemOverviewResourceUsage {providers} />
  </div>
</div>