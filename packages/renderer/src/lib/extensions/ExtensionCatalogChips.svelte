<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';
import ExtensionCatalogMetaChips from './ExtensionCatalogMetaChips.svelte';
import ExtensionVerifiedLabel from './ExtensionVerifiedLabel.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-2 {className}">
  <ExtensionCatalogMetaChips {extension} />
  {#if !extension.isSupportedByRedHat}
    <Badge
      label="Community"
      color={EXTENSION_CHIP_COLORS.community}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
  {#if extension.isVerified}
    <ExtensionVerifiedLabel isSupportedByRedHat={extension.isSupportedByRedHat} class={EXTENSION_CHIP_BADGE_CLASS} />
  {/if}
</div>
