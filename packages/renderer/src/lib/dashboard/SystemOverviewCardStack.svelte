<script lang="ts">
import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import SystemOverviewProviderCardCompact from '/@/lib/dashboard/SystemOverviewProviderCardCompact.svelte';

interface Props {
  connections: Array<{ connection: ProviderConnectionInfo; provider: ProviderInfo }>;
}

let { connections, showAddButton = true }: Props = $props();

let expanded = $state(false);

function toggle(): void {
  expanded = !expanded;
}

function goToResources(): void {
  router.goto('/preferences/resources');
}
</script>

<div class="flex flex-wrap items-center gap-2">
  {#each connections as { connection, provider } (provider.id + ':' + connection.name)}
    <SystemOverviewProviderCardCompact {connection} {provider} />
  {/each}
</div>
