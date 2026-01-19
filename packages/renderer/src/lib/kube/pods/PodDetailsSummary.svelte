<script lang="ts">
import type { V1Pod } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';
import type { EventUI } from '/@/lib/events/EventUI';
import KubeEventsArtifact from '/@/lib/kube/details/KubeEventsArtifact.svelte';
import KubeObjectMetaArtifact from '/@/lib/kube/details/KubeObjectMetaArtifact.svelte';
import KubePodSpecArtifact from '/@/lib/kube/details/KubePodSpecArtifact.svelte';
import KubePodStatusArtifact from '/@/lib/kube/details/KubePodStatusArtifact.svelte';

interface Props {
  pod: V1Pod | undefined;
  events: EventUI[];
  kubeError?: string;
}
let { pod, events, kubeError = undefined }: Props = $props();
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
