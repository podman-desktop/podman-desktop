<script lang="ts">
import { Spinner } from '@podman-desktop/ui-svelte';

import type { TypeaheadGroupedItems, TypeaheadHeadings, TypeaheadItem } from './Typeahead';

interface Props {
  placeholder?: string;
  required?: boolean;
  delay?: number;
  disabled?: boolean;
  initialFocus?: boolean;
  id?: string;
  name?: string;
  error?: boolean;
  resultItems?: TypeaheadItem[];
  onInputChange?: (s: string) => Promise<void>;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  class?: string;
  compare?: (a: string, b: string) => number;
}

let {
  placeholder,
  required = false,
  delay = 200,
  disabled = false,
  initialFocus = false,
  id,
  name,
  error = false,
  resultItems = [],
  onInputChange,
  onChange,
  onEnter,
  class: className,
  compare,
}: Props = $props();

let inputDelayTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
let input: HTMLInputElement | undefined = $state();
let list: HTMLDivElement | undefined = $state();
let inputDiv: HTMLDivElement | undefined = $state();
let scrollElements: HTMLElement[] = $state([]);
let value: string = $state('');
let opened: boolean = $state(false);
let highlightIndex: number = $state(-1);
let pageStep: number = $state(10);
let userValue: string = $state('');
let loading: boolean = $state(false);

let groupedItems: TypeaheadGroupedItems = $derived.by(() => {
  let groupItems: TypeaheadGroupedItems = {};
  let groups = [...new Set(resultItems.map(item => item.group ?? ''))];
  for (const group of groups) {
    let values = resultItems.filter(item => (group ? item.group === group : !item.group)).map(item => item.value);
    groupItems[group] = values.toSorted(
      compare ??
        ((a: string, b: string): number => {
          if (a.startsWith(userValue) === b.startsWith(userValue)) {
            return a.localeCompare(b);
          } else if (a.startsWith(userValue) && !b.startsWith(userValue)) {
            return -1;
          } else {
            return 1;
          }
        }),
    );
  }
  return groupItems;
});

let itemHeadings: TypeaheadHeadings = $derived.by(() => {
  if (disabled) {
    return {};
  }
  let headingIndex = 0;
  let headings: TypeaheadHeadings = {};
  for (const group in groupedItems) {
    if (group) {
      if (headings[headingIndex]) {
        headings[headingIndex].push(group);
      } else {
        headings[headingIndex] = [group];
      }
      headingIndex += groupedItems[group].length;
    }
  }
  return headings;
});

let items: string[] = $derived.by(() => {
  if (disabled) {
    return [];
  }
  let currentItems: string[] = [];
  for (const group in groupedItems) {
    currentItems = currentItems.concat(groupedItems[group]);
  }
  return currentItems;
});

function onItemSelected(s: string): void {
  value = s;
  userValue = s;
  input?.focus();
  close();
  onChange?.(s);
}

function onInput(): void {
  userValue = value;
  onChange?.(value);
  clearTimeout(inputDelayTimeout);
  inputDelayTimeout = setTimeout(processInput, delay);
}

function onKeyDown(e: KeyboardEvent): void {
  switch (e.key) {
    case 'ArrowDown':
      onDownKey(e);
      break;
    case 'PageDown':
      onPageDownKey(e);
      break;
    case 'ArrowUp':
      onUpKey(e);
      break;
    case 'PageUp':
      onPageUpKey(e);
      break;
    case 'Escape':
      onEscKey(e);
      break;
    case 'Enter':
      onEnterKey(e);
      break;
  }
  onChange?.(value);
}

function onUpKey(e: KeyboardEvent): void {
  if (opened) {
    if (highlightIndex > 0) {
      highlightIndex--;
      value = items[highlightIndex];
      makeVisible();
    } else if (highlightIndex === 0) {
      highlightIndex = -1;
      value = userValue;
      close();
    }
  }
  e.preventDefault();
}

function onPageUpKey(e: KeyboardEvent): void {
  if (opened) {
    highlightIndex = Math.max(0, highlightIndex - pageStep);
    value = items[highlightIndex];
    makeVisible();
    e.preventDefault();
  }
}

function onDownKey(e: KeyboardEvent): void {
  if (!opened) {
    processInput();
  } else {
    if (highlightIndex < items.length - 1) {
      highlightIndex++;
      value = items[highlightIndex];
      makeVisible();
    }
  }
  e.preventDefault();
}

function onPageDownKey(e: KeyboardEvent): void {
  if (opened) {
    highlightIndex = Math.min(items.length - 1, highlightIndex + pageStep);
    value = items[highlightIndex];
    makeVisible();
    e.preventDefault();
  }
}

function onEscKey(e: KeyboardEvent): void {
  if (opened) {
    close();
    e.stopPropagation();
  }
}

function onEnterKey(e: KeyboardEvent): void {
  if (opened && highlightIndex >= 0) {
    onItemSelected(items[highlightIndex]);
    close();
    e.stopPropagation();
  } else {
    close();
    onEnter?.();
  }
}

function makeVisible(): void {
  scrollElements[highlightIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'start',
  });
}

function processInput(): void {
  loading = true;
  onInputChange?.(value)
    .then(() => {
      highlightIndex = -1;
      open();
    })
    .catch(() => {
      // We do not display the error
    })
    .finally(() => {
      loading = false;
    });
}

function open(): void {
  opened = true;
}

function close(): void {
  opened = false;
}

function requestFocus(e: HTMLInputElement): void {
  if (initialFocus) {
    e.focus();
  }
}

function onWindowClick(e: Event): void {
  if (list && e.target instanceof Node && !list.contains(e.target) && !inputDiv?.contains(e.target)) {
    close();
  }
}
</script>

<svelte:window on:click={onWindowClick} />
<div
  class="flex flex-row grow items-center px-1 py-1 group bg-[var(--pd-input-field-bg)] border-[1px] border-transparent {className}"
  class:not(focus-within):hover:bg-[var(--pd-input-field-hover-bg)]={!disabled}
  class:focus-within:bg-[var(--pd-input-field-focused-bg)]={!disabled}
  class:focus-within:rounded-md={!disabled}
  class:border-b-[var(--pd-input-field-stroke)]={!disabled}
  class:hover:border-b-[var(--pd-input-field-hover-stroke)]={!disabled && !error}
  class:focus-within:border-[var(--pd-input-field-hover-stroke)]={!disabled}
  class:border-b-[var(--pd-input-field-stroke-readonly)]={disabled}
  class:border-b-[var(--pd-input-field-stroke-error)]={error}
  class:focus-within:border-[var(--pd-input-field-stroke-error)]={error}
  bind:this={inputDiv}>
  <input
    type="text"
    class="w-full px-0.5 outline-0 bg-[var(--pd-input-field-bg)] placeholder:text-[color:var(--pd-input-field-placeholder-text)] overflow-hidden"
    class:text-[color:var(--pd-input-field-focused-text)]={!disabled}
    class:text-[color:var(--pd-input-field-disabled-text)]={disabled}
    class:group-hover:bg-[var(--pd-input-field-hover-bg)]={!disabled}
    class:group-focus-within:bg-[var(--pd-input-field-hover-bg)]={!disabled}
    class:group-hover-placeholder:text-[color:var(--pd-input-field-placeholder-text)]={!disabled}
    bind:this={input}
    bind:value={value}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    id={id}
    name={name}
    oninput={onInput}
    onkeydown={onKeyDown}
    onfocus={processInput}
    use:requestFocus />
  {#if loading}
    <Spinner size="1em" />
  {/if}
</div>
{#if opened && items.length > 0}
  <div
    role="row"
    bind:this={list}
    class="max-h-80 overflow-auto bg-[var(--pd-content-card-bg)] border-[var(--pd-input-field-hover-stroke)] border-[1px]">
    {#each items as item, i (i)}
      {#if itemHeadings[i]}
        {#each itemHeadings[i] as heading, index (index)}
          <button class='p-[2px] text-[var(--pd-button-disabled-text)] w-full text-start' disabled>{heading}</button>
        {/each}
      {/if}
      <button
        bind:this={scrollElements[i]}
        class:bg-[var(--pd-content-card-hover-bg)]={i === highlightIndex}
        class="p-1 text-start w-full cursor-pointer"
        onclick={(): void => onItemSelected(item)}
        onpointerenter={(): void => {
          highlightIndex = i;
        }}>{item}</button>
    {/each}
  </div>
{/if}
