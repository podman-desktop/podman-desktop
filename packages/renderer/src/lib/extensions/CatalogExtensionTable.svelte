<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { setCatalogTableCallbacks } from './catalog-extension-table-context';
import CatalogExtensionActions from './CatalogExtensionActions.svelte';
import CatalogExtensionIcon from './CatalogExtensionIcon.svelte';
import { buildExtensionDetailsPath } from './extension-list';
import ExtensionCatalogMetaChips from './ExtensionCatalogMetaChips.svelte';
import ExtensionLifecycleStatus from './ExtensionLifecycleStatus.svelte';
import ExtensionOriginChips from './ExtensionOriginChips.svelte';
import ExtensionUpdateVersionLink from './ExtensionUpdateVersionLink.svelte';
import ExtensionVersionUpdateStatus from './ExtensionVersionUpdateStatus.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  oninstall: (extensionId: string) => void;
  onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void;
}

let { catalogExtensions, oninstall, onChangeVersion }: Props = $props();

onMount(() => {
  setCatalogTableCallbacks({ oninstall, onChangeVersion });
});

function openDetails(extension: CatalogExtensionInfoUI, event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, [role="menu"], [role="link"]')) {
    return;
  }
  router.goto(buildExtensionDetailsPath(extension.id, 'catalog'));
}
</script>

<div class="w-full mx-5" role="table" aria-label="extensions">
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
        class="grid gap-x-2 min-h-[56px] mb-2 rounded-lg border border-[var(--pd-content-table-border)] bg-[var(--pd-content-card-bg)] hover:bg-[var(--pd-content-card-hover-bg)] cursor-pointer"
        style="grid-template-columns: 56px 2fr 1.5fr 1fr 1fr 2fr 140px"
        role="row"
        aria-label={extension.displayName}
        onclick={(event): void => openDetails(extension, event)}>
        <div role="cell" class="self-center pl-3 pr-1 py-2">
          <CatalogExtensionIcon iconHref={extension.iconHref} displayName={extension.displayName} />
        </div>
        <div role="cell" class="self-center min-w-0 overflow-hidden py-2 pr-2">
          <div class="truncate font-semibold text-[var(--pd-content-header)]">{extension.displayName}</div>
          <Tooltip top tip={extension.shortDescription} containerClass="relative block min-w-0 w-full">
            <span class="block truncate text-sm text-[var(--pd-content-text)]">
              {extension.shortDescription}
            </span>
          </Tooltip>
        </div>
        <div role="cell" class="self-center text-sm text-[var(--pd-content-text)] py-2">
          {extension.publisherDisplayName}
        </div>
        <div role="cell" class="self-center py-2" onclick={(event): void => event.stopPropagation()}>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--pd-content-text)]">
            {#if extension.isInstalled && extension.installedVersion}
              <span>v{extension.installedVersion}</span>
              <ExtensionUpdateVersionLink
                {extension}
                onUpdate={(catalogExtension, version): void => onChangeVersion(catalogExtension, version)} />
            {:else if extension.isInstalled}
              <span>v{extension.installedVersion}</span>
            {:else}
              <span>{extension.fetchVersion ? `v${extension.fetchVersion}` : 'N/A'}</span>
            {/if}
            <ExtensionVersionUpdateStatus extensionId={extension.id} />
          </div>
        </div>
        <div role="cell" class="self-center py-2">
          {#if extension.isInstalled && extension.installedExtension}
            <ExtensionLifecycleStatus extension={extension.installedExtension} />
          {:else}
            <span class="text-sm text-[var(--pd-table-header-text)]">Not installed</span>
          {/if}
        </div>
        <div role="cell" class="self-center py-2">
          <div class="flex flex-wrap items-center gap-2">
            <ExtensionOriginChips {extension} />
            <ExtensionCatalogMetaChips {extension} />
          </div>
        </div>
        <div role="cell" class="self-center justify-self-end py-2" onclick={(event): void => event.stopPropagation()}>
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
