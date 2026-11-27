<script lang="ts">
import { router } from 'tinro';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';
import ExtensionStatus from '/@/lib/ui/ExtensionStatus.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';

interface Props {
  catalogExtensionUI: CatalogExtensionInfoUI;
  oninstall?: (extensionId: string) => void;
  ondetails?: (extensionId: string) => void;
}
let {
  catalogExtensionUI,
  oninstall = (_extensionId: string): void => {},
  ondetails = (_extensionId: string): void => {},
}: Props = $props();

const installed = $derived(catalogExtensionUI.installedExtension);
const detailsPath = $derived(`/extensions/details/${catalogExtensionUI.id}/`);

function openExtensionDetails(event: MouseEvent): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  ondetails(catalogExtensionUI.id);
  router.goto(detailsPath);
}
</script>

<div
  class="relative isolate rounded-lg border border-(--pd-content-bg) flex flex-col bg-(--pd-content-card-bg) hover:border-(--pd-content-card-border-selected) min-h-32"
  role="group"
  aria-label={catalogExtensionUI.displayName}>
  <div class="p-3 h-full w-full flex flex-col justify-start">
    <div class="flex items-start gap-2 w-full">
      <img
        src={catalogExtensionUI.iconHref}
        alt="{catalogExtensionUI.displayName} logo"
        class="size-10 shrink-0 object-contain" />
      <div class="min-w-0 flex-1">
        <a
          href={detailsPath}
          data-tinro-ignore
          aria-label={catalogExtensionUI.displayName}
          onclick={openExtensionDetails}
          class="block after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-(--pd-button-focus-ring)">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="relative z-10 truncate font-semibold text-(--pd-content-header)" title={catalogExtensionUI.displayName}>
              {catalogExtensionUI.displayName}
            </span>
            {#if catalogExtensionUI.isFeatured}
              <span
                class="inline-flex shrink-0 rounded-full border border-(--pd-content-header) px-2 py-0.5 text-xs font-medium leading-none text-(--pd-content-header)">
                Featured
              </span>
            {/if}
          </div>
          <!-- Keep the publisher title hoverable without taking it out of the link. -->
          <div
            class="relative z-10 pt-0.5 truncate text-sm font-medium text-(--pd-content-header)"
            title={catalogExtensionUI.publisherDisplayName}>
            {catalogExtensionUI.publisherDisplayName}
          </div>
        </a>
        <div class="pt-0.5 text-sm text-(--pd-content-text) line-clamp-1">
          {catalogExtensionUI.shortDescription}
        </div>
        {#if installed}
          <ExtensionStatus status={installed.state} class="pt-1" />
        {/if}
      </div>

      {#if !catalogExtensionUI.isInstalled && catalogExtensionUI.fetchable}
        <!-- Keep independent controls above the stretched details link. -->
        <div class="relative z-10 shrink-0">
          <FeaturedExtensionDownload oninstall={oninstall} extension={catalogExtensionUI} />
        </div>
      {/if}
    </div>
    <div class="items-end flex flex-1">
      <div class="text-[var(--pd-content-text)] text-sm">
        v{catalogExtensionUI.fetchVersion}
        {#if catalogExtensionUI.installedVersion && catalogExtensionUI.installedVersion !== catalogExtensionUI.fetchVersion}
          <span>(installed: v{catalogExtensionUI.installedVersion})</span>
        {/if}
      </div>
    </div>
  </div>
</div>
