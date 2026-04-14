<script lang="ts">
import FormPage from './FormPage.svelte';
</script>

<FormPage title="Test component">
  {#snippet icon()}
  <i class="fas fa-lightbulb fa-2x" aria-label="icon"></i>
  {/snippet}

  {#snippet actions()}
  <i class="fas fa-lightbulb fa-2x" aria-label="actions"></i>
  {/snippet}

  {#snippet content()}
  <div class="flex flex-col">
    <i class="fas fa-lightbulb fa-2x" aria-label="content"></i>
  </div>
  {/snippet}
</FormPage>
