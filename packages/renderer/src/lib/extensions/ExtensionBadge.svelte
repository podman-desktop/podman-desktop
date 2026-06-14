<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_BUILTIN_CHIP_TEXT_CLASS,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from './extension-badge-styles';

export let extension: { type: 'dd' | 'pd'; removable: boolean; devMode: boolean };
</script>

<div class="flex flex-row gap-1 items-center {$$props.class}" role="region" aria-label="Extension Badge">
  {#if extension.type === 'dd'}
    <Badge
      label="Docker Desktop extension"
      color={EXTENSION_CHIP_COLORS.dockerDesktop}
      class={`text-[8px] ${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
  {:else if extension.devMode}
    <Badge
      label="DevMode extension"
      color={EXTENSION_CHIP_COLORS.devMode}
      class={`text-[8px] ${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {:else if !extension.removable}
    <Badge
      label={EXTENSION_BUILTIN_CHIP_LABEL}
      color={EXTENSION_CHIP_COLORS.builtin}
      class={`text-[8px] ${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_BUILTIN_CHIP_TEXT_CLASS}`} />
  {/if}
</div>
