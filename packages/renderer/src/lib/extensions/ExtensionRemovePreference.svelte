<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  canRemoveExtensionFromPreferences,
  EXTENSION_REMOVE_PREFERENCE_TITLE,
  getExtensionRemovePreferenceDetail,
  PREFERENCES_MAIN_ROUTE,
  removeExtensionWithConfirmation,
} from './extension-remove-preference';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();

const detail = $derived(getExtensionRemovePreferenceDetail(extension));
const canRemove = $derived(canRemoveExtensionFromPreferences(extension));

function handleRemove(): void {
  removeExtensionWithConfirmation(extension, { redirectAfterRemove: PREFERENCES_MAIN_ROUTE });
}
</script>

<div class="flex flex-col px-2 py-2 w-full text-[color:var(--pd-invert-content-card-text)] space-y-4">
  <div class="flex flex-row justify-between gap-4">
    <div class="flex min-w-0 flex-col">
      <div class="flex flex-row text-[color:var(--pd-invert-content-card-text)]">
        <span class="font-semibold">{EXTENSION_REMOVE_PREFERENCE_TITLE}</span>
      </div>
      <div class="pt-1 text-[color:var(--pd-invert-content-card-text)] text-sm pr-2">{detail}</div>
    </div>
    <div class="flex shrink-0 items-start pt-1">
      <Button
        type="danger"
        icon={faTrash}
        disabled={!canRemove}
        title="Uninstall {extension.displayName}"
        on:click={handleRemove}>
        Uninstall
      </Button>
    </div>
  </div>
</div>
