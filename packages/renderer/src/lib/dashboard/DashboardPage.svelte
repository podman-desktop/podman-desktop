<script lang="ts">
import { NavPage } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';

import { dashboardPageRegistry } from '/@/stores/dashboard/dashboard-page-registry';

import NotificationsBox from './NotificationsBox.svelte';
</script>

<NavPage searchEnabled={false} title="Dashboard">
  {#snippet content()}
  <div class="flex flex-col min-w-full h-full bg-[var(--pd-content-bg)] py-5">
    <div class="min-w-full flex-1">
      <NotificationsBox />
      <div class="px-5 space-y-5 h-full">
        {#each $dashboardPageRegistry as dashboardRegistryItem (dashboardRegistryItem.id)}
          {@const Section = dashboardRegistryItem.component as Component}
          <Section />
        {/each}
      </div>
    </div>
  </div>
  {/snippet}
</NavPage>
