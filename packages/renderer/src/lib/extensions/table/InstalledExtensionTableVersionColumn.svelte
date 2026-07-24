<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import { isAutoUpdateEnabled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import { confirmExtensionVersionChange } from '/@/lib/extensions/extension-version-preference';
import {
  applyExtensionVersionChange,
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  getOptimisticInstalledVersion,
  getVersionChangeLinkLabel,
  resolveVersionChangeTarget,
  shouldShowVersionChangeLink,
  versionUpdateStatesStore,
  withDisplayInstalledVersion,
} from '/@/lib/extensions/extension-version-update.svelte';
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

const isUpdating = $derived($versionUpdateStatesStore[object.extension.id]?.status === 'updating');

const displayVersion = $derived.by(() => {
  uiRevision;
  const actualVersion = object.extension.version;
  const optimistic = getOptimisticInstalledVersion(object.extension.id);
  const normalizedActual = actualVersion?.replace(/^v/i, '').trim();

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

const showLink = $derived.by(() => {
  uiRevision;
  return !isUpdating && shouldShowVersionChangeLink(extensionForDisplay);
});

const targetVersion = $derived(resolveVersionChangeTarget(extensionForDisplay));
const linkLabel = $derived(targetVersion ? getVersionChangeLinkLabel(displayVersion, targetVersion) : '');

async function handleUpdate(): Promise<void> {
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

<div class="flex flex-col gap-1 py-1 text-sm text-[var(--pd-content-text)] min-w-0">
  <span class="whitespace-nowrap">{displayVersion ? `v${displayVersion}` : 'N/A'}</span>
  {#if showLink && targetVersion}
    <Link
      class="inline-flex shrink-0 self-start"
      aria-label={linkLabel}
      on:click={(): void => {
        handleUpdate().catch(() => undefined);
      }}>
      {linkLabel}
    </Link>
  {/if}
</div>
