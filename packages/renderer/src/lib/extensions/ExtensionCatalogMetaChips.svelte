<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';
import { isNewlyInstalled } from './extension-catalog-settings.svelte';
import { extensionHasVersionUpdate } from './extension-onboarding-utils';

interface Props {
  extension: CatalogExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();

const showUpdate = $derived(
  extensionHasVersionUpdate(
    extension.isInstalled,
    extension.installedVersion,
    extension.fetchVersion,
    extension.hasUpdate,
  ),
);
</script>

<div class="flex flex-wrap items-center gap-2 {className}">
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
  {#if showUpdate}
    <Badge
      label="Update"
      color={EXTENSION_CHIP_COLORS.update}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
  {#if extension.isInstalled}
    <Badge
      label="Installed"
      color={EXTENSION_CHIP_COLORS.installed}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
</div>
