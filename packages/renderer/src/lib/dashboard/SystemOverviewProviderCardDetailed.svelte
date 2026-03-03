<script lang="ts">
import type { ProviderConnectionStatus } from '@podman-desktop/api';
import type { ProviderConnectionInfo, ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { Button, type ButtonType } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { startConnection } from '/@/lib/dashboard/system-overview-utils';
import SystemOverviewCardStack from '/@/lib/dashboard/SystemOverviewCardStack.svelte';
import SystemOverviewProviderCardCompact from '/@/lib/dashboard/SystemOverviewProviderCardCompact.svelte';
import SystemOverviewResourceUsage from '/@/lib/dashboard/SystemOverviewResourceUsage.svelte';
import { getConnectionDisplayName, getSystemOverviewStatus } from '/@/stores/dashboard/system-overview.svelte';

import SystemOverviewProviderLabel from './SystemOverviewProviderLabel.svelte';

export type ChildConnection = {
  connection: ProviderConnectionInfo;
  provider: ProviderInfo;
};

interface Props {
  connection: ProviderConnectionInfo;
  provider: ProviderInfo;
  childConnections?: ChildConnection[];
}

let { connection, provider, childConnections = [] }: Props = $props();
let errorMessage = $state<string | undefined>(undefined);

let connectionStatus = $derived(getSystemOverviewStatus(connection.status));
let vmType = $derived(getVmTypeName(connection));
let providerVersion = $derived(provider.version);
let displayName = $derived(getConnectionDisplayName(connection));

function getVmTypeName(connection: ProviderConnectionInfo): string | undefined {
  if (connection.connectionType === 'container') {
    const containerConn = connection as ProviderContainerConnectionInfo;
    return containerConn.vmType?.name;
  }
  return undefined;
}

function getStatusTextClass(status: ProviderConnectionStatus): string {
  switch (status) {
    case 'started':
      return 'text-[var(--pd-status-running)]';
    case 'stopped':
      return 'text-[var(--pd-status-stopped)]';
    case 'unknown':
      return 'text-[var(--pd-status-terminated)]';
    case 'starting':
    case 'stopping':
      return 'text-[var(--pd-status-starting)]';
    default:
      return 'text-[var(--pd-status-stopped)]';
  }
}

function getStatusLabel(status: ProviderConnectionStatus): string {
  switch (status) {
    case 'started':
      return 'Running';
    case 'stopped':
      return 'Stopped';
    case 'unknown':
      return 'Unknown';
    case 'starting':
      return 'Starting';
    case 'stopping':
      return 'Stopping';
  }
}

function getConnectionButtonType(connectionStatus: ProviderConnectionStatus): ButtonType {
  switch (connectionStatus) {
    case 'started':
      return 'secondary';
    case 'stopped':
      return 'primary';
    case 'unknown':
      return 'danger';
    case 'starting':
      return 'secondary';
    case 'stopping':
      return 'secondary';
  }
}

function getConnectionButtonText(connectionStatus: ProviderConnectionStatus): string {
  switch (connectionStatus) {
    case 'started':
      return 'View';
    case 'stopped':
      return `Start ${provider.name}`;
    case 'unknown':
      return 'See Details in Resources';
    case 'starting':
    case 'stopping':
      return 'View';
    default:
      return 'See Details in Resources';
  }
}

function navigateToProvider(): void {
  router.goto(`/preferences/resources?focus=${provider.id}`);
}

async function handleActionButtonClick(connection: ProviderConnectionInfo): Promise<void> {
  try {
    errorMessage = undefined;
    if (connection.status === 'stopped') {
      await startConnection(provider.internalId, $state.snapshot(connection));
    } else {
      navigateToProvider();
    }
  } catch (error: unknown) {
    console.error(`Error handling action button click: ${error}`);
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
  }
}
</script>

<div class="flex flex-col gap-3 py-2 rounded-lg p-4 bg-[var(--pd-content-card-carousel-card-bg)]">
  <div class="flex flex-row items-center gap-3">
    <SystemOverviewProviderCardCompact {connection} {provider} />

    <div class="flex-1 min-w-0 flex flex-col gap-0.5">
      <SystemOverviewProviderLabel name={displayName} version={providerVersion} {vmType} />
      <div class="flex items-center gap-1.5 mt-0.5">
        {#if connectionStatus.status === 'healthy'}
          <span class="text-sm {getStatusTextClass(connection.status)}">{getStatusLabel(connection.status)}</span>
        {:else if connectionStatus.status === 'progressing'}
          <span class="text-sm text-[var(--pd-status-starting)]">{connection.status === 'starting' ? 'Starting' : 'Stopping'}</span>
        {:else if connectionStatus.status === 'stable'}
          <span class="text-sm {getStatusTextClass(connection.status)}">{getStatusLabel(connection.status)}</span>
          <div class="text-sm text-[var(--pd-content-text-sub)]"> 
            - 
            {#if connection.connectionType === 'container'}
              Required to run containers and pods
            {:else if connection.connectionType === 'kubernetes'}
              Start to deploy Kubernetes workloads locally
            {:else}
              Not running
            {/if}
          </div>
        {:else if connectionStatus.status === 'critical'}
          <span class="text-sm {getStatusTextClass(connection.status)}">{getStatusLabel(connection.status)}</span>
        {/if}
      </div>
    </div>

    {#if connection.connectionType === 'container' && connection.status === 'started'}
      <SystemOverviewResourceUsage {provider} connection={connection} compact={true} />
    {/if}

    <Button 
      type={getConnectionButtonType(connection.status)} 
      onclick={async (): Promise<void> => await handleActionButtonClick(connection)}>
        {getConnectionButtonText(connection.status)}
    </Button>
  </div>

  {#if provider.warnings.length || errorMessage}
    <div class="flex items-center gap-1.5 text-sm text-[var(--pd-status-terminated)]">
      {#each provider.warnings as warning, index (index)}
        {warning.details ?? warning.name}
      {/each}
      {#if errorMessage}
        {errorMessage}
      {/if}
    </div>
  {/if}

  {#if connection.connectionType === 'container' && connection.status === 'started'}
    <SystemOverviewResourceUsage {provider} connection={connection} />
  {/if}

  {#if childConnections.length > 0}
    <div class="flex items-center gap-2 pt-2"
      class:border-t={connection.connectionType === 'container' && connection.status === 'started'}
      class:border-[var(--pd-content-divider)]={connection.connectionType === 'container' && connection.status === 'started'}>
      <SystemOverviewCardStack connections={childConnections} showAddButton={false} />
    </div>
  {/if}
</div>
