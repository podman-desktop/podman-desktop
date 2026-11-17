<script lang="ts">
import type { V1JobSpec } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';
import { capitalize } from '/@/lib/ui/Util';

interface Props {
  artifact?: V1JobSpec;
}

let { artifact }: Props = $props();
</script>

  {#if artifact}
    <tr>
      <Title>{t('workloads.details') ?? 'Details'}</Title>
    </tr>
    {#if artifact.parallelism !== undefined}
      <tr>
        <Cell>{t('workloads.parallelism') ?? 'Parallelism'}</Cell>
        <Cell>{artifact.parallelism}</Cell>
      </tr>
    {/if}
    {#if artifact.completions !== undefined}
      <tr>
        <Cell>{t('workloads.completions') ?? 'Completions'}</Cell>
        <Cell>{artifact.completions}</Cell>
      </tr>
    {/if}
    {#if artifact.backoffLimit !== undefined}
      <tr>
        <Cell>{t('workloads.backoffLimit') ?? 'Backoff Limit'}</Cell>
        <Cell>{artifact.backoffLimit}</Cell>
      </tr>
    {/if}
    {#if artifact.activeDeadlineSeconds !== undefined}
      <tr>
        <Cell>{t('workloads.activeDeadlineSeconds') ?? 'Active Deadline Seconds'}</Cell>
        <Cell>{artifact.activeDeadlineSeconds}</Cell>
      </tr>
    {/if}
    {#if artifact.ttlSecondsAfterFinished !== undefined}
      <tr>
        <Cell>{t('workloads.ttlSecondsAfterFinished') ?? 'TTL Seconds After Finished'}</Cell>
        <Cell>{artifact.ttlSecondsAfterFinished}</Cell>
      </tr>
    {/if}
    {#if artifact.suspend !== undefined}
      <tr>
        <Cell>{t('workloads.suspend') ?? 'Suspend'}</Cell>
        <Cell>{capitalize(artifact.suspend.toString())}</Cell>
      </tr>
    {/if}
  {/if}
