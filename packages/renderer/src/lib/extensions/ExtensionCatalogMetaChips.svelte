<script lang="ts">
import { faStar } from '@fortawesome/free-solid-svg-icons';

import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';
import { newlyInstalled } from './extension-catalog-settings.svelte';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';

interface Props {
  extension: CatalogExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();

const showUpdate = $derived(extensionRequiresManualUpdate(extension));
const isNew = $derived(newlyInstalled.has(extension.id));
</script>

<div class="inline-flex flex-none flex-wrap items-center gap-x-2 gap-y-1 {className}">
  {#if extension.isFeatured}
    <Badge
      label="Featured"
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.featured} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
  {#if showUpdate}
    <Badge
      label="Update"
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
  {#if isNew}
    <Badge
      label="New"
      icon={faStar}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
</div>
