<script lang="ts">
import { WorkloadKind } from '@desktop-framework/api';
import type { V1DeploymentSpec } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Subtitle from '/@/lib/details/DetailsSubtitle.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

import Container from './KubeContainerArtifact.svelte';

interface Props {
  artifact?: V1DeploymentSpec;
  deploymentName?: string;
  namespace?: string;
}
let { artifact, deploymentName, namespace }: Props = $props();
</script>

{#if artifact}
  <tr>
    <Title>{t('workloads.details') ?? 'Details'}</Title>
  </tr>
  <tr>
    <Cell>{t('workloads.replicas') ?? 'Replicas'}</Cell>
    <Cell>{artifact.replicas}</Cell>
  </tr>
  {#if artifact.selector.matchLabels}
    <tr>
      <Cell>{t('workloads.selector') ?? 'Selector'}</Cell>
      <Cell>
        {#each Object.entries(artifact.selector.matchLabels) as [key, value] (key)}
          <div>{key}: {value}</div>
        {/each}
      </Cell>
    </tr>
  {/if}
  {#if artifact.strategy}
    <tr>
      <Cell>{t('workloads.strategy') ?? 'Strategy'}</Cell>
      <Cell>{artifact.strategy.type}</Cell>
    </tr>
  {/if}
  {#if artifact.template.spec?.containers}
    <tr>
      <Title>{t('workloads.containers') ?? 'Containers'}</Title>
    </tr>
    {#each artifact.template.spec?.containers as container (container.name)}
      <tr>
        <Subtitle>{container.name}</Subtitle>
      </tr>
      <Container kind={WorkloadKind.DEPLOYMENT} namespace={namespace} resourceName={deploymentName} artifact={container} />
    {/each}
  {/if}

{/if}
