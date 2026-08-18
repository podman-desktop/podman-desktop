<script lang="ts">
import type { HTMLTdAttributes } from 'svelte/elements';

let { class: className, children, ...restProps }: HTMLTdAttributes = $props();
</script>

<td class={['pl-2 text-md font-semibold text-[var(--pd-table-body-text-sub-secondary)]', className]} {...restProps}>
  {@render children?.()}
</td>
