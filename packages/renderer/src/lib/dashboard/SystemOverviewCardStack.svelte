<script lang="ts">
import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';

import SystemOverviewProviderCardCompact from '/@/lib/dashboard/SystemOverviewProviderCardCompact.svelte';

interface Props {
  connections: Array<{ connection: ProviderConnectionInfo; provider: ProviderInfo }>;
}

let { connections }: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-2">
  {#each connections as { connection, provider } (provider.id + ':' + connection.name)}
    <SystemOverviewProviderCardCompact {connection} {provider} />
  {/each}
</div>
