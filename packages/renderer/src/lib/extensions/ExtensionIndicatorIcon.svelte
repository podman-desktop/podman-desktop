<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Tooltip } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';

interface Props {
  icon: IconDefinition;
  tip: string;
  iconClass?: string;
}

let { icon, tip, iconClass = 'text-sm text-[var(--pd-badge-sky)]' }: Props = $props();
</script>

<Tooltip top {tip}>
  <span class="inline-flex shrink-0 items-center self-center font-normal" aria-label={tip}>
    <Fa {icon} class={iconClass} />
  </span>
</Tooltip>
