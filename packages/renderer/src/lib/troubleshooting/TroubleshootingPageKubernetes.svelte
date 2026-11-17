<script lang="ts">
import type { KubernetesTroubleshootingInformation } from '@desktop-framework/api';
import { faDatabase, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';

import { t } from '/@/lib/i18n/translations.svelte';

let info = $state<KubernetesTroubleshootingInformation>();

onMount(async () => {
  await refresh();
});

async function refresh(): Promise<void> {
  info = await window.kubernetesGetTroubleshootingInformation();
}
</script>

<div class="flex flex-col w-full m-4 p-4 rounded-lg bg-[var(--pd-content-card-bg)]">
  <div class="flex flex-row align-middle items-center w-full mb-4">
    <Icon size="1.875x" class="pr-3" icon={faDatabase} />
    <div role="status" aria-label={t('management.stores') ?? 'stores'} class="text-xl">{t('management.kubernetes.monitoring') ?? 'Kubernetes monitoring'}</div>
    <div class="flex flex-1 justify-end">
      <Button title={t('management.refresh') ?? 'Refresh'} class="ml-5" on:click={refresh} type="link"
        ><Icon class="h-5 w-5 cursor-pointer text-xl text-(--pd-button-icon-primary-text)" icon={faRefresh} /></Button>
    </div>
  </div>

  <div class="h-full overflow-auto p-2 bg-[var(--pd-invert-content-card-bg)]">
    <h2 class="mt-2">{t('management.kubernetes.health') ?? 'Health Checks'}</h2>
    <div class="flex flex-col space-y-4">
    {#each info?.healthCheckers ?? [] as healthchecker, index (index)}
      <ul>
        <li><b>{healthchecker.contextName}</b></li>
        <li>{t('management.kubernetes.checking') ?? 'checking'}: {healthchecker.checking}</li>
        <li>{t('management.kubernetes.reachable') ?? 'reachable'}: {healthchecker.reachable}</li>
      </ul>
    {/each}
    </div>

    <h2 class="mt-2">{t('management.kubernetes.permissions') ?? 'Permission Checks'}</h2>
    <div class="flex flex-col space-y-4">
      {#each info?.permissionCheckers ?? [] as permissionChecker, index (index)}
        <ul>
          <li><b>{permissionChecker.contextName} / {permissionChecker.resourceName}</b></li>
          <li>{t('management.kubernetes.permitted') ?? 'permitted'}: {permissionChecker.permitted}</li>
          <li>{t('management.kubernetes.reason') ?? 'reason'}: {permissionChecker.reason}</li>
        </ul>
      {/each}
    </div>

    <h2 class="mt-2">{t('management.kubernetes.informers') ?? 'Informers'}</h2>
    <div class="flex flex-col space-y-4">
    {#each info?.informers ?? [] as informer, index (index)}
      <ul>
        <li><b>{informer.contextName} / {informer.resourceName}</b></li>
        <li>{t('management.kubernetes.offline') ?? 'is offline'}: {informer.isOffline}</li>
        <li>{t('management.kubernetes.objects') ?? '# objects'}: {informer.objectsCount ?? (t('management.unknown') ?? 'unknown')}</li>
      </ul>
    {/each}
    </div>
  </div>
</div>
