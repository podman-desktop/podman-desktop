<script lang="ts">
import type { V1PersistentVolumeClaimSpec } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  artifact?: V1PersistentVolumeClaimSpec;
}

let { artifact }: Props = $props();
</script>

{#if artifact}
  <tr>
    <Title>{t('workloads.details') ?? 'Details'}</Title>
  </tr>
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
  {#if artifact.storageClassName}
    <tr>
      <Cell>{t('workloads.storageClassName') ?? 'Storage Class Name'}</Cell>
      <Cell>{artifact.storageClassName}</Cell>
    </tr>
  {/if}
  {#if artifact.volumeMode}
    <tr>
      <Cell>{t('workloads.volumeMode') ?? 'Volume Mode'}</Cell>
      <Cell>{artifact.volumeMode}</Cell>
    </tr>
  {/if}
  {#if artifact.resources?.requests}
    <tr>
      <Cell>{t('workloads.requests') ?? 'Requests'}</Cell>
      {#if artifact.resources.requests}
        <Cell>
          <table>
            <tbody>
              {#each Object.entries(artifact.resources.requests) as [resourceType, quantity] (resourceType)}
                <tr>
                  <Cell>{resourceType}: {quantity}</Cell>
                </tr>
              {/each}
            </tbody>
          </table>
        </Cell>
      {/if}
    </tr>
  {/if}
  {#if artifact.resources?.limits}
    <tr>
      <Cell>{t('workloads.limits') ?? 'Limits'}</Cell>
      <Cell>
        <table>
          <tbody>
            {#each Object.entries(artifact.resources.limits) as [resourceType, quantity] (resourceType)}
              <tr>
                <Cell>{resourceType}: {quantity}</Cell>
              </tr>
            {/each}
          </tbody>
        </table>
      </Cell>
    </tr><tr> </tr>{/if}

  {#if artifact.selector}
    <tr>
      <Title>{t('workloads.selector') ?? 'Selector'}</Title>
      {#if artifact.selector.matchLabels}
        <Cell>
          <table>
            <tbody>
              {#each Object.entries(artifact.selector.matchLabels) as [label, value] (label)}
                <tr>
                  <Cell>Match Label: {label}</Cell>
                  <Cell>{value}</Cell>
                </tr>
              {/each}
            </tbody>
          </table>
        </Cell>
      {/if}
      {#if artifact.selector.matchExpressions}
        <Cell>
          <table>
            <tbody>
              {#each artifact.selector.matchExpressions as expression, index (index)}
                {#if expression.values}
                  <tr>
                    <Cell>Expression: {expression.key} {expression.operator}</Cell>
                    <Cell>{expression.values.join(', ')}</Cell>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </Cell>
      {/if}
    </tr>
  {/if}
{/if}
