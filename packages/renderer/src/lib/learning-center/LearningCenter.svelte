<script lang="ts">
import { Carousel, Expandable } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import type { Guide } from '/@api/learning-center/guide';

import GuideCard from './GuideCard.svelte';

let guides: Guide[] = $state([]);
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

const CONFIGURATION_KEY = 'learningCenter.expanded';

onMount(async () => {
  guides = await window.listGuides();

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
</script>

{#snippet card(guide: Guide)}
  <GuideCard guide={guide} />
{/snippet}


<div class="flex flex-1 flex-col bg-[var(--pd-content-card-bg)] p-5 rounded-lg">
  <Expandable bind:initialized bind:expanded onclick={toggle}>
    <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
    {#snippet title()}<div class="text-lg font-semibold text-[var(--pd-content-card-header-text)]">Learning Center</div>{/snippet}
    <div class="pt-2">
      <Carousel cards={guides} {card} />
    </div>
  </Expandable>
</div>
