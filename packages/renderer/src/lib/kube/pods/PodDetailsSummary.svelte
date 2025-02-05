<script lang="ts">
import type { V1Pod } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';
import { kubernetesCurrentContextEvents } from '/@/stores/kubernetes-contexts-state';

import KubeEventsArtifact from '../details/KubeEventsArtifact.svelte';
import KubeObjectMetaArtifact from '../details/KubeObjectMetaArtifact.svelte';
import KubePodSpecArtifact from '../details/KubePodSpecArtifact.svelte';
import KubePodStatusArtifact from '../details/KubePodStatusArtifact.svelte';

interface Props {
  pod: V1Pod | undefined;
  kubeError?: string;
}
let { pod, kubeError = undefined }: Props = $props();

let events = $derived($kubernetesCurrentContextEvents.filter(ev => ev.involvedObject.uid === pod?.metadata?.uid));
</script>

<!-- Show the kube error if we're unable to retrieve the data correctly, but we still want to show the
basic information -->
{#if kubeError}
  <ErrorMessage error={kubeError} />
{/if}

<Table>
  {#if pod}
    <KubeObjectMetaArtifact artifact={pod.metadata} />
    <KubePodStatusArtifact artifact={pod.status} />
    <KubePodSpecArtifact artifact={pod.spec} podName={pod.metadata?.name} namespace={pod.metadata?.namespace} />
    <KubeEventsArtifact events={events} />
  {:else}
    <p class="text-[var(--pd-state-info)] font-medium">Loading ...</p>
  {/if}
</Table>
