<script lang="ts">
import type { ExploreFeature } from '@desktop-framework/api';
import { Carousel } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import { ContextKeyExpr } from '/@/lib/context/contextKey';
import DashboardSection from '/@/lib/dashboard/DashboardSection.svelte';
import { context } from '/@/stores/context';
import { exploreFeaturesInfo } from '/@/stores/explore-features';

import ExploreFeatureCard from './ExploreFeatureCard.svelte';

let features: ExploreFeature[] = $derived(
  $exploreFeaturesInfo.filter(feature => {
    if (feature.when) {
      const whenDeserialized = ContextKeyExpr.deserialize(feature.when);
      return whenDeserialized?.evaluate($context) && (feature.show ?? true);
    }
    return feature.show ?? true;
  }),
);

onMount(() => {
  // event for the exploreFeaturesInfo store to check for an update
  window.dispatchEvent(new CustomEvent('update-explore-features', {}));
});

function featureClosed(featureId: string): void {
  features = features.filter(feature => feature.id !== featureId);
}
</script>

{#snippet card(feature: ExploreFeature)}
  <ExploreFeatureCard feature={feature} closeFeature={featureClosed} />
{/snippet}

{#if features.length > 0}
  <DashboardSection id="Explore Features" expandedKey="exploreFeatures.expanded">
    <div class="pt-2">
      <Carousel cards={features} {card} />
    </div>
  </DashboardSection>
{/if}
