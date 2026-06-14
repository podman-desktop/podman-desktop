<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';
import { isNewlyInstalled } from './extension-catalog-settings.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();
</script>

<div class="inline-flex flex-none flex-wrap items-center gap-x-2 gap-y-1 {className}">
  {#if extension.isFeatured}
    <Badge
      label="Featured"
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.featured} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
  {#if isNewlyInstalled(extension.id)}
    <Badge
      label="New"
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
</div>
