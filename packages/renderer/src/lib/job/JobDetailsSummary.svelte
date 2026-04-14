<script lang="ts">
import type { V1Job } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';
import KubeJobArtifact from '/@/lib/kube/details/KubeJobArtifact.svelte';
import KubeJobStatusArtifact from '/@/lib/kube/details/KubeJobStatusArtifact.svelte';
import KubeObjectMetaArtifact from '/@/lib/kube/details/KubeObjectMetaArtifact.svelte';

interface Props {
  job?: V1Job;
  kubeError?: string;
}

let { job, kubeError }: Props = $props();
</script>

<!-- Show the kube error if we're unable to retrieve the data correctly, but we still want to show the
basic information -->
{#if kubeError}
  <ErrorMessage error={kubeError} />
{/if}

<Table>
  {#if job}
    <KubeObjectMetaArtifact artifact={job.metadata} />
    <KubeJobStatusArtifact artifact={job.status} />
    <KubeJobArtifact artifact={job.spec} />
  {:else}
    <p class="text-[var(--pd-state-info)] font-medium">Loading ...</p>
  {/if}
</Table>
