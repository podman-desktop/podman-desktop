<script lang="ts">
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_AUTO_UPDATE_PREFERENCE_TITLE,
  getExtensionAutoUpdatePreferenceDetail,
  toggleExtensionAutoUpdate,
} from './extension-auto-update-preference';
import { isAutoUpdateEnabled } from './extension-catalog-settings.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();

const checked = $derived(isAutoUpdateEnabled(extension.id));
const detail = $derived(getExtensionAutoUpdatePreferenceDetail(extension));
const toggleId = $derived(`input-standard-extension.autoUpdate.${extension.id}`);

async function handleToggle(): Promise<void> {
  await toggleExtensionAutoUpdate(extension, !checked);
}
</script>

<div class="flex flex-col px-2 py-2 w-full text-[color:var(--pd-invert-content-card-text)] space-y-4">
  <div class="flex flex-row justify-between">
    <div class="flex flex-col">
      <div class="flex flex-row text-[color:var(--pd-invert-content-card-text)]">
        <span class="font-semibold">{EXTENSION_AUTO_UPDATE_PREFERENCE_TITLE}</span>
      </div>
      <div class="pt-1 text-[color:var(--pd-invert-content-card-text)] text-sm pr-2">{detail}</div>
    </div>
    <SlideToggle
      id={toggleId}
      name={`extension.autoUpdate.${extension.id}`}
      left
      {checked}
      on:checked={(): void => {
        handleToggle().catch(() => undefined);
      }}
      aria-label={detail}>
      <span class="text-xs">{checked ? 'Enabled' : 'Disabled'}</span>
    </SlideToggle>
  </div>
</div>
