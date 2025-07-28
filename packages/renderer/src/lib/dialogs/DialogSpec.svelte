<script lang="ts">
import Dialog from './Dialog.svelte';
</script>

<Dialog title="Test dialog" onclose={(): undefined => {}}>
  {#snippet icon()}
    <i  aria-label="icon">Icon</i>
  {/snippet}

  {#snippet content()}
    <i  aria-label="content">Content</i>
  {/snippet}

  {#snippet validation()}
    <i  aria-label="validation">Validation</i>
  {/snippet}

  {#snippet buttons()}
    <i  aria-label="buttons">Buttons</i>
  {/snippet}
</Dialog>
