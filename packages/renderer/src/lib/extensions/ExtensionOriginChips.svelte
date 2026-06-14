<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_BUILTIN_CHIP_TEXT_CLASS,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from './extension-badge-styles';
import ExtensionVerifiedLabel from './ExtensionVerifiedLabel.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();

const installed = $derived(extension.installedExtension);
</script>

<div class="inline-flex flex-none flex-wrap items-center gap-x-2 gap-y-1 {className}">
  {#if installed?.type === 'dd'}
    <Badge
      label="Docker Desktop extension"
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktop} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
  {:else if installed?.devMode}
    <Badge
      label="DevMode extension"
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.devMode} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {:else if installed && !installed.removable}
    <Badge
      label={EXTENSION_BUILTIN_CHIP_LABEL}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.builtin} ${EXTENSION_BUILTIN_CHIP_TEXT_CLASS}`} />
  {:else}
    <Badge
      label="Community"
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.communityOrigin} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {#if extension.isVerified}
      <ExtensionVerifiedLabel isSupportedByRedHat={extension.isSupportedByRedHat} class={EXTENSION_CHIP_BADGE_CLASS} />
    {/if}
  {/if}
</div>
