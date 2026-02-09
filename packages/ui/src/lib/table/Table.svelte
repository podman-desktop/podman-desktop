<style>
.grid-table {
  display: grid;
  grid-template-columns: var(--table-grid-table-columns);
}
</style>

<script lang="ts" generics="T extends { selected?: boolean; name?: string }">
/* eslint-disable import/no-duplicates */
// https://github.com/import-js/eslint-plugin-import/issues/1479
import { onMount, tick } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import Checkbox from '../checkbox/Checkbox.svelte';
import ChevronExpander from '../icons/ChevronExpander.svelte';
import type { ListOrganizerItem } from '../layouts/ListOrganizer';
import ListOrganizer from '../layouts/ListOrganizer.svelte';
/* eslint-enable import/no-duplicates */
import type { Column, Row } from './table';
import { tablePersistence } from './table-persistence-store.svelte';

export let kind: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let columns: Column<T, any>[];
export let row: Row<T>;
export let data: T[];
export let defaultSortColumn: string | undefined = undefined;
export let collapsed: string[] = [];
/**
 * To better distinct individual row, you can provide a dedicated key method
 *
 * By default, it will use the object name property
 */
export let key: (object: T) => string = item => item.name ?? String(item);
/**
 * Specify the aria-label for a given item
 *
 * By default, it will use the object name property
 */
export let label: (object: T) => string = item => item.name ?? String(item);

export let enableLayoutConfiguration: boolean = false;

let columnItems: ListOrganizerItem[] = [];
let columnOrdering = new SvelteMap<string, number>();
let isInitialized = false;
let isLoading = false;

// Initialize default column configuration
function getDefaultColumnItems(): ListOrganizerItem[] {
  return columns.map((col, index) => ({
    id: col.title,
    label: col.title,
    enabled: true,
    originalOrder: index,
  }));
}

// Initialize column configuration
async function initializeColumns(): Promise<void> {
  if (isInitialized || isLoading) return;

  isLoading = true;
  try {
    if (enableLayoutConfiguration) {
      const loadedItems = await loadColumnConfiguration();
      columnItems = loadedItems;
    } else {
      columnItems = getDefaultColumnItems();
    }
    isInitialized = true;
  } catch (error: unknown) {
    console.error('Failed to load column configuration:', error);
    // Fallback to default configuration
    columnItems = getDefaultColumnItems();
    isInitialized = true;
  } finally {
    isLoading = false;
  }
}

// Initialize columns on mount
onMount(async () => {
  await initializeColumns();
});

// Load configuration
async function loadColumnConfiguration(): Promise<ListOrganizerItem[]> {
  if (enableLayoutConfiguration && tablePersistence.storage) {
    const loadedItems = await tablePersistence.storage.load(
      kind,
      columns.map(col => col.title),
    );

    if (loadedItems.length > 0) {
      // Ensure loaded items have proper originalOrder from defaults if missing
      const defaultItems = getDefaultColumnItems();
      const items = loadedItems.map((item: ListOrganizerItem) => ({
        ...item,
        originalOrder: item.originalOrder ?? defaultItems.find(d => d.id === item.id)?.originalOrder ?? 0,
      }));

      // Build ordering map from loaded items
      // Check if items are in a different order than their original order
      const isReordered = items.some((item, index) => item.originalOrder !== index);
      if (isReordered) {
        const ordering = new SvelteMap<string, number>();
        items.forEach((item, index) => {
          ordering.set(item.id, index);
        });
        columnOrdering = ordering;
      } else {
        columnOrdering.clear();
      }

      return items;
    }
  }
  return getDefaultColumnItems();
}

// Save configuration
async function saveColumnConfiguration(): Promise<void> {
  if (enableLayoutConfiguration && tablePersistence.storage) {
    // Create ordered items based on current state
    const orderedItems = getOrderedColumns();
    await tablePersistence.storage.save(kind, orderedItems);
  }
}

// Get ordered columns based on current ordering
function getOrderedColumns(): ListOrganizerItem[] {
  if (columnOrdering.size === 0) {
    return [...columnItems].sort((a, b) => a.originalOrder - b.originalOrder);
  }
  return [...columnItems].sort((a, b) => {
    const aOrder = columnOrdering.get(a.id) ?? a.originalOrder;
    const bOrder = columnOrdering.get(b.id) ?? b.originalOrder;
    return aOrder - bOrder;
  });
}

// Save configuration whenever columnItems or ordering changes (after initialization)
$: if (isInitialized && columnItems.length > 0) {
  columnOrdering;
  saveColumnConfiguration().catch((error: unknown) => {
    console.error('Failed to save column configuration:', error);
  });
}

// Computed visible columns based on configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
$: visibleColumns = ((): Column<T, any>[] => {
  if (columnItems.length === 0) {
    // Fallback to all columns when not yet initialized
    return columns;
  }

  // Get ordered columns inline to ensure reactivity
  const orderedColumns =
    columnOrdering.size === 0
      ? [...columnItems].sort((a, b) => a.originalOrder - b.originalOrder)
      : [...columnItems].sort((a, b) => {
          const aOrder = columnOrdering.get(a.id) ?? a.originalOrder;
          const bOrder = columnOrdering.get(b.id) ?? b.originalOrder;
          return aOrder - bOrder;
        });

  const result = orderedColumns
    .filter(item => item.enabled)
    .map(item => columns.find(col => col.title === item.id)!)
    .filter(Boolean);

  return result;
})();

let tableHtmlDivElement: HTMLDivElement | undefined = undefined;

// number of selected items in the list
export let selectedItemsNumber: number = 0;
$: selectedItemsNumber = row.info.selectable
  ? data.filter(object => row.info.selectable?.(object) && object.selected).length +
    data.reduce(
      (previous, current) =>
        previous +
        (row.info.children?.(current)?.filter(child => row.info.selectable?.(child) && child.selected).length ?? 0),
      0,
    )
  : 0;

// do we need to unselect all checkboxes if we don't have all items being selected ?
let selectedAllCheckboxes = false;
$: selectedAllCheckboxes = row.info.selectable
  ? data.filter(object => row.info.selectable?.(object)).every(object => object.selected) &&
    data
      .reduce(
        (accumulator, current) => {
          const children = row.info.children?.(current);
          if (children) {
            accumulator.push(...children);
          }
          return accumulator;
        },
        [] as Array<T>,
      )
      .filter(child => row.info.selectable?.(child))
      .every(child => child.selected) &&
    data.filter(object => row.info.selectable?.(object)).length > 0
  : false;

function toggleAll(e: CustomEvent<boolean>): void {
  const checked = e.detail;
  if (!row.info.selectable) {
    return;
  }
  data.filter(object => row.info.selectable?.(object)).forEach(object => (object.selected = checked));

  // toggle children
  data.forEach(object => {
    const children = row.info.children?.(object);
    if (children) {
      children.filter(child => row.info.selectable?.(child)).forEach(child => (child.selected = checked));
    }
  });
  data = [...data];
}

let sortCol: Column<T>;
let sortAscending: boolean;

$: if (data && sortCol) {
  sortImpl();
}

function sort(column: Column<T>): void {
  if (!column) {
    return;
  }

  let comparator = column.info.comparator;
  if (!comparator) {
    // column is not sortable
    return;
  }

  if (sortCol === column) {
    sortAscending = !sortAscending;
  } else {
    sortCol = column;
    sortAscending = column.info.initialOrder ? column.info.initialOrder !== 'descending' : true;
  }
  sortImpl();
}

function sortImpl(): void {
  // confirm we're sorting
  if (!sortCol) {
    return;
  }

  let comparator = sortCol.info.comparator;
  if (!comparator) {
    // column is not sortable
    return;
  }

  if (!sortAscending) {
    // we're already sorted, switch to reverse order
    let comparatorTemp = comparator;
    comparator = (a, b): number => -comparatorTemp(a, b);
  }

  // eslint-disable-next-line etc/no-assign-mutated-array
  data = data.sort(comparator);
}

onMount(async () => {
  const column: Column<T> | undefined = columns.find(column => column.title === defaultSortColumn);
  if (column?.info.comparator) {
    sortCol = column;
    sortAscending = column.info.initialOrder ? column.info.initialOrder !== 'descending' : true;
    await tick(); // Ensure all initializations are complete.
    sortImpl(); // Explicitly call sortImpl to sort the data initially.
  }
});

let gridTemplateColumns: string;
$: {
  // section and checkbox columns
  let columnWidths: string[] = ['20px'];

  if (row.info.selectable) {
    columnWidths.push('32px');
  }

  // custom columns
  visibleColumns.map(c => c.info.width ?? '1fr').forEach(w => columnWidths.push(w));

  if (enableLayoutConfiguration && tablePersistence) {
    // Add space for settings icon in header (32px)
    columnWidths.push('32px');
  } else {
    // final spacer
    columnWidths.push('5px');
  }

  gridTemplateColumns = columnWidths.join(' ');
}

function objectChecked(object: T): void {
  // check for children and set them to the same state
  if (row.info.children) {
    const children = row.info.children(object);
    if (children) {
      // event fires before parent changes so use '!'
      children.forEach(child => (child.selected = !object.selected));
    }
  }
}

function toggleChildren(name: string | undefined): void {
  if (!name) {
    return;
  }

  if (collapsed.includes(name)) {
    const index = collapsed.indexOf(name, 0);
    if (index > -1) {
      collapsed.splice(index, 1);
    }
  } else {
    collapsed.push(name);
  }
  // trigger Svelte update
  collapsed = collapsed;
}

// Handle column order changes from ListOrganizer
function handleColumnOrderChange(newOrdering: SvelteMap<string, number>): void {
  columnOrdering = newOrdering;
}

// Handle column toggle changes from ListOrganizer
function handleColumnToggle(itemId: string, enabled: boolean): void {
  columnItems = columnItems.map(item => (item.id === itemId ? { ...item, enabled } : item));
}

// Reset columns to default state and clear saved configuration
async function resetColumns(): Promise<void> {
  try {
    if (enableLayoutConfiguration && tablePersistence.storage) {
      columnItems = await tablePersistence.storage.reset(
        kind,
        columns.map(col => col.title),
      );
      columnOrdering.clear();
    } else {
      columnItems = getDefaultColumnItems();
      columnOrdering.clear();
    }
  } catch (error: unknown) {
    console.error(`Failed to reset column configuration in table ${kind}: ${error}`);
    // Fallback to default configuration
    columnItems = getDefaultColumnItems();
    columnOrdering.clear();
  }
}
</script>

<div
  style="--table-grid-table-columns: {gridTemplateColumns}"
  class="w-full mx-5"
  class:hidden={data.length === 0}
  role="table"
  aria-label={kind}
  bind:this={tableHtmlDivElement}>
  <!-- Table header -->
  <div role="rowgroup" class="relative">
    <div
      class="grid grid-table gap-x-0.5 h-7 sticky top-0 text-[var(--pd-table-header-text)] uppercase z-2"
      role="row">
      <div class="whitespace-nowrap justify-self-start" role="columnheader"></div>
      {#if row.info.selectable}
        <div class="whitespace-nowrap place-self-center" role="columnheader">
          <Checkbox
            title="Toggle all"
            bind:checked={selectedAllCheckboxes}
            disabled={!row.info.selectable || data.filter(object => row.info.selectable?.(object)).length === 0}
            indeterminate={selectedItemsNumber > 0 && !selectedAllCheckboxes}
            on:click={toggleAll} />
        </div>
      {/if}
      {#each visibleColumns as column, index (index)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-interactive-supports-focus -->
        <div
          class="max-w-full overflow-hidden flex flex-row text-sm font-semibold items-center whitespace-nowrap {column
            .info.align === 'right'
            ? 'justify-self-end'
            : column.info.align === 'center'
              ? 'justify-self-center'
              : 'justify-self-start'} self-center select-none"
          class:cursor-pointer={column.info.comparator}
          on:click={sort.bind(undefined, column)}
          role="columnheader">
          <div class="overflow-hidden text-ellipsis">
            {column.title}
          </div>
          {#if column.info.comparator}<i
              class="fas pl-0.5"
              class:fa-sort={sortCol !== column}
              class:fa-sort-up={sortCol === column && sortAscending}
              class:fa-sort-down={sortCol === column && !sortAscending}
              class:text-[var(--pd-table-header-unsorted)]={sortCol !== column}
              aria-hidden="true"></i
            >{/if}
        </div>
      {/each}
      <!-- Empty space for settings - only when layout configuration is enabled -->
      {#if enableLayoutConfiguration && tablePersistence.storage}
        <div class="whitespace-nowrap justify-self-end place-self-center" role="columnheader"></div>
      {/if}
    </div>

    <!-- Settings - only show when layout configuration is enabled -->
    {#if enableLayoutConfiguration && tablePersistence.storage}
      <div class="absolute top-0 right-0 h-7 flex items-center pr-2 z-10">
        <ListOrganizer
          items={columnItems}
          ordering={columnOrdering}
          title="Configure Columns"
          enableReorder={true}
          enableToggle={true}
          onOrderChange={handleColumnOrderChange}
          onToggle={handleColumnToggle}
          onReset={resetColumns}
          resetButtonLabel="Reset to default"
        />
      </div>
    {/if}
  </div>
  <!-- Table body -->
  <div role="rowgroup">
    {#each data as object (object)}
      {@const children = row.info.children?.(object) ?? []}
      {@const itemKey = key(object)}
      <div class="min-h-[48px] h-fit bg-[var(--pd-content-card-bg)] rounded-lg mb-2 border border-[var(--pd-content-table-border)]">
        <div
          class="grid grid-table gap-x-0.5 min-h-[48px] hover:bg-[var(--pd-content-card-hover-bg)]"
          class:rounded-t-lg={!collapsed.includes(itemKey) &&
            children.length > 0}
          class:rounded-lg={collapsed.includes(itemKey) ||
            children.length === 0}
          role="row"
          aria-label={label(object)}>
          <div class="whitespace-nowrap place-self-center" role="cell">
            {#if children.length > 0}
              <button
                title={collapsed.includes(itemKey) ? 'Expand Row' : 'Collapse Row'}
                aria-expanded={!collapsed.includes(itemKey)}
                on:click={toggleChildren.bind(undefined, itemKey)}
              >
                <ChevronExpander
                  expanded={!collapsed.includes(itemKey)}
                  size="0.8x"
                  class="text-[var(--pd-table-body-text)] cursor-pointer" />
              </button>
            {/if}
          </div>
          {#if row.info.selectable}
            <div class="whitespace-nowrap place-self-center" role="cell">
              <Checkbox
                title="Toggle {kind}"
                bind:checked={object.selected}
                disabled={!row.info.selectable(object)}
                disabledTooltip={row.info.disabledText}
                on:click={objectChecked.bind(undefined, object)} />
            </div>
          {/if}
          {#each visibleColumns as column, index (index)}
            <div
              class="whitespace-nowrap {column.info.align === 'right'
                ? 'justify-self-end'
                : column.info.align === 'center'
                  ? 'justify-self-center'
                  : 'justify-self-start'} self-center {column.info.overflow === true
                ? ''
                : 'overflow-hidden'} max-w-full py-1.5"
              class:col-span-2={index === visibleColumns.length - 1 && enableLayoutConfiguration && tablePersistence.storage}
              role="cell">
              {#if column.info.renderer}
                <svelte:component
                  this={column.info.renderer}
                  object={column.info.renderMapping ? column.info.renderMapping(object) : object} />
              {/if}
            </div>
          {/each}
        </div>

        <!-- Child objects -->
        {#if !collapsed.includes(itemKey) && children.length > 0}
          {#each children as child, i (child)}
            <div
              class="grid grid-table gap-x-0.5 hover:bg-[var(--pd-content-card-hover-bg)]"
              class:rounded-b-lg={i === children.length - 1}
              role="row"
              aria-label={child.name}>
              <div class="whitespace-nowrap justify-self-start" role="cell"></div>
              {#if row.info.selectable}
                <div class="whitespace-nowrap place-self-center" role="cell">
                  <Checkbox
                    title="Toggle {kind}"
                    bind:checked={child.selected}
                    disabled={!row.info.selectable(child)}
                    disabledTooltip={row.info.disabledText} />
                </div>
              {/if}
              {#each visibleColumns as column, index (index)}
                <div
                  class="whitespace-nowrap {column.info.align === 'right'
                    ? 'justify-self-end'
                    : column.info.align === 'center'
                      ? 'justify-self-center'
                      : 'justify-self-start'} self-center {column.info.overflow === true
                    ? ''
                    : 'overflow-hidden'} max-w-full py-1.5"
                  class:col-span-2={index === visibleColumns.length - 1 && enableLayoutConfiguration && tablePersistence.storage}
                  role="cell">
                  {#if column.info.renderer}
                    <svelte:component
                      this={column.info.renderer}
                      object={column.info.renderMapping ? column.info.renderMapping(child) : child} />
                  {/if}
                </div>
              {/each}
            </div>
          {/each}
        {/if}
      </div>
    {/each}
  </div>
</div>
