<script lang="ts">
import type { V1CronJobStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  artifact?: V1CronJobStatus;
}

let { artifact }: Props = $props();
</script>
  
  {#if artifact && (artifact.lastScheduleTime ?? artifact.lastSuccessfulTime ?? artifact.active)}
    <tr>
      <Title>{t('workloads.status') ?? 'Status'}</Title>
    </tr>
    {#if artifact.lastScheduleTime}
      <tr>
        <Cell>{t('workloads.lastScheduleTime') ?? 'Last Schedule Time'}</Cell>
        <Cell>{artifact.lastScheduleTime}</Cell>
      </tr>
    {/if}
    {#if artifact.lastSuccessfulTime}
      <tr>
        <Cell>{t('workloads.lastSuccessfulTime') ?? 'Last Successful Time'}</Cell>
        <Cell>{artifact.lastSuccessfulTime}</Cell>
      </tr>
    {/if}
    {#if artifact.active}
      <tr>
        <Cell>{t('workloads.activeJobs') ?? 'Active Jobs'}</Cell>
        <Cell>
              {#each artifact.active as job (job.name)}
                  {job.name}
                  <br />
              {/each}
        </Cell>
      </tr>
    {/if}
  {/if}
