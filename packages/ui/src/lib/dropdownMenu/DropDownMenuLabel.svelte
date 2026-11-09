<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

let { title, class: className, ...restProps }: Props = $props();
</script>

<!-- Non-interactive title of a group of items -->
<div
  class="px-2.5 pt-2.5 pb-1 text-xs font-semibold whitespace-nowrap text-[var(--pd-dropdown-label-text)] {className}"
  {...restProps}>
  {title}
</div>
