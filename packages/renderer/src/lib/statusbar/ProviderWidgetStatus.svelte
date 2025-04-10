
<script lang="ts">
import type { ProviderConnectionStatus, ProviderStatus } from '@podman-desktop/api';

import type { ProviderInfo } from '/@api/provider-info';

interface Props {
  entry?: ProviderInfo;
  status?: ProviderStatus | ProviderConnectionStatus | 'Update available';
  class?: string;
}

let { entry, status, class: className = '' }: Props = $props();

let providerStatus = $derived.by(() => {
  if (entry) {
    if (entry.updateInfo?.version) {
      return 'Update available';
    } else if (entry.containerConnections.length > 0) {
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

const faRegularIconStatus: string[] = ['ready', 'started', 'stopped', 'error', 'unknown', 'Update available'];
</script>

{#if providerStatus === 'starting' || providerStatus === 'stopping'}
  <div aria-label="Connection Status Icon" class="max-h-3 rounded-full animate-spin border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent {className}"></div>
{:else}
  <div aria-label="Connection Status Icon" class="max-h-3 {className}"
    class:fa-regular={faRegularIconStatus.includes(providerStatus)}
    class:fa={providerStatus === 'not-installed'}
    class:fa-circle-check={providerStatus === 'ready' || providerStatus === 'started'}
    class:fa-circle-dot={providerStatus === 'stopped'}
    class:fa-circle-xmark={providerStatus === 'error'}
    class:fa-exclamation-triangle={providerStatus === 'not-installed'}
    class:fa-circle-question={providerStatus === 'unknown'}
    class:fa-circle-up={providerStatus === 'Update available'}
    >
  </div>
{/if}
