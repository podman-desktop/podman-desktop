<script lang="ts">
import type { V1JobStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  artifact?: V1JobStatus;
}

let { artifact }: Props = $props();
</script>

  {#if artifact && (artifact.active ?? artifact.succeeded ?? artifact.failed ?? artifact.startTime ?? artifact.completionTime)}
    <tr>
      <Title>{t('workloads.status') ?? 'Status'}</Title>
    </tr>
    {#if artifact.active !== undefined}
      <tr>
        <Cell>{t('workloads.activeJobs') ?? 'Active Jobs'}</Cell>
        <Cell>{artifact.active}</Cell>
      </tr>
    {/if}
    {#if artifact.succeeded !== undefined}
      <tr>
        <Cell>{t('workloads.succeeded') ?? 'Succeeded'}</Cell>
        <Cell>{artifact.succeeded}</Cell>
      </tr>
    {/if}
    {#if artifact.failed !== undefined}
      <tr>
        <Cell>{t('workloads.failed') ?? 'Failed'}</Cell>
        <Cell>{artifact.failed}</Cell>
      </tr>
    {/if}
    {#if artifact.startTime}
      <tr>
        <Cell>{t('workloads.startTime') ?? 'Start Time'}</Cell>
        <Cell>{artifact.startTime}</Cell>
      </tr>
    {/if}
    {#if artifact.completionTime}
      <tr>
        <Cell>{t('workloads.completionTime') ?? 'Completion Time'}</Cell>
        <Cell>{artifact.completionTime}</Cell>
      </tr>
    {/if}
  {/if}
