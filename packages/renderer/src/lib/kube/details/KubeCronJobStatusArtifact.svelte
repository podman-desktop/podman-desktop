<script lang="ts">
import type { V1CronJobStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';

interface Props {
  artifact?: V1CronJobStatus;
}

let { artifact }: Props = $props();
</script>
  
  {#if artifact && (artifact.lastScheduleTime ?? artifact.lastSuccessfulTime ?? artifact.active)}
    <tr>
      <Title>Status</Title>
    </tr>
    {#if artifact.lastScheduleTime}
      <tr>
        <Cell>Last Schedule Time</Cell>
        <Cell>{artifact.lastScheduleTime}</Cell>
      </tr>
    {/if}
    {#if artifact.lastSuccessfulTime}
      <tr>
        <Cell>Last Successful Time</Cell>
        <Cell>{artifact.lastSuccessfulTime}</Cell>
      </tr>
    {/if}
    {#if artifact.active}
      <tr>
        <Cell>Active Jobs</Cell>
        <Cell>
              {#each artifact.active as job}
                  {job.name}
                  <br />
              {/each}
        </Cell>
      </tr>
    {/if}
  {/if}
