<script lang="ts">
import DashboardSection from './DashboardSection.svelte';
</script>

<DashboardSection id="Learning Center" expandedKey="learningCenter.expanded">
  {#snippet status(expanded: boolean)}
    <span>status:{expanded}</span>
  {/snippet}
  <p>content</p>
</DashboardSection>
