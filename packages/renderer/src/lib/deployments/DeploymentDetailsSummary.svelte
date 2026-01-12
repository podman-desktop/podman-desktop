<script lang="ts">
import type { V1Deployment } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';
import type { EventUI } from '/@/lib/events/EventUI';
import KubeDeploymentArtifact from '/@/lib/kube/details/KubeDeploymentArtifact.svelte';
import KubeDeploymentStatusArtifact from '/@/lib/kube/details/KubeDeploymentStatusArtifact.svelte';
import KubeEventsArtifact from '/@/lib/kube/details/KubeEventsArtifact.svelte';
import KubeObjectMetaArtifact from '/@/lib/kube/details/KubeObjectMetaArtifact.svelte';

interface Props {
  deployment: V1Deployment | undefined;
  kubeError?: string;
  events: EventUI[];
}

let { deployment, kubeError = undefined, events }: Props = $props();
</script>

<!-- Show the kube error if we're unable to retrieve the data correctly, but we still want to show the
basic information -->
{#if kubeError}
  <ErrorMessage error={kubeError} />
{/if}

<Table>
  {#if deployment}
    <KubeObjectMetaArtifact artifact={deployment.metadata} />
    <KubeDeploymentStatusArtifact artifact={deployment.status} />
    <KubeDeploymentArtifact deploymentName={deployment.metadata?.name} namespace={deployment.metadata?.namespace} artifact={deployment.spec} />
    <KubeEventsArtifact events={events} />
  {:else}
    <p class="text-[var(--pd-state-info)] font-medium">Loading ...</p>
  {/if}
</Table>
