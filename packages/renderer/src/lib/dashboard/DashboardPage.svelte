<script lang="ts">
import { NavPage } from '@podman-desktop/ui-svelte';

import { dashboardPageRegistry } from '/@/stores/dashboard/dashboard-page-registry.svelte';

import NotificationsBox from './NotificationsBox.svelte';
</script>

<NavPage searchEnabled={false} title="Dashboard">
  {#snippet content()}
  <div class="flex flex-col min-w-full h-full bg-[var(--pd-content-bg)] py-5">
    <div class="min-w-full flex-1">
      <NotificationsBox />
      <div class="px-5 space-y-5 h-full">
        {#each dashboardPageRegistry.entries as dashboardRegistryItem (dashboardRegistryItem.id)}
          <dashboardRegistryItem.component />
        {/each}
      </div>
    </div>
  </div>
  {/snippet}
</NavPage>
