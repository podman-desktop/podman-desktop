<script lang="ts">
import type { V1Route } from '@desktop-framework/api';
import { Link } from '@podman-desktop/ui-svelte';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

// Assuming V1Route type is imported or defined elsewhere
interface Props {
  artifact?: V1Route;
}

let { artifact }: Props = $props();
</script>

{#if artifact}
  <tr>
    <Title>{t('workloads.details') ?? 'Details'}</Title>
  </tr>
  {#if artifact.spec?.host}
    <tr>
      <Cell>{t('workloads.host') ?? 'Host'}</Cell>
      <Cell>
        {artifact.spec.host}
      </Cell>
    </tr>
  {/if}
  {#if artifact.spec?.path}
    <tr>
      <Cell>{t('workloads.path') ?? 'Path'}</Cell>
      <Cell>
        {artifact.spec.path ?? 'N/A'}
      </Cell>
    </tr>
  {/if}
  {#if artifact.spec?.port}
    <tr>
      <Cell>{t('workloads.port') ?? 'Port'}</Cell>
      <Cell>
        {artifact.spec.port ? artifact.spec.port.targetPort : 'N/A'}
      </Cell>
    </tr>
  {/if}
  {#if artifact.spec?.tls}
    <tr>
      <Cell>TLS</Cell>
      <Cell>
        {t('workloads.terminationLabel') ?? 'Termination:'} {artifact.spec.tls.termination} • {t('workloads.insecureEdgePolicyLabel') ?? 'Insecure Edge Policy:'} {artifact.spec.tls
          .insecureEdgeTerminationPolicy}
      </Cell>
    </tr>
  {/if}
  {#if artifact.spec?.wildcardPolicy}
    <tr>
      <Cell>{t('workloads.wildcardPolicy') ?? 'Wildcard Policy'}</Cell>
      <Cell>
        {artifact.spec.wildcardPolicy}
      </Cell>
    </tr>
  {/if}
  {#if artifact.spec?.to}
    <tr>
      <Cell>{t('workloads.backend') ?? 'Backend'}</Cell>
      <Cell>
        {artifact.spec.to.kind} / {artifact.spec.to.name} ({t('workloads.weightLabel') ?? 'Weight:'} {artifact.spec.to.weight})
      </Cell>
    </tr>
  {/if}
  {#if artifact.spec?.host}
    <tr>
      <Cell>{t('workloads.link') ?? 'Link'}</Cell>
      <Cell>
        {@const link = `${artifact.spec.tls ? 'https' : 'http'}://${artifact.spec.host}${artifact.spec.path ?? ''}`}
        <Link on:click={(): Promise<void> => window.openExternal(link)}>
          {link}
        </Link>
      </Cell>
    </tr>
  {/if}
{/if}
