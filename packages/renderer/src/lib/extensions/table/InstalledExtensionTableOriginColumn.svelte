<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_BUILTIN_CHIP_TEXT_CLASS,
  EXTENSION_BUILTIN_CHIP_TOOLTIP,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from '/@/lib/extensions/extension-badge-styles';
import ExtensionVerifiedLabel from '/@/lib/extensions/ExtensionVerifiedLabel.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';
import Badge from '/@/lib/ui/Badge.svelte';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-2 py-1">
  {#if object.extension.type === 'dd'}
    <Tooltip right tip="Docker Desktop extension">
      <Badge
        label="Docker Desktop extension"
        color={EXTENSION_CHIP_COLORS.dockerDesktop}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
    </Tooltip>
  {:else if object.extension.devMode}
    <Tooltip right tip="In Development Mode extension">
      <Badge
        label="DevMode extension"
        color={EXTENSION_CHIP_COLORS.devMode}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    </Tooltip>
  {:else if !object.extension.removable}
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
    {#if object.catalogExtension.isVerified}
      <ExtensionVerifiedLabel isSupportedByRedHat={object.catalogExtension.isSupportedByRedHat} />
    {/if}
  {/if}
</div>
