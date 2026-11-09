<script lang="ts">
import type { Snippet } from 'svelte';

import DropDownMenuLabel from './DropDownMenuLabel.svelte';

interface Props {
  // optional title displayed above the items, also used as the accessible name of the group
  label?: string;
  children?: Snippet;
}

let { label, children }: Props = $props();

const labelId = $props.id();
</script>

<div role="group" aria-labelledby={label ? labelId : undefined} class="divide-y divide-[var(--pd-dropdown-divider)]">
  {#if label}
    <DropDownMenuLabel id={labelId} title={label} />
  {/if}
  {@render children?.()}
</div>
