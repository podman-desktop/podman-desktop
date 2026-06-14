<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_BUILTIN_CHIP_TEXT_CLASS,
  EXTENSION_BUILTIN_CHIP_TOOLTIP,
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

<div class="flex flex-wrap items-center gap-2 {className}">
  {#if installed?.type === 'dd'}
    <Tooltip right tip="Docker Desktop extension">
      <Badge
        label="Docker Desktop extension"
        color={EXTENSION_CHIP_COLORS.dockerDesktop}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
    </Tooltip>
  {:else if installed?.devMode}
    <Tooltip right tip="In Development Mode extension">
      <Badge
        label="DevMode extension"
        color={EXTENSION_CHIP_COLORS.devMode}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    </Tooltip>
  {:else if installed && !installed.removable}
    <Tooltip right tip={EXTENSION_BUILTIN_CHIP_TOOLTIP}>
      <Badge
        label={EXTENSION_BUILTIN_CHIP_LABEL}
        color={EXTENSION_CHIP_COLORS.builtin}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_BUILTIN_CHIP_TEXT_CLASS}`} />
    </Tooltip>
  {:else}
    <Badge
      label="Community"
      color={EXTENSION_CHIP_COLORS.communityOrigin}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {#if extension.isVerified}
      <ExtensionVerifiedLabel isSupportedByRedHat={extension.isSupportedByRedHat} class={EXTENSION_CHIP_BADGE_CLASS} />
    {/if}
  {/if}
</div>
