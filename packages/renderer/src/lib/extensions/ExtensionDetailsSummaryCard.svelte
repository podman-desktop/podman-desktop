<script lang="ts">
import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import type { ExtensionDetailsUI } from './extension-details-ui';
import ExtensionDetailsVersionRow from './ExtensionDetailsVersionRow.svelte';
import ExtensionLifecycleStatus from './ExtensionLifecycleStatus.svelte';
import ExtensionOriginChips from './ExtensionOriginChips.svelte';
import ExtensionDetailsSummaryCardEntry from './InstalledExtensionDetailsSummaryCardEntry.svelte';

interface Props {
  extensionDetails: ExtensionDetailsUI;
  catalogExtension?: CatalogExtensionInfoUI;
}

let { extensionDetails, catalogExtension }: Props = $props();
</script>

<div class="order-first lg:order-last w-full lg:w-56 flex shrink-0 justify-end pb-4 lg:pb-0">
  <div
    class="bg-[var(--pd-details-card-bg)] w-full lg:w-52 h-fit lg:ml-4 p-4 rounded-md flex flex-col gap-3 min-w-0">
    {#if catalogExtension}
      <div class="flex flex-col gap-1 min-w-0 border-b border-[var(--pd-content-divider)] pb-3">
        <span class="text-xs uppercase text-[var(--pd-table-header-text)]">Version</span>
        <ExtensionDetailsVersionRow catalogExtension={catalogExtension} />
      </div>
    {:else}
      <ExtensionDetailsSummaryCardEntry label="version" value={extensionDetails.version} />
    {/if}

    <ExtensionDetailsSummaryCardEntry label="released" value={extensionDetails.releaseDate} />

    <ExtensionDetailsSummaryCardEntry label="published by" value={extensionDetails.publisherDisplayName} />

    {#if catalogExtension?.installedExtension}
      <div class="flex flex-col items-start lg:mb-1">
        <div class="uppercase text-sm text-[var(--pd-details-card-header)]">Status</div>
        <ExtensionLifecycleStatus
          extension={catalogExtension.installedExtension}
          catalogExtension={catalogExtension}
          class="pt-0.5" />
      </div>
    {/if}

    {#if catalogExtension}
      <div class="flex flex-col items-start lg:mb-1">
        <div class="uppercase text-sm text-[var(--pd-details-card-header)]">Origin</div>
        <ExtensionOriginChips extension={catalogExtension} class="pt-0.5" />
      </div>
    {/if}

    {#if extensionDetails.categories.length > 0}
      <ExtensionDetailsSummaryCardEntry label="categories" value={extensionDetails.categories.join(', ')} />
    {/if}
  </div>
</div>
