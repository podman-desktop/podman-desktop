<script lang="ts">
import type { ProviderConnectionInfo, ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import {
  getConnectionButtonText,
  getConnectionDetailPath,
  getConnectionStatusConfig,
  getStatusTextClass,
  startConnection,
} from '/@/lib/dashboard/system-overview-utils';
import SystemOverviewCardStack from '/@/lib/dashboard/SystemOverviewCardStack.svelte';
import SystemOverviewProviderCardBase from '/@/lib/dashboard/SystemOverviewProviderCardBase.svelte';
import SystemOverviewResourceUsage from '/@/lib/dashboard/SystemOverviewResourceUsage.svelte';
import { getConnectionDisplayName, getSystemOverviewStatus } from '/@/stores/dashboard/system-overview.svelte';

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
let statusConfig = $derived(getConnectionStatusConfig(connection.status));
let buttonText = $derived(getConnectionButtonText(connection.status, provider.name));
let displayName = $derived(getConnectionDisplayName(connection));
let providerVersion = $derived(provider.version);

let vmType = $derived.by((): string | undefined => {
  if (connection.connectionType === 'container') {
    return (connection as ProviderContainerConnectionInfo).vmType?.name;
  }
  return undefined;
});

function navigateToConnection(): void {
  router.goto(getConnectionDetailPath(provider.internalId, connection));
}

async function handleActionButtonClick(): Promise<void> {
  try {
    errorMessage = undefined;
    if (connection.status === 'stopped') {
      await startConnection(provider.internalId, $state.snapshot(connection));
    } else {
      navigateToConnection();
    }
  } catch (error: unknown) {
    console.error(`Error handling action button click: ${error}`);
    errorMessage = error instanceof Error ? error.message : String(error);
  }
}
</script>

<SystemOverviewProviderCardBase {provider} {connection} name={displayName} version={providerVersion} {vmType}>
  {#snippet subtitle()}
    <div class="flex items-center gap-1.5 mt-0.5">
      <span class="text-sm {getStatusTextClass(connectionStatus.status)}">{statusConfig.label}</span>
      {#if connectionStatus.status === 'stable'}
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
      {/if}
    </div>
  {/snippet}

  {#snippet actions()}
    {#if connection.connectionType === 'container' && connection.status === 'started'}
      <SystemOverviewResourceUsage {provider} connection={connection as ProviderContainerConnectionInfo} />
    {:else if connection.status !== 'starting' && connection.status !== 'stopping'}
      <Button type={statusConfig.buttonType} onclick={handleActionButtonClick}>
        {buttonText}
      </Button>
    {/if}
  {/snippet}

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

  {#if childConnections.length > 0}
    <div class="flex items-center gap-2">
      <SystemOverviewCardStack connections={childConnections} />
    </div>
  {/if}
</SystemOverviewProviderCardBase>
