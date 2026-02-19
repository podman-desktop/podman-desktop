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
  subtitle={`${provider.name} needs to be set up. Some features might not function optimally.`}
  buttonLabel="Set up {provider.name}"
  onButtonClick={goToOnboarding}
/>
