<script lang="ts">
import { ErrorMessage, StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import PodIcon from '/@/lib/images/PodIcon.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import StateChange from '/@/lib/ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import Route from '/@/Route.svelte';
import { replaceCurrentUrl } from '/@/stores/navigation-history.svelte';
import { podsInfos } from '/@/stores/pods';

import PodActions from './PodActions.svelte';
import PodDetailsInspect from './PodDetailsInspect.svelte';
import PodDetailsKube from './PodDetailsKube.svelte';
import PodDetailsLogs from './PodDetailsLogs.svelte';
import type { PodInfoUI } from './PodInfoUI';
import PodmanPodDetailsSummary from './PodmanPodDetailsSummary.svelte';

interface Props {
  podName: string;
  engineId: string;
}
let { podName, engineId }: Props = $props();

let pod = $state<PodInfoUI>();
let detailsPage = $state<DetailsPage>();

// update current route scheme
let currentRouterPath = $derived<string>($router.path);

let matchingPod = $derived<PodInfoUI | undefined>(
  $podsInfos.find(podInPods => podInPods.name === podName && podInPods.engineId === engineId),
);

$effect(() => {
  if (matchingPod) {
    try {
      pod = matchingPod;

      if (currentRouterPath.endsWith('/')) {
        replaceCurrentUrl(`${currentRouterPath}logs`);
      }
    } catch (err) {
      console.error(err);
    }
  } else if (detailsPage) {
    // the pod has been deleted
    detailsPage.close();
  }
});
</script>

{#if pod}
  {@const currentPod = pod}
  <DetailsPage title={currentPod.name} subtitle={currentPod.shortId} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={PodIcon} size={24} status={currentPod.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      <div class="flex items-center w-5">
        {#if currentPod.actionError}
          <ErrorMessage error={currentPod.actionError} icon wrapMessage />
        {:else}
          <div>&nbsp;</div>
        {/if}
      </div>
      <PodActions pod={currentPod} detailed={true} />
    {/snippet}
    {#snippet detailSnippet()}
      <div class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
        <StateChange state={currentPod.status} />
      </div>
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Logs" selected={isTabSelected($router.path, 'logs')} url={getTabUrl($router.path, 'logs')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
      <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <PodmanPodDetailsSummary pod={currentPod} />
      </Route>
      <Route path="/logs" breadcrumb="Logs" navigationHint="tab">
        <PodDetailsLogs pod={currentPod} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <PodDetailsInspect pod={currentPod} />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <PodDetailsKube pod={currentPod} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
