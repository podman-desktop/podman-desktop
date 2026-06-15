<script lang="ts">
import { faStar } from '@fortawesome/free-solid-svg-icons';

import {
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from '/@/lib/extensions/extension-badge-styles';
import { newlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import ExtensionDetailsLink from '/@/lib/extensions/ExtensionDetailsLink.svelte';
import ExtensionTruncatedText from '/@/lib/extensions/ExtensionTruncatedText.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';
import Badge from '/@/lib/ui/Badge.svelte';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();

const isNew = $derived(newlyInstalled.has(object.catalogExtension.id));
</script>

<div class="flex flex-col gap-1 min-w-0 py-1 pr-6">
  <div class="flex items-center gap-2 min-w-0">
    <ExtensionDetailsLink
      displayIcon={false}
      class="text-[color:var(--pd-card-header-text)] font-semibold truncate min-w-0"
      extension={object.extension} />
    {#if isNew}
      <Badge
        label="New"
        icon={faStar}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
  </div>
  {#if object.extension.description}
    <ExtensionTruncatedText text={object.extension.description} class="text-sm text-[var(--pd-content-text)]" />
  {/if}
</div>
