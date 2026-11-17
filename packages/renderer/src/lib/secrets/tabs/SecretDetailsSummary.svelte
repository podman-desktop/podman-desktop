<script lang="ts">
import type { SecretInfo } from '@desktop-framework/api';

import DetailsCell from '/@/lib/details/DetailsCell.svelte';
import DetailsTable from '/@/lib/details/DetailsTable.svelte';
import DetailsTitle from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  secret: SecretInfo;
}

let { secret }: Props = $props();
let labels = $derived(secret?.Labels ? Object.entries(secret.Labels) : []);
</script>

<DetailsTable>
  <tr>
    <DetailsTitle>{t('kubernetes.resources.details') ?? 'Details'}</DetailsTitle>
  </tr>
  <tr>
    <DetailsCell>{t('kubernetes.resources.name') ?? 'Name'}</DetailsCell>
    <DetailsCell>{secret.Name}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>ID</DetailsCell>
    <DetailsCell>{secret.Id}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('kubernetes.resources.created') ?? 'Created'}</DetailsCell>
    <DetailsCell>{secret.CreatedAt ?? 'N/A'}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('kubernetes.resources.updated') ?? 'Updated'}</DetailsCell>
    <DetailsCell>{secret.UpdatedAt ?? 'N/A'}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('kubernetes.resources.engineName') ?? 'Engine Name'}</DetailsCell>
    <DetailsCell>{secret.engineName}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('kubernetes.resources.engineId') ?? 'Engine ID'}</DetailsCell>
    <DetailsCell>{secret.engineId}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('kubernetes.resources.engineType') ?? 'Engine Type'}</DetailsCell>
    <DetailsCell>{secret.engineType}</DetailsCell>
  </tr>
  <tr>
    <DetailsTitle>{t('kubernetes.resources.labels') ?? 'Labels'}</DetailsTitle>
  </tr>
  {#if labels.length === 0}
    <tr>
      <DetailsCell>{t('kubernetes.resources.noLabels') ?? 'No labels'}</DetailsCell>
    </tr>
  {:else}
    {#each labels as [key, value] (key)}
      <tr>
        <DetailsCell>{key}</DetailsCell>
        <DetailsCell>{value}</DetailsCell>
      </tr>
    {/each}
  {/if}
</DetailsTable>
