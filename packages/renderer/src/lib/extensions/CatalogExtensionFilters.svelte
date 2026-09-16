<script lang="ts">
import { Button, Dropdown, SearchInput } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  catalogListFilters,
  hasActiveCatalogListFilters,
  resetCatalogListFilters,
  setCatalogCategoryFilter,
  setCatalogInstalledFilter,
  toggleCatalogBooleanFilter,
} from './catalog-list-filters.svelte';
import { collectCatalogCategories } from './extension-tag-utils';
import ExtensionFilterCheckbox from './ExtensionFilterCheckbox.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
}

let { catalogExtensions }: Props = $props();

const categories = $derived(collectCatalogCategories(catalogExtensions));
const filters = $derived(catalogListFilters.value);

const installOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'installed', label: 'Installed' },
  { value: 'not-installed', label: 'Not installed' },
];

const installFilterValue = $derived(
  filters.installed === true ? 'installed' : filters.installed === false ? 'not-installed' : 'all',
);

const categoryOptions = $derived([
  { value: '', label: 'All categories' },
  ...categories.map(category => ({ value: category, label: category })),
]);

const categoryFilterValue = $derived(filters.category ?? '');

function handleInstallFilterChange(value: string): void {
  if (value === 'installed') {
    setCatalogInstalledFilter(true);
  } else if (value === 'not-installed') {
    setCatalogInstalledFilter(false);
  } else {
    setCatalogInstalledFilter(undefined);
  }
}

function handleCategoryFilterChange(value: string): void {
  setCatalogCategoryFilter(value || undefined);
}

const hasActiveFilters = $derived(
  hasActiveCatalogListFilters(filters) || catalogListFilters.searchTerm.trim().length > 0,
);

function clearAll(): void {
  resetCatalogListFilters();
}
</script>

<div class="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
  <div class="relative z-50 w-72 shrink-0">
    <SearchInput bind:searchTerm={catalogListFilters.searchTerm} title="extensions" class="w-full" />
  </div>
  <div class="relative z-50 shrink-0">
    <Dropdown
      name="catalogInstallFilter"
      bind:value={(): string => installFilterValue, (v: string): void => handleInstallFilterChange(v)}
      options={installOptions}
      class="min-w-[10.5rem]"
      ariaLabel="Filter by install status" />
  </div>
  {#if categories.length > 0}
    <div class="relative z-50 shrink-0">
      <Dropdown
        name="catalogCategoryFilter"
        bind:value={(): string => categoryFilterValue, (v: string): void => handleCategoryFilterChange(v)}
        options={categoryOptions}
        class="min-w-[10.5rem]"
        ariaLabel="Filter by category" />
    </div>
  {/if}
  <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 pl-1">
    <ExtensionFilterCheckbox
      checked={filters.featured === true}
      label="Featured"
      onToggle={(): void => toggleCatalogBooleanFilter('featured')} />
  </div>
  {#if hasActiveFilters}
    <Button type="link" on:click={clearAll}>Clear</Button>
  {/if}
</div>
