<script lang="ts">
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { Button, FilteredEmptyScreen, NavPage, Tab } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import type { ExtensionListScreen } from '/@/lib/extensions/extension-list';
import InstalledExtensionList from '/@/lib/extensions/InstalledExtensionList.svelte';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import { SearchTermParser } from '/@/lib/search/search-term-parser';
import { type CombinedExtensionInfoUI, combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  catalogListFilters,
  hasActiveCatalogListFilters,
  resetCatalogListFilters,
} from './catalog-list-filters.svelte';
import CatalogExtensionList from './CatalogExtensionList.svelte';
import DevelopmentExtensionList from './dev-mode/DevelopmentExtensionList.svelte';
import { buildExtensionsListPath } from './extension-list';
import { showPostInstallTooltipDemo } from './extension-prototype-post-install-tooltip-demo';
import { arePrototypeUseCasesEnabled } from './extension-prototype-use-cases';
import { EXTENSION_VERSION_UI_CHANGE_EVENT } from './extension-version-update.svelte';
import {
  areExtensionsImprovementsSuggested,
  EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT,
} from './extensions-prototype-scope';
import { ExtensionsUtils } from './extensions-utils';
import {
  hasActiveInstalledListFilters,
  installedListFilters,
  resetInstalledListFilters,
} from './installed-list-filters.svelte';
import InstallManuallyExtensionModal from './InstallManuallyExtensionModal.svelte';

interface Props {
  searchTerm?: string;
  screen?: ExtensionListScreen;
}

let { searchTerm = '', screen = 'installed' }: Props = $props();

const extensionsUtils = new ExtensionsUtils();
let versionUiRevision = $state(0);
let scopeRevision = $state(0);

const isSuggestionScope = $derived.by(() => {
  scopeRevision;
  return areExtensionsImprovementsSuggested();
});

onMount(() => {
  const versionHandler = (): void => {
    versionUiRevision += 1;
  };
  const scopeHandler = (): void => {
    scopeRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, versionHandler);
  window.addEventListener(EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT, scopeHandler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, versionHandler);
    window.removeEventListener(EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT, scopeHandler);
  };
});

let enableCustomExtensions = $derived(
  (await window.getConfigurationValue('extensions.customExtensions.enabled')) ?? true,
);

let enableLocalExtensions = $derived(
  (await window.getConfigurationValue('extensions.localExtensions.enabled')) ?? true,
);

let enableCatalog = $derived((await window.getConfigurationValue('extensions.catalog.enabled')) ?? true);

const installedExtensionsWithDemos: CombinedExtensionInfoUI[] = $derived(
  isSuggestionScope
    ? extensionsUtils.applyPrototypeUseCaseOverlays($combinedInstalledExtensions)
    : $combinedInstalledExtensions,
);

const installedCatalogById = $derived.by(() => {
  if (!isSuggestionScope) {
    return new Map<string, CatalogExtensionInfoUI>();
  }

  $catalogExtensionInfos;
  $featuredExtensionInfos;
  const catalogExtensions = installedExtensionsWithDemos.map(extension =>
    extensionsUtils.buildCatalogInfoForInstalled(extension, $catalogExtensionInfos, $featuredExtensionInfos),
  );
  return new Map(extensionsUtils.ensurePrototypeUpdateDemo(catalogExtensions).map(catalog => [catalog.id, catalog]));
});

const filteredInstalledExtensions: CombinedExtensionInfoUI[] = $derived.by(() => {
  versionUiRevision;
  if (isSuggestionScope) {
    return extensionsUtils.filterInstalledExtensions(
      installedExtensionsWithDemos,
      searchTerm,
      installedListFilters.value,
      installedCatalogById,
    );
  }

  return extensionsUtils.filterInstalledExtensions($combinedInstalledExtensions, searchTerm);
});

let filteredInstalledItems: number = $derived($combinedInstalledExtensions.length - filteredInstalledExtensions.length);

// combine data from featured extensions and catalog extension
// need to add in the catalog extension a flag to know if extension is featured or not
// and featured extensions need to be displayed first
const enhancedCatalogExtensions: CatalogExtensionInfoUI[] = $derived.by(() => {
  const catalogExtensions = extensionsUtils.extractCatalogExtensions(
    $catalogExtensionInfos,
    $featuredExtensionInfos,
    isSuggestionScope ? installedExtensionsWithDemos : $combinedInstalledExtensions,
  );

  return isSuggestionScope ? extensionsUtils.ensurePrototypeUpdateDemo(catalogExtensions) : catalogExtensions;
});

const filteredCatalogExtensions: CatalogExtensionInfoUI[] = $derived(
  isSuggestionScope
    ? extensionsUtils.filterCatalogExtensions(enhancedCatalogExtensions, searchTerm, catalogListFilters.value)
    : extensionsUtils.filterCatalogExtensions(enhancedCatalogExtensions, searchTerm),
);

let filteredCatalogItems: number = $derived(enhancedCatalogExtensions.length - filteredCatalogExtensions.length);

const showCatalogFilterEmpty = $derived(
  isSuggestionScope &&
    screen === 'catalog' &&
    enableCatalog &&
    filteredCatalogExtensions.length === 0 &&
    (!!searchTerm || hasActiveCatalogListFilters()),
);
const showInstalledFilterEmpty = $derived(
  isSuggestionScope &&
    screen === 'installed' &&
    filteredInstalledExtensions.length === 0 &&
    (!!searchTerm || hasActiveInstalledListFilters()),
);
const showInstalledSearchEmpty = $derived(
  !isSuggestionScope && screen === 'installed' && !!searchTerm && filteredInstalledExtensions.length === 0,
);
const showCatalogSearchEmpty = $derived(
  !isSuggestionScope && screen === 'catalog' && !!searchTerm && filteredCatalogExtensions.length === 0,
);

function closeModal(): void {
  installManualImageModal = false;
}

function handleExtensionInstalled(extensionId: string): void {
  console.log(`[DTUX-2854] Extension installed from catalog: ${extensionId}`);
}

let installManualImageModal: boolean = $state(false);
let prototypeTooltipDemoMessage = $state('');

async function previewPostInstallTooltipDemo(): Promise<void> {
  prototypeTooltipDemoMessage = '';
  const result = await showPostInstallTooltipDemo();
  if (!result.shown && result.message) {
    prototypeTooltipDemoMessage = result.message;
  }
}

let previousScreen: ExtensionListScreen | undefined;

$effect(() => {
  const currentScreen = screen;
  if (previousScreen === undefined) {
    previousScreen = currentScreen;
    return;
  }
  if (previousScreen === currentScreen) {
    return;
  }

  searchTerm = new SearchTermParser(searchTerm, ExtensionsUtils.CATALOG_FILTERS).terms.join(' ');
  if (currentScreen !== 'catalog') {
    resetCatalogListFilters();
  }
  if (currentScreen !== 'installed') {
    resetInstalledListFilters();
  }
  previousScreen = currentScreen;
});
</script>

<NavPage
  bind:searchTerm={searchTerm}
  title="extensions"
  searchEnabled={isSuggestionScope ? screen !== 'installed' && screen !== 'catalog' : true}>
  {#snippet additionalActions()}
    {#if enableCatalog && arePrototypeUseCasesEnabled() && screen === 'catalog'}
      <Button
        type="secondary"
        on:click={(): void => {
          previewPostInstallTooltipDemo().catch((error: unknown) => {
            console.error('Unable to preview post-install tooltip demo', error);
          });
        }}
        title="Preview the post-install sidebar tooltip with Learn"
        aria-label="Preview install tooltip">Preview install tooltip</Button>
    {/if}
    {#if enableCustomExtensions}
      <Button
        on:click={(): void => {
          installManualImageModal = true;
        }}
        icon={faCloudDownload}
        title="Install manually an extension"
        aria-label="Install custom">Install custom...</Button>
    {/if}
  {/snippet}

  {#snippet bottomAdditionalActions()}
    {#if !isSuggestionScope}
      {#if filteredInstalledItems > 0 && screen === 'installed'}
        <div class="text-sm text-[var(--pd-content-text)]">
          Filtered out {filteredInstalledItems} items of {$combinedInstalledExtensions.length}
        </div>
      {:else if filteredCatalogItems > 0 && screen === 'catalog'}
        <div class="text-sm text-[var(--pd-content-text)]">
          Filtered out {filteredCatalogItems} items of {enhancedCatalogExtensions.length}
        </div>
      {/if}
    {/if}
  {/snippet}

  {#snippet tabs()}
    <Tab
      title="Installed"
      selected={screen === 'installed'}
      url={buildExtensionsListPath('installed', searchTerm)} />
    {#if enableCatalog}
      <Tab
        title="Catalog"
        selected={screen === 'catalog'}
        url={buildExtensionsListPath('catalog', searchTerm)} />
    {/if}
    {#if enableLocalExtensions}
      <Tab
        title="Local Extensions"
        selected={screen === 'development'}
        url={buildExtensionsListPath('development', searchTerm)} />
    {/if}
  {/snippet}

  {#snippet content()}
  {#if isSuggestionScope}
  <div class="flex min-w-full h-full flex-1">
    {#if screen === 'installed'}
      {#if showInstalledSearchEmpty}
        <div class="px-5 pt-3">
          <FilteredEmptyScreen
            icon={ExtensionIcon}
            kind="extensions"
            bind:searchTerm
            onResetFilter={(): void => {
              searchTerm = '';
            }} />
        </div>
      {/if}
      <InstalledExtensionList
        suggestionScope={true}
        bind:searchTerm
        extensionInfos={filteredInstalledExtensions}
        allExtensionInfos={installedExtensionsWithDemos}
        showFilteredEmpty={showInstalledFilterEmpty}
        onResetFilter={(): void => {
          searchTerm = '';
          resetInstalledListFilters();
        }} />
    {:else if screen === 'catalog' && enableCatalog}
      {#if showCatalogSearchEmpty}
        <div class="px-5 pt-3">
          <FilteredEmptyScreen
            icon={ExtensionIcon}
            kind="extensions"
            bind:searchTerm
            onResetFilter={(): void => {
              searchTerm = '';
            }} />
        </div>
      {/if}
      {#if prototypeTooltipDemoMessage}
        <div class="px-5 pt-3 text-sm text-[var(--pd-status-warning)]">{prototypeTooltipDemoMessage}</div>
      {/if}
      <CatalogExtensionList
        suggestionScope={true}
        showEmptyScreen={!searchTerm && !hasActiveCatalogListFilters()}
        showFilteredEmpty={showCatalogFilterEmpty}
        bind:searchTerm
        onResetFilter={(): void => {
          searchTerm = '';
          resetCatalogListFilters();
        }}
        allCatalogExtensions={enhancedCatalogExtensions}
        catalogExtensions={filteredCatalogExtensions}
        oninstall={handleExtensionInstalled} />
    {:else if screen === 'development' && enableLocalExtensions}
      <DevelopmentExtensionList />
    {/if}
  </div>
  {:else}
  <div class="flex min-w-full h-full">
    {#if screen === 'installed'}
      {#if searchTerm && filteredInstalledExtensions.length === 0}
        <FilteredEmptyScreen
          icon={ExtensionIcon}
          kind="extensions"
          bind:searchTerm
          onResetFilter={(): void => {
            searchTerm = '';
          }} />
      {/if}
      <InstalledExtensionList suggestionScope={false} extensionInfos={filteredInstalledExtensions} />
    {:else if screen === 'catalog' && enableCatalog}
      {#if searchTerm && filteredCatalogExtensions.length === 0}
        <FilteredEmptyScreen
          icon={ExtensionIcon}
          kind="extensions"
          bind:searchTerm
          onResetFilter={(): void => {
            searchTerm = '';
          }} />
      {/if}
      <CatalogExtensionList
        suggestionScope={false}
        showEmptyScreen={!searchTerm}
        catalogExtensions={filteredCatalogExtensions} />
    {:else if screen === 'development' && enableLocalExtensions}
      <DevelopmentExtensionList />
    {/if}
  </div>
  {/if}
  {/snippet}
</NavPage>

{#if installManualImageModal}
  <InstallManuallyExtensionModal
    closeCallback={closeModal} />
{/if}
