<script lang="ts">
import type { V1CronJobSpec } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { capitalize } from '/@/lib/ui/Util';

interface Props {
  artifact?: V1CronJobSpec;
}

let { artifact }: Props = $props();
</script>
  
  {#if artifact}
    <tr>
      <Title>Details</Title>
    </tr>
    {#if artifact.schedule}
      <tr>
        <Cell>Schedule</Cell>
        <Cell>{artifact.schedule}</Cell>
      </tr>
    {/if}
    {#if artifact.concurrencyPolicy}
      <tr>
        <Cell>Concurrency Policy</Cell>
        <Cell>{artifact.concurrencyPolicy}</Cell>
      </tr>
    {/if}
    {#if artifact.failedJobsHistoryLimit !== undefined}
      <tr>
        <Cell>Failed Jobs History Limit</Cell>
        <Cell>{artifact.failedJobsHistoryLimit}</Cell>
      </tr>
    {/if}
    {#if artifact.successfulJobsHistoryLimit !== undefined}
      <tr>
        <Cell>Successful Jobs History Limit</Cell>
        <Cell>{artifact.successfulJobsHistoryLimit}</Cell>
      </tr>
    {/if}
    {#if artifact.startingDeadlineSeconds !== undefined}
      <tr>
        <Cell>Starting Deadline Seconds</Cell>
        <Cell>{artifact.startingDeadlineSeconds}</Cell>
      </tr>
    {/if}
    {#if artifact.suspend !== undefined}
      <tr>
        <Cell>Suspend</Cell>
        <Cell>{capitalize(artifact.suspend.toString())}</Cell>
      </tr>
    {/if}
    {#if artifact.timeZone}
      <tr>
        <Cell>Time Zone</Cell>
        <Cell>{artifact.timeZone}</Cell>
      </tr>
    {/if}
  {/if}
