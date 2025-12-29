<script lang="ts">
import type { V1JobSpec } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { capitalize } from '/@/lib/ui/Util';

interface Props {
  artifact?: V1JobSpec;
}

let { artifact }: Props = $props();
</script>
  
  {#if artifact}
    <tr>
      <Title>Details</Title>
    </tr>
    {#if artifact.parallelism !== undefined}
      <tr>
        <Cell>Parallelism</Cell>
        <Cell>{artifact.parallelism}</Cell>
      </tr>
    {/if}
    {#if artifact.completions !== undefined}
      <tr>
        <Cell>Completions</Cell>
        <Cell>{artifact.completions}</Cell>
      </tr>
    {/if}
    {#if artifact.backoffLimit !== undefined}
      <tr>
        <Cell>Backoff Limit</Cell>
        <Cell>{artifact.backoffLimit}</Cell>
      </tr>
    {/if}
    {#if artifact.activeDeadlineSeconds !== undefined}
      <tr>
        <Cell>Active Deadline Seconds</Cell>
        <Cell>{artifact.activeDeadlineSeconds}</Cell>
      </tr>
    {/if}
    {#if artifact.ttlSecondsAfterFinished !== undefined}
      <tr>
        <Cell>TTL Seconds After Finished</Cell>
        <Cell>{artifact.ttlSecondsAfterFinished}</Cell>
      </tr>
    {/if}
    {#if artifact.suspend !== undefined}
      <tr>
        <Cell>Suspend</Cell>
        <Cell>{capitalize(artifact.suspend.toString())}</Cell>
      </tr>
    {/if}
  {/if}
  