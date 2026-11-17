<script lang="ts">
import type { V1NodeSpec } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  artifact?: V1NodeSpec;
}
let { artifact }: Props = $props();
</script>

{#if artifact}
  <tr>
    <Title>{t('workloads.details') ?? 'Details'}</Title>
  </tr>
  {#if artifact.externalID}
    <tr>
      <Cell>{t('workloads.externalId') ?? 'External ID'}</Cell>
      <Cell>{artifact.externalID}</Cell>
    </tr>
  {/if}
  {#if artifact.podCIDRs}
    <tr>
      <Cell>{t('workloads.podCidrs') ?? 'Pod CIDRs'}</Cell>
      <Cell>
        {#each artifact.podCIDRs as cidr, index (index)}
          <div>{cidr}</div>
        {/each}
      </Cell>
    </tr>
  {/if}
  {#if artifact.providerID}
    <tr>
      <Cell>{t('workloads.providerId') ?? 'Provider ID'}</Cell>
      <Cell>{artifact.providerID}</Cell>
    </tr>
  {/if}
  {#if artifact.taints}
    <tr>
      <Title>{t('workloads.taints') ?? 'Taints'}</Title>
      <Cell>
        <table>
          <tbody>
            {#each artifact.taints as taint, index (index)}
              <tr>
                <Cell>{taint.key}</Cell>
                <Cell>Effect: {taint.effect}, Value: {taint.value ?? 'N/A'}</Cell>
              </tr>
            {/each}
          </tbody>
        </table>
      </Cell>
    </tr>
  {/if}
  <tr>
    <Cell>{t('workloads.unschedulable') ?? 'Unschedulable'}</Cell>
    <Cell>{artifact.unschedulable ? 'Yes' : 'No'}</Cell>
  </tr>
{/if}
