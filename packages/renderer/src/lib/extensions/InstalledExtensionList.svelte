<script lang="ts">
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import ChangeVersionModal from './ChangeVersionModal.svelte';
import { ExtensionsUtils } from './extensions-utils';
import type { InstalledExtensionTableRow } from './installed-extension-table-row';
import InstalledExtensionTable from './InstalledExtensionTable.svelte';

interface Props {
  extensionInfos?: CombinedExtensionInfoUI[];
}

let { extensionInfos = [] }: Props = $props();

const extensionsUtils = new ExtensionsUtils();
let changeVersionExtension: CatalogExtensionInfoUI | undefined = $state(undefined);
let changeVersionPreferredVersion: string | undefined = $state(undefined);

const tableRows: InstalledExtensionTableRow[] = $derived.by(() => {
  const catalogExtensions = extensionInfos.map(extension =>
    extensionsUtils.buildCatalogInfoForInstalled(extension, $catalogExtensionInfos, $featuredExtensionInfos),
  );
  const catalogWithDemo = extensionsUtils.ensurePrototypeUpdateDemo(catalogExtensions);

  return extensionInfos.map((extension, index) => ({
    name: extension.displayName || extension.name,
    extension,
    catalogExtension: catalogWithDemo[index],
  }));
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
