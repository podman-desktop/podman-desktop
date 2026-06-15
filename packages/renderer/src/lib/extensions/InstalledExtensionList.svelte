<script lang="ts">
import { onMount } from 'svelte';

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
import InstalledExtensionTable from './InstalledExtensionTable.svelte';

interface Props {
  extensionInfos?: CombinedExtensionInfoUI[];
}

let { extensionInfos = [] }: Props = $props();

const extensionsUtils = new ExtensionsUtils();
let changeVersionExtension: CatalogExtensionInfoUI | undefined = $state(undefined);
let changeVersionPreferredVersion: string | undefined = $state(undefined);
let uiRevision = $state(0);

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

  return orderInstalledTableRows(rows, extensionsUtils);
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

<div class="grow px-5 py-3">
  <InstalledExtensionTable rows={tableRows} onChangeVersion={openChangeVersion} />
</div>

{#if changeVersionExtension}
  <ChangeVersionModal
    extension={changeVersionExtension}
    preferredVersion={changeVersionPreferredVersion}
    closeCallback={closeChangeVersion} />
{/if}
