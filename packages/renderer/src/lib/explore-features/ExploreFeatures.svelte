<script lang="ts">
import { Carousel, Expandable } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import { ContextKeyExpr } from '/@/lib/context/contextKey';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import { context } from '/@/stores/context';
import { exploreFeaturesInfo } from '/@/stores/explore-features';
import type { ExploreFeature } from '/@api/explore-feature';

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
let expanded: boolean = $state(true);
let initialized: boolean = $state(false);

const listener: EventListener = (obj: object) => {
  if ('detail' in obj) {
    const detail = obj.detail as { key: string; value: boolean };
    if (CONFIGURATION_KEY === detail?.key) {
      expanded = detail.value;
    }
  }
};

const CONFIGURATION_KEY = 'exploreFeatures.expanded';

onMount(async () => {
  // event for the exploreFeaturesInfo store to check for an update
  window.dispatchEvent(new CustomEvent('update-explore-features', {}));

  onDidChangeConfiguration.addEventListener(CONFIGURATION_KEY, listener);
  expanded = (await window.getConfigurationValue<boolean>(CONFIGURATION_KEY)) ?? true;
  initialized = true;
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener(CONFIGURATION_KEY, listener);
});

async function toggle(expanded: boolean): Promise<void> {
  await window.updateConfigurationValue(CONFIGURATION_KEY, expanded);
}

function featureClosed(featureId: string): void {
  features = features.filter(feature => feature.id !== featureId);
}
</script>

{#snippet card(feature: ExploreFeature)}
  <ExploreFeatureCard feature={feature} closeFeature={featureClosed} />
{/snippet}

{#if features.length > 0}
  <div class="flex flex-1 flex-col bg-[var(--pd-content-card-bg)] p-5 rounded-lg">
    <Expandable bind:initialized bind:expanded onclick={toggle}>
      <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
      {#snippet title()}<div class="text-lg font-semibold text-[var(--pd-content-card-header-text)]">Explore Features</div>{/snippet}
      <div class="pt-2">
        <Carousel cards={features} {card} />
      </div>
    </Expandable>
  </div>
{/if}
