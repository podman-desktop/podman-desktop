<script lang="ts">
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import type { ProviderInfo } from '/@api/provider-info';

import TroubleshootingRepairCleanup from './TroubleshootingRepairCleanup.svelte';

interface Props {
  providers?: ProviderInfo[];
}

let { providers = [] }: Props = $props();
</script>

<div class="flex flex-col w-full bg-[var(--pd-content-card-bg)] p-4 rounded-lg" role="region" aria-label="Repair">
  <div class="flex flex-row w-full pb-2 items-center">
    <Icon size="1.5x" class="pr-2" icon={faWrench} />
    <div class="text-xl" aria-label="Repair">Repair</div>
  </div>

  <TroubleshootingRepairCleanup providers={providers} />
</div>
