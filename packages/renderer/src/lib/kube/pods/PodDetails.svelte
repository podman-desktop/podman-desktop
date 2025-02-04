<script lang="ts">
import type { V1Pod } from '@kubernetes/client-node';
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';
import { stringify } from 'yaml';

import { kubernetesCurrentContextPods } from '/@/stores/kubernetes-contexts-state';

import Route from '../../../Route.svelte';
import MonacoEditor from '../../editor/MonacoEditor.svelte';
import PodIcon from '../../images/PodIcon.svelte';
import DetailsPage from '../../ui/DetailsPage.svelte';
import StateChange from '../../ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '../../ui/Util';
import KubeEditYaml from '../KubeEditYAML.svelte';
import KubernetesTerminalBrowser from './KubernetesTerminalBrowser.svelte';
import { PodUtils } from './pod-utils';
import PodActions from './PodActions.svelte';
import PodDetailsLogs from './PodDetailsLogs.svelte';
import PodDetailsSummary from './PodDetailsSummary.svelte';
import type { PodUI } from './PodUI';

interface Props {
  name: string;
  namespace: string;
}
let { name, namespace }: Props = $props();

let pod = $state<PodUI | undefined>();
let detailsPage = $state<DetailsPage | undefined>();
let kubePod = $state<V1Pod | undefined>();
let kubeError = $state<string | undefined>();

onMount(() => {
  const podUtils = new PodUtils();
  // loading pod info
  return kubernetesCurrentContextPods.subscribe(pods => {
    const matchingPod = pods.find(pod => pod.metadata?.name === name && pod.metadata?.namespace === namespace);
    if (matchingPod) {
      try {
        pod = podUtils.getPodUI(matchingPod);
        loadDetails().catch((err: unknown) => console.error(`Error getting pod details ${pod?.name}`, err));
      } catch (err) {
        console.error(err);
      }
    } else if (detailsPage) {
      // the pod has been deleted
      detailsPage?.close();
    }
  });
});

async function loadDetails(): Promise<void> {
  const getKubePod = await window.kubernetesReadNamespacedPod(name, namespace);
  if (getKubePod) {
    kubePod = getKubePod;
  } else {
    kubeError = `Unable to retrieve Kubernetes details for ${pod?.name}`;
  }
}
</script>

{#if pod}
  <DetailsPage title={pod.name} subtitle={pod.namespace} bind:this={detailsPage}>
    <StatusIcon slot="icon" icon={PodIcon} size={24} status={pod.status} />
    <svelte:fragment slot="actions">
      <PodActions pod={pod} detailed={true} />
    </svelte:fragment>
    <div slot="detail" class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
      <StateChange state={pod.status} />
    </div>
    <svelte:fragment slot="tabs">
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Logs" selected={isTabSelected($router.path, 'logs')} url={getTabUrl($router.path, 'logs')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
      <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
      <Tab
          title="Terminal"
          selected={isTabSelected($router.path, 'k8s-terminal')}
          url={getTabUrl($router.path, 'k8s-terminal')} />
    </svelte:fragment>
    <svelte:fragment slot="content">
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <PodDetailsSummary pod={kubePod} kubeError={kubeError} />
      </Route>
      <Route path="/logs" breadcrumb="Logs" navigationHint="tab">
        <PodDetailsLogs pod={pod} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <MonacoEditor content={JSON.stringify(kubePod, undefined, 2)} language="json" />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <KubeEditYaml content={stringify(kubePod)} />
      </Route>
      <Route path="/k8s-terminal" breadcrumb="Terminal" navigationHint="tab">
        <KubernetesTerminalBrowser pod={pod} />
      </Route>
    </svelte:fragment>
  </DetailsPage>
{/if}
