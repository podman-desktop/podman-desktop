<script lang="ts">
import type { V1PersistentVolumeClaimStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  artifact?: V1PersistentVolumeClaimStatus;
}

let { artifact }: Props = $props();
</script>

{#if artifact}
  <tr>
    <Title>{t('workloads.status') ?? 'Status'}</Title>
  </tr>
  {#if artifact.phase}
    <tr>
      <Cell>{t('workloads.phase') ?? 'Phase'}</Cell>
      <Cell>{artifact.phase}</Cell>
    </tr>
  {/if}
  {#if artifact.accessModes}
    <tr>
      <Cell>{t('workloads.accessModes') ?? 'Access Modes'}</Cell>
      <Cell>
        {#each artifact.accessModes as mode, index (index)}
          <div>{mode}</div>
        {/each}
      </Cell>
    </tr>
  {/if}
  {#if artifact.capacity}
    <tr>
      <Cell>{t('workloads.capacity') ?? 'Capacity'}</Cell>
      <Cell>
        <table>
          <tbody>
            {#each Object.entries(artifact.capacity) as [resource, quantity] (resource)}
              <tr>
                <Cell>{resource}: {quantity}</Cell>
              </tr>
            {/each}
          </tbody>
        </table>
      </Cell>
    </tr>
  {/if}
  {#if artifact.conditions}
    <tr>
      <Title>{t('workloads.conditions') ?? 'Conditions'}</Title>
      <Cell>
        <table>
          <tbody>
            {#each artifact.conditions as condition, index (index)}
              <tr>
                <Cell>Type: {condition.type}</Cell>
                <Cell
                  >Status: {condition.status}, LastProbeTime: {condition.lastProbeTime ?? 'N/A'}, LastTransitionTime: {condition.lastTransitionTime ?? 'N/A'}</Cell>
              </tr>
            {/each}
          </tbody>
        </table>
      </Cell>
    </tr>
  {/if}
{/if}
