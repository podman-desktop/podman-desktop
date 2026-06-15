<script lang="ts">
import { onMount } from 'svelte';
import { router } from 'tinro';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { buildExtensionDetailsPath } from './extension-list';
import { ExtensionsUtils } from './extensions-utils';
import { setInstalledTableCallbacks } from './installed-extension-table-context';
import type { InstalledExtensionTableRow } from './installed-extension-table-row';
import InstalledExtensionTableActionsColumn from './table/InstalledExtensionTableActionsColumn.svelte';
import InstalledExtensionTableIconColumn from './table/InstalledExtensionTableIconColumn.svelte';
import InstalledExtensionTableLifecycleColumn from './table/InstalledExtensionTableLifecycleColumn.svelte';
import InstalledExtensionTableNameColumn from './table/InstalledExtensionTableNameColumn.svelte';
import InstalledExtensionTableOriginColumn from './table/InstalledExtensionTableOriginColumn.svelte';
import InstalledExtensionTableVersionColumn from './table/InstalledExtensionTableVersionColumn.svelte';

interface Props {
  rows: InstalledExtensionTableRow[];
  onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void;
}

let { rows, onChangeVersion }: Props = $props();

const extensionsUtils = new ExtensionsUtils();

const gridTemplateColumns = '56px 2fr 1.5fr 1.35fr minmax(9rem, 1.25fr) 2fr 140px';

onMount(() => {
  setInstalledTableCallbacks({ onChangeVersion });
});

function openDetails(row: InstalledExtensionTableRow, event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, [role="menu"], [role="link"]')) {
    return;
  }
  router.goto(buildExtensionDetailsPath(row.extension.id, 'installed'));
}
</script>

<div class="w-full px-5" role="table" aria-label="installed extensions">
  <div
    role="rowgroup"
    class="grid gap-x-4 sticky top-0 z-10 h-7 bg-[var(--pd-content-bg)] pb-1 text-[var(--pd-table-header-text)] uppercase"
    style:grid-template-columns={gridTemplateColumns}>
    <div role="columnheader"></div>
    <div role="columnheader" class="text-sm font-semibold self-center">Name</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Publisher</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Version</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Status</div>
    <div role="columnheader" class="text-sm font-semibold self-center">Origin</div>
    <div role="columnheader" class="text-sm font-semibold self-center justify-self-end">Actions</div>
  </div>

  <div role="rowgroup">
    {#each rows as row (row.extension.id)}
      <div
        class="grid gap-x-4 min-h-[56px] mb-2 rounded-lg border border-[var(--pd-content-table-border)] bg-[var(--pd-content-card-bg)] hover:bg-[var(--pd-content-card-hover-bg)] cursor-pointer"
        style:grid-template-columns={gridTemplateColumns}
        role="row"
        aria-label={row.name}
        onclick={(event): void => openDetails(row, event)}>
        <div role="cell" class="self-center pl-3 pr-1 py-2">
          <InstalledExtensionTableIconColumn object={row} />
        </div>
        <div role="cell" class="self-center min-w-0 overflow-hidden py-2 pr-2">
          <InstalledExtensionTableNameColumn object={row} />
        </div>
        <div role="cell" class="self-center text-sm text-[var(--pd-content-text)] py-2">
          {extensionsUtils.resolvePublisherDisplayName(row.extension, row.catalogExtension.publisherDisplayName)}
        </div>
        <div role="cell" class="self-center py-2 pr-4 min-w-0" onclick={(event): void => event.stopPropagation()}>
          <InstalledExtensionTableVersionColumn object={row} />
        </div>
        <div role="cell" class="self-center py-2 min-w-0 overflow-hidden">
          <InstalledExtensionTableLifecycleColumn object={row} />
        </div>
        <div role="cell" class="self-center py-2">
          <InstalledExtensionTableOriginColumn object={row} />
        </div>
        <div role="cell" class="self-center justify-self-end py-2" onclick={(event): void => event.stopPropagation()}>
          <InstalledExtensionTableActionsColumn object={row} />
        </div>
      </div>
    {/each}
  </div>
</div>
