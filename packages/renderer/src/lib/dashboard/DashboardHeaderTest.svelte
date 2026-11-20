<script lang="ts">
import DashboardHeader from './DashboardHeader.svelte';
</script>

<DashboardHeader title="Dashboard">
  {#snippet actions()}
    <button type="button">edit</button>
  {/snippet}
</DashboardHeader>
