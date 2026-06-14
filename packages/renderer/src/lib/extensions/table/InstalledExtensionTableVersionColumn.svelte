<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import {
  applyResolvedVersionChange,
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  getOptimisticInstalledVersion,
  getVersionChangeLinkLabel,
  isExtensionVersionUpdating,
  resolveVersionChangeTarget,
  shouldShowVersionChangeLink,
  withDisplayInstalledVersion,
} from '/@/lib/extensions/extension-version-update.svelte';
import ExtensionVersionUpdateStatus from '/@/lib/extensions/ExtensionVersionUpdateStatus.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();

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
  const actualVersion = object.extension.version;
  const optimistic = getOptimisticInstalledVersion(object.extension.id);
  const normalizedActual = actualVersion?.replace(/^v/i, '').trim();

  if (isExtensionVersionUpdating(object.extension.id)) {
    return actualVersion;
  }

  if (optimistic && optimistic !== normalizedActual) {
    return optimistic;
  }

  return actualVersion;
});

const extensionForDisplay = $derived(
  withDisplayInstalledVersion({
    ...object.catalogExtension,
    installedVersion: displayVersion,
  }),
);

const isUpdating = $derived.by(() => {
  uiRevision;
  return isExtensionVersionUpdating(object.extension.id);
});

const showLink = $derived.by(() => {
  uiRevision;
  return !isUpdating && shouldShowVersionChangeLink(extensionForDisplay);
});

const targetVersion = $derived(resolveVersionChangeTarget(extensionForDisplay));
const linkLabel = $derived(targetVersion ? getVersionChangeLinkLabel(displayVersion, targetVersion) : '');

function handleUpdate(): void {
  applyResolvedVersionChange(extensionForDisplay);
}
</script>

<div class="flex flex-col gap-1 py-1 text-sm text-[var(--pd-content-text)] min-w-0">
  <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
    <span class="whitespace-nowrap">{displayVersion ? `v${displayVersion}` : 'N/A'}</span>
    {#if showLink && targetVersion}
      <Link class="inline-flex shrink-0" aria-label={linkLabel} on:click={handleUpdate}>
        {linkLabel}
      </Link>
    {/if}
  </div>
  <ExtensionVersionUpdateStatus extensionId={object.extension.id} />
</div>
