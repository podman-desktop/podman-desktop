<script lang="ts">
import type { V1Secret } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Subtitle from '/@/lib/details/DetailsSubtitle.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';

export let artifact: V1Secret | undefined;
</script>

{#if artifact}
  <tr>
    <Title>Details</Title>
  </tr>
  <tr>
    <Cell>Type</Cell>
    <Cell>{artifact.type}</Cell>
  </tr>
  <tr>
    <Cell>Immutable</Cell>
    <Cell>{artifact.immutable ? 'Yes' : 'No'}</Cell>
  </tr>
  {#if artifact.data}
    <tr>
      <Subtitle>Data</Subtitle>
    </tr>
    {#each Object.entries(artifact.data) as [key, value] (key)}
      <tr>
        <Cell>{key}</Cell>
        <Cell>{value}</Cell>
      </tr>
    {/each}
  {/if}
{/if}
