<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';
import { isNewlyInstalled } from './extension-catalog-settings.svelte';
import ExtensionVerifiedLabel from './ExtensionVerifiedLabel.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();
</script>

<div class="inline-flex flex-wrap items-center gap-x-2 gap-y-1 {className}">
  {#if extension.isFeatured}
    <Badge
      label="Featured"
      color={EXTENSION_CHIP_COLORS.featured}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
  {#if isNewlyInstalled(extension.id)}
    <Badge
      label="New"
      color={EXTENSION_CHIP_COLORS.new}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
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
