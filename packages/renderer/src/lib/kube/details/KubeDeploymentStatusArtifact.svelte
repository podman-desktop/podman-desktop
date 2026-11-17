<script lang="ts">
import type { V1DeploymentStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

import ConditionsTable from './ConditionsTable.svelte';

interface Props {
  artifact?: V1DeploymentStatus;
}

let { artifact }: Props = $props();
</script>

{#if artifact}
  <tr>
    <Title>{t('workloads.status') ?? 'Status'}</Title>
  </tr>
  <tr>
    <Cell>{t('workloads.replicas') ?? 'Replicas'}</Cell>
    <Cell>
      {t('workloads.desiredLabel') ?? 'Desired:'} {artifact.replicas ?? 'N/A'}, {t('workloads.updatedLabel') ?? 'Updated:'} {artifact.updatedReplicas ?? 'N/A'}, {t('workloads.totalLabel') ?? 'Total:'} {artifact.replicas ??
        'N/A'}, {t('workloads.availableLabel') ?? 'Available:'} {artifact.availableReplicas ?? 'N/A'}, {t('workloads.unavailableLabel') ?? 'Unavailable:'} {artifact.unavailableReplicas ?? 'N/A'}
    </Cell>
  </tr>
  {#if artifact.conditions}
    <tr>
      <Title>{t('workloads.conditions') ?? 'Conditions'}</Title>
    </tr>
    <ConditionsTable conditions={artifact.conditions} />
  {/if}
{/if}
