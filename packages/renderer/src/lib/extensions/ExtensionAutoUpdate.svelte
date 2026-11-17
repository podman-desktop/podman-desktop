<script lang="ts">
import { isAutoUpdatable } from '@desktop-framework/api';
import { Button } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

interface Props {
  extension: CombinedExtensionInfoUI;
}

let { extension }: Props = $props();

let inProgress = $state(false);

async function toggleAutoUpdate(): Promise<void> {
  inProgress = true;
  try {
    await window.setExtensionAutoUpdate(extension.id, !!extension.autoUpdateDisabled);
  } catch (err: unknown) {
    console.error(`Unable to change the automatic updates of extension ${extension.id}`, err);
  } finally {
    inProgress = false;
  }
}
</script>

<!-- Docker Desktop extensions are never updated -->
{#if extension.type === 'pd' && isAutoUpdatable(extension)}
  <div class="flex flex-col lg:mb-4 items-start" role="region" aria-label={t('workloads.autoUpdate') ?? 'Auto-update'}>
    <div class="uppercase text-sm text-(--pd-details-card-header)">{t('workloads.autoUpdate') ?? 'auto-update'}</div>
    <div class="flex flex-row items-center gap-2 font-thin text-sm text-(--pd-details-card-text)">
      <span>{extension.autoUpdateDisabled ? (t('workloads.disabled') ?? 'Disabled') : (t('workloads.enabled') ?? 'Enabled')}</span>
      <Button type="link" padding="px-0" {inProgress} onclick={toggleAutoUpdate}
        >{extension.autoUpdateDisabled ? (t('workloads.enable') ?? 'Enable') : (t('workloads.disable') ?? 'Disable')}</Button>
    </div>
  </div>
{/if}
