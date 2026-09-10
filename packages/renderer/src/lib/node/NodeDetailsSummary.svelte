<script lang="ts">
import type { V1Node } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';
import type { EventUI } from '/@/lib/events/EventUI';
import KubeEventsArtifact from '/@/lib/kube/details/KubeEventsArtifact.svelte';
import KubeNodeArtifact from '/@/lib/kube/details/KubeNodeArtifact.svelte';
import KubeNodeStatusArtifact from '/@/lib/kube/details/KubeNodeStatusArtifact.svelte';
import KubeObjectMetaArtifact from '/@/lib/kube/details/KubeObjectMetaArtifact.svelte';

interface Props {
  node?: V1Node;
  kubeError?: string;
  events: EventUI[];
}

let { node, kubeError, events }: Props = $props();
</script>

<!-- Show the kube error if we're unable to retrieve the data correctly, but we still want to show the
basic information -->
{#if kubeError}
  <ErrorMessage error={kubeError} />
{/if}

<Table>
  {#if node}
    <KubeObjectMetaArtifact artifact={node.metadata} />
    <KubeNodeStatusArtifact artifact={node.status} />
    <KubeNodeArtifact artifact={node.spec} />
    <KubeEventsArtifact events={events} />
  {:else}
    <p class="text-[var(--pd-state-info)] font-medium">Loading...</p>
  {/if}
</Table>
