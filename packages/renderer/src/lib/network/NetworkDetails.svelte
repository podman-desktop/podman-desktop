<script lang="ts">
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import Route from '../../Route.svelte';
import VolumeIcon from '../images/VolumeIcon.svelte';
import DetailsPage from '../ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '../ui/Util';
import VolumeDetailsSummary from '././VolumeDetailsSummary.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';
import VolumeDetailsInspect from './VolumeDetailsInspect.svelte';
import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  networkName: string;
  engineId: string;
}

let { networkName, engineId }: Props = $props();

let network: NetworkInfoUI;
let detailsPage: DetailsPage;

const networkUtils = new NetworkUtils();

let matchingNetwork = $derived(
  $networkList.find(network => network.name === networkName && network.engineId === engineId),
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
      <StatusIcon icon={VolumeIcon} size={24} status={network.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      <NetworkActions network={network} detailed={true} on:update={(): VolumeInfoUI => (network = network)} />
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <VolumeDetailsSummary volume={volume} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <VolumeDetailsInspect volume={volume} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
