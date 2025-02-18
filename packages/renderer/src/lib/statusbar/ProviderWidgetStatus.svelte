
<script lang="ts">
import type { ProviderConnectionStatus, ProviderStatus } from '@podman-desktop/api';

import type { ProviderInfo } from '/@api/provider-info';

interface Props {
  entry?: ProviderInfo;
  displayProviderStatus?: string;
  status?: ProviderStatus | ProviderConnectionStatus;
  class?: string;
}

let { entry, displayProviderStatus = $bindable(), status, class: className = '' }: Props = $props();

let providerStatus = $derived.by(() => {
  if (entry) {
    if (entry.containerConnections.length > 0) {
      return entry.containerConnections[0].status;
    } else if (entry.kubernetesConnections.length > 0) {
      return entry.kubernetesConnections[0].status;
    } else {
      return entry.status;
    }
  } else if (status) {
    return status;
  } else {
    return 'unknown';
  }
});

$effect(() => {
  switch (providerStatus) {
    case 'ready':
      displayProviderStatus = 'Running';
      break;
    case 'started':
      displayProviderStatus = 'Running';
      break;
    case 'error':
      displayProviderStatus = 'Error';
      break;
    case 'starting':
      displayProviderStatus = 'Starting';
      break;
    case 'stopping':
      displayProviderStatus = 'Stopping';
      break;
    case 'stopped':
      displayProviderStatus = 'Off';
      break;
    case 'unknown':
      displayProviderStatus = 'Unknown';
      break;
    case 'not-installed':
      displayProviderStatus = 'Not installed';
      break;
    case 'installed':
      displayProviderStatus = 'Installed but not ready';
      break;
    case 'configuring':
      displayProviderStatus = 'Configuring';
      break;
    case 'configured':
      displayProviderStatus = 'Off';
      break;
  }
});

const faRegularIconStatus: ProviderStatus[] = ['ready', 'started', 'stopped', 'error', 'unknown'];
</script>

{#if providerStatus === 'starting' || providerStatus === 'stopping'}
  <div aria-label="Connection Status Icon" class="w-3 h-3 rounded-full animate-spin border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent {className}"></div>
{:else}
  <div aria-label="Connection Status Icon" class="w-3 h-3 {className}"
    class:fa-regular={faRegularIconStatus.includes(providerStatus)}
    class:fa={providerStatus === 'not-installed'}
    class:fa-circle-check={providerStatus === 'ready' || providerStatus === 'started'}
    class:fa-circle-dot={providerStatus === 'stopped'}
    class:fa-circle-xmark={providerStatus === 'error'}
    class:fa-exclamation-triangle={providerStatus === 'not-installed'}
    class:fa-circle-question={providerStatus === 'unknown'}
    >
  </div>
{/if}
