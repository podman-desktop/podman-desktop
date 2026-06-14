<script lang="ts">
import { router } from 'tinro';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionActions from './CatalogExtensionActions.svelte';
import CatalogExtensionIcon from './CatalogExtensionIcon.svelte';
import { buildExtensionDetailsPath, type ExtensionListScreen } from './extension-list';
import ExtensionCatalogMetaChips from './ExtensionCatalogMetaChips.svelte';
import ExtensionLifecycleStatus from './ExtensionLifecycleStatus.svelte';
import ExtensionOriginChips from './ExtensionOriginChips.svelte';
import ExtensionTruncatedText from './ExtensionTruncatedText.svelte';
import ExtensionUpdateVersionLink from './ExtensionUpdateVersionLink.svelte';
import ExtensionVersionUpdateStatus from './ExtensionVersionUpdateStatus.svelte';

export let catalogExtensionUI: CatalogExtensionInfoUI;
export let returnScreen: ExtensionListScreen = 'catalog';
export let oninstall: (extensionId: string) => void = () => {};
export let ondetails: (extensionId: string) => void = () => {};
export let onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void = () => {};

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

function handleChangeVersion(preferredVersion?: string): void {
  onChangeVersion(catalogExtensionUI, preferredVersion);
}
</script>

<div
  class="relative rounded-lg border border-[var(--pd-content-bg)] flex flex-col bg-[var(--pd-content-card-bg)] hover:border-[var(--pd-content-card-border-selected)] cursor-pointer"
  role="group"
  aria-label={catalogExtensionUI.displayName}
  onclick={handleCardClick}>
  <div class="px-3 pt-3 pb-1 flex flex-col gap-1.5">
    <div class="flex items-center gap-x-2">
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
        <ExtensionCatalogMetaChips extension={catalogExtensionUI} />
        <ExtensionOriginChips extension={catalogExtensionUI} />
      </div>
      <div class="flex shrink-0 items-center gap-1">
        {#if !catalogExtensionUI.isInstalled && catalogExtensionUI.fetchable}
          <FeaturedExtensionDownload oninstall={oninstall} extension={catalogExtensionUI} />
        {/if}
        <CatalogExtensionActions
          extension={catalogExtensionUI}
          {returnScreen}
          onChangeVersion={(): void => handleChangeVersion()} />
      </div>
    </div>

    <div class="flex items-start gap-2">
      <div class="flex size-10 shrink-0 items-center justify-start">
        <CatalogExtensionIcon iconHref={catalogExtensionUI.iconHref} displayName={catalogExtensionUI.displayName} />
      </div>

      <div class="min-w-0 flex-1 overflow-hidden">
        <div class="truncate leading-4 text-[var(--pd-content-header)]">
          {catalogExtensionUI.displayName}
        </div>
        <ExtensionTruncatedText
          text={catalogExtensionUI.publisherDisplayName}
          class="pt-0.5 text-sm text-[var(--pd-table-header-text)]" />
        <ExtensionTruncatedText
          text={catalogExtensionUI.shortDescription}
          class="pt-0.5 text-sm text-[var(--pd-content-text)]" />
        <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5 text-sm text-[var(--pd-content-text)]">
          {#if catalogExtensionUI.isInstalled && catalogExtensionUI.installedExtension}
            <ExtensionLifecycleStatus extension={catalogExtensionUI.installedExtension} class="shrink-0" />
          {/if}
          {#if catalogExtensionUI.isInstalled && catalogExtensionUI.installedVersion}
            <span>v{catalogExtensionUI.installedVersion}</span>
            <ExtensionUpdateVersionLink extension={catalogExtensionUI} onUpdate={handleChangeVersion} />
          {:else if catalogExtensionUI.isInstalled}
            <span>v{catalogExtensionUI.installedVersion}</span>
          {:else}
            <span>v{catalogExtensionUI.fetchVersion}</span>
          {/if}
          <ExtensionVersionUpdateStatus extensionId={catalogExtensionUI.id} />
        </div>
      </div>
    </div>
  </div>
</div>
