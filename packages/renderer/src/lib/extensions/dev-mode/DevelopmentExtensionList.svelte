<script lang="ts">
import type { ExtensionDevelopmentFolderInfo, ExtensionInfo } from '@podman-desktop/core-api';
import { ExtensionLoaderSettings } from '@podman-desktop/core-api';
import { Button, EmptyScreen, FilteredEmptyScreen, SearchInput } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount, untrack } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import DevelopmentExtensionInstallActions from '/@/lib/extensions/dev-mode/DevelopmentExtensionInstallActions.svelte';
import DevelopmentExtensionListTable from '/@/lib/extensions/dev-mode/table/ListTable.svelte';
import {
  customInstalledRevision,
  isCustomInstalledExtension,
  reconcileCustomInstalledExtensions,
} from '/@/lib/extensions/extension-custom-local';
import {
  mergePrototypeDefaultCustomLocalRows,
  prototypeDefaultCustomLocalRevision,
} from '/@/lib/extensions/extension-custom-local-defaults';
import { prototypeLifecycleOverlayRevisionStore } from '/@/lib/extensions/extension-prototype-lifecycle-overlay.svelte';
import { applyPrototypeUseCaseOverlays } from '/@/lib/extensions/extension-prototype-use-cases';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import { type CombinedExtensionInfoUI, combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { extensionDevelopmentFolders } from '/@/stores/extensionDevelopmentFolders';
import { extensionInfos } from '/@/stores/extensions';

import type { SelectableExtensionDevelopmentFolderInfoUI } from './development-folder-info-ui';
import DevelopmentExtensionEmptyScreen from './DevelopmentExtensionEmptyScreen.svelte';

interface Props {
  /** Suggestion scope: open the Install custom modal from this tab. */
  onInstallCustom?: () => void;
  enableCustomExtensions?: boolean;
}

let { onInstallCustom, enableCustomExtensions = true }: Props = $props();

let isDevelopmentModeEnabled = $state(false);
let searchTerm = $state('');

const unsubscribers: Unsubscriber[] = [];
const suggestionScope = $derived(areExtensionsImprovementsSuggested());

let currentExtFolders: ExtensionDevelopmentFolderInfo[] = $state([]);
let currentExtensionInfos: ExtensionInfo[] = $state([]);
let currentCombinedExtensions: CombinedExtensionInfoUI[] = $state([]);

/** Apply Enabling/Disabling overlays so Status matches Installed tab behavior. */
const displayCombinedExtensions: CombinedExtensionInfoUI[] = $derived.by(() => {
  $prototypeLifecycleOverlayRevisionStore;
  if (!suggestionScope) {
    return currentCombinedExtensions;
  }
  return applyPrototypeUseCaseOverlays(currentCombinedExtensions);
});

const folderRows: SelectableExtensionDevelopmentFolderInfoUI[] = $derived.by(() => {
  $prototypeLifecycleOverlayRevisionStore;
  return currentExtFolders.map(folder => {
    const matchingExtension =
      displayCombinedExtensions.find(ext => ext.path === folder.path) ??
      currentExtensionInfos.find(ext => ext.path === folder.path);
    let extension = undefined;
    let installedExtension: CombinedExtensionInfoUI | undefined = undefined;
    if (matchingExtension) {
      extension = { name: matchingExtension.name, state: matchingExtension.state, id: matchingExtension.id };
      installedExtension =
        'type' in matchingExtension
          ? (matchingExtension as CombinedExtensionInfoUI)
          : displayCombinedExtensions.find(ext => ext.id === matchingExtension.id);
    }

    return {
      ...folder,
      selected: false,
      name: folder.path,
      source: 'folder' as const,
      extension,
      installedExtension,
    };
  });
});

$effect(() => {
  if (!suggestionScope) {
    return;
  }
  // Track only the installed list. Side effects (restore / remember) must be
  // untracked so store bumps cannot re-enter this effect and freeze the UI.
  const extensions = currentCombinedExtensions;
  untrack(() => {
    reconcileCustomInstalledExtensions(extensions);
  });
});

const customRows: SelectableExtensionDevelopmentFolderInfoUI[] = $derived.by(() => {
  if (!suggestionScope) {
    return [];
  }
  customInstalledRevision.value;
  $catalogExtensionInfos;
  $prototypeLifecycleOverlayRevisionStore;
  const folderPaths = new Set(currentExtFolders.map(folder => folder.path));
  return displayCombinedExtensions
    .filter(
      extension => !folderPaths.has(extension.path) && isCustomInstalledExtension(extension, $catalogExtensionInfos),
    )
    .map(extension => ({
      path: extension.path,
      selected: false,
      name: extension.displayName?.trim() ? extension.displayName : extension.name,
      source: 'custom' as const,
      extension: { id: extension.id, name: extension.name, state: extension.state },
      installedExtension: extension,
    }));
});

const selectableExtensionDevelopmentFolders: SelectableExtensionDevelopmentFolderInfoUI[] = $derived.by(() => {
  $prototypeLifecycleOverlayRevisionStore;
  prototypeDefaultCustomLocalRevision.value;
  const realRows = [...folderRows, ...customRows];
  if (!suggestionScope) {
    return realRows;
  }
  // Seed the two documented examples after a prototype refresh when nothing real covers them.
  return mergePrototypeDefaultCustomLocalRows(realRows);
});

const hasListItems = $derived(selectableExtensionDevelopmentFolders.length > 0);

const filteredExtensionDevelopmentFolders = $derived.by(() => {
  const term = searchTerm.trim().toLowerCase();
  if (!term) {
    return selectableExtensionDevelopmentFolders;
  }
  return selectableExtensionDevelopmentFolders.filter(folder => {
    const haystack = [folder.path, folder.name, folder.extension?.name ?? '', folder.extension?.state ?? '']
      .join(' ')
      .toLowerCase();
    return haystack.includes(term);
  });
});

const showFilteredEmpty = $derived(hasListItems && filteredExtensionDevelopmentFolders.length === 0);

onMount(async () => {
  //
  // Check if development mode is enabled
  isDevelopmentModeEnabled =
    (await window.getConfigurationValue(
      `${ExtensionLoaderSettings.SectionName}.${ExtensionLoaderSettings.DevelopmentMode}`,
    )) ?? false;

  // subscribe to extension changes
  unsubscribers.push(
    extensionInfos.subscribe(value => {
      currentExtensionInfos = value;
    }),
  );
  unsubscribers.push(
    extensionDevelopmentFolders.subscribe(value => {
      currentExtFolders = value;
    }),
  );
  unsubscribers.push(
    combinedInstalledExtensions.subscribe(value => {
      currentCombinedExtensions = value;
    }),
  );
});

onDestroy(() => {
  for (const unsubscriber of unsubscribers) {
    unsubscriber();
  }
});

async function addLocalFolderExtension(): Promise<void> {
  // call the openDialog
  const result = await window.openDialog({
    selectors: ['openDirectory'],
    openLabel: 'Select folder',
    title: 'Track a new extension folder',
  });
  if (result?.[0]) {
    try {
      await window.trackExtensionFolder(result[0]);
    } catch (error: unknown) {
      // show error
      await window.showMessageBox({
        title: 'Add Extension Failed',
        message: String(error),
        type: 'error',
        buttons: ['Dismiss'],
      });
    }
  }
}
</script>

{#if suggestionScope}
  <div class="flex grow flex-col py-3">
    <div class="sticky top-0 z-20 bg-[var(--pd-content-bg)] px-5 pb-4 pt-1">
      {#if hasListItems}
        <div class="flex w-full flex-wrap items-center gap-3">
          <div class="relative z-50 w-72 shrink-0">
            <SearchInput bind:searchTerm title="extensions" class="w-full" />
          </div>
          <div class="min-w-0 flex-1"></div>
          <div class="flex shrink-0 flex-wrap items-center gap-2">
            <DevelopmentExtensionInstallActions
              {enableCustomExtensions}
              {onInstallCustom}
              onAddLocalFolder={addLocalFolderExtension} />
          </div>
        </div>
      {:else}
        <!-- Spacer matches Catalog/Installed filter-row height so empty states do not jump. -->
        <div class="h-9" aria-hidden="true"></div>
      {/if}
    </div>

    <div class="grow">
      {#if !isDevelopmentModeEnabled && customRows.length === 0}
        <div class="flex min-h-[40vh] flex-1 items-center justify-center px-5">
          <EmptyScreen
            icon={ExtensionIcon}
            title="Install custom/local extensions"
            message="Install an extension from a container image, or enable Development Mode to track a local folder."
            detail="Use Install custom for OCI images, or add a local folder after enabling Preferences > Extensions > Development Mode.">
            <div class="flex flex-wrap gap-2 justify-center">
              <DevelopmentExtensionInstallActions
                {enableCustomExtensions}
                {onInstallCustom}
                onAddLocalFolder={addLocalFolderExtension} />
            </div>
          </EmptyScreen>
        </div>
      {:else if !hasListItems}
        <div class="flex min-h-[40vh] flex-1 items-center justify-center px-5">
          <EmptyScreen
            icon={ExtensionIcon}
            title="Install custom/local extensions"
            message="Install from a container image or add a folder on your machine to load and test an extension."
            detail="Tracked folders appear here with load status and actions.">
            <div class="flex flex-wrap gap-2 justify-center">
              <DevelopmentExtensionInstallActions
                {enableCustomExtensions}
                {onInstallCustom}
                onAddLocalFolder={addLocalFolderExtension} />
            </div>
          </EmptyScreen>
        </div>
      {:else if showFilteredEmpty}
        <div class="flex min-h-[40vh] flex-1 items-center justify-center px-5">
          <FilteredEmptyScreen
            icon={ExtensionIcon}
            kind="extensions"
            bind:searchTerm
            onResetFilter={(): void => {
              searchTerm = '';
            }} />
        </div>
      {:else}
        <!-- px-5 matches sticky toolbar; ListTable zeros Table's mx-5 to avoid overflow. -->
        <div class="min-w-0 px-5">
          <DevelopmentExtensionListTable extensionFolderUIInfos={filteredExtensionDevelopmentFolders} />
        </div>
      {/if}
    </div>
  </div>
{:else if !isDevelopmentModeEnabled}
  <div class="flex flex-1 w-full items-center justify-center">
    <DevelopmentExtensionEmptyScreen />
  </div>
{:else if selectableExtensionDevelopmentFolders.length === 0}
  <div class="flex flex-1 w-full items-center justify-center">
    <EmptyScreen
      icon={ExtensionIcon}
      title="No local extensions tracked"
      message="Add a folder on your machine to load and test an extension during development."
      detail="Tracked folders appear here with load status and actions.">
      <Button type="primary" on:click={addLocalFolderExtension}>Add a local folder extension...</Button>
    </EmptyScreen>
  </div>
{:else}
  <div class="flex flex-col grow px-5 py-3">
    <div class="mb-4 flex flex-row items-center justify-end">
      <Button on:click={addLocalFolderExtension}>Add a local folder extension...</Button>
    </div>
    <DevelopmentExtensionListTable extensionFolderUIInfos={selectableExtensionDevelopmentFolders} />
  </div>
{/if}
