<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';

let { ...props }: HTMLAttributes<HTMLTableCellElement> = $props();
</script>

<td class="pl-2 text-md font-semibold text-[var(--pd-table-body-text-sub-secondary)]" {...props}>
  <slot />
</td>
