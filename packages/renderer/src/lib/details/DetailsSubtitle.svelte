<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLTdAttributes } from 'svelte/elements';

interface Props extends HTMLTdAttributes {
  children?: Snippet;
}

let { children, ...props }: Props = $props();
</script>

<td class="pl-2 text-md font-semibold text-[var(--pd-table-body-text-sub-secondary)]" {...props}>
  {@render children?.()}
</td>
