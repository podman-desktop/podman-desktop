<script lang="ts">
import type { V1Pod } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';

import KubeObjectMetaArtifact from '../details/KubeObjectMetaArtifact.svelte';
import KubePodSpecArtifact from '../details/KubePodSpecArtifact.svelte';
import KubePodStatusArtifact from '../details/KubePodStatusArtifact.svelte';

interface Props {
  pod: V1Pod | undefined;
  kubeError: string | undefined;
}
let { pod, kubeError = undefined }: Props = $props();
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
    <KubePodSpecArtifact artifact={pod.spec} />
  {:else}
    <p class="text-[var(--pd-state-info)] font-medium">Loading ...</p>
  {/if}
</Table>
