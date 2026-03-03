<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';

import SystemOverviewProviderCardCompact from './SystemOverviewProviderCardCompact.svelte';
import SystemOverviewProviderLabel from './SystemOverviewProviderLabel.svelte';

interface Props {
  provider: ProviderInfo;
  subtitle: string;
  buttonLabel: string;
  onButtonClick: () => void | Promise<void>;
  inProgress?: boolean;
}

let { provider, subtitle, buttonLabel, onButtonClick, inProgress = false }: Props = $props();
</script>

<div class="flex items-center gap-3 py-2 bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg p-4">
  <SystemOverviewProviderCardCompact {provider} />

  <div class="flex-1 min-w-0 flex flex-col gap-0.5">
    <SystemOverviewProviderLabel name={provider.name} version={provider.version} />
    <div class="text-sm text-[var(--pd-content-text-sub)]">
      {subtitle}
    </div>
  </div>

  <Button type="primary" onclick={onButtonClick} inProgress={inProgress}>
    {buttonLabel}
  </Button>
</div>
