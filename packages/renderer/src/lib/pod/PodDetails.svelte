<script lang="ts">
import { ErrorMessage, StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import type { PodInfo } from '/@api/pod-info';

import Route from '../../Route.svelte';
import { podsInfos } from '../../stores/pods';
import PodIcon from '../images/PodIcon.svelte';
import DetailsPage from '../ui/DetailsPage.svelte';
import StateChange from '../ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '../ui/Util';
import { PodUtils } from './pod-utils';
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

const podUtils = new PodUtils();
let detailsPage: DetailsPage | undefined = $state();

let podInfo: PodInfo | undefined = $derived(
  $podsInfos.find(podInPods => podInPods.Name === podName && podInPods.engineId === engineId),
);

// Use $state instead of $derived to allow PodActions to mutate properties for immediate UI updates
let pod = $state<PodInfoUI | undefined>(undefined);
// Track the last podInfo to detect changes
let lastPodInfo: PodInfo | undefined = $state(undefined);

// Update pod whenever podInfo changes from the store
$effect(() => {
  if (podInfo) {
    // Only update if podInfo actually changed to avoid overwriting transient state
    if (
      !lastPodInfo ||
      lastPodInfo.Id !== podInfo.Id ||
      lastPodInfo.Status !== podInfo.Status ||
      lastPodInfo.Created !== podInfo.Created
    ) {
      const newPod = podUtils.getPodInfoUI(podInfo);
      // Preserve transient UI state (loading indicators, error messages) during store updates
      if (pod && pod.id === newPod.id) {
        newPod.actionInProgress = pod.actionInProgress;
        newPod.actionError = pod.actionError;
        // If the actual status changed in the store, update it and clear transient state
        if (pod.status !== newPod.status) {
          newPod.actionInProgress = false;
        }
      }
      pod = newPod;
      lastPodInfo = podInfo;
    }
  } else if (pod) {
    // Pod was deleted from store
    detailsPage?.close();
    pod = undefined;
    lastPodInfo = undefined;
  }
});

$effect(() => {
  if (podInfo) {
    const currentRouterPath = $router.path;
    if (currentRouterPath.endsWith('/')) {
      router.goto(`${currentRouterPath}logs`);
    }
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
      <PodActions
        pod={currentPod}
        detailed={true}
        onUpdate={(): PodInfoUI => {
          // Mutations are already tracked via $state, just return pod for the callback signature
          return currentPod;
        }} />
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
