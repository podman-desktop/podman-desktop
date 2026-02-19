<script lang="ts">
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { ProviderConnectionInfo, ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { router } from 'tinro';

import SystemOverviewProviderCardDetailed from '/@/lib/dashboard/SystemOverviewProviderCardDetailed.svelte';
import SystemOverviewProviderCardMinimal from '/@/lib/dashboard/SystemOverviewProviderCardMinimal.svelte';
import SystemOverviewProviderConfigured from '/@/lib/dashboard/SystemOverviewProviderConfigured.svelte';
import SystemOverviewProviderInstalled from '/@/lib/dashboard/SystemOverviewProviderInstalled.svelte';
import { containersInfos } from '/@/stores/containers';
import { type Status, systemOverview } from '/@/stores/dashboard/system-overview.svelte';
import { providerInfos } from '/@/stores/providers';

import SystemOverviewProviderNotInstalled from './SystemOverviewProviderNotInstalled.svelte';

let providers = $derived($providerInfos);
let containers = $derived($containersInfos);

let status: Status = $derived(systemOverview.status);
let statusText: string = $derived(systemOverview.text);

// Container connections (shown as detailed cards)
let containerConnectionsWithProvider = $derived.by(() => {
  const result: Array<{ connection: ProviderContainerConnectionInfo; provider: ProviderInfo }> = [];
  for (const provider of providers) {
    for (const conn of provider.containerConnections) {
      result.push({ connection: conn, provider });
    }
  }
  return result;
});

// Non-container connections (Kubernetes + VM, always shown as minimal cards)
let nonContainerConnectionsWithProvider = $derived.by(() => {
  const result: Array<{ connection: ProviderConnectionInfo; provider: ProviderInfo }> = [];
  for (const provider of providers) {
    for (const conn of provider.kubernetesConnections) {
      result.push({ connection: conn, provider });
    }
    for (const conn of provider.vmConnections) {
      result.push({ connection: conn, provider });
    }
  }
  return result;
});

// Go through all containers and find the matching label to a connection name.
function resolveKubernetesOwnerEngineId(connectionName: string): string | undefined {
  return containers.find(c => c.Labels && Object.values(c.Labels).includes(connectionName))?.engineId;
}

// Go through all containers and find the matching engineName to a connection name.
function resolveVmOwnerEngineId(connectionName: string): string | undefined {
  return containers.find(c => c.engineName === connectionName)?.engineId;
}

// Map engineId (= containerConnection.name) -> non-container connections that run on that engine
let childConnectionsByEngineId = $derived.by(() => {
  const map = new SvelteMap<string, { connection: ProviderConnectionInfo; provider: ProviderInfo }[]>();

  for (const provider of providers) {
    for (const conn of provider.kubernetesConnections) {
      const engineId = resolveKubernetesOwnerEngineId(conn.name);
      if (engineId !== undefined) {
        const list = map.get(engineId) ?? [];
        list.push({ connection: conn, provider });
        map.set(engineId, list);
      }
    }
    for (const conn of provider.vmConnections) {
      const engineId = resolveVmOwnerEngineId(conn.name);
      if (engineId !== undefined) {
        const list = map.get(engineId) ?? [];
        list.push({ connection: conn, provider });
        map.set(engineId, list);
      }
    }
  }

  return map;
});

// Track which non-container connections are already nested inside a container connection
let groupedConnectionKeys = $derived.by(() => {
  const keys = new SvelteSet<string>();
  for (const children of childConnectionsByEngineId.values()) {
    for (const { connection, provider } of children) {
      keys.add(`${provider.id}:${connection.name}`);
    }
  }
  return keys;
});

// Container connections with their grouped Kubernetes/VM children.
let containerConnectionsWithChildren = $derived(
  containerConnectionsWithProvider.map(({ connection, provider }) => ({
    connection,
    provider,
    childConnections: childConnectionsByEngineId.get(`${provider.id}.${connection.name}`) ?? [],
  })),
);

// Non-container connections not grouped under any container connection (standalone minimal cards)
let standaloneConnections = $derived(
  nonContainerConnectionsWithProvider.filter(
    ({ connection, provider }) => !groupedConnectionKeys.has(`${provider.id}:${connection.name}`),
  ),
);

// Check Podman provider states
let providersNotInstalled = $derived(providers.filter(p => p.status === 'not-installed'));
let providersInstalled = $derived(providers.filter(p => p.status === 'installed'));
let providersConfigured = $derived(
  providers.filter(
    p =>
      p.status === 'configured' &&
      !p.containerConnections.length &&
      !p.kubernetesConnections.length &&
      !p.vmConnections.length,
  ),
);

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

    <!-- Container providers as detailed cards with Kubernetes/VM children nested inside -->
    {#each containerConnectionsWithChildren as { connection, provider, childConnections }, index (index)}
      <SystemOverviewProviderCardDetailed {connection} {provider} {childConnections} />
    {/each}

    <!-- Kubernetes/VM connections not linked to any container provider (standalone minimal chips) -->
    {#if standaloneConnections.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each standaloneConnections as { connection, provider }, index (index)}
          <SystemOverviewProviderCardMinimal {connection} {provider} />
        {/each}
      </div>
    {/if}
  </div>
</div>