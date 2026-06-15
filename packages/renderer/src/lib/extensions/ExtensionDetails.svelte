<script lang="ts">
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { derived, type Readable } from 'svelte/store';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';
import extensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import ExtensionIcon from '/@/lib/preferences/ExtensionIcon.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionActions from './CatalogExtensionActions.svelte';
import { EXTENSION_ACTIONS_MENU_CHANGE_EVENT, getOpenExtensionActionsMenuId } from './extension-actions-menu.svelte';
import {
  mapCompatibilityIssuesToDetailsWarnings,
  resolveExtensionCompatibilityIssues,
} from './extension-compatibility';
import type { ExtensionDetailsUI } from './extension-details-ui';
import { resolveExtensionLifecycleWarnings } from './extension-lifecycle-warning';
import { buildExtensionsListPath, type ExtensionListScreen } from './extension-list';
import { EXTENSION_VERSION_UI_CHANGE_EVENT, withDisplayInstalledVersion } from './extension-version-update.svelte';
import ExtensionDetailsError from './ExtensionDetailsError.svelte';
import ExtensionDetailsReadme from './ExtensionDetailsReadme.svelte';
import ExtensionDetailsSummaryCard from './ExtensionDetailsSummaryCard.svelte';
import ExtensionDetailsWarnings from './ExtensionDetailsWarnings.svelte';
import { ExtensionsUtils } from './extensions-utils';

export let extensionId: string;
export let returnScreen: ExtensionListScreen = 'installed';

const returnPath = buildExtensionsListPath(returnScreen);

let screen: 'README' | 'ERROR' = 'README';
let detailsPage: DetailsPage;
const extensionsUtils = new ExtensionsUtils();

let podmanDesktopVersion = '';
let uiRevision = 0;
let actionsMenuRevision = 0;

let extension: Readable<ExtensionDetailsUI | undefined>;

$: decodedExtensionId = decodeURIComponent(extensionId);

$: installedExtensionsWithDemos = extensionsUtils.applyPrototypeUseCaseOverlays($combinedInstalledExtensions);

$: catalogExtension = ((): CatalogExtensionInfoUI | undefined => {
  uiRevision;
  const info = extensionsUtils.buildCatalogExtensionInfoForId(
    decodedExtensionId,
    $catalogExtensionInfos,
    $featuredExtensionInfos,
    installedExtensionsWithDemos,
  );
  return info ? withDisplayInstalledVersion(info) : undefined;
})();

$: extension = derived(
  [catalogExtensionInfos, combinedInstalledExtensions],
  ([$catalogExtensionInfos, _combinedInstalledExtensions]) => {
    const withDemos = extensionsUtils.applyPrototypeUseCaseOverlays(_combinedInstalledExtensions);
    return extensionsUtils.extractExtensionDetail($catalogExtensionInfos, withDemos, decodedExtensionId);
  },
);

$: compatibilityIssues = ((): ReturnType<typeof resolveExtensionCompatibilityIssues> => {
  uiRevision;
  return resolveExtensionCompatibilityIssues(
    catalogExtension ?? {
      id: decodedExtensionId,
      displayName: $extension?.displayName ?? decodedExtensionId,
      isInstalled: !!$extension?.installedExtension,
    },
    installedExtensionsWithDemos,
    podmanDesktopVersion || undefined,
  );
})();

$: lifecycleWarnings = resolveExtensionLifecycleWarnings($extension?.installedExtension);

$: detailsWarnings = [...lifecycleWarnings, ...mapCompatibilityIssuesToDetailsWarnings(compatibilityIssues)];

$: hideDisabledLifecycleWarningWhileMenuOpen = ((): boolean => {
  actionsMenuRevision;
  return (
    $extension?.installedExtension?.state === 'stopped' &&
    catalogExtension?.id !== undefined &&
    getOpenExtensionActionsMenuId() === catalogExtension.id
  );
})();

$: visibleDetailsWarnings = hideDisabledLifecycleWarningWhileMenuOpen
  ? mapCompatibilityIssuesToDetailsWarnings(compatibilityIssues)
  : detailsWarnings;

onMount(() => {
  async function loadPodmanDesktopVersion(): Promise<void> {
    try {
      const version = await window.getPodmanDesktopVersion?.();
      if (version) {
        podmanDesktopVersion = version;
        uiRevision += 1;
      }
    } catch {
      // Ignore version lookup failures on the details page.
    }
  }

  void loadPodmanDesktopVersion().catch(() => {});

  const handler = (): void => {
    uiRevision += 1;
  };
  const actionsMenuHandler = (): void => {
    actionsMenuRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  window.addEventListener(EXTENSION_ACTIONS_MENU_CHANGE_EVENT, actionsMenuHandler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
    window.removeEventListener(EXTENSION_ACTIONS_MENU_CHANGE_EVENT, actionsMenuHandler);
  };
});
</script>

{#if $extension}
  <DetailsPage
    title="{$extension.displayName} extension"
    subtitle={$extension.description}
    {returnPath}
    bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <div class="flex flex-col mt-1 items-baseline w-8">
        <div class="w-8 min-h-8">
          {#if $extension.icon}
            <ExtensionIcon extension={$extension} />
          {:else if $extension.iconRef}
            <img src={$extension.iconRef} alt="{$extension.displayName} icon" class="max-w-8 max-h-8" />
          {/if}
        </div>
      </div>
    {/snippet}
    {#snippet actionsSnippet()}
      <div class="flex items-center gap-2">
        {#if !$extension.installedExtension && $extension.fetchable}
          <FeaturedExtensionDownload extension={$extension} catalogExtension={catalogExtension} />
        {/if}
        {#if catalogExtension}
          <CatalogExtensionActions
            extension={catalogExtension}
            {returnScreen}
            onDetailsPage={true} />
        {/if}
      </div>
    {/snippet}

    {#snippet tabsSnippet()}
      {#if $extension.state === 'failed'}
        <Button
          type="tab"
          on:click={(): void => {
            screen = 'README';
          }}
          selected={screen === 'README'}>Readme</Button>
        <Button
          type="tab"
          on:click={(): void => {
            screen = 'ERROR';
          }}
          selected={screen === 'ERROR'}>Error</Button>
      {/if}
    {/snippet}

    {#snippet contentSnippet()}
      <div class="flex w-full h-full overflow-y-auto p-5 flex-col lg:flex-row gap-4">
        {#if screen === 'README'}
          <div class="flex flex-col gap-4 flex-1 min-w-0">
            {#if visibleDetailsWarnings.length > 0}
              <ExtensionDetailsWarnings warnings={visibleDetailsWarnings} />
            {/if}
            <ExtensionDetailsReadme readme={$extension.readme} />
          </div>
          <ExtensionDetailsSummaryCard extensionDetails={$extension} {catalogExtension} />
        {:else if screen === 'ERROR'}
          <div class="flex flex-col gap-4 flex-1 min-w-0">
            {#if visibleDetailsWarnings.length > 0}
              <ExtensionDetailsWarnings warnings={visibleDetailsWarnings} />
            {/if}
            <ExtensionDetailsError extension={$extension} />
          </div>
          <ExtensionDetailsSummaryCard extensionDetails={$extension} {catalogExtension} />
        {/if}
      </div>
    {/snippet}
  </DetailsPage>
{:else}
  <DetailsPage title="{extensionId} extension" {returnPath} bind:this={detailsPage}>
    {#snippet contentSnippet()}
      <div class="flex w-full h-full">
        <EmptyScreen
          title="Extension not found"
          message="Extension with id '{extensionId}' is not available in the catalog"
          icon={extensionIcon} />
      </div>
    {/snippet}
  </DetailsPage>
{/if}
