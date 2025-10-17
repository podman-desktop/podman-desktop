<script lang="ts">
import Tooltip from './Tooltip.svelte';
</script>

<Tooltip>
  {#snippet tipSnippet()}
    <div>Custom snippet content</div>
  {/snippet}
  <div>Hover me</div>
</Tooltip>
