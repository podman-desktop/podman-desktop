<script lang="ts">
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { Button, FilteredEmptyScreen, NavPage } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import type { ExtensionListScreen } from '/@/lib/extensions/extension-list';
import InstalledExtensionList from '/@/lib/extensions/InstalledExtensionList.svelte';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import { SearchTermParser } from '/@/lib/search/search-term-parser';
import { type CombinedExtensionInfoUI, combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionList from './CatalogExtensionList.svelte';
import DevelopmentExtensionList from './dev-mode/DevelopmentExtensionList.svelte';
import { markNewlyInstalled } from './extension-catalog-settings.svelte';
import { buildExtensionsListPath } from './extension-list';
import { showPostInstallTooltipDemo } from './extension-prototype-post-install-tooltip-demo';
import { arePrototypeUseCasesEnabled } from './extension-prototype-use-cases';
import { ExtensionsUtils } from './extensions-utils';
import InstallManuallyExtensionModal from './InstallManuallyExtensionModal.svelte';

interface Props {
  searchTerm?: string;
  screen?: ExtensionListScreen;
}

let { searchTerm = '', screen = 'installed' }: Props = $props();

const extensionsUtils = new ExtensionsUtils();

let enableCustomExtensions = $derived(
  (await window.getConfigurationValue('extensions.customExtensions.enabled')) ?? true,
);

let enableLocalExtensions = $derived(
  (await window.getConfigurationValue('extensions.localExtensions.enabled')) ?? true,
);

let enableCatalog = $derived((await window.getConfigurationValue('extensions.catalog.enabled')) ?? true);

const installedExtensionsWithDemos: CombinedExtensionInfoUI[] = $derived(
  extensionsUtils.applyPrototypeUseCaseOverlays($combinedInstalledExtensions),
);

const filteredInstalledExtensions: CombinedExtensionInfoUI[] = $derived(
  extensionsUtils.filterInstalledExtensions(installedExtensionsWithDemos, searchTerm),
);

let filteredInstalledItems: number = $derived(installedExtensionsWithDemos.length - filteredInstalledExtensions.length);
// combine data from featured extensions and catalog extension
// need to add in the catalog extension a flag to know if extension is featured or not
// and featured extensions need to be displayed first
const enhancedCatalogExtensions: CatalogExtensionInfoUI[] = $derived(
  extensionsUtils.ensurePrototypeUpdateDemo(
    extensionsUtils.extractCatalogExtensions(
      $catalogExtensionInfos,
      $featuredExtensionInfos,
      installedExtensionsWithDemos,
    ),
  ),
);

const filteredCatalogExtensions: CatalogExtensionInfoUI[] = $derived(
  extensionsUtils.filterCatalogExtensions(enhancedCatalogExtensions, searchTerm),
);

let filteredCatalogItems: number = $derived(enhancedCatalogExtensions.length - filteredCatalogExtensions.length);

const showInstalledFilterEmpty = $derived(
  screen === 'installed' && !!searchTerm && filteredInstalledExtensions.length === 0,
);
const showCatalogFilterEmpty = $derived(
  screen === 'catalog' && enableCatalog && !!searchTerm && filteredCatalogExtensions.length === 0,
);
const showFilterEmptyScreen = $derived(showInstalledFilterEmpty || showCatalogFilterEmpty);

function closeModal(): void {
  installManualImageModal = false;
}

function handleExtensionInstalled(extensionId: string): void {
  console.log(`[DTUX-2854] Extension installed from catalog: ${extensionId}`);
  markNewlyInstalled(extensionId);
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

function changeScreen(newScreen: ExtensionListScreen): void {
  if (screen === newScreen) {
    return;
  }
  screen = newScreen;
  searchTerm = new SearchTermParser(searchTerm, ExtensionsUtils.CATALOG_FILTERS).terms.join(' ');
  router.goto(buildExtensionsListPath(newScreen, searchTerm));
}
</script>

<NavPage bind:searchTerm={searchTerm} title="extensions">
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
    {#if !showFilterEmptyScreen}
      {#if filteredInstalledItems > 0 && screen === 'installed'}
        <div class="text-sm text-[var(--pd-content-text)]">
          Filtered out {filteredInstalledItems} items of {installedExtensionsWithDemos.length}
        </div>
      {:else if filteredCatalogItems > 0 && screen === 'catalog'}
        <div class="text-sm text-[var(--pd-content-text)]">
          Filtered out {filteredCatalogItems} items of {enhancedCatalogExtensions.length}
        </div>
      {/if}
    {/if}
  {/snippet}

  {#snippet tabs()}
    <Button
      type="tab"
      on:click={(): void => {
        changeScreen('installed');
      }}
      selected={screen === 'installed'}>Installed</Button>
    {#if enableCatalog}
      <Button
        type="tab"
        on:click={(): void => {
          changeScreen('catalog');
        }}
        selected={screen === 'catalog'}>Catalog</Button>
    {/if}
    {#if enableLocalExtensions}
      <Button
        type="tab"
        on:click={(): void => {
          changeScreen('development');
        }}
        selected={screen === 'development'}>Local Extensions</Button>
    {/if}
 {/snippet}

  {#snippet content()}
  <div class="flex min-w-full h-full flex-1">
    {#if screen === 'installed'}
      {#if showInstalledFilterEmpty}
        <div class="flex flex-1 w-full items-center justify-center">
          <FilteredEmptyScreen
            icon={ExtensionIcon}
            kind="extensions"
            bind:searchTerm={searchTerm}
            onResetFilter={(): void => {
              searchTerm = '';
            }} />
        </div>
      {:else}
        <InstalledExtensionList extensionInfos={filteredInstalledExtensions} />
      {/if}
    {:else if screen === 'catalog' && enableCatalog}
      {#if prototypeTooltipDemoMessage}
        <div class="px-5 pt-3 text-sm text-[var(--pd-status-warning)]">{prototypeTooltipDemoMessage}</div>
      {/if}
      {#if showCatalogFilterEmpty}
        <div class="flex flex-1 w-full items-center justify-center">
          <FilteredEmptyScreen
            icon={ExtensionIcon}
            kind="extensions"
            bind:searchTerm={searchTerm}
            onResetFilter={(): void => {
              searchTerm = '';
            }} />
        </div>
      {:else}
        <CatalogExtensionList
          showEmptyScreen={!searchTerm}
          catalogExtensions={filteredCatalogExtensions}
          oninstall={handleExtensionInstalled} />
      {/if}
    {:else if screen === 'development' && enableLocalExtensions}
      <DevelopmentExtensionList />
    {/if}
  </div>
  {/snippet}
</NavPage>

{#if installManualImageModal}
  <InstallManuallyExtensionModal
    closeCallback={closeModal} />
{/if}
