<script lang="ts">
import LegacyDialog from './LegacyDialog.svelte';
</script>

<LegacyDialog title="Test dialog" onclose={(): void => {}}>
  <i slot="icon" aria-label="icon">Icon</i>

  <i slot="content" aria-label="content">Content</i>

  <i slot="validation" aria-label="validation">Validation</i>

  <i slot="buttons" aria-label="buttons">Buttons</i>
</LegacyDialog>
