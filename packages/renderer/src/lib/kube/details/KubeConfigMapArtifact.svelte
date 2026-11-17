<script lang="ts">
import type { V1ConfigMap } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Subtitle from '/@/lib/details/DetailsSubtitle.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  artifact?: V1ConfigMap;
}

let { artifact }: Props = $props();
</script>

{#if artifact}
  <tr>
    <Title>{t('workloads.details') ?? 'Details'}</Title>
  </tr>
  <tr>
    <Cell>{t('workloads.immutable') ?? 'Immutable'}</Cell>
    <Cell>{artifact.immutable ? 'Yes' : 'No'}</Cell>
  </tr>
  {#if artifact.binaryData}
    <tr>
      <Cell>{t('workloads.binaryData') ?? 'Binary Data'}</Cell>
      <Cell>
        {#each Object.entries(artifact.binaryData) as [key, value] (key)}
          <div>{key}: {value.length} bytes</div>
        {/each}
      </Cell>
    </tr>
  {/if}
  {#if artifact.data}
    <tr>
      <Subtitle>{t('workloads.data') ?? 'Data'}</Subtitle>
    </tr>
    {#each Object.entries(artifact.data) as [key, value] (key)}
      <tr>
        <Cell>{key}</Cell>
        <Cell>{value}</Cell>
      </tr>
    {/each}
  {/if}
{/if}
