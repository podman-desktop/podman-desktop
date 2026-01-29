<script lang="ts">
import { Page, Tab } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import TroubleShootingIcon from '/@/lib/images/TroubleShootingIcon.svelte';
import { isKubernetesExperimentalMode } from '/@/lib/kube/resources-listen';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import Route from '/@/Route.svelte';
import { lastPage } from '/@/stores/breadcrumb';

import TroubleshootingDevToolsConsoleLogs from './TroubleshootingDevToolsConsoleLogs.svelte';
import TroubleshootingGatherLogs from './TroubleshootingGatherLogs.svelte';
import TroubleshootingPageKubernetes from './TroubleshootingPageKubernetes.svelte';
import TroubleshootingPageProviders from './TroubleshootingPageProviders.svelte';
import TroubleshootingPageStores from './TroubleshootingPageStores.svelte';

let displayKubernetes = $state<boolean>(false);

export function goToPreviousPage(): void {
  router.goto($lastPage.path);
}

onMount(async () => {
  displayKubernetes = await isKubernetesExperimentalMode();
});
</script>

<Page title="Troubleshooting" onclose={goToPreviousPage}>
  {#snippet icon()}
  <TroubleShootingIcon size="32" />
  {/snippet}

  {#snippet tabs()}
  <div class="flex flex-row px-2 border-b border-[var(--pd-content-divider)]">
    <Tab
      title="Repair & Connections"
      selected={isTabSelected($router.path, 'repair-connections')}
      url={getTabUrl($router.path, 'repair-connections')} />
    <Tab title="Logs" selected={isTabSelected($router.path, 'logs')} url={getTabUrl($router.path, 'logs')} />
    <Tab
      title="Gather Logs"
      selected={isTabSelected($router.path, 'gatherlogs')}
      url={getTabUrl($router.path, 'gatherlogs')} />
    <Tab title="Stores" selected={isTabSelected($router.path, 'stores')} url={getTabUrl($router.path, 'stores')} />
    {#if displayKubernetes}
      <Tab title="Kubernetes" selected={isTabSelected($router.path, 'kubernetes')} url={getTabUrl($router.path, 'kubernetes')} />
    {/if}
  </div>
  {/snippet}
  {#snippet content()}
  <div class="flex w-full h-full overflow-auto">
    <Route path="/repair-connections" breadcrumb="Repair & Connections" navigationHint="tab">
      <TroubleshootingPageProviders />
    </Route>

    <Route path="/logs" breadcrumb="Logs" navigationHint="tab">
      <TroubleshootingDevToolsConsoleLogs />
    </Route>

    <Route path="/gatherlogs" breadcrumb="GatherLogs" navigationHint="tab">
      <TroubleshootingGatherLogs />
    </Route>

    <Route path="/stores" breadcrumb="Stores" navigationHint="tab">
      <TroubleshootingPageStores />
    </Route>

    {#if displayKubernetes}
      <Route path="/kubernetes" breadcrumb="Kubernetes" navigationHint="tab">
        <TroubleshootingPageKubernetes />
      </Route>
    {/if}
  </div>
  {/snippet}
</Page>
