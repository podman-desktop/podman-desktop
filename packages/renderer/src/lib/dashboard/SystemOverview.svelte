<script lang="ts">
import { Expandable } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import SystemOverviewContent from '/@/lib/dashboard/SystemOverviewContent.svelte';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import { SYSTEM_OVERVIEW_CONFIGURATION_KEY } from '/@api/dashboard-info';

let expanded: boolean = $state(true);
let initialized: boolean = $state(false);

const listener: EventListener = (obj: object) => {
  if ('detail' in obj) {
    const detail = obj.detail as { key: string; value: boolean };
    if (SYSTEM_OVERVIEW_CONFIGURATION_KEY === detail?.key) {
      expanded = detail.value;
    }
  }
};

onMount(async () => {
  onDidChangeConfiguration.addEventListener(SYSTEM_OVERVIEW_CONFIGURATION_KEY, listener);
  expanded = (await window.getConfigurationValue<boolean>(SYSTEM_OVERVIEW_CONFIGURATION_KEY)) ?? true;
  initialized = true;
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener(SYSTEM_OVERVIEW_CONFIGURATION_KEY, listener);
});

async function toggle(expanded: boolean): Promise<void> {
  await window.updateConfigurationValue(SYSTEM_OVERVIEW_CONFIGURATION_KEY, expanded);
}
</script>

<div class="flex flex-1 flex-col bg-[var(--pd-content-card-bg)] p-5 rounded-lg">
  <Expandable bind:initialized bind:expanded onclick={toggle}>
    {#snippet title()}
      <div class="text-lg font-semibold text-[var(--pd-content-card-header-text)]">System Overview</div>
    {/snippet}
    <SystemOverviewContent />
  </Expandable>
</div>
    