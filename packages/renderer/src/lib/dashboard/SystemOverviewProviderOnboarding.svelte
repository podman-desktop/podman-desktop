<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import SystemOverviewProviderCardBase from './SystemOverviewProviderCardBase.svelte';

interface Props {
  provider: ProviderInfo;
}

let { provider }: Props = $props();

let subtitleText = $derived(
  provider.status === 'not-installed'
    ? `${provider.name} needs to be set up. Some features might not function optimally.`
    : 'No container engine (machine) created yet. Create one to run containers and pods.',
);

function goToOnboarding(): void {
  router.goto(`/preferences/onboarding/${provider.extensionId}`);
}
</script>

<SystemOverviewProviderCardBase {provider}>
  {#snippet subtitle()}
    <div class="text-sm text-[var(--pd-content-text-sub)]">
      {subtitleText}
    </div>
  {/snippet}
  {#snippet actions()}
    <Button type="primary" onclick={goToOnboarding}>Set up {provider.name}</Button>
  {/snippet}
</SystemOverviewProviderCardBase>
