<script lang="ts">
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtension from './CatalogExtension.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  title?: string;
  showEmptyScreen?: boolean;
  oninstall?: (extensionId: string) => void;
  ondetails?: (extensionId: string) => void;
}
let {
  catalogExtensions,
  title = t('workloads.availableExtensions') ?? 'Available extensions',
  showEmptyScreen = true,
  oninstall = (_extensionId: string): void => {},
  ondetails = (_extensionId: string): void => {},
}: Props = $props();

async function fetchCatalog(): Promise<void> {
  try {
    await window.refreshCatalogExtensions();
  } catch (error) {
    await window.showMessageBox({
      type: 'error',
      title: t('workloads.refreshCatalogFailed') ?? 'Refresh Catalog Failed',
      message: t('workloads.refreshCatalogError') ?? 'Failed to refresh the catalog',
      detail: String(error),
      buttons: [t('workloads.dismiss') ?? 'Dismiss'],
    });
  }
}
</script>

<div class="flex flex-col grow px-5 py-3">
  {#if catalogExtensions.length > 0}
    <div class="mb-4 flex flex-row">
      <div class="flex items-center text-[var(--pd-content-header)]">{title}</div>
      <div class="flex-1 text-right">
        <Button type="link" on:click={fetchCatalog}>{t('workloads.refreshCatalog') ?? 'Refresh the catalog'}</Button>
      </div>
    </div>
  {:else if showEmptyScreen}
    <EmptyScreen
      title={t('workloads.noCatalogExtensions') ?? 'No extensions in the catalog'}
      message={t('workloads.noCatalogExtensionsMessage') ?? 'No extensions from the catalog. It seems that the internet connection was not available to download the catalog.'}
      icon={faPuzzlePiece}>
      <div class="flex gap-2 justify-center">
        <Button type="link" on:click={fetchCatalog}>{t('workloads.refreshCatalog') ?? 'Refresh the catalog'}</Button>
      </div>
    </EmptyScreen>
  {/if}

  <div class="flex flex-col w-full">
    <div
      class="grid min-[920px]:grid-cols-2 min-[1180px]:grid-cols-3 gap-3"
      role="region"
      aria-label={t('workloads.catalogExtensions') ?? 'Catalog Extensions'}>
      {#each catalogExtensions as catalogExtension (catalogExtension.id)}
        <CatalogExtension ondetails={ondetails} oninstall={oninstall} catalogExtensionUI={catalogExtension} />
      {/each}
    </div>
  </div>
</div>
