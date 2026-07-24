<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import { EXTENSION_CHIP_BADGE_CLASS, EXTENSION_CHIP_COLORS, EXTENSION_CHIP_TEXT_CLASS } from './extension-badge-styles';

interface Props {
  isSupportedByRedHat?: boolean;
  class?: string;
}

let { isSupportedByRedHat = false, class: className = '' }: Props = $props();
</script>

<span class="inline-flex {className}">
  <Badge
    label="Verified"
    aria-label={isSupportedByRedHat ? 'Verified Red Hat extension' : 'Verified extension'}
    class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.verified} ${EXTENSION_CHIP_TEXT_CLASS}`} />
</span>
