<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

import DropDownMenuLabel from './DropDownMenuLabel.svelte';

interface Props extends HTMLAttributes<HTMLDivElement> {
  // optional title displayed above the items, also used as the accessible name of the group
  label?: string;
  children?: Snippet;
}

let { label, class: className, children, ...restProps }: Props = $props();

const labelId = $props.id();
</script>

<div
  role="group"
  aria-labelledby={label ? labelId : undefined}
  class="divide-y divide-[var(--pd-dropdown-divider)] {className}"
  {...restProps}>
  {#if label}
    <DropDownMenuLabel id={labelId} title={label} />
  {/if}
  {@render children?.()}
</div>
