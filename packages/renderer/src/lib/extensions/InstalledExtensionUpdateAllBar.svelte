<script lang="ts">
import { faArrowUp, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { applyExtensionVersionChange, getLatestAvailableVersion } from './extension-version-update.svelte';

interface Props {
  extensionsWithUpdate: CatalogExtensionInfoUI[];
}

let { extensionsWithUpdate }: Props = $props();

const updateCount = $derived(extensionsWithUpdate.length);
let bulkUpdating = $state(false);

function updateAll(): void {
  if (bulkUpdating || updateCount === 0) {
    return;
  }
  bulkUpdating = true;
  for (const extension of extensionsWithUpdate) {
    const latest = getLatestAvailableVersion(extension);
    if (latest) {
      applyExtensionVersionChange(extension, latest);
    }
  }
  bulkUpdating = false;
}
</script>

{#if updateCount > 1}
  <div
    class="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
    style:border-color="var(--pd-state-info)"
    style:background-color="color-mix(in srgb, var(--pd-state-info) 10%, transparent)"
    role="status"
    aria-label="Bulk upgrade available">
    <div class="flex min-w-0 flex-1 items-start gap-2">
      <Icon class="mt-0.5 shrink-0 text-[var(--pd-state-info)]" icon={faCircleInfo} size="sm" />
      <p class="min-w-0 flex-1 break-words text-[var(--pd-content-text)]">
        There are {updateCount} extensions with upgrades available.
      </p>
    </div>
    <Button
      type="secondary"
      icon={faArrowUp}
      inProgress={bulkUpdating}
      on:click={updateAll}
      aria-label="Upgrade all {updateCount}">
      Upgrade all {updateCount}
    </Button>
  </div>
{/if}
