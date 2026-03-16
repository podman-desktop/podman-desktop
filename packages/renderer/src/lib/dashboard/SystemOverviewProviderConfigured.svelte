<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';

import SystemOverviewProviderCardBase from './SystemOverviewProviderCardBase.svelte';

interface Props {
  provider: ProviderInfo;
}

let { provider }: Props = $props();

let startInProgress = $state(false);

function startProvider(): void {
  startInProgress = true;
  window
    .startProvider(provider.internalId)
    .catch(() => {
      startInProgress = false;
    })
    .finally(() => {
      startInProgress = false;
    });
}
</script>

<SystemOverviewProviderCardBase {provider}>
  {#snippet subtitle()}
    <div class="text-sm text-[var(--pd-content-text-sub)]">
      No container engine (machine) created yet. Create one to run containers and pods.
    </div>
  {/snippet}
  {#snippet actions()}
    <Button type="primary" onclick={startProvider} inProgress={startInProgress}>Start {provider.name}</Button>
  {/snippet}
</SystemOverviewProviderCardBase>
