<script lang="ts">
import type { KubernetesObject, V1CronJob } from '@kubernetes/client-node';
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import { router } from 'tinro';
import { stringify } from 'yaml';

import { listenResource } from '/@/lib/kube/resource-listen';
import { kubernetesCurrentContextCronJobs } from '/@/stores/kubernetes-contexts-state';
import type { IDisposable } from '/@api/disposable';

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
let detailsPage = $state<DetailsPage<CronJobUI> | undefined>();
let kubeCronJob = $state<V1CronJob | undefined>();
let kubeError = $state<string | undefined>();

let listener: IDisposable | undefined;

onMount(async () => {
  const cronjobUtils = new CronJobUtils();
  listener = await listenResource({
    resourceName: 'cronjobs',
    name,
    namespace,
    listenEvents: false,
    legacyResourceStore: kubernetesCurrentContextCronJobs,
    onResourceNotFound: () => {
      if (detailsPage) {
        // the cronjob has been deleted
        detailsPage.close();
      }
    },
    onResourceUpdated: (resource: KubernetesObject, isExperimental: boolean) => {
      cronjob = cronjobUtils.getCronJobUI(resource);
      if (isExperimental) {
        kubeCronJob = resource;
      } else {
        loadDetails().catch((err: unknown) => console.error(`Error getting CronJob details ${name}`, err));
      }
    },
  });
});

onDestroy(() => {
  listener?.dispose();
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
  <DetailsPage title={cronjob.name} subtitle={cronjob.namespace} bind:this={detailsPage} snippetsData={cronjob}>
    {#snippet iconSnippet(sCronjob)}
      <StatusIcon icon={CronJobIcon} size={24} status={sCronjob.status} />
    {/snippet}
    {#snippet actionsSnippet(sCronjob)}
      <CronJobActions cronjob={sCronjob} detailed={true} />
    {/snippet}
    {#snippet detailSnippet(sCronjob)}
      <div class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
        <StateChange state={sCronjob.status} />
      </div>
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
      <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <CronJobDetailsSummary cronjob={kubeCronJob} kubeError={kubeError} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <MonacoEditor content={JSON.stringify(kubeCronJob, undefined, 2)} language="json" />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <KubeEditYAML content={stringify(kubeCronJob)} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
