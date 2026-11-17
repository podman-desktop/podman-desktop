<script lang="ts">
import type { V1CronJobSpec } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';
import { capitalize } from '/@/lib/ui/Util';

interface Props {
  artifact?: V1CronJobSpec;
}

let { artifact }: Props = $props();
</script>
  
  {#if artifact}
    <tr>
      <Title>{t('workloads.details') ?? 'Details'}</Title>
    </tr>
    {#if artifact.schedule}
      <tr>
        <Cell>{t('workloads.schedule') ?? 'Schedule'}</Cell>
        <Cell>{artifact.schedule}</Cell>
      </tr>
    {/if}
    {#if artifact.concurrencyPolicy}
      <tr>
        <Cell>{t('workloads.concurrencyPolicy') ?? 'Concurrency Policy'}</Cell>
        <Cell>{artifact.concurrencyPolicy}</Cell>
      </tr>
    {/if}
    {#if artifact.failedJobsHistoryLimit !== undefined}
      <tr>
        <Cell>{t('workloads.failedJobsHistoryLimit') ?? 'Failed Jobs History Limit'}</Cell>
        <Cell>{artifact.failedJobsHistoryLimit}</Cell>
      </tr>
    {/if}
    {#if artifact.successfulJobsHistoryLimit !== undefined}
      <tr>
        <Cell>{t('workloads.successfulJobsHistoryLimit') ?? 'Successful Jobs History Limit'}</Cell>
        <Cell>{artifact.successfulJobsHistoryLimit}</Cell>
      </tr>
    {/if}
    {#if artifact.startingDeadlineSeconds !== undefined}
      <tr>
        <Cell>{t('workloads.startingDeadlineSeconds') ?? 'Starting Deadline Seconds'}</Cell>
        <Cell>{artifact.startingDeadlineSeconds}</Cell>
      </tr>
    {/if}
    {#if artifact.suspend !== undefined}
      <tr>
        <Cell>{t('workloads.suspend') ?? 'Suspend'}</Cell>
        <Cell>{capitalize(artifact.suspend.toString())}</Cell>
      </tr>
    {/if}
    {#if artifact.timeZone}
      <tr>
        <Cell>{t('workloads.timeZone') ?? 'Time Zone'}</Cell>
        <Cell>{artifact.timeZone}</Cell>
      </tr>
    {/if}
  {/if}
