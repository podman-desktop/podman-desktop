<script lang="ts">
import type { ProviderInfo } from '@desktop-framework/api';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';

import { t } from '/@/lib/i18n/translations.svelte';

import TroubleshootingContainerEngine from './TroubleshootingContainerEngine.svelte';
import TroubleshootingContainerEngineReconnect from './TroubleshootingContainerEngineReconnect.svelte';

interface Props {
  providers?: ProviderInfo[];
}

let { providers = [] }: Props = $props();
let containerEngines = $derived(providers.map(provider => provider.containerConnections).flat());
let containerEnginesRunning = $derived(
  containerEngines.filter(containerEngine => containerEngine.status === 'started'),
);
</script>

<div class="flex flex-col w-full bg-[var(--pd-content-card-bg)] p-4 rounded-lg" role="region" aria-label={t('management.containerConnections') ?? 'Container Connections'}>
  <div class="flex flex-row align-middle items-center">
    <ContainerIcon size="40" solid={true} class="pr-3" />
    <div role="status" aria-label={t('management.connectionCount') ?? 'Container connections count'} class="text-xl">
      {t('management.connections.count', { count: containerEngines.length, running: containerEnginesRunning.length }) ?? `Container connections: ${containerEngines.length} (${containerEnginesRunning.length} running)`}
    </div>
  </div>

  {#if containerEnginesRunning.length > 0}
    <div class="mt-4">{t('management.running') ?? 'Running'}:</div>
    {#each containerEnginesRunning as containerEngineRunning, index (index)}
      <TroubleshootingContainerEngine containerEngineRunning={containerEngineRunning} />
    {/each}

    <div class="flex flex-row align-middle items-center">
      <p class="mr-2 italic">{t('management.connections.help') ?? 'In case of connection failures, connections to the sockets can be recreated:'}</p>
      <TroubleshootingContainerEngineReconnect />
    </div>
  {/if}
</div>
