<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLTdAttributes } from 'svelte/elements';

interface Props extends HTMLTdAttributes {
  children?: Snippet;
}

let { class: className, children, ...restProps }: Props = $props();
</script>

<td class={['pl-2 text-md font-semibold text-[var(--pd-table-body-text-sub-secondary)]', className]} {...restProps}>
  {@render children?.()}
</td>
