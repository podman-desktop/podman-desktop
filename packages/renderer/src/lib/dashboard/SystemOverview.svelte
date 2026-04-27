<script lang="ts">
import { SYSTEM_OVERVIEW_EXPANDED } from '@podman-desktop/core-api';
import { Expandable, Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy, onMount } from 'svelte';

import SystemOverviewContent from '/@/lib/dashboard/SystemOverviewContent.svelte';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import { systemOverviewInfos } from '/@/stores/dashboard/system-overview.svelte';

import { STATUS_TEXT_CLASS } from './system-overview-utils.svelte';

let expanded: boolean = $state(true);
let initialized: boolean = $state(false);

const listener: EventListener = (obj: object) => {
  if ('detail' in obj) {
    const detail = obj.detail as { key: string; value: boolean };
    if (SYSTEM_OVERVIEW_EXPANDED === detail?.key) {
      expanded = detail.value;
    }
  }
};

onMount(async () => {
  onDidChangeConfiguration.addEventListener(SYSTEM_OVERVIEW_EXPANDED, listener);
  expanded = (await window.getConfigurationValue<boolean>(SYSTEM_OVERVIEW_EXPANDED)) ?? true;
  initialized = true;
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener(SYSTEM_OVERVIEW_EXPANDED, listener);
});

async function toggle(expanded: boolean): Promise<void> {
  await window.updateConfigurationValue(SYSTEM_OVERVIEW_EXPANDED, expanded);
}
</script>

<div class="flex flex-1 flex-col bg-[var(--pd-content-card-bg)] p-5 rounded-lg">
  <Expandable bind:initialized bind:expanded onclick={toggle}>
    {#snippet title()}
      <div class="flex items-center gap-2">
        <span class="text-lg font-semibold text-[var(--pd-content-card-header-text)]">System Overview</span>
        {#if !expanded}
          <Tooltip tip={$systemOverviewInfos.text} containerClass="inline-flex items-center">
            {#key $systemOverviewInfos.status.status}
              <Icon class={STATUS_TEXT_CLASS[$systemOverviewInfos.status.status]} icon={$systemOverviewInfos.status.icon} size={$systemOverviewInfos.status.status === 'progressing' ? '1.25em' : 'lg'} />
            {/key}
          </Tooltip>
        {/if}
      </div>
    {/snippet}
    <SystemOverviewContent />
  </Expandable>
</div>
