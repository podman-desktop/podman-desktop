<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import { confirmExtensionVersionChange } from './extension-version-preference';
import {
  applyExtensionVersionChange,
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  getOptimisticInstalledVersion,
  getVersionChangeLinkLabel,
  isExtensionVersionUpdating,
  resolveVersionChangeTarget,
  shouldShowVersionChangeLink,
  withDisplayInstalledVersion,
} from './extension-version-update.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();

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

const displayInstalledVersion = $derived.by(() => {
  uiRevision;
  const actualVersion = extension.installedVersion;
  const optimistic = getOptimisticInstalledVersion(extension.id);
  const normalizedActual = actualVersion?.replace(/^v/i, '').trim();

  if (isExtensionVersionUpdating(extension.id)) {
    return actualVersion;
  }

  if (optimistic && optimistic !== normalizedActual) {
    return optimistic;
  }

  return actualVersion;
});

const extensionForDisplay = $derived(
  withDisplayInstalledVersion({
    ...extension,
    installedVersion: displayInstalledVersion,
  }),
);

const isUpdating = $derived.by(() => {
  uiRevision;
  return isExtensionVersionUpdating(extension.id);
});

const showLink = $derived.by(() => {
  uiRevision;
  return !isUpdating && shouldShowVersionChangeLink(extensionForDisplay);
});

const targetVersion = $derived(resolveVersionChangeTarget(extensionForDisplay));
const linkLabel = $derived(targetVersion ? getVersionChangeLinkLabel(displayInstalledVersion, targetVersion) : '');

async function handleUpdate(event: Event): Promise<void> {
  event.stopPropagation();
  if (!targetVersion) {
    return;
  }

  const confirmed = await confirmExtensionVersionChange(extensionForDisplay, targetVersion);
  if (!confirmed) {
    return;
  }

  applyExtensionVersionChange(extensionForDisplay, targetVersion, isAutoUpdateEnabled(extensionForDisplay.id));
}
</script>

{#if showLink && targetVersion}
  <Link
    class="inline-flex shrink-0"
    aria-label={linkLabel}
    on:click={(event): void => {
      handleUpdate(event).catch(() => undefined);
    }}>
    {linkLabel}
  </Link>
{/if}
