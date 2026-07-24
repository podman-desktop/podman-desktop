<script lang="ts">
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  canChangeExtensionLifecyclePreference,
  EXTENSION_LIFECYCLE_PREFERENCE_TITLE,
  getExtensionLifecyclePreferenceDetail,
  isExtensionLifecyclePreferenceChecked,
  toggleExtensionLifecyclePreference,
} from './extension-lifecycle-preference';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();

let checked = $state(false);
let pendingChecked: boolean | undefined = $state(undefined);
let toggleInProgress = $state(false);

const detail = $derived(getExtensionLifecyclePreferenceDetail(extension));
const canToggle = $derived(canChangeExtensionLifecyclePreference(extension));
const toggleId = $derived(`input-standard-extension.enabled.${extension.id}`);

$effect(() => {
  const sourceChecked = isExtensionLifecyclePreferenceChecked(extension);

  if (pendingChecked !== undefined) {
    // eslint-disable-next-line svelte/prefer-writable-derived -- optimistic toggle state during lifecycle transitions
    checked = pendingChecked;
    if (sourceChecked === pendingChecked) {
      pendingChecked = undefined;
    }
    return;
  }

  checked = sourceChecked;
});

async function handleToggle(): Promise<void> {
  if (!canToggle || toggleInProgress) {
    pendingChecked = undefined;
    checked = isExtensionLifecyclePreferenceChecked(extension);
    return;
  }

  const enabling = !isExtensionLifecyclePreferenceChecked(extension);
  pendingChecked = enabling;
  checked = enabling;
  toggleInProgress = true;

  try {
    await toggleExtensionLifecyclePreference(extension, enabling);
  } catch {
    pendingChecked = undefined;
    checked = isExtensionLifecyclePreferenceChecked(extension);
  } finally {
    toggleInProgress = false;
  }
}
</script>

<div class="flex flex-col px-2 py-2 w-full text-[color:var(--pd-invert-content-card-text)] space-y-4">
  <div class="flex flex-row justify-between">
    <div class="flex flex-col">
      <div class="flex flex-row text-[color:var(--pd-invert-content-card-text)]">
        <span class="font-semibold">{EXTENSION_LIFECYCLE_PREFERENCE_TITLE}</span>
      </div>
      <div class="pt-1 text-[color:var(--pd-invert-content-card-text)] text-sm pr-2">{detail}</div>
    </div>
    <SlideToggle
      id={toggleId}
      name={`extension.enabled.${extension.id}`}
      left
      disabled={!canToggle || toggleInProgress}
      bind:checked={checked}
      on:checked={(): void => {
        handleToggle().catch(() => undefined);
      }}
      aria-label={detail}>
      <span class="text-xs">{checked ? 'Enabled' : 'Disabled'}</span>
    </SlideToggle>
  </div>
</div>
