<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import Badge from '/@/lib/ui/Badge.svelte';

import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';

interface Props {
  isSupportedByRedHat?: boolean;
  class?: string;
}

let { isSupportedByRedHat = false, class: className = '' }: Props = $props();

const tooltip = $derived(isSupportedByRedHat ? 'Supported by Red Hat' : 'Verified extension');
</script>

<Tooltip top tip={tooltip}>
  <span class="inline-flex cursor-help {className}">
    <Badge
      label="Verified"
      color={EXTENSION_CHIP_COLORS.verified}
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  </span>
</Tooltip>
