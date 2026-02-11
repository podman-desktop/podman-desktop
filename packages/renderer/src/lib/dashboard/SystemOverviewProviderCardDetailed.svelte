<script lang="ts">
import type { ProviderConnectionStatus } from '@podman-desktop/api';
import { Button, type ButtonType } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import KubernetesIcon from '/@/lib/images/KubernetesIcon.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import {
  type ConnectionCallback,
  eventCollect,
  registerConnectionCallback,
} from '/@/lib/preferences/preferences-connection-rendering-task';
import { convertProviderStatusToSystemOverviewStatus } from '/@/stores/dashboard/system-overview.svelte';
import type { ProviderConnectionInfo, ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

import StatusDotGlow from './StatusDotGlow.svelte';

interface Props {
  connection: ProviderConnectionInfo;
  provider: ProviderInfo;
}

let { connection, provider }: Props = $props();
let errorMessage = $state<string | undefined>(undefined);

let connectionStatus = $derived(convertProviderStatusToSystemOverviewStatus(connection.status));
let vmType = $derived(getVmTypeName(connection));
let providerVersion = $derived(provider.version);
let displayName = $derived.by(() => {
  if (connection.connectionType === 'container') {
    return connection.displayName ?? connection.name;
  }
  return connection.name;
});

let errorState = $derived(errorMessage ?? connectionStatus.status === 'critical');

function getVmTypeName(connection: ProviderConnectionInfo): string | undefined {
  if (connection.connectionType === 'container') {
    const containerConn = connection as ProviderContainerConnectionInfo;
    return containerConn.vmType?.name;
  }
  return undefined;
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

function getLoggerHandler(_provider: ProviderInfo): ConnectionCallback {
  return {
    log: (_args: string[]): void => {},
    warn: (_args: string[]): void => {},
    error: (_args: string[]): void => {},
    onEnd: (): void => {},
  };
}

async function handleActionButtonClick(connection: ProviderConnectionInfo): Promise<void> {
  try {
    errorMessage = undefined;
    if (connection.status === 'stopped') {
      const loggerHandlerKey = registerConnectionCallback(getLoggerHandler(provider));
      await window.startProviderConnectionLifecycle(
        provider.internalId,
        $state.snapshot(connection),
        loggerHandlerKey,
        eventCollect,
      );
    } else {
      router.goto(`/preferences/resources?focus=${provider.internalId}`);
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

<div class="flex items-center gap-3 py-2 rounded-lg p-4"
  class:bg-[var(--pd-system-overview-critical-bg)]={errorState}
  class:bg-[var(--pd-content-card-carousel-card-bg)]={!errorState}
  >
  <!-- Provider Logo -->
  <div class="flex-shrink-0 rounded-md p-2"
    class:bg-[var(--pd-content-card-bg)]={!errorState}
    class:bg-[var(--pd-system-overview-critical-bg)]={errorState}
  >
    <Icon icon={connection.connectionType === 'container' ? PodIcon : KubernetesIcon } size={24} />
  </div>

  <!-- Connection Info -->
  <div class="flex-1 min-w-0 flex flex-col gap-0.5">
    <!-- Connection Name with VM Type and Version -->
    <div class="flex items-center gap-2 text-[var(--pd-content-card-text)]">
      <span class="font-medium">{displayName}</span>
      {#if vmType ?? providerVersion}
        <span class="text-sm text-[var(--pd-content-text-sub)] bg-[var(--pd-content-card-bg)] rounded-md p-1">
          {#if vmType}{vmType}{/if}
          {#if vmType && providerVersion} - {/if}
          {#if providerVersion}v{providerVersion}{/if}
        </span>
      {/if}
    </div>
      
    {#if connection.connectionType === 'kubernetes'}
      <div class="text-sm">
        Local Kubernetes
      </div>
    {/if}

      <!-- Status Line with Icon and Text -->
    <div class="flex items-center gap-1.5 mt-0.5">      
      {#if connectionStatus.status === 'healthy' || connectionStatus.status === 'progressing'}
        <StatusDotGlow status={connection.status} showText={true} />
      {:else if connectionStatus.status === 'stable'}
        <StatusDotGlow status={connection.status} showText={true} />
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
        <StatusDotGlow status={connection.status} showText={true} /> - 
        {#if errorMessage}
          <div class="text-sm text-[var(--pd-status-terminated)]">
            {errorMessage}
          </div>
        {/if}
      {/if}
    </div>

    <!-- Error/Warning Messages -->
    {#if provider.warnings.length || errorMessage}
      <div class="flex items-center gap-1.5 mt-0.5 text-sm text-[var(--pd-status-terminated)]">
        {#each provider.warnings as warning, index (index)}
          {warning.details ?? warning.name}
        {/each}
        {#if errorMessage}
          {errorMessage}
        {/if}
      </div>
    {/if}
  </div>

  <!-- Action Button -->
  <Button 
    type={getConnectionButtonType(connection.status)} 
    onclick={async (): Promise<void> => await handleActionButtonClick(connection)}>
      {getConnectionButtonText(connection.status)}
  </Button>
</div>