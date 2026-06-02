<script lang="ts" generics="T extends { selected?: boolean; name?: string }">
import { createEventDispatcher, onMount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import Checkbox from '../checkbox/Checkbox.svelte';
import ChevronExpander from '../icons/ChevronExpander.svelte';
import type { ListOrganizerItem } from '../layouts/ListOrganizer';
import ListOrganizer from '../layouts/ListOrganizer.svelte';
import type { Column, Row } from './table';
import { tablePersistence } from './table-persistence-store.svelte';

interface Props {
  kind: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous render types require any
  columns: Column<T, any>[];
  row: Row<T>;
  data: T[];
  defaultSortColumn?: string;
  collapsed?: string[];
  key?: (object: T) => string;
  label?: (object: T) => string;
  enableLayoutConfiguration?: boolean;
  selectedItemsNumber?: number;
}

let {
  kind,
  columns,
  row,
  data,
  defaultSortColumn = undefined,
  collapsed = $bindable([]),
  key = (item: T): string => item.name ?? String(item),
  label = (item: T): string => item.name ?? String(item),
  enableLayoutConfiguration = false,
  selectedItemsNumber = $bindable(),
}: Props = $props();

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- enables on:update event forwarding from column renderers
const dispatch = createEventDispatcher<{ update: undefined }>();

let columnItems: ListOrganizerItem[] = $state([]);
let columnOrdering = new SvelteMap<string, number>();
let isInitialized = $state(false);
let isLoading = $state(false);

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
      const defaultItems = getDefaultColumnItems();
      const items = loadedItems.map((item: ListOrganizerItem) => ({
        ...item,
        originalOrder: item.originalOrder ?? defaultItems.find(d => d.id === item.id)?.originalOrder ?? 0,
      }));

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
    const orderedItems = $state.snapshot(getOrderedColumns());
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
$effect(() => {
  if (isInitialized && columnItems.length > 0) {
    // access columnOrdering to track it as a dependency
    columnOrdering;
    saveColumnConfiguration().catch((error: unknown) => {
      console.error('Failed to save column configuration:', error);
    });
  }
});

// Computed visible columns based on configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches columns prop type
const visibleColumns: Column<T, any>[] = $derived.by(() => {
  if (columnItems.length === 0) {
    return columns;
  }

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
});

let selectedAllCheckboxes: boolean | undefined = $state(false);

function recomputeSelection(): void {
  selectedItemsNumber = row.info.selectable
    ? data.filter(object => row.info.selectable?.(object) && object.selected).length +
      data.reduce(
        (previous, current) =>
          previous +
          (row.info.children?.(current)?.filter(child => row.info.selectable?.(child) && child.selected).length ?? 0),
        0,
      )
    : 0;

  selectedAllCheckboxes = row.info.selectable
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
}

function toggleAll(checked: boolean): void {
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
  recomputeSelection();
}

let sortCol: Column<T> = $state(undefined!);
let sortAscending: boolean = $state(true);

const sortedData: T[] = $derived.by(() => {
  if (!sortCol?.info.comparator) {
    return data;
  }

  let comparator = sortCol.info.comparator;
  if (!sortAscending) {
    const comparatorTemp = comparator;
    comparator = (a, b): number => -comparatorTemp(a, b);
  }

  return [...data].sort(comparator);
});

function sort(column: Column<T>): void {
  if (!column?.info.comparator) {
    return;
  }

  if (sortCol === column) {
    sortAscending = !sortAscending;
  } else {
    sortCol = column;
    sortAscending = column.info.initialOrder ? column.info.initialOrder !== 'descending' : true;
  }
}

onMount(() => {
  const column: Column<T> | undefined = columns.find(column => column.title === defaultSortColumn);
  if (column?.info.comparator) {
    sortCol = column;
    sortAscending = column.info.initialOrder ? column.info.initialOrder !== 'descending' : true;
  }
});

const gridTemplateColumns: string = $derived.by(() => {
  let columnWidths: string[] = ['20px'];

  if (row.info.selectable) {
    columnWidths.push('32px');
  }

  visibleColumns.map(c => c.info.width ?? '1fr').forEach(w => columnWidths.push(w));

  if (enableLayoutConfiguration && tablePersistence) {
    columnWidths.push('32px');
  } else {
    columnWidths.push('5px');
  }

  return columnWidths.join(' ');
});

function objectChecked(object: T, checked: boolean): void {
  object.selected = checked;
  if (row.info.children) {
    const children = row.info.children(object);
    if (children) {
      children.forEach(child => (child.selected = checked));
    }
  }
  recomputeSelection();
}

function childChecked(child: T, checked: boolean): void {
  child.selected = checked;
  recomputeSelection();
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
    columnItems = getDefaultColumnItems();
    columnOrdering.clear();
  }
}
</script>

<div
  style="--table-grid-table-columns: {gridTemplateColumns}"
  class="w-full mx-5"
  class:hidden={sortedData.length === 0}
  role="table"
  aria-label={kind}>
  <!-- Table header -->
  <div role="rowgroup" class="relative">
    <div
      class="grid grid-cols-[var(--table-grid-table-columns)] gap-x-0.5 h-7 sticky top-0 text-[var(--pd-table-header-text)] uppercase z-2"
      role="row">
      <div class="whitespace-nowrap justify-self-start" role="columnheader"></div>
      {#if row.info.selectable}
        <div class="whitespace-nowrap place-self-center" role="columnheader">
          <Checkbox
            title="Toggle all"
            checked={selectedAllCheckboxes}
            disabled={!row.info.selectable || data.filter(object => row.info.selectable?.(object)).length === 0}
            indeterminate={(selectedItemsNumber ?? 0) > 0 && !selectedAllCheckboxes}
            onclick={toggleAll} />
        </div>
      {/if}
      {#each visibleColumns as column, index (index)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_interactive_supports_focus -->
        <div
          class="max-w-full overflow-hidden flex flex-row text-sm font-semibold items-center whitespace-nowrap {column
            .info.align === 'right'
            ? 'justify-self-end'
            : column.info.align === 'center'
              ? 'justify-self-center'
              : 'justify-self-start'} self-center select-none"
          class:cursor-pointer={column.info.comparator}
          onclick={sort.bind(undefined, column)}
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
    {#each sortedData as object (object)}
      {@const children = row.info.children?.(object) ?? []}
      {@const itemKey = key(object)}
      <div class="min-h-[48px] h-fit bg-[var(--pd-content-card-bg)] rounded-lg mb-2 border border-[var(--pd-content-table-border)]">
        <div
          class="grid grid-cols-[var(--table-grid-table-columns)] gap-x-0.5 min-h-[48px] hover:bg-[var(--pd-content-card-hover-bg)]"
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
                onclick={toggleChildren.bind(undefined, itemKey)}
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
                checked={object.selected}
                disabled={!row.info.selectable(object)}
                disabledTooltip={row.info.disabledText}
                onclick={objectChecked.bind(undefined, object)} />
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
                {@const Renderer = column.info.renderer}
                <Renderer
                  object={column.info.renderMapping ? column.info.renderMapping(object) : object} />
              {/if}
            </div>
          {/each}
        </div>

        <!-- Child objects -->
        {#if !collapsed.includes(itemKey) && children.length > 0}
          {#each children as child, i (child)}
            <div
              class="grid grid-cols-[var(--table-grid-table-columns)] gap-x-0.5 hover:bg-[var(--pd-content-card-hover-bg)]"
              class:rounded-b-lg={i === children.length - 1}
              role="row"
              aria-label={child.name}>
              <div class="whitespace-nowrap justify-self-start" role="cell"></div>
              {#if row.info.selectable}
                <div class="whitespace-nowrap place-self-center" role="cell">
                  <Checkbox
                    title="Toggle {kind}"
                    checked={child.selected}
                    disabled={!row.info.selectable(child)}
                    disabledTooltip={row.info.disabledText}
                    onclick={childChecked.bind(undefined, child)} />
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
                    {@const Renderer = column.info.renderer}
                    <Renderer
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
