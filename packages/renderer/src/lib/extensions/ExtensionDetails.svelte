<script lang="ts">
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { derived, type Readable } from 'svelte/store';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';
import extensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import ExtensionIcon from '/@/lib/preferences/ExtensionIcon.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import ExtensionStatus from '/@/lib/ui/ExtensionStatus.svelte';
import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionActions from './CatalogExtensionActions.svelte';
import ChangeVersionModal from './ChangeVersionModal.svelte';
import {
  mapCompatibilityIssuesToDetailsWarnings,
  resolveExtensionCompatibilityIssues,
} from './extension-compatibility';
import type { ExtensionDetailsUI } from './extension-details-ui';
import { resolveExtensionLifecycleWarnings } from './extension-lifecycle-warning';
import { buildExtensionsListPath, type ExtensionListScreen } from './extension-list';
import { prototypeLifecycleOverlayRevisionStore } from './extension-prototype-lifecycle-overlay.svelte';
import { EXTENSION_VERSION_UI_CHANGE_EVENT, withDisplayInstalledVersion } from './extension-version-update.svelte';
import ExtensionBadge from './ExtensionBadge.svelte';
import ExtensionDetailsError from './ExtensionDetailsError.svelte';
import ExtensionDetailsReadme from './ExtensionDetailsReadme.svelte';
import ExtensionDetailsSummaryCard from './ExtensionDetailsSummaryCard.svelte';
import ExtensionDetailsWarnings from './ExtensionDetailsWarnings.svelte';
import {
  areExtensionsImprovementsSuggested,
  EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT,
} from './extensions-prototype-scope';
import { ExtensionsUtils } from './extensions-utils';
import InstalledExtensionActions from './InstalledExtensionActions.svelte';
import SuggestionExtensionDetailsSummaryCard from './SuggestionExtensionDetailsSummaryCard.svelte';

export let extensionId: string;
export let returnScreen: ExtensionListScreen = 'installed';

const returnPath = buildExtensionsListPath(returnScreen);

let screen: 'README' | 'ERROR' = 'README';
let detailsPage: DetailsPage;
const extensionsUtils = new ExtensionsUtils();

let podmanDesktopVersion = '';
let uiRevision = 0;
let changeVersionExtension: CatalogExtensionInfoUI | undefined;
let changeVersionPreferredVersion: string | undefined;
let scopeRevision = 0;

$: isSuggestionScope = ((): boolean => {
  scopeRevision;
  return areExtensionsImprovementsSuggested();
})();

$: decodedExtensionId = decodeURIComponent(extensionId);

$: installedExtensionsWithDemos = isSuggestionScope
  ? (scopeRevision, extensionsUtils.applyPrototypeUseCaseOverlays($combinedInstalledExtensions))
  : $combinedInstalledExtensions;

$: installedExtensionsForUi = extensionsUtils.resolveInstalledExtensionsForUi(
  installedExtensionsWithDemos,
  $catalogExtensionInfos,
  $featuredExtensionInfos,
  { applyPrototypeUpdateDemo: isSuggestionScope },
);

let extension: Readable<ExtensionDetailsUI | undefined>;

$: extension = derived(
  [catalogExtensionInfos, combinedInstalledExtensions, featuredExtensionInfos, prototypeLifecycleOverlayRevisionStore],
  ([$catalogExtensionInfos, $combinedInstalledExtensions, $featuredExtensionInfos]) => {
    const extensions = isSuggestionScope
      ? extensionsUtils.applyPrototypeUseCaseOverlays($combinedInstalledExtensions)
      : $combinedInstalledExtensions;
    const installedForUi = extensionsUtils.resolveInstalledExtensionsForUi(
      extensions,
      $catalogExtensionInfos,
      $featuredExtensionInfos,
      { applyPrototypeUpdateDemo: isSuggestionScope },
    );
    return extensionsUtils.extractExtensionDetail($catalogExtensionInfos, installedForUi, decodedExtensionId);
  },
);

$: catalogExtension = ((): CatalogExtensionInfoUI | undefined => {
  if (!isSuggestionScope) {
    return undefined;
  }

  uiRevision;
  const info = extensionsUtils.buildCatalogExtensionInfoForId(
    decodedExtensionId,
    $catalogExtensionInfos,
    $featuredExtensionInfos,
    installedExtensionsForUi,
  );
  return info ? withDisplayInstalledVersion(info) : undefined;
})();

$: compatibilityIssues = ((): ReturnType<typeof resolveExtensionCompatibilityIssues> => {
  if (!isSuggestionScope) {
    return [];
  }

  uiRevision;
  return resolveExtensionCompatibilityIssues(
    catalogExtension ?? {
      id: decodedExtensionId,
      displayName: $extension?.displayName ?? decodedExtensionId,
      isInstalled: !!$extension?.installedExtension,
    },
    installedExtensionsForUi,
    podmanDesktopVersion || undefined,
  );
})();

$: lifecycleWarnings = isSuggestionScope ? resolveExtensionLifecycleWarnings($extension?.installedExtension) : [];

$: detailsWarnings = [...lifecycleWarnings, ...mapCompatibilityIssuesToDetailsWarnings(compatibilityIssues)];

onMount(() => {
  async function loadPodmanDesktopVersion(): Promise<void> {
    if (!areExtensionsImprovementsSuggested()) {
      return;
    }

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
  const scopeHandler = (): void => {
    scopeRevision += 1;
  };
  const activatingOverlayUnsubscribe = prototypeLifecycleOverlayRevisionStore.subscribe(() => {
    scopeRevision += 1;
  });
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  window.addEventListener(EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT, scopeHandler);
  return (): void => {
    activatingOverlayUnsubscribe();
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
    window.removeEventListener(EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT, scopeHandler);
  };
});

function openChangeVersion(): void {
  if (!catalogExtension) {
    return;
  }
  changeVersionExtension = catalogExtension;
  changeVersionPreferredVersion = undefined;
}

function closeChangeVersion(): void {
  changeVersionExtension = undefined;
  changeVersionPreferredVersion = undefined;
}
</script>

{#if $extension}
  {#if isSuggestionScope}
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
              onChangeVersion={openChangeVersion}
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
              {#if detailsWarnings.length > 0}
                <ExtensionDetailsWarnings warnings={detailsWarnings} />
              {/if}
              <ExtensionDetailsReadme readme={$extension.readme} />
            </div>
            <SuggestionExtensionDetailsSummaryCard extensionDetails={$extension} {catalogExtension} />
          {:else if screen === 'ERROR'}
            <div class="flex flex-col gap-4 flex-1 min-w-0">
              {#if detailsWarnings.length > 0}
                <ExtensionDetailsWarnings warnings={detailsWarnings} />
              {/if}
              <ExtensionDetailsError extension={$extension} />
            </div>
            <SuggestionExtensionDetailsSummaryCard extensionDetails={$extension} {catalogExtension} />
          {/if}
        </div>
      {/snippet}
    </DetailsPage>
  {:else}
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
          <div class="flex flex-row mt-3">
            <ExtensionStatus status={$extension.type === 'dd' ? 'started' : $extension.state} />
          </div>
        </div>
      {/snippet}
      {#snippet actionsSnippet()}
        <div class="flex items-center space-x-10 w-full">
          {#if $extension.installedExtension}
            <InstalledExtensionActions class="w-48" extension={$extension.installedExtension} />
          {:else if $extension.fetchable}
            <div class="flex flex-1 justify-items-end w-18 flex-col items-end place-content-center">
              <div class="italic text-sm text-[var(--pd-content-text)] pb-3">
                Install this extension with a single click
              </div>
              <FeaturedExtensionDownload extension={$extension} />
            </div>
          {/if}
        </div>
      {/snippet}

      {#snippet detailSnippet()}
        <div class="flex">
          <ExtensionBadge class="mt-2" extension={$extension} />
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
        <div class="flex w-full h-full overflow-y-auto p-5 flex-col">
          {#if screen === 'README'}
            <ExtensionDetailsSummaryCard extensionDetails={$extension} />
            <ExtensionDetailsReadme readme={$extension.readme} />
          {:else if screen === 'ERROR'}
            <ExtensionDetailsError extension={$extension} />
          {/if}
        </div>
      {/snippet}
    </DetailsPage>
  {/if}
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

{#if changeVersionExtension && isSuggestionScope}
  <ChangeVersionModal
    extension={changeVersionExtension}
    preferredVersion={changeVersionPreferredVersion}
    closeCallback={closeChangeVersion} />
{/if}
