<script lang="ts">
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import NetworkIcon from '/@/lib/images/NetworkIcon.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import Route from '/@/Route.svelte';
import { networksListInfo } from '/@/stores/networks';

import { NetworkUtils } from './network-utils';
import NetworkActions from './NetworkActions.svelte';
import NetworkDetailsInspect from './NetworkDetailsInspect.svelte';
import NetworkDetailsSummary from './NetworkDetailsSummary.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  networkName: string;
  engineId: string;
}

let { networkName, engineId }: Props = $props();

const networkUtils = new NetworkUtils();

let matchingNetwork = $derived(
  $networksListInfo.find(network => network.Name === networkName && network.engineId === engineId),
);

let network: NetworkInfoUI | undefined = $derived(
  matchingNetwork ? networkUtils.toNetworkInfoUI(matchingNetwork) : undefined,
);
let detailsPage: DetailsPage | undefined = $state();

$effect(() => {
  if (!network && detailsPage) {
    detailsPage.close();
  }
});
</script>

{#if network}
  <DetailsPage title={network.name} subtitle={network.shortId} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={NetworkIcon} size={24} status={network?.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      <NetworkActions object={network} detailed={true} />
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <NetworkDetailsSummary network={network} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <NetworkDetailsInspect network={network} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
