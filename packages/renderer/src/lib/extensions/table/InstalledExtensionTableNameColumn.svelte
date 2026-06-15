<script lang="ts">
import {
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from '/@/lib/extensions/extension-badge-styles';
import { isNewBadgeActive, newBadgeRevision } from '/@/lib/extensions/extension-catalog-settings.svelte';
import { extensionRequiresManualUpdate } from '/@/lib/extensions/extension-onboarding-utils';
import ExtensionNewBadge from '/@/lib/extensions/ExtensionNewBadge.svelte';
import ExtensionTruncatedText from '/@/lib/extensions/ExtensionTruncatedText.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';
import Badge from '/@/lib/ui/Badge.svelte';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();

const isNew = $derived.by(() => {
  newBadgeRevision.value;
  return isNewBadgeActive(object.catalogExtension.id);
});
const displayName = $derived(object.catalogExtension.displayName);
const description = $derived(object.catalogExtension.shortDescription ?? object.extension.description ?? '');
const showUpdate = $derived(extensionRequiresManualUpdate(object.catalogExtension));
</script>

<div class="flex flex-col gap-1 min-w-0 py-1">
  <div class="flex min-w-0 max-w-full items-center gap-1.5">
    <span class="truncate font-semibold text-[var(--pd-content-header)]">{displayName}</span>
    {#if showUpdate}
      <Badge
        label="Update"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if isNew}
      <ExtensionNewBadge />
    {/if}
  </div>
  {#if description}
    <ExtensionTruncatedText text={description} class="text-sm text-[var(--pd-content-text)]" />
  {/if}
</div>
