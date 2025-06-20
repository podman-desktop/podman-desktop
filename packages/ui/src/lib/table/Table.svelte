<style>
.grid-table {
  display: grid;
  grid-template-columns: var(--table-grid-table-columns);
}
</style>
<script lang="ts" generics="T">
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { onMount } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import Fa from 'svelte-fa';

import Checkbox from '../checkbox/Checkbox.svelte';
import type { Column, Row } from './table';

interface Props<T> {
  readonly kind: string;
  readonly data: Array<T>;
  collapsed?: Set<string>;
  selected?: Set<string>;
  readonly defaultSortColumn?: string;
  readonly row: Row<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly columns: Array<Column<T, any>>;

  /**
   * @deprecated useful for parent component using Svelte 4
   */
  selectedItemsNumber?: number;

  /**
   * the key function is mandatory to determine the key for selected and collapsed
   *
   * @remarks the key must be unique for every object T
   * @param object
   */
  key(object: T): string;

  /**
   * To set the aria-label on each row, you can specify a label function
   * @param object
   */
  label?(object: T): string;
}

let {
  kind,
  data,
  collapsed = $bindable(new SvelteSet()),
  selected = $bindable(new SvelteSet()),
  row,
  columns,
  key,
  // default label to key
  label = key,
  defaultSortColumn,
  selectedItemsNumber = $bindable(),
}: Props<T> = $props();

let selectedCount: number = $derived(selected.size);

$effect(() => {
  selectedItemsNumber = selectedCount;
});

let selectedAllCheckboxes: boolean = $derived.by(() => {
  // shortcut if row has no selectable function
  if (!row.info.selectable) return false;

  // shortcut if none is selectable
  if (data.filter(object => row.info.selectable?.(object)).length === 0) return false;

  return data
    .reduce(
      (accumulator, current) => {
        const children = row.info.children?.(current);
        if (children) {
          accumulator.push(...children);
        }
        return accumulator;
      },
      [...data] as Array<T>,
    )
    .filter(child => row.info.selectable?.(child))
    .every(child => selected.has(key(child)));
});

function toggleAll(e: CustomEvent<boolean>): void {
  // shortcut if not selectable
  if (!row.info.selectable) {
    return;
  }

  data.forEach(object => objectChecked(object, e.detail));
}

function objectChecked(object: T, checked: boolean): void {
  // select object itself
  if (row.info.selectable?.(object)) {
    if (checked) {
      selected.add(key(object));
    } else {
      selected.delete(key(object));
    }
  }

  // select object children
  if (row.info.children?.(object)) {
    row.info
      .children?.(object)
      ?.filter(child => row.info.selectable?.(child))
      .forEach(child => {
        if (checked) {
          selected.add(key(child));
        } else {
          selected.delete(key(child));
        }
      });
  }
}

// sorting states
let sortCol: Column<T> | undefined = $state(undefined);
let sortAscending: boolean = $state(false);

let sortedData: Array<T> = $derived.by(() => {
  if (!sortCol) return data;

  let comparator = sortCol.info.comparator;
  if (!comparator) {
    // column is not sortable
    return data;
  }

  if (!sortAscending) {
    // we're already sorted, switch to reverse order
    let comparatorTemp = comparator;
    comparator = (a, b): number => -comparatorTemp(a, b);
  }

  console.log('sortData', data);
  return data.toSorted(comparator);
});

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
}

/**
 * Update the collapse state of a row
 * @param key
 */
function toggleChildren(key: string): void {
  if (collapsed.has(key)) {
    collapsed.delete(key);
  } else {
    collapsed.add(key);
  }
}

// grid computation
let gridTemplateColumns: string = $derived.by(() => {
  // section and checkbox columns
  let columnWidths: string[] = ['20px'];

  if (row.info.selectable) {
    columnWidths.push('32px');
  }

  // custom columns
  columns.map(c => c.info.width ?? '1fr').forEach(w => columnWidths.push(w));

  // final spacer
  columnWidths.push('5px');

  return columnWidths.join(' ');
});

onMount(() => {
  const column: Column<T> | undefined = columns.find(column => column.title === defaultSortColumn);
  if (column?.info.comparator) {
    sortCol = column;
    sortAscending = column.info.initialOrder ? column.info.initialOrder !== 'descending' : true;
  }
});
</script>
<div
  style="--table-grid-table-columns: {gridTemplateColumns}"
  class="w-full mx-5" class:hidden={data.length === 0} role="table" aria-label={kind}>
  <!-- Table header -->
  <div role="rowgroup">
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
            indeterminate={selectedCount > 0 && !selectedAllCheckboxes}
            on:click={toggleAll} />
        </div>
      {/if}
      {#each columns as column, index (index)}
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
    </div>
  </div>

  <!-- Table body -->
  <div role="rowgroup">
    {#each sortedData as object (key(object))}
      {@const children = row.info.children?.(object) ?? []}
      <div class="min-h-[48px] h-fit bg-[var(--pd-content-card-bg)] rounded-lg mb-2 border border-[var(--pd-content-table-border)]">

        <!-- row parent -->
        <div
          class="grid grid-table gap-x-0.5 min-h-[48px] hover:bg-[var(--pd-content-card-hover-bg)]"
          class:rounded-t-lg={
            !collapsed.has(key(object)) &&
            children.length > 0}
          class:rounded-lg={
            collapsed.has(key(object)) ||
            children.length === 0}
          role="row"
          aria-label={label(object)}>
          <div class="whitespace-nowrap place-self-center" role="cell">
            {#if children.length > 0}
              <button onclick={toggleChildren.bind(undefined, key(object))}>
                <Fa
                  size="0.8x"
                  class="text-[var(--pd-table-body-text)] cursor-pointer"
                  icon={!collapsed.has(key(object)) ? faChevronDown : faChevronRight} />
              </button>
            {/if}
          </div>
          {#if row.info.selectable}
            <div class="whitespace-nowrap place-self-center" role="cell">
              <Checkbox
                title="Toggle {kind}"
                checked={selected.has(key(object))}
                disabled={!row.info.selectable(object)}
                disabledTooltip={row.info.disabledText}
                onclick={objectChecked.bind(undefined, object)} />
            </div>
          {/if}
          {#each columns as column, index (index)}
            <div
              class="whitespace-nowrap {column.info.align === 'right'
                ? 'justify-self-end'
                : column.info.align === 'center'
                  ? 'justify-self-center'
                  : 'justify-self-start'} self-center {column.info.overflow === true
                ? ''
                : 'overflow-hidden'} max-w-full py-1.5"
              role="cell">
              {#if column.info.renderer}
                {@const Renderer = column.info.renderer}
                <Renderer object={column.info.renderMapping ? column.info.renderMapping(object) : object}/>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Child objects -->
        {#if !collapsed.has(key(object)) && children.length > 0}
          {#each children as child, i (key(child))}
            <div
              class="grid grid-table gap-x-0.5 hover:bg-[var(--pd-content-card-hover-bg)]"
              class:rounded-b-lg={i === children.length - 1}
              role="row"
              aria-label={label(child)}>
              <div class="whitespace-nowrap justify-self-start" role="cell"></div>
              {#if row.info.selectable}
                <div class="whitespace-nowrap place-self-center" role="cell">
                  <Checkbox
                    title="Toggle {kind}"
                    checked={selected.has(key(child))}
                    disabled={!row.info.selectable(child)}
                    disabledTooltip={row.info.disabledText}
                    onclick={objectChecked.bind(undefined, child)}
                  />
                </div>
              {/if}
              {#each columns as column, index (index)}
                <div
                  class="whitespace-nowrap {column.info.align === 'right'
                    ? 'justify-self-end'
                    : column.info.align === 'center'
                      ? 'justify-self-center'
                      : 'justify-self-start'} self-center {column.info.overflow === true
                    ? ''
                    : 'overflow-hidden'} max-w-full py-1.5"
                  role="cell">
                  {#if column.info.renderer}
                    {@const Renderer = column.info.renderer}
                    <Renderer object={column.info.renderMapping ? column.info.renderMapping(child) : child}/>
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
