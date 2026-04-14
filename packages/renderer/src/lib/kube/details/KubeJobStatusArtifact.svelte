<script lang="ts">
import type { V1JobStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';

interface Props {
  artifact?: V1JobStatus;
}

let { artifact }: Props = $props();
</script>
  
  {#if artifact && (artifact.active ?? artifact.succeeded ?? artifact.failed ?? artifact.startTime ?? artifact.completionTime)}
    <tr>
      <Title>Status</Title>
    </tr>
    {#if artifact.active !== undefined}
      <tr>
        <Cell>Active Jobs</Cell>
        <Cell>{artifact.active}</Cell>
      </tr>
    {/if}
    {#if artifact.succeeded !== undefined}
      <tr>
        <Cell>Succeeded</Cell>
        <Cell>{artifact.succeeded}</Cell>
      </tr>
    {/if}
    {#if artifact.failed !== undefined}
      <tr>
        <Cell>Failed</Cell>
        <Cell>{artifact.failed}</Cell>
      </tr>
    {/if}
    {#if artifact.startTime}
      <tr>
        <Cell>Start Time</Cell>
        <Cell>{artifact.startTime}</Cell>
      </tr>
    {/if}
    {#if artifact.completionTime}
      <tr>
        <Cell>Completion Time</Cell>
        <Cell>{artifact.completionTime}</Cell>
      </tr>
    {/if}
  {/if}
  