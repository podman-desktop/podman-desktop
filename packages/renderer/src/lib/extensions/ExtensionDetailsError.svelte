<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';

import type { ExtensionDetailsUI } from './extension-details-ui';

interface Props {
  extension: ExtensionDetailsUI;
}
let { extension }: Props = $props();
</script>

{#if extension.error}
  <div class="flex flex-col text-[var(--pd-content-card-text)]">
    <div class="py-2">Error: {extension.error.message}</div>
    {#if extension.error.stack}
      <div class="text-xs">
        <div>{t('workloads.stackTraceLabel') ?? 'Stack trace:'}</div>
        <pre role="group" aria-label={t('workloads.stackTrace') ?? 'Stack Trace'}>{extension.error.stack}</pre>
      </div>
    {/if}
  </div>
{/if}
