<!-- force the component to be legacy mode -->
<svelte:options runes={false} />
<script lang="ts">
import { Button } from '/@/lib';

export let onclick: () => void;
export let content: string | undefined;
</script>

<Button on:click={onclick}>
  {content}
</Button>
