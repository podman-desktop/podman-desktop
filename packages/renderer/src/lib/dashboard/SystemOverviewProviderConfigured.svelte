<script lang="ts">
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import PodIcon from '/@/lib/images/PodIcon.svelte';
import type { ProviderInfo } from '/@api/provider-info';

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

<div class="flex items-center gap-3 py-2 bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg p-4">
    <div class="flex-shrink-0 rounded-md bg-[var(--pd-content-card-bg)] p-2">
    <Icon icon={PodIcon} size={24} />
    </div>

    <div class="flex-1 min-w-0 flex flex-col gap-0.5">
    <div class="flex items-center gap-2 text-[var(--pd-content-card-text)]">
        <span class="font-medium">{provider.name}</span>
        {#if provider.version}
        <span class="text-sm text-[var(--pd-content-text-sub)] bg-[var(--pd-content-card-bg)] rounded-md p-1">
            v{provider.version}
        </span>
        {/if}
    </div>
    <div class="text-sm text-[var(--pd-content-text-sub)]">
        No container engine (machine) created yet. Create one to run containers and pods.
    </div>
    </div>

    <Button type="primary" onclick={startProvider} inProgress={startInProgress}>
        Start {provider.name}
    </Button>
</div>
