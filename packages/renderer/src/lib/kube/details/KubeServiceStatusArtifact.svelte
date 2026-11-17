<script lang="ts">
import type { V1ServiceStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  artifact?: V1ServiceStatus;
}

let { artifact }: Props = $props();
</script>

<!-- This artifact is a bit weird as it only contains one object
    so do not bother showing unless we have both loadBalancer AND loadBalancer.ingress -->
{#if artifact?.loadBalancer?.ingress}
  <tr>
    <Title>{t('workloads.status') ?? 'Status'}</Title>
  </tr>
  <tr>
    <Cell>{t('workloads.loadBalancer') ?? 'Load Balancer'}</Cell>
    <Cell>
      {#each artifact.loadBalancer?.ingress as ingress, index (index)}
        <div>{ingress.ip ?? ingress.hostname}</div>
      {/each}
    </Cell>
  </tr>
{/if}
