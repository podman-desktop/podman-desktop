<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';

import SystemOverviewProviderCardBase from './SystemOverviewProviderCardBase.svelte';

interface Props {
  provider: ProviderInfo;
}

let { provider }: Props = $props();

let createButtonTitle = $derived(`Create new ${provider.containerProviderConnectionCreationDisplayName ?? 'machine'}`);
let initializeInProgress = $state(false);

function initializeProvider(): void {
  initializeInProgress = true;
  window
    .initializeProvider(provider.internalId)
    .catch(() => {
      initializeInProgress = false;
    })
    .finally(() => {
      initializeInProgress = false;
    });
}
</script>

<SystemOverviewProviderCardBase
  {provider}
  subtitle="No container engine (machine) created yet. Create one to run containers and pods."
  buttonLabel={createButtonTitle}
  onButtonClick={initializeProvider}
  inProgress={initializeInProgress}
/>
