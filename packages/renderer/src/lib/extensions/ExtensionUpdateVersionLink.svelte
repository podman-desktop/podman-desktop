<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import ChangeVersionModal from './ChangeVersionModal.svelte';
import {
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
let changeVersionPreferredVersion: string | undefined = $state(undefined);
let showChangeVersionModal = $state(false);

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

function handleUpdate(event: Event): void {
  event.stopPropagation();
  if (!targetVersion) {
    return;
  }

  changeVersionPreferredVersion = targetVersion;
  showChangeVersionModal = true;
}

function closeChangeVersionModal(): void {
  showChangeVersionModal = false;
  changeVersionPreferredVersion = undefined;
}
</script>

{#if showLink && targetVersion}
  <Link class="inline-flex shrink-0" aria-label={linkLabel} on:click={handleUpdate}>
    {linkLabel}
  </Link>
{/if}

{#if showChangeVersionModal}
  <ChangeVersionModal
    extension={extensionForDisplay}
    preferredVersion={changeVersionPreferredVersion}
    closeCallback={closeChangeVersionModal} />
{/if}
