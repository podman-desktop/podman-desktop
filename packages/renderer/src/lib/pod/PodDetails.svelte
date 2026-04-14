<script lang="ts">
import { ErrorMessage, StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import PodIcon from '/@/lib/images/PodIcon.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import StateChange from '/@/lib/ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import Route from '/@/Route.svelte';
import { podsInfos } from '/@/stores/pods';

import { PodUtils } from './pod-utils';
import PodActions from './PodActions.svelte';
import PodDetailsInspect from './PodDetailsInspect.svelte';
import PodDetailsKube from './PodDetailsKube.svelte';
import PodDetailsLogs from './PodDetailsLogs.svelte';
import type { PodInfoUI } from './PodInfoUI';
import PodmanPodDetailsSummary from './PodmanPodDetailsSummary.svelte';

export let podName: string;
export let engineId: string;

let pod: PodInfoUI;
let detailsPage: DetailsPage;

// update current route scheme
let currentRouterPath: string;

onMount(() => {
  const podUtils = new PodUtils();

  router.subscribe(route => {
    currentRouterPath = route.path;
  });

  // loading pod info
  return podsInfos.subscribe(pods => {
    const matchingPod = pods.find(podInPods => podInPods.Name === podName && podInPods.engineId === engineId);
    if (matchingPod) {
      try {
        pod = podUtils.getPodInfoUI(matchingPod);

        if (currentRouterPath.endsWith('/')) {
          router.goto(`${currentRouterPath}logs`);
        }
      } catch (err) {
        console.error(err);
      }
    } else if (detailsPage) {
      // the pod has been deleted
      detailsPage.close();
    }
  });
});
</script>

{#if pod}
  <DetailsPage title={pod.name} subtitle={pod.shortId} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={PodIcon} size={24} status={pod.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      <div class="flex items-center w-5">
        {#if pod.actionError}
          <ErrorMessage error={pod.actionError} icon wrapMessage />
        {:else}
          <div>&nbsp;</div>
        {/if}
      </div>
      <PodActions pod={pod} detailed={true} on:update={(): PodInfoUI => {
        pod = pod; // Keep this assignment for svelte 4 - can be safely removed when migrating to svelte 5
        return pod;
      }} />
    {/snippet}
    {#snippet detailSnippet()}
      <div class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
        <StateChange state={pod.status} />
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
        <PodmanPodDetailsSummary pod={pod} />
      </Route>
      <Route path="/logs" breadcrumb="Logs" navigationHint="tab">
        <PodDetailsLogs pod={pod} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <PodDetailsInspect pod={pod} />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <PodDetailsKube pod={pod} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
