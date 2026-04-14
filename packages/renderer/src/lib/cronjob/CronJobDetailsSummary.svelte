<script lang="ts">
import type { V1CronJob } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';
import KubeCronJobArtifact from '/@/lib/kube/details/KubeCronJobArtifact.svelte';
import KubeCronJobStatusArtifact from '/@/lib/kube/details/KubeCronJobStatusArtifact.svelte';
import KubeObjectMetaArtifact from '/@/lib/kube/details/KubeObjectMetaArtifact.svelte';

interface Props {
  cronjob?: V1CronJob;
  kubeError?: string;
}

let { cronjob, kubeError }: Props = $props();
</script>

<!-- Show the kube error if we're unable to retrieve the data correctly, but we still want to show the
basic information -->
{#if kubeError}
  <ErrorMessage error={kubeError} />
{/if}

<Table>
  {#if cronjob}
    <KubeObjectMetaArtifact artifact={cronjob.metadata} />
    <KubeCronJobStatusArtifact artifact={cronjob.status} />
    <KubeCronJobArtifact artifact={cronjob.spec} />
  {:else}
    <p class="text-[var(--pd-state-info)] font-medium">Loading ...</p>
  {/if}
</Table>
