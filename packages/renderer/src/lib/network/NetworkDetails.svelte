<script lang="ts">
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { networksListInfo } from '/@/stores/networks';

import Route from '../../Route.svelte';
import VolumeIcon from '../images/VolumeIcon.svelte';
import DetailsPage from '../ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '../ui/Util';
import NetworkActions from './columns/NetworkActions.svelte';
import { NetworkUtils } from './network-utils';
import NetworkDetailsInspect from './NetworkDetailsInspect.svelte';
import NetworkDetailsSummary from './NetworkDetailsSummary.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  networkName: string;
  engineId: string;
}

let { networkName, engineId }: Props = $props();

let network: NetworkInfoUI | undefined = $state();
let detailsPage: DetailsPage | undefined = $state();

const networkUtils = new NetworkUtils();

let matchingNetwork = $derived(
  $networksListInfo.find(network => network.Name === networkName && network.engineId === engineId),
);

$effect(() => {
  if (matchingNetwork) {
    network = networkUtils.toNetworkInfoUI(matchingNetwork);
  } else if (detailsPage) {
    detailsPage.close();
  }
});
</script>

{#if network}
  <DetailsPage title={network.name} subtitle={network.shortId} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={VolumeIcon} size={24} status={network?.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      {#if network}
        <NetworkActions network={network} detailed={true} />
      {/if}
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
    {/snippet}
    {#snippet contentSnippet()}
      {#if network}
        <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
          <NetworkDetailsSummary network={network} />
        </Route>
        <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
         <NetworkDetailsInspect network={network} />
        </Route>
      {/if}
    {/snippet}
  </DetailsPage>
{/if}
