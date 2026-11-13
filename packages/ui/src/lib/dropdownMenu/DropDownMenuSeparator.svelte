<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';

type Props = HTMLAttributes<HTMLDivElement>;

let { class: className, ...restProps }: Props = $props();
</script>

<!-- border-none: opt out of the divider border the menu puts on its items, so the separator color is visible.
     -mt-px: overlap the divider of the previous item, to not display two lines when dividers are visible (high contrast). -->
<div role="separator" class="-mt-px h-px border-none bg-[var(--pd-dropdown-separator)] {className}" {...restProps}></div>
