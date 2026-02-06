<script lang="ts">
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import KubernetesIcon from '/@/lib/images/KubernetesIcon.svelte';
import type { ProviderConnectionInfo, ProviderInfo } from '/@api/provider-info';

import StatusDotGlow from './StatusDotGlow.svelte';

interface Props {
  connection: ProviderConnectionInfo;
  provider: ProviderInfo;
}

let { connection, provider }: Props = $props();

// Get the connection name based on connection type
let connectionName = $derived(connection.connectionType === 'container' ? connection.displayName : connection.name);

function navigateToProvider(): void {
  router.goto(`/preferences/resources?focus=${provider.id}`);
}
</script>

<button 
  class="inline-flex items-center gap-3 px-4 py-3 bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg transition-colors cursor-pointer"
  onclick={navigateToProvider}
  aria-label="Navigate to {connectionName} resource">
    <Icon icon={KubernetesIcon} size={20} />
    <span class="font-medium text-[var(--pd-content-card-text)]">{connectionName}</span>
    <StatusDotGlow status={connection.status} />
</button>