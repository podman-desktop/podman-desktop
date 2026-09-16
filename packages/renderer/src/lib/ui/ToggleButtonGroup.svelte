<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  children?: Snippet;
}
let { children }: Props = $props();
</script>

<div class="flex flex-row space-x-[1px]">
  {@render children?.()}
</div>
