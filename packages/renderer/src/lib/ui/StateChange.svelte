<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  state: string;
  children?: Snippet;
}
let { state, children }: Props = $props();
</script>

{#if state === 'STARTING'}Starting...{:else if state === 'STOPPING'}Stopping...{:else if state === 'DELETING'}Deleting...{:else}
  {@render children?.()}
{/if}
