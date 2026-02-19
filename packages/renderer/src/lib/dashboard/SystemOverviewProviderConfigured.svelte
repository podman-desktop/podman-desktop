<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';

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

<SystemOverviewProviderCardBase
  {provider}
  subtitle="No container engine (machine) created yet. Create one to run containers and pods."
  buttonLabel="Start {provider.name}"
  onButtonClick={startProvider}
  inProgress={startInProgress}
/>
