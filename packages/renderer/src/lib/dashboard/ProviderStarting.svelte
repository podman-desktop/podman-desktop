<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';

import ProviderCard from './ProviderCard.svelte';

export let provider: ProviderInfo;
</script>

<ProviderCard provider={provider}>
  <svelte:fragment slot="content">
    {#if provider.containerConnections.length > 0}
      <div class="flex flex-row text-[var(--pd-content-text)] mt-4">
        <p>
          {provider.containerConnections.map(c => c.name).join(', ')}
        </p>
      </div>
    {/if}
  </svelte:fragment>
</ProviderCard>
