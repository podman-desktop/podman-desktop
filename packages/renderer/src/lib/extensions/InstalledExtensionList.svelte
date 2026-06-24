<script lang="ts">
import { FilteredEmptyScreen } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import ChangeVersionModal from './ChangeVersionModal.svelte';
import { newBadgeRevision, refreshNewBadges } from './extension-catalog-settings.svelte';
import { ensurePrototypeManualUpdateSettings } from './extension-prototype-use-cases';
import { EXTENSION_VERSION_UI_CHANGE_EVENT, withDisplayInstalledVersion } from './extension-version-update.svelte';
import { ExtensionsUtils } from './extensions-utils';
import type { InstalledExtensionTableRow } from './installed-extension-table-row';
import { installedTableSortState, orderInstalledTableRows } from './installed-extension-table-sort.svelte';
import InstalledExtensionFilters from './InstalledExtensionFilters.svelte';
import InstalledExtensionTable from './InstalledExtensionTable.svelte';

interface Props {
  extensionInfos?: CombinedExtensionInfoUI[];
  allExtensionInfos?: CombinedExtensionInfoUI[];
  searchTerm?: string;
  showFilteredEmpty?: boolean;
  onResetFilter?: () => void;
}

let {
  extensionInfos = [],
  allExtensionInfos = [],
  searchTerm = $bindable(''),
  showFilteredEmpty = false,
  onResetFilter = (): void => {},
}: Props = $props();

const extensionsUtils = new ExtensionsUtils();
let changeVersionExtension: CatalogExtensionInfoUI | undefined = $state(undefined);
let changeVersionPreferredVersion: string | undefined = $state(undefined);
let uiRevision = $state(0);

const filterCatalogExtensions: CatalogExtensionInfoUI[] = $derived.by(() => {
  $catalogExtensionInfos;
  $featuredExtensionInfos;
  return (allExtensionInfos.length > 0 ? allExtensionInfos : extensionInfos).map(extension =>
    extensionsUtils.buildCatalogInfoForInstalled(extension, $catalogExtensionInfos, $featuredExtensionInfos),
  );
});

onMount(() => {
  refreshNewBadges();
  const handler = (): void => {
    uiRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  };
});

$effect(() => {
  const catalogExtensions = extensionInfos.map(extension =>
    extensionsUtils.buildCatalogInfoForInstalled(extension, $catalogExtensionInfos, $featuredExtensionInfos),
  );
  ensurePrototypeManualUpdateSettings(extensionsUtils.ensurePrototypeUpdateDemo(catalogExtensions));
});

const tableRows: InstalledExtensionTableRow[] = $derived.by(() => {
  uiRevision;
  installedTableSortState.value;
  newBadgeRevision.value;
  const catalogExtensions = extensionInfos.map(extension =>
    extensionsUtils.buildCatalogInfoForInstalled(extension, $catalogExtensionInfos, $featuredExtensionInfos),
  );
  const catalogWithDemo = extensionsUtils.ensurePrototypeUpdateDemo(catalogExtensions);
  const catalogById = new Map(catalogWithDemo.map(catalog => [catalog.id, catalog]));

  const rows = extensionInfos.map(extension => {
    const catalogExtension =
      catalogById.get(extension.id) ??
      extensionsUtils.buildCatalogInfoForInstalled(extension, $catalogExtensionInfos, $featuredExtensionInfos);

    return {
      name: catalogExtension.displayName,
      extension,
      catalogExtension: withDisplayInstalledVersion(catalogExtension),
    };
  });

  return orderInstalledTableRows(rows);
});

function openChangeVersion(extension: CatalogExtensionInfoUI, preferredVersion?: string): void {
  changeVersionExtension = extension;
  changeVersionPreferredVersion = preferredVersion;
}

function closeChangeVersion(): void {
  changeVersionExtension = undefined;
  changeVersionPreferredVersion = undefined;
}
</script>

<div class="flex grow flex-col py-3">
  <div class="sticky top-0 z-20 bg-[var(--pd-content-bg)] px-5 pb-4 pt-1">
    <InstalledExtensionFilters catalogExtensions={filterCatalogExtensions} bind:searchTerm />
  </div>

  <div class="grow px-5">
    {#if showFilteredEmpty}
      <div class="flex min-h-[40vh] flex-1 items-center justify-center">
        <FilteredEmptyScreen icon={ExtensionIcon} kind="extensions" bind:searchTerm {onResetFilter} />
      </div>
    {:else}
      <InstalledExtensionTable rows={tableRows} onChangeVersion={openChangeVersion} />
    {/if}
  </div>
</div>

{#if changeVersionExtension}
  <ChangeVersionModal
    extension={changeVersionExtension}
    preferredVersion={changeVersionPreferredVersion}
    closeCallback={closeChangeVersion} />
{/if}
