<style>
.grid-table {
  display: grid;
  grid-template-columns: var(--table-grid-table-columns);
}
</style>

<script lang="ts" generics="T">
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { Checkbox } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { SvelteSet } from 'svelte/reactivity';

interface Props {
  /**
   * aria-label of the root component
   */
  kind: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Array<TableColumn<T, any>>;
  row: TableRow<T>;
  data: Array<T>;
  defaultSortColumn?: string;
  collapsed?: SvelteSet<string>;
  selected?: SvelteSet<string>;

  /**
   * To follow Svelte guideline about keyed-each-blocks, you must explicitly provide a key function.
   * @param object
   */
  key(object: T): string;
  label(object: T): string;
}

let {
  kind,
  data,
  row,
  columns,
  defaultSortColumn,
  collapsed = $bindable(new SvelteSet()),
  selected = $bindable(new SvelteSet()),
  key,
  label,
}: Props = $props();

/**
 * Svelte states
 */
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

let selectedAllCheckboxes = $derived(data.every(object => selected.has(key(object))));
let sortCol: TableColumn<T, unknown> | undefined = $state(
  defaultSortColumn ? columns.find(column => column.title === defaultSortColumn) : undefined,
);
let sortAscending: boolean = $state(false);

let sortedData: Array<T> = $derived.by(() => {
  let comparator = sortCol?.info?.comparator;
  if (!comparator) {
    return data;
  }

  if (!sortAscending) {
    // we're already sorted, switch to reverse order
    let comparatorTemp = comparator;
    comparator = (a, b): number => -comparatorTemp(a, b);
  }

  // do not sort in place
  return data.toSorted(comparator);
});

/**
 * Utility functions
 */
function onCheckedAll(checked: boolean): void {
  data.forEach(object => onChecked(object, checked));
}

function onChecked(object: T, checked: boolean): void {
  if (row.info.selectable?.(object)) {
    if (checked) {
      selected.add(key(object));
    } else {
      selected.delete(key(object));
    }
  }
  const children = row.info.children?.(object);
  children?.forEach(child => onChecked(child, checked));
}

function sort(column: TableColumn<T, unknown>): void {
  if (sortCol === column) {
    sortAscending = !sortAscending;
  } else {
    sortAscending = column.info.initialOrder ? column.info.initialOrder !== 'descending' : true;
    sortCol = column;
  }
}

function onToggle(keyItem: string): void {
  if (collapsed.has(keyItem)) {
    collapsed.delete(keyItem);
  } else {
    collapsed.add(keyItem);
  }
}
</script>

{#snippet RowGroup(object: T)}
  {@const children = row.info.children?.(object) ?? []}
  {@const itemKey = key(object)}
  <div class="min-h-[48px] h-fit bg-[var(--pd-content-card-bg)] rounded-lg mb-2 border border-[var(--pd-content-table-border)]">
    <div
      class="grid grid-table gap-x-0.5 min-h-[48px] hover:bg-[var(--pd-content-card-hover-bg)]"
      class:rounded-t-lg={!collapsed.has(itemKey) &&
            children.length > 0}
      class:rounded-lg={collapsed.has(itemKey) ||
            children.length === 0}
      role="row"
      aria-label={label(object)}>
      <div class="whitespace-nowrap place-self-center" role="cell">
        {#if children.length > 0}
          <button
            title={collapsed.has(itemKey) ? 'Expand Row' : 'Collapse Row'}
            aria-expanded={!collapsed.has(itemKey)}
            onclick={onToggle.bind(undefined, itemKey)}
          >
            <Icon size="0.8x"
                  class="text-[var(--pd-table-body-text)] cursor-pointer"
                  icon={collapsed.has(itemKey) ? faChevronRight : faChevronDown}/>
          </button>
        {/if}
      </div>
      {#if row.info.selectable}
        <div class="whitespace-nowrap place-self-center" role="cell">
          <Checkbox
            title="Toggle {kind}"
            checked={selected.has(itemKey)}
            disabled={!row.info.selectable(object)}
            disabledTooltip={row.info.disabledText}
            onclick={onChecked.bind(undefined, object)} />
        </div>
      {/if}
      {#each columns as column, index (index)}
        {@const Render = column.info.renderer}
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
            <Render object={column.info.renderMapping ? column.info.renderMapping(object) : object}/>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Child objects -->
    {#if !collapsed.has(itemKey) && children.length > 0}
      {#each children as child, i (child)}
        {@const childKey = key(child)}
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
                checked={selected.has(childKey)}
                disabled={!row.info.selectable(child)}
                disabledTooltip={row.info.disabledText}
                onclick={onChecked.bind(undefined, child)} />
            </div>
          {/if}
          {#each columns as column, index (index)}
            {@const Render = column.info.renderer}
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
                <Render object={column.info.renderMapping ? column.info.renderMapping(object) : object}/>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
{/snippet}

<div
  style="--table-grid-table-columns: {gridTemplateColumns}"
  class="w-full mx-5"
  class:hidden={data.length === 0}
  role="table"
  aria-label={kind}>
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
            checked={selectedAllCheckboxes}
            disabled={!row.info.selectable || data.filter(object => row.info.selectable?.(object)).length === 0}
            indeterminate={selected.size > 0 && !selectedAllCheckboxes}
            onclick={onCheckedAll} />
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
    {#each sortedData as object (object)}
      <!-- eslint-disable-next-line sonarjs/no-use-of-empty-return-value -->
      {@render RowGroup(object)}
    {/each}
  </div>
</div>
