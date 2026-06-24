<script lang="ts">
import { onMount } from 'svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import {
  confirmExtensionVersionChange,
  EXTENSION_VERSION_PREFERENCE_TITLE,
  extensionHasVersionChoices,
  extensionIsOnLatestVersion,
  getExtensionVersionOptions,
  getExtensionVersionPreferenceDescription,
  getExtensionVersionPreferenceValue,
} from './extension-version-preference';
import {
  applyExtensionVersionChange,
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  isExtensionVersionUpdating,
  normalizeVersionValue,
} from './extension-version-update.svelte';
import ExtensionUpToDateChip from './ExtensionUpToDateChip.svelte';
import ExtensionVersionPreferenceDropdown from './ExtensionVersionPreferenceDropdown.svelte';
import ExtensionVersionUpdateStatus from './ExtensionVersionUpdateStatus.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();

let uiRevision = $state(0);
let selectedVersion = $state('');
let isChanging = $state(false);

const currentVersion = $derived.by(() => {
  uiRevision;
  return getExtensionVersionPreferenceValue(extension);
});

const hasOtherVersions = $derived.by(() => {
  uiRevision;
  return extensionHasVersionChoices(extension);
});

const description = $derived(getExtensionVersionPreferenceDescription(currentVersion, hasOtherVersions));

const versionOptions = $derived.by(() => {
  uiRevision;
  return getExtensionVersionOptions(extension, currentVersion);
});

const disabled = $derived.by(() => {
  uiRevision;
  return !hasOtherVersions || isChanging || isExtensionVersionUpdating(extension.id);
});

const showUpToDateChip = $derived.by(() => {
  uiRevision;
  return extensionIsOnLatestVersion(extension) && !isExtensionVersionUpdating(extension.id);
});

const dropdownId = $derived(`input-standard-extension.version.${extension.id}`);

$effect(() => {
  // eslint-disable-next-line svelte/prefer-writable-derived -- keep dropdown selection aligned with installed version
  if (!isChanging) {
    selectedVersion = currentVersion;
  }
});

onMount(() => {
  const handler = (): void => {
    uiRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  };
});

async function handleVersionChange(newValue: string): Promise<void> {
  const newVersion = normalizeVersionValue(newValue);
  if (!newVersion || newVersion === currentVersion || disabled) {
    selectedVersion = currentVersion;
    return;
  }

  isChanging = true;
  try {
    const confirmed = await confirmExtensionVersionChange(extension, newVersion);
    if (!confirmed) {
      selectedVersion = currentVersion;
      return;
    }

    applyExtensionVersionChange(extension, newVersion, isAutoUpdateEnabled(extension.id));
    selectedVersion = newVersion;
  } finally {
    isChanging = false;
  }
}
</script>

<div class="flex flex-col px-2 py-2 w-full text-[color:var(--pd-invert-content-card-text)] space-y-4">
  <div class="flex flex-row justify-between gap-6">
    <div class="flex min-w-0 flex-col">
      <div class="flex flex-row items-center gap-2 text-[color:var(--pd-invert-content-card-text)]">
        <span class="font-semibold">{EXTENSION_VERSION_PREFERENCE_TITLE}</span>
        {#if showUpToDateChip}
          <ExtensionUpToDateChip />
        {/if}
      </div>
      <div class="pt-1 text-[color:var(--pd-invert-content-card-text)] text-sm pr-2">{description}</div>
      <ExtensionVersionUpdateStatus extensionId={extension.id} class="pt-1" />
    </div>
    <div class="flex shrink-0 items-start pt-1">
      <ExtensionVersionPreferenceDropdown
        id={dropdownId}
        ariaLabel={description}
        disabled={disabled}
        options={versionOptions}
        bind:value={selectedVersion}
        onChange={handleVersionChange} />
    </div>
  </div>
</div>
