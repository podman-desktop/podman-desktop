<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import { EXTENSION_OUTLINED_CHIP_CLASS, EXTENSION_OUTLINED_CHIP_FEATURED_CLASS } from './extension-badge-styles';

interface Props {
  class?: string;
}

let { class: className = '' }: Props = $props();

const label = 'Featured';
</script>

<Tooltip top tip="Featured extension">
  <span
    class="{EXTENSION_OUTLINED_CHIP_CLASS} {EXTENSION_OUTLINED_CHIP_FEATURED_CLASS} {className}"
    aria-label={label}
    role="status">
    {label}
  </span>
</Tooltip>
