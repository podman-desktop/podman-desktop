<script lang="ts">
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

import {
  EXTENSION_BUILTIN_INDICATOR_TOOLTIP,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
  EXTENSION_INDICATOR_ICON_CLASS,
} from '/@/lib/extensions/extension-badge-styles';
import { extensionRequiresManualUpdate } from '/@/lib/extensions/extension-onboarding-utils';
import { shouldShowBuiltInNameIndicator } from '/@/lib/extensions/extension-origin-utils';
import ExtensionIndicatorIcon from '/@/lib/extensions/ExtensionIndicatorIcon.svelte';
import ExtensionTruncatedText from '/@/lib/extensions/ExtensionTruncatedText.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';
import Badge from '/@/lib/ui/Badge.svelte';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();

const displayName = $derived(object.catalogExtension.displayName);
const description = $derived(object.catalogExtension.shortDescription ?? object.extension.description ?? '');
const showUpdate = $derived(extensionRequiresManualUpdate(object.catalogExtension));
const showBuiltIn = $derived(
  shouldShowBuiltInNameIndicator(object.extension, object.catalogExtension.fetchable === true),
);
</script>

<div class="flex flex-col gap-1 min-w-0 py-1">
  <span class="inline-flex min-w-0 max-w-full items-center gap-1">
    <span class="truncate font-semibold text-[var(--pd-content-header)]">{displayName}</span>
    {#if showBuiltIn}
      <ExtensionIndicatorIcon
        icon={faShieldHalved}
        tip={EXTENSION_BUILTIN_INDICATOR_TOOLTIP}
        iconClass={EXTENSION_INDICATOR_ICON_CLASS} />
    {/if}
    {#if showUpdate}
      <Badge
        label="Update"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
  </span>
  {#if description}
    <ExtensionTruncatedText text={description} class="text-sm text-[var(--pd-content-text)]" />
  {/if}
</div>
