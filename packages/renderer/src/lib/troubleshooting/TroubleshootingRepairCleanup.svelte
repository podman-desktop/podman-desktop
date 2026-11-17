<script lang="ts">
import type { ProviderInfo } from '@desktop-framework/api';
import { faBroom, faWarning } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  providers?: ProviderInfo[];
}

let { providers = [] }: Props = $props();
let providerIdsWithCleanup: string[] = $derived(
  providers.filter(provider => provider.cleanupSupport).map(provider => provider.internalId),
);

let cleanupInProgress = $state(false);

let cleanupFailures = $state<string[]>([]);

async function openCleanupDialog(): Promise<void> {
  const message = t('management.cleanup.confirm') ?? 'This action will delete data and cannot be undone. Proceed?';
  const action = t('management.cleanup.action') ?? 'Clear / Purge Data';

  const result = await window.showMessageBox({
    title: t('management.cleanup.title') ?? 'Clear / Purge Data?',
    type: 'danger',
    message: message,
    buttons: [action, t('common.cancel') ?? 'Cancel'],
  });

  if (result?.response === action) {
    await cleanup();
  }
}

async function cleanup(): Promise<void> {
  try {
    cleanupInProgress = true;
    cleanupFailures = [];
    await window.cleanupProviders(providerIdsWithCleanup, Symbol('cleanup-provider'), (_key, _eventName, args) => {
      // log into the console as no UI is available to display logs
      console.log('cleanup event', args);
    });
  } catch (e) {
    console.error(e);
    cleanupFailures.push(String(e));
    cleanupFailures = [...cleanupFailures];
  } finally {
    cleanupInProgress = false;
  }
}
</script>

<div class="flex flex-row items-end">
  <div>
    <div class="text-[var(--pd-content-header)] flex flex-row items-center">{t('management.cleanup.heading') ?? 'Clear / purge data'}</div>
    <div class="text-sm pt-1">
      <div class="flex flex-row items-center">
        <Icon class="pr-1" size="0.8x" icon={faWarning} />{t('management.cleanup.warning') ?? 'Proceeding with this action will result in data loss.'}
      </div>
      <p class="pt-2">{t('management.cleanup.deletes') ?? 'It will delete:'}</p>
      <ul class="list-disc ml-5">
        <li>{t('management.cleanup.machine') ?? 'The current Podman machine'}</li>
        <li>{t('management.cleanup.resources') ?? 'Containers, images, volumes, configuration files'}</li>
        <li>{t('management.cleanup.keys') ?? 'SSH keys'}</li>
      </ul>
      <p class="pt-2">{t('management.cleanup.keeps') ?? 'It will not delete:'}</p>
      <ul class="list-disc ml-5">
        <li>{t('management.cleanup.logs') ?? 'Podman logs'}</li>
      </ul>
    </div>
  </div>

  <div class="flex flex-1 justify-end">
    <Button
      type="danger"
      on:click={openCleanupDialog}
      inProgress={cleanupInProgress}
      icon={faBroom}>{t('management.cleanup.action') ?? 'Clear / Purge Data'}</Button>
  </div>

  <div>
    {#if cleanupFailures.length > 0}
      <div class="text-[var(--pd-state-error)] text-xs flex flex-row items-center" role="alert">
        <Icon class="pr-1" size="1x" icon={faWarning} ariaHidden={true} />{t('management.failures', { count: cleanupFailures.length }) ?? `${cleanupFailures.length} failures`}
      </div>
    {/if}
  </div>
</div>
