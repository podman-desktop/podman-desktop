<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import Badge from '/@/lib/ui/Badge.svelte';

import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';

export let extension: { type: 'dd' | 'pd'; removable: boolean; devMode: boolean };
</script>

<div class="flex flex-row gap-1 items-center {$$props.class}" role="region" aria-label="Extension Badge">
  {#if extension.type === 'dd'}
    <Tooltip right tip="Docker Desktop extension">
      <Badge
        label="Docker Desktop extension"
        color={EXTENSION_CHIP_COLORS.dockerDesktop}
        class={`text-[8px] ${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
    </Tooltip>
  {:else if extension.devMode}
    <Tooltip right tip="In Development Mode Extension">
      <Badge
        label="DevMode extension"
        color={EXTENSION_CHIP_COLORS.devMode}
        class={`text-[8px] ${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    </Tooltip>
  {:else if !extension.removable}
    <Tooltip right tip="Built-in extension">
      <Badge
        label="Built-in extension"
        color={EXTENSION_CHIP_COLORS.builtin}
        class={`text-[8px] ${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    </Tooltip>
  {/if}
</div>
