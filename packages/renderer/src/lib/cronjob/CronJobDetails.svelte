<script lang="ts">
import type { V1CronJob } from '@kubernetes/client-node';
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';
import { stringify } from 'yaml';

import { kubernetesCurrentContextCronJobs } from '/@/stores/kubernetes-contexts-state';

import Route from '../../Route.svelte';
import MonacoEditor from '../editor/MonacoEditor.svelte';
import CronJobIcon from '../images/CronJobIcon.svelte';
import KubeEditYAML from '../kube/KubeEditYAML.svelte';
import DetailsPage from '../ui/DetailsPage.svelte';
import StateChange from '../ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '../ui/Util';
import { CronJobUtils } from './cronjob-utils';
import CronJobActions from './CronJobActions.svelte';
import CronJobDetailsSummary from './CronJobDetailsSummary.svelte';
import type { CronJobUI } from './CronJobUI';

interface Props {
  name: string;
  namespace: string;
}
let { name, namespace }: Props = $props();

let cronjob = $state<CronJobUI | undefined>();
let detailsPage = $state<DetailsPage | undefined>();
let kubeCronJob = $state<V1CronJob | undefined>();
let kubeError = $state<string | undefined>();

onMount(() => {
  const cronjobUtils = new CronJobUtils();
  // loading cronjob info
  return kubernetesCurrentContextCronJobs.subscribe(cronjobs => {
    const matchingCronJob = cronjobs.find(
      cronjob => cronjob.metadata?.name === name && cronjob.metadata?.namespace === namespace,
    );
    if (matchingCronJob) {
      cronjob = cronjobUtils.getCronJobUI(matchingCronJob);
      loadDetails().catch((err: unknown) => console.error(`Error getting CronJob details ${cronjob?.name}`, err));
    } else if (detailsPage) {
      // the cronjob has been deleted
      detailsPage.close();
    }
  });
});

async function loadDetails(): Promise<void> {
  const getKubeCronJob = await window.kubernetesReadNamespacedCronJob(name, namespace);
  if (getKubeCronJob) {
    kubeCronJob = getKubeCronJob;
  } else {
    kubeError = `Unable to retrieve Kubernetes details for ${name}`;
  }
}
</script>

{#if cronjob}
  <DetailsPage title={cronjob.name} subtitle={cronjob.namespace} bind:this={detailsPage}>
    <StatusIcon slot="icon" icon={CronJobIcon} size={24} status={cronjob.status} />
    <svelte:fragment slot="actions">
      <CronJobActions cronjob={cronjob} detailed={true} />
    </svelte:fragment>
    <div slot="detail" class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
      <StateChange state={cronjob.status} />
    </div>
    <svelte:fragment slot="tabs">
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
      <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
    </svelte:fragment>
    <svelte:fragment slot="content">
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <CronJobDetailsSummary cronjob={kubeCronJob} kubeError={kubeError} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <MonacoEditor content={JSON.stringify(kubeCronJob, undefined, 2)} language="json" />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <KubeEditYAML content={stringify(kubeCronJob)} />
      </Route>
    </svelte:fragment>
  </DetailsPage>
{/if}
