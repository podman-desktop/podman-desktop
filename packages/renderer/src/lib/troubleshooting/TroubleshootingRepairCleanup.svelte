<script lang="ts">
import { faBroom, faWarning } from '@fortawesome/free-solid-svg-icons';
import type { ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

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
  let message = 'This action may delete data. Proceed?';

  const result = await window.showMessageBox({
    title: 'Cleanup',
    message: message,
    buttons: ['Yes', 'Cancel'],
  });

  if (result?.response === 0) {
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

<div class="flex flex-row items-center">
  <div>
    <div class="text-[var(--pd-content-header)] flex flex-row items-center">Clean / Purge data</div>
    <div class="text-sm flex flex-row items-center pt-1">
      <Icon class="pr-1" size="0.8x" icon={faWarning} />Proceeding with this action may result in data loss, including
      existing volumes, containers, images, etc.
    </div>
  </div>

  <div class="flex flex-1 justify-end">
    <Button
      type="danger"
      on:click={openCleanupDialog}
      inProgress={cleanupInProgress}
      aria-label="Cleanup"
      icon={faBroom}>Cleanup / Purge data</Button>
  </div>

  <div>
    {#if cleanupFailures.length > 0}
      <div class="text-[var(--pd-state-error)] text-xs flex flex-row items-center" role="alert" aria-label="error">
        <Icon class="pr-1" size="1x" icon={faWarning} />{cleanupFailures.length} failures
      </div>
    {/if}
  </div>
</div>
