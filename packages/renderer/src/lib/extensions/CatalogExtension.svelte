<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionActions from './CatalogExtensionActions.svelte';
import CatalogExtensionIcon from './CatalogExtensionIcon.svelte';
import { buildExtensionDetailsPath, type ExtensionListScreen } from './extension-list';
import ExtensionCatalogChips from './ExtensionCatalogChips.svelte';
import ExtensionLifecycleStatus from './ExtensionLifecycleStatus.svelte';

export let catalogExtensionUI: CatalogExtensionInfoUI;
export let returnScreen: ExtensionListScreen = 'catalog';
export let oninstall: (extensionId: string) => void = () => {};
export let ondetails: (extensionId: string) => void = () => {};
export let onChangeVersion: (extension: CatalogExtensionInfoUI) => void = () => {};

function openExtensionDetails(): void {
  ondetails(catalogExtensionUI.id);
  router.goto(buildExtensionDetailsPath(catalogExtensionUI.id, returnScreen));
}

function handleCardClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, [role="menu"], [role="link"]')) {
    return;
  }
  openExtensionDetails();
}

function handleChangeVersion(): void {
  onChangeVersion(catalogExtensionUI);
}
</script>

<div
  class="relative rounded-lg border border-[var(--pd-content-bg)] flex flex-col bg-[var(--pd-content-card-bg)] hover:border-[var(--pd-content-card-border-selected)] cursor-pointer"
  role="group"
  aria-label={catalogExtensionUI.displayName}
  onclick={handleCardClick}>
  <div class="p-3 flex flex-col gap-2">
    <div class="flex items-start gap-2">
      <div class="flex min-w-0 flex-wrap items-center gap-2">
        <ExtensionCatalogChips extension={catalogExtensionUI} />
      </div>

      <div class="ml-auto flex shrink-0 items-center gap-2">
        {#if catalogExtensionUI.isInstalled && catalogExtensionUI.installedExtension}
          <ExtensionLifecycleStatus extension={catalogExtensionUI.installedExtension} />
        {/if}
        {#if !catalogExtensionUI.isInstalled && catalogExtensionUI.fetchable}
          <FeaturedExtensionDownload oninstall={oninstall} extension={catalogExtensionUI} />
        {/if}
        <CatalogExtensionActions
          extension={catalogExtensionUI}
          {returnScreen}
          onChangeVersion={handleChangeVersion} />
      </div>
    </div>

    <div class="flex flex-row items-start gap-2">
      <CatalogExtensionIcon iconHref={catalogExtensionUI.iconHref} displayName={catalogExtensionUI.displayName} />

      <div class="min-w-0 flex-1 overflow-hidden">
        <div class="truncate leading-4 text-[var(--pd-content-header)]">
          {catalogExtensionUI.displayName}
        </div>
        <Tooltip top tip={catalogExtensionUI.shortDescription} containerClass="relative block min-w-0 w-full">
          <span class="block truncate pt-1 text-sm text-[var(--pd-content-text)]">
            {catalogExtensionUI.shortDescription}
          </span>
        </Tooltip>
      </div>
    </div>

    <Tooltip top tip={catalogExtensionUI.publisherDisplayName} containerClass="relative block min-w-0 w-full">
      <span class="block truncate text-sm text-[var(--pd-content-text)] pl-12">
        {catalogExtensionUI.publisherDisplayName}
      </span>
    </Tooltip>

    <div class="text-[var(--pd-content-text)] text-sm pl-12">
      v{catalogExtensionUI.fetchVersion}
      {#if catalogExtensionUI.installedVersion && catalogExtensionUI.installedVersion !== catalogExtensionUI.fetchVersion}
        <span>(installed: v{catalogExtensionUI.installedVersion})</span>
      {/if}
    </div>
  </div>
</div>
