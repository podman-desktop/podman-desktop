<script lang="ts">
import type { Guide } from '@desktop-framework/api/learning-center';
import { Carousel } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import DashboardSection from '/@/lib/dashboard/DashboardSection.svelte';

import GuideCard from './GuideCard.svelte';

let guides: Guide[] = $state([]);

onMount(async () => {
  guides = await window.listGuides();
});
</script>

{#snippet card(guide: Guide)}
  <GuideCard guide={guide} />
{/snippet}

<DashboardSection id="Learning Center" expandedKey="learningCenter.expanded">
  <div class="pt-2">
    <Carousel cards={guides} {card} />
  </div>
</DashboardSection>
