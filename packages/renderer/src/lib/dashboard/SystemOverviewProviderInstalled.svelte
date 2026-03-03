<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';
import { router } from 'tinro';

import SystemOverviewProviderCardBase from './SystemOverviewProviderCardBase.svelte';

interface Props {
  provider: ProviderInfo;
}

let { provider }: Props = $props();

function goToOnboarding(): void {
  router.goto(`/preferences/onboarding/${provider.extensionId}`);
}
</script>

<SystemOverviewProviderCardBase
  {provider}
  subtitle="No container engine (machine) created yet. Create one to run containers and pods."
  buttonLabel="Set up {provider.name}"
  onButtonClick={goToOnboarding}
/>
