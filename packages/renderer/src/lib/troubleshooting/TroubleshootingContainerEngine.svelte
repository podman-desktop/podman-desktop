<script lang="ts">
import type { ProviderContainerConnectionInfo } from '@desktop-framework/api';

import { t } from '/@/lib/i18n/translations.svelte';

import TroubleshootingContainerEngineGrabContainers from './TroubleshootingContainerEngineGrabContainers.svelte';
import TroubleshootingContainerEnginePing from './TroubleshootingContainerEnginePing.svelte';

interface Props {
  containerEngineRunning: ProviderContainerConnectionInfo;
}

let { containerEngineRunning }: Props = $props();
</script>

<div class="flex flex-col bg-[var(--pd-invert-content-card-bg)] m-4 p-4 text-sm" role="region" aria-label={containerEngineRunning.name}>
  <h6 aria-label={t('management.name') ?? 'name'}>{t('management.name') ?? 'Name'}: {containerEngineRunning.name}</h6>
  <div class="mx-4">
    <h6 aria-label={t('management.status') ?? 'status'}>{t('management.status') ?? 'Status'}: {t(`management.status.${containerEngineRunning.status}`) ?? containerEngineRunning.status}</h6>
    <h6 aria-label={t('management.socket') ?? 'socket path'}>{t('management.socket') ?? 'Socket path'}: {containerEngineRunning.endpoint.socketPath}</h6>
  </div>
  <div>{t('management.actions') ?? 'Actions'}:</div>
  <div class="mx-4">
    <TroubleshootingContainerEnginePing providerContainerEngine={containerEngineRunning} />
    <TroubleshootingContainerEngineGrabContainers providerContainerEngine={containerEngineRunning} />
  </div>
</div>
