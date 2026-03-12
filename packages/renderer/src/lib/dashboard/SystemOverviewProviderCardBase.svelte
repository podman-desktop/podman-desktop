<script lang="ts">
import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import type { Snippet } from 'svelte';

import SystemOverviewProviderCardCompact from './SystemOverviewProviderCardCompact.svelte';
import SystemOverviewProviderLabel from './SystemOverviewProviderLabel.svelte';

interface Props {
  provider: ProviderInfo;
  connection?: ProviderConnectionInfo;
  name?: string;
  version?: string;
  vmType?: string;
  subtitle?: Snippet;
  trailing?: Snippet;
  actions?: Snippet;
  children?: Snippet;
}

let { provider, connection, name, version, vmType, subtitle, trailing, actions, children }: Props = $props();
</script>

<div class="flex flex-col gap-3 rounded-lg p-2 bg-[var(--pd-content-card-carousel-card-bg)]">
  <div class="flex flex-row items-center gap-3">
    <SystemOverviewProviderCardCompact {connection} {provider} expanded={false} />

    <div class="flex-1 min-w-0 flex flex-col gap-0.5">
      <SystemOverviewProviderLabel name={name ?? provider.name} version={version ?? provider.version} {vmType} />
      {#if subtitle}
        {@render subtitle()}
      {/if}
    </div>

    {#if trailing}
      {@render trailing()}
    {/if}

    {#if actions}
      {@render actions()}
    {/if}
  </div>

  {#if children}
    {@render children()}
  {/if}
</div>
