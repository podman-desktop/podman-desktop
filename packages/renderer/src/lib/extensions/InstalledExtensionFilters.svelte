<script lang="ts">
import { Button, Dropdown, SearchInput } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { collectCatalogCategories } from './extension-tag-utils';
import ExtensionFilterCheckbox from './ExtensionFilterCheckbox.svelte';
import {
  hasActiveInstalledListFilters,
  installedListFilters,
  resetInstalledListFilters,
  setInstalledCategoryFilter,
  toggleInstalledBooleanFilter,
} from './installed-list-filters.svelte';

interface Props {
  catalogExtensions: CatalogExtensionInfoUI[];
  searchTerm?: string;
}

let { catalogExtensions, searchTerm = $bindable('') }: Props = $props();

const categories = $derived(collectCatalogCategories(catalogExtensions));
const filters = $derived(installedListFilters.value);

const categoryOptions = $derived([
  { value: '', label: 'All categories' },
  ...categories.map(category => ({ value: category, label: category })),
]);

const categoryFilterValue = $derived(filters.category ?? '');

function handleCategoryFilterChange(value: string): void {
  setInstalledCategoryFilter(value || undefined);
}
</script>

<div class="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
  <div class="relative z-50 w-72 shrink-0">
    <SearchInput bind:searchTerm title="extensions" class="w-full" />
  </div>
  {#if categories.length > 0}
    <div class="relative z-50 shrink-0">
      <Dropdown
        name="installedCategoryFilter"
        value={categoryFilterValue}
        options={categoryOptions}
        onChange={handleCategoryFilterChange}
        class="min-w-[10.5rem]"
        ariaLabel="Filter by category" />
    </div>
  {/if}
  <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 pl-1">
    <ExtensionFilterCheckbox
      checked={filters.verified === true}
      label="Verified"
      onToggle={(): void => toggleInstalledBooleanFilter('verified')} />
    <ExtensionFilterCheckbox
      checked={filters.featured === true}
      label="Featured"
      onToggle={(): void => toggleInstalledBooleanFilter('featured')} />
    <ExtensionFilterCheckbox
      checked={filters.builtIn === true}
      label="Built-in"
      onToggle={(): void => toggleInstalledBooleanFilter('builtIn')} />
    <ExtensionFilterCheckbox
      checked={filters.hasUpdate === true}
      label="Has update"
      onToggle={(): void => toggleInstalledBooleanFilter('hasUpdate')} />
  </div>
  {#if hasActiveInstalledListFilters()}
    <Button type="link" on:click={resetInstalledListFilters}>Clear</Button>
  {/if}
</div>
