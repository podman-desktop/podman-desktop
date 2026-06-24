<script lang="ts">
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { SearchInput } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import { type Unsubscriber } from 'svelte/store';

import type { ContextUI } from '/@/lib/context/context';
import {
  getExtensionPreferencesSectionTitle,
  matchesExtensionAutoUpdateSearch,
  resolveExtensionPreferenceCatalog,
  shouldShowExtensionAutoUpdatePreference,
} from '/@/lib/extensions/extension-auto-update-preference';
import {
  matchesExtensionLifecycleSearch,
  shouldShowExtensionLifecyclePreference,
} from '/@/lib/extensions/extension-lifecycle-preference';
import {
  matchesExtensionRemoveSearch,
  shouldShowExtensionRemovePreference,
} from '/@/lib/extensions/extension-remove-preference';
import {
  matchesExtensionVersionSearch,
  shouldShowExtensionVersionPreference,
} from '/@/lib/extensions/extension-version-preference';
import {
  EXTENSION_VERSION_UI_CHANGE_EVENT,
  withDisplayInstalledVersion,
} from '/@/lib/extensions/extension-version-update.svelte';
import ExtensionAutomaticUpdatesPreference from '/@/lib/extensions/ExtensionAutomaticUpdatesPreference.svelte';
import ExtensionLifecyclePreference from '/@/lib/extensions/ExtensionLifecyclePreference.svelte';
import ExtensionRemovePreference from '/@/lib/extensions/ExtensionRemovePreference.svelte';
import { ExtensionsUtils } from '/@/lib/extensions/extensions-utils';
import ExtensionVersionPreference from '/@/lib/extensions/ExtensionVersionPreference.svelte';
import Route from '/@/Route.svelte';
import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { context } from '/@/stores/context';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import PreferencesRenderingItem from './PreferencesRenderingItem.svelte';
import SettingsPage from './SettingsPage.svelte';
import { isDefaultScope, isPropertyValidInContext } from './Util';

interface Props {
  properties: IConfigurationPropertyRecordedSchema[];
  key: string;
  searchValue?: string;
}

let { properties = [], key, searchValue = '' }: Props = $props();

const extensionsUtils = new ExtensionsUtils();
let versionUiRevision = $state(0);

const extensionPreferenceCatalog = $derived.by(() => {
  versionUiRevision;
  $combinedInstalledExtensions;
  $catalogExtensionInfos;
  $featuredExtensionInfos;
  const catalog = resolveExtensionPreferenceCatalog(
    key,
    $combinedInstalledExtensions,
    $catalogExtensionInfos,
    $featuredExtensionInfos,
    extensionsUtils,
  );

  return catalog ? withDisplayInstalledVersion(catalog) : undefined;
});

const showExtensionAutoUpdatePreference = $derived(
  !!extensionPreferenceCatalog &&
    shouldShowExtensionAutoUpdatePreference(extensionPreferenceCatalog) &&
    matchesExtensionAutoUpdateSearch(searchValue),
);

const showExtensionVersionPreference = $derived(
  !!extensionPreferenceCatalog &&
    shouldShowExtensionVersionPreference(extensionPreferenceCatalog) &&
    matchesExtensionVersionSearch(searchValue),
);

const showExtensionLifecyclePreference = $derived(
  !!extensionPreferenceCatalog &&
    shouldShowExtensionLifecyclePreference(extensionPreferenceCatalog) &&
    matchesExtensionLifecycleSearch(searchValue),
);

const showExtensionRemovePreference = $derived(
  !!extensionPreferenceCatalog &&
    shouldShowExtensionRemovePreference(extensionPreferenceCatalog) &&
    matchesExtensionRemoveSearch(searchValue),
);

const showExtensionPreferences = $derived(
  showExtensionAutoUpdatePreference ||
    showExtensionVersionPreference ||
    showExtensionLifecyclePreference ||
    showExtensionRemovePreference,
);

// Context variables
let contextsUnsubscribe: Unsubscriber;
let globalContext: ContextUI;

// Search and matching records
let updateSearchValueTimeout: NodeJS.Timeout;
const matchingRecords = $derived(
  properties
    .filter(property => property.parentId.startsWith(key) && isDefaultScope(property.scope) && !property.hidden)
    .filter(property => isPropertyValidInContext(property.when, globalContext))
    .filter(
      property =>
        !searchValue ||
        matchValue(property.title, searchValue) ||
        (!!property.description && matchValue(property.description, searchValue)) ||
        (!!property.markdownDescription && matchValue(property.markdownDescription, searchValue)),
    )
    .reduce((map, property) => {
      if (!map.has(property.parentId)) {
        map.set(property.parentId, []);
      }
      map.get(property.parentId)?.push(property);
      return map;
    }, new Map<string, IConfigurationPropertyRecordedSchema[]>()),
);

onMount(() => {
  contextsUnsubscribe = context.subscribe(value => {
    globalContext = value;
  });

  const versionUiHandler = (): void => {
    versionUiRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, versionUiHandler);

  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, versionUiHandler);
  };
});

onDestroy(() => {
  if (contextsUnsubscribe) {
    contextsUnsubscribe();
  }
});

function matchValue(text: string, searchValue: string): boolean {
  if (!text) {
    return false;
  }
  return text.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateSearchValue(event: any): void {
  clearTimeout(updateSearchValueTimeout);
  updateSearchValueTimeout = setTimeout(() => (searchValue = event.target.value), 500);
}
</script>

{#snippet extensionPreferenceCards()}
  {#if showExtensionAutoUpdatePreference && extensionPreferenceCatalog}
    <div class="bg-[var(--pd-invert-content-card-bg)] rounded-md mt-2 ml-2">
      <ExtensionAutomaticUpdatesPreference extension={extensionPreferenceCatalog} />
    </div>
  {/if}
  {#if showExtensionVersionPreference && extensionPreferenceCatalog}
    <div class="bg-[var(--pd-invert-content-card-bg)] rounded-md mt-2 ml-2">
      <ExtensionVersionPreference extension={extensionPreferenceCatalog} />
    </div>
  {/if}
  {#if showExtensionLifecyclePreference && extensionPreferenceCatalog}
    <div class="bg-[var(--pd-invert-content-card-bg)] rounded-md mt-2 ml-2">
      <ExtensionLifecyclePreference extension={extensionPreferenceCatalog} />
    </div>
  {/if}
  {#if showExtensionRemovePreference && extensionPreferenceCatalog}
    <div class="bg-[var(--pd-invert-content-card-bg)] rounded-md mt-2 ml-2">
      <ExtensionRemovePreference extension={extensionPreferenceCatalog} />
    </div>
  {/if}
{/snippet}

<Route path="/" breadcrumb={key}>
  <SettingsPage title="Preferences">
    {#snippet header()}
        <SearchInput  title="preferences" class="mt-4" oninput={updateSearchValue} />
      {/snippet}
    <div class="flex flex-col space-y-5 text-[var(--pd-content-header)] pb-2">
      {#if matchingRecords.size === 0 && !showExtensionPreferences}
        <div>No Settings Found</div>
      {:else}
        {#each [...matchingRecords.keys()].sort((a, b) => a.localeCompare(b)) as configSection, index (index)}
          {@const records = matchingRecords.get(configSection)}
          {@const showExtensionPrefsInSection =
            showExtensionPreferences && extensionPreferenceCatalog && configSection === key}
          {#if records}
            <div>
              <div class="text-lg font-medium first-letter:uppercase">{records.at(0)?.title}</div>
              {#each records as configItem (configItem.id)}
                <div class="bg-[var(--pd-invert-content-card-bg)] rounded-md mt-2 ml-2">
                  <PreferencesRenderingItem record={configItem} />
                </div>
              {/each}
              {#if showExtensionPrefsInSection}
                <!-- eslint-disable-next-line sonarjs/no-use-of-empty-return-value -- Svelte snippet render -->
                {@render extensionPreferenceCards()}
              {/if}
            </div>
          {/if}
        {/each}
        {#if showExtensionPreferences && extensionPreferenceCatalog && !matchingRecords.has(key)}
          <div>
            <div class="text-lg font-medium">
              {getExtensionPreferencesSectionTitle(extensionPreferenceCatalog.displayName)}
            </div>
            <!-- eslint-disable-next-line sonarjs/no-use-of-empty-return-value -- Svelte snippet render -->
            {@render extensionPreferenceCards()}
          </div>
        {/if}
      {/if}
    </div>
  </SettingsPage>
</Route>
