<script lang="ts">
import type { KubernetesObject } from '@kubernetes/client-node';
import { Expandable, Link } from '@podman-desktop/ui-svelte';

import KubernetesCurrentContextConnectionBadge from '/@/lib/ui/KubernetesCurrentContextConnectionBadge.svelte';
import { containersInfos } from '/@/stores/containers';
import {
  kubernetesCurrentContextConfigMaps,
  kubernetesCurrentContextCronJobs,
  kubernetesCurrentContextDeployments,
  kubernetesCurrentContextIngresses,
  kubernetesCurrentContextJobs,
  kubernetesCurrentContextNodes,
  kubernetesCurrentContextPersistentVolumeClaims,
  kubernetesCurrentContextPods,
  kubernetesCurrentContextRoutes,
  kubernetesCurrentContextSecrets,
  kubernetesCurrentContextServices,
  kubernetesCurrentContextState,
} from '/@/stores/kubernetes-contexts-state';
import { NO_CURRENT_CONTEXT_ERROR } from '/@api/kubernetes-contexts-states';

import { kubernetesContexts } from '../../stores/kubernetes-contexts';
import deployAndTestKubernetesImage from './DeployAndTestKubernetes.png';
import KubernetesDashboardGuideCard from './KubernetesDashboardGuideCard.svelte';
import KubernetesDashboardResourceCard from './KubernetesDashboardResourceCard.svelte';
import KubernetesEmptyPage from './KubernetesEmptyPage.svelte';
import shareYourLocalProdmanImagesWithTheKubernetesImage from './ShareYourLocalPodmanImagesWithTheKubernetes.png';
import workingWithKubernetesImage from './WorkingWithKubernetes.png';

interface ExtendedKubernetesObject extends KubernetesObject {
  spec: {
    replicas: number;
  };
}

let noContexts = $derived($kubernetesCurrentContextState.error === NO_CURRENT_CONTEXT_ERROR);
let currentContextName = $derived($kubernetesContexts.find(context => context.currentContext)?.name);
let nodeCount = $derived($kubernetesCurrentContextNodes.length);
let activeNodeCount = $derived(
  $containersInfos.filter(
    container =>
      container.State === 'running' &&
      container.Names?.some(name => $kubernetesCurrentContextNodes.some(node => name === `/${node.metadata?.name}`)),
  ).length,
);
let deploymentCount = $derived($kubernetesCurrentContextDeployments.length);
let activeDeploymentsCount = $derived(
  ($kubernetesCurrentContextDeployments as ExtendedKubernetesObject[]).filter(
    deployment => deployment.spec?.replicas > 0,
  ).length,
);
let podCount = $derived($kubernetesCurrentContextPods.length);
let serviceCount = $derived($kubernetesCurrentContextServices.length);
let ingressRouteCount = $derived($kubernetesCurrentContextIngresses.length + $kubernetesCurrentContextRoutes.length);
let pvcCount = $derived($kubernetesCurrentContextPersistentVolumeClaims.length);
let configMapSecretCount = $derived(
  $kubernetesCurrentContextConfigMaps.length + $kubernetesCurrentContextSecrets.length,
);
let cronjobCount = $derived($kubernetesCurrentContextCronJobs.length);
let jobCount = $derived($kubernetesCurrentContextJobs.length);

async function openKubernetesDocumentation(): Promise<void> {
  await window.openExternal('https://podman-desktop.io/docs/kubernetes');
}
</script>

<div class="flex flex-col w-full h-full">
  <div class="flex flex-col w-full h-full pt-4">
    {#if noContexts}
      <KubernetesEmptyPage />
    {:else}
      <!-- Details - collapsible -->
      <div class="flex flex-row w-full px-5 pb-2">
        <Expandable>
          <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
          {#snippet title()}
            <div class="flex flex-row w-full items-center">
              <div class="text-xl font-bold capitalize text-[var(--pd-content-header)]">Dashboard</div>
              <div class="flex grow justify-end"><KubernetesCurrentContextConnectionBadge /></div>
            </div>
          {/snippet}
          <div class="flex flex-col gap-4">
            <div>Here you can manage and interact with Kubernetes clusters with features like connecting to clusters, and
              viewing workloads like deployments and services.</div>
            <div>Get up and running by clicking one of the menu items!</div>
            <div><Link class="place-self-start" on:click={openKubernetesDocumentation}>Kubernetes documentation</Link></div>
          </div>
        </Expandable>
       </div>

      <div class="flex w-full h-full overflow-auto">
        <div class="flex min-w-full h-full justify-center">
          <div class="flex flex-col space-y-4 min-w-full overflow-y-auto">
            <div class="flex flex-col gap-4 bg-[var(--pd-content-card-bg)] grow p-5">
              {#if currentContextName}
                <!-- Metrics - non-collapsible -->
                <div class="text-xl pt-2">Metrics</div>
                <div class="grid grid-cols-4 gap-4">
                    <KubernetesDashboardResourceCard type='Nodes' activeCount={activeNodeCount} count={nodeCount} kind='Node'/>
                    <KubernetesDashboardResourceCard type='Deployments' activeCount={activeDeploymentsCount} count={deploymentCount} kind='Deployment'/>
                    <KubernetesDashboardResourceCard type='Pods' count={podCount} kind='Pod'/>
                    <KubernetesDashboardResourceCard type='Services' count={serviceCount} kind='Service'/>
                    <KubernetesDashboardResourceCard type='Ingresses & Routes' count={ingressRouteCount} kind='Ingress'/>
                    <KubernetesDashboardResourceCard type='Persistent Volume Claims' count={pvcCount} kind='PersistentVolumeClaim'/>
                    <KubernetesDashboardResourceCard type='ConfigMaps & Secrets' count={configMapSecretCount} kind='ConfigMap'/>
                    <KubernetesDashboardResourceCard type='Jobs' count={jobCount} kind='Job'/>
                    <KubernetesDashboardResourceCard type='CronJobs' count={cronjobCount} kind='CronJob'/>
                </div>
                <!-- Graphs -->
                
              {/if}
              <!-- Articles and blog posts - collapsible -->
              <div class="flex flex-1 flex-col pt-2">
                <Expandable>
                  <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
                  {#snippet title()}<div class="text-xl">Explore articles and blog posts</div>{/snippet}
                  <div class="grid grid-cols-3 gap-4">
                    <KubernetesDashboardGuideCard title='Deploy and test Kubernetes containers using Podman Desktop' image={deployAndTestKubernetesImage} link='https://developers.redhat.com/articles/2023/06/09/deploy-and-test-kubernetes-containers-using-podman-desktop'/>
                    <KubernetesDashboardGuideCard title='Working with Kubernetes in Podman Desktop' image={workingWithKubernetesImage} link='https://developers.redhat.com/articles/2023/11/06/working-kubernetes-podman-desktop'/>
                    <KubernetesDashboardGuideCard title='Share your local podman images with the Kubernetes cluster' image={shareYourLocalProdmanImagesWithTheKubernetesImage} link='https://podman-desktop.io/blog/sharing-podman-images-with-kubernetes-cluster'/>
                  </div>
                </Expandable>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
