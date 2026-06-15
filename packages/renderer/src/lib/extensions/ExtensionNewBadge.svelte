<script lang="ts">
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';

import Badge from '/@/lib/ui/Badge.svelte';

import {
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
  EXTENSION_NEW_BADGE_TOOLTIP,
} from './extension-badge-styles';

interface Props {
  class?: string;
}

let { class: className = '' }: Props = $props();
</script>

<Tooltip top tip={EXTENSION_NEW_BADGE_TOOLTIP} class="inline-flex shrink-0">
  <Badge
    label="New"
    icon={faStar}
    class={`${EXTENSION_CHIP_BADGE_CLASS} shrink-0 ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS} ${className}`} />
</Tooltip>
