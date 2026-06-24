<script lang="ts">
import { onMount } from 'svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  getOptimisticInstalledVersion,
  isExtensionVersionUpdating,
} from './extension-version-update.svelte';
import ExtensionVersionUpdateStatus from './ExtensionVersionUpdateStatus.svelte';

interface Props {
  catalogExtension: CatalogExtensionInfoUI;
  class?: string;
}

let { catalogExtension, class: className = '' }: Props = $props();

let uiRevision = $state(0);

onMount(() => {
  const handler = (): void => {
    uiRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  };
});

const displayVersion = $derived.by(() => {
  uiRevision;
  const actualVersion = catalogExtension.installedVersion;
  const optimistic = getOptimisticInstalledVersion(catalogExtension.id);
  const normalizedActual = actualVersion?.replace(/^v/i, '').trim();

  if (isExtensionVersionUpdating(catalogExtension.id)) {
    return actualVersion;
  }

  if (optimistic && optimistic !== normalizedActual) {
    return optimistic;
  }

  return actualVersion ?? catalogExtension.fetchVersion;
});
</script>

<div class="flex flex-col gap-1 min-w-0 {className}">
  {#if catalogExtension.isInstalled}
    <span class="font-medium text-[var(--pd-content-header)] break-words">
      {displayVersion ? `v${displayVersion}` : 'N/A'}
    </span>
    <p class="text-xs text-[var(--pd-content-text)]">
      Change version from extension preferences.
    </p>
    <ExtensionVersionUpdateStatus
      extensionId={catalogExtension.id}
      extensionState={catalogExtension.installedExtension?.state} />
  {:else}
    <span class="text-[var(--pd-content-text)] break-words">
      Latest catalog version: v{catalogExtension.fetchVersion || 'N/A'}
    </span>
  {/if}
</div>
