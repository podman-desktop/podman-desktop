<script lang="ts">
import { onMount } from 'svelte';
import { router } from 'tinro';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { setCatalogTableCallbacks } from './catalog-extension-table-context';
import CatalogExtensionActions from './CatalogExtensionActions.svelte';
import CatalogExtensionIcon from './CatalogExtensionIcon.svelte';
import { buildExtensionDetailsPath } from './extension-list';
import {
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  getOptimisticInstalledVersion,
  isExtensionVersionUpdating,
} from './extension-version-update.svelte';
import ExtensionCatalogStatusChips from './ExtensionCatalogStatusChips.svelte';
import ExtensionLifecycleStatus from './ExtensionLifecycleStatus.svelte';
import ExtensionTruncatedText from './ExtensionTruncatedText.svelte';
import ExtensionUpdateVersionLink from './ExtensionUpdateVersionLink.svelte';
import ExtensionVersionUpdateStatus from './ExtensionVersionUpdateStatus.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  oninstall: (extensionId: string) => void;
  onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void;
}

let { catalogExtensions, oninstall, onChangeVersion }: Props = $props();

let uiRevision = $state(0);

onMount(() => {
  setCatalogTableCallbacks({ oninstall, onChangeVersion });
  const handler = (): void => {
    uiRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  };
});

function openDetails(extension: CatalogExtensionInfoUI, event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, [role="menu"], [role="link"]')) {
    return;
  }
  router.goto(buildExtensionDetailsPath(extension.id, 'catalog'));
}
</script>

<div class="w-full px-5" role="table" aria-label="extensions">
  <div
    role="rowgroup"
    class="grid gap-x-2 sticky top-0 z-10 h-7 bg-[var(--pd-content-bg)] pb-1 text-[var(--pd-table-header-text)] uppercase"
    style="grid-template-columns: 56px 2fr 1.5fr 1fr 1fr 2fr 140px">
    <div role="columnheader"></div>
    <div role="columnheader" class="text-sm font-semibold self-center">Name</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Publisher</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Version</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Status</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Origin</div>
    <div role="columnheader" class="text-sm font-semibold self-center justify-self-end">Actions</div>
  </div>

  <div role="rowgroup">
    {#each catalogExtensions as extension (extension.id)}
      <div
        class="grid items-center gap-x-2 min-h-[56px] mb-2 rounded-lg border border-[var(--pd-content-table-border)] bg-[var(--pd-content-card-bg)] hover:bg-[var(--pd-content-card-hover-bg)] cursor-pointer"
        style="grid-template-columns: 56px 2fr 1.5fr 1fr 1fr 2fr 140px"
        role="row"
        aria-label={extension.displayName}
        onclick={(event): void => openDetails(extension, event)}>
        <div role="cell" class="pl-3 pr-1 py-2">
          <CatalogExtensionIcon iconHref={extension.iconHref} displayName={extension.displayName} />
        </div>
        <div role="cell" class="min-w-0 overflow-hidden py-2 pr-2">
          <div class="truncate font-semibold text-[var(--pd-content-header)]">{extension.displayName}</div>
          <ExtensionTruncatedText
            text={extension.shortDescription}
            class="text-sm text-[var(--pd-content-text)]" />
        </div>
        <div role="cell" class="text-sm text-[var(--pd-content-text)] py-2">
          {extension.publisherDisplayName}
        </div>
        <div role="cell" class="py-2" onclick={(event): void => event.stopPropagation()}>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--pd-content-text)]">
            {#if extension.isInstalled}
              {#key uiRevision}
                {@const actualVersion = extension.installedVersion}
                {@const normalizedActual = actualVersion?.replace(/^v/i, '').trim()}
                {@const optimistic = getOptimisticInstalledVersion(extension.id)}
                {@const displayInstalledVersion =
                  isExtensionVersionUpdating(extension.id)
                    ? actualVersion
                    : optimistic && optimistic !== normalizedActual
                      ? optimistic
                      : actualVersion}
                {#if displayInstalledVersion}
                  <span>v{displayInstalledVersion}</span>
                  <ExtensionUpdateVersionLink {extension} />
                {:else}
                  <span>v{extension.installedVersion}</span>
                {/if}
                <ExtensionVersionUpdateStatus extensionId={extension.id} />
              {/key}
            {:else}
              <span>{extension.fetchVersion ? `v${extension.fetchVersion}` : 'N/A'}</span>
            {/if}
          </div>
        </div>
        <div role="cell" class="py-2">
          {#if extension.isInstalled && extension.installedExtension}
            <ExtensionLifecycleStatus extension={extension.installedExtension} />
          {:else}
            <span class="text-sm text-[var(--pd-table-header-text)]">Not installed</span>
          {/if}
        </div>
        <div role="cell" class="py-2">
          <ExtensionCatalogStatusChips {extension} originFirst nowrap />
        </div>
        <div role="cell" class="justify-self-end py-2" onclick={(event): void => event.stopPropagation()}>
          <div class="flex shrink-0 items-center justify-end gap-1">
            {#if !extension.isInstalled && extension.fetchable}
              <FeaturedExtensionDownload {oninstall} extension={extension} />
            {/if}
            <CatalogExtensionActions
              {extension}
              returnScreen="catalog"
              onChangeVersion={(): void => onChangeVersion(extension)} />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
