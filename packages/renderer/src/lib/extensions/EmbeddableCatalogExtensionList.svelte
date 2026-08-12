<script lang="ts">
import { onMount } from 'svelte';
import { derived, type Readable } from 'svelte/store';

import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionList from './CatalogExtensionList.svelte';
import { ExtensionsUtils } from './extensions-utils';

interface Props {
  category?: string;
  keywords?: string[];
  title?: string;
  showEmptyScreen?: boolean;
  oninstall?: (extensionId: string) => void;
  ondetails?: (extensionId: string) => void;
  showInstalled?: boolean;
}
let {
  category,
  keywords = [],
  title = 'Available extensions',
  showEmptyScreen = true,
  oninstall = (_extensionId: string): void => {},
  ondetails = (_extensionId: string): void => {},
  showInstalled = true,
}: Props = $props();

let enableCatalog = $state(true);

onMount(async () => {
  const value = await window.getConfigurationValue<boolean>('extensions.catalog.enabled');
  enableCatalog = value ?? true;
});

const extensionsUtils = new ExtensionsUtils();

const catalogExtensions: Readable<CatalogExtensionInfoUI[]> = derived(
  [catalogExtensionInfos, featuredExtensionInfos, combinedInstalledExtensions],
  ([$catalogExtensionInfos, $featuredExtensionInfos, $combinedInstalledExtensions]) => {
    if (category) {
      const filteredCategory = category;
      $catalogExtensionInfos = $catalogExtensionInfos.filter(catalogExtension =>
        catalogExtension.categories.includes(filteredCategory),
      );
    }
    for (const keyword of keywords) {
      const filteredKeyword = keyword;
      $catalogExtensionInfos = $catalogExtensionInfos.filter(catalogExtension =>
        catalogExtension.keywords.includes(filteredKeyword),
      );
    }
    if (!showInstalled) {
      $catalogExtensionInfos = $catalogExtensionInfos.filter(
        catalogExtension =>
          !$combinedInstalledExtensions.some(installedExtension => installedExtension.id === catalogExtension.id),
      );
    }

    return extensionsUtils.extractCatalogExtensions(
      $catalogExtensionInfos,
      $featuredExtensionInfos,
      $combinedInstalledExtensions,
    );
  },
);
</script>

{#if enableCatalog}
<div class="flex bg-[var(--pd-content-bg)] text-left">
  <CatalogExtensionList
    oninstall={oninstall}
    ondetails={ondetails}
    title={title}
    showEmptyScreen={showEmptyScreen}
    catalogExtensions={$catalogExtensions} />
</div>
{/if}
