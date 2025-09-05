<script lang="ts">
import { faChevronRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Button, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy, onMount, tick } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import { commandsInfos } from '/@/stores/commands';
import { context } from '/@/stores/context';
import type { CommandInfo } from '/@api/command-info';

import type { ContextUI } from '../context/context';
import ArrowDownIcon from '../images/ArrowDownIcon.svelte';
import ArrowUpIcon from '../images/ArrowUpIcon.svelte';
import EnterIcon from '../images/EnterIcon.svelte';
import NotFoundIcon from '../images/NotFoundIcon.svelte';
import { isPropertyValidInContext } from '../preferences/Util';

const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';
const ARROW_DOWN_KEY = 'ArrowDown';
const ARROW_UP_KEY = 'ArrowUp';
const TAB_KEY = 'Tab';
const F1 = 'F1';

interface Props {
  display?: boolean;
  onclose?: () => void;
}

interface SearchOption {
  text: string;
  shortCut?: string[];
}

let { display = false, onclose }: Props = $props();

let outerDiv: HTMLDivElement | undefined = $state(undefined);
let inputElement: HTMLInputElement | undefined = $state(undefined);
let inputValue: string | undefined = $state('');
let scrollElements: HTMLLIElement[] = $state([]);
let searchIcon = $derived.by(() => {
  if (searchOptionsSelectedIndex === 1) {
    // Commands
    return faChevronRight;
  } else {
    return faMagnifyingGlass;
  }
});

let isMac: boolean = $state(false);
let modifierC: string = $derived(isMac ? '⌘' : 'Ctrl+');
let modifierS: string = $derived(isMac ? '⇧' : 'Shift+');
let searchOptions: SearchOption[] = $derived([
  { text: 'All', shortCut: [`${modifierC}${modifierS}P`] },
  { text: 'Commands', shortCut: [`${F1}`, '>'] },
  { text: 'Documentation', shortCut: [`${modifierC}K`] },
  { text: 'Go to', shortCut: [`${modifierC}F`] },
]);
let searchOptionsSelectedIndex: number = $state(0);

let commandInfoItems: CommandInfo[] = $state([]);
let globalContext: ContextUI;

let filteredCommandInfoItems: CommandInfo[] = $derived(
  commandInfoItems
    .filter(property => isPropertyValidInContext(property.enablement, globalContext))
    .filter(item => (inputValue ? item.title?.toLowerCase().includes(inputValue.toLowerCase()) : true)),
);

let contextsUnsubscribe: Unsubscriber;

onMount(async () => {
  const platform = await window.getOsPlatform();

  isMac = platform === 'darwin';
});

onMount(() => {
  contextsUnsubscribe = context.subscribe(value => {
    globalContext = value;
  });
  // subscribe to the commands
  return commandsInfos.subscribe(infos => {
    commandInfoItems = infos;
  });
});

onDestroy(() => {
  contextsUnsubscribe?.();
});

// Focus the input when the command palette becomes visible
$effect(() => {
  if (display && inputElement) {
    tick()
      .then(() => {
        inputElement?.focus();
      })
      .catch((error: unknown) => {
        console.error('Unable to focus input box', error);
      });
  }
});

let selectedFilteredIndex = $state(0);
let selectedIndex = 0;

function displaySearchBar(): void {
  // clear the input value
  inputValue = '';
  selectedIndex = 0;
  // toggle the display
  display = true;
}

async function handleKeydown(e: KeyboardEvent): Promise<void> {
  // toggle display using F1 or ESC keys
  if (e.key === `${F1}` || e.key === '>') {
    selectedFilteredIndex = 0;
    searchOptionsSelectedIndex = 1;
    displaySearchBar();
    e.preventDefault();
    return;
  } else if (e.key === ESCAPE_KEY) {
    // here we toggle the display
    hideCommandPallete();
    e.preventDefault();
    return;
  } else if (e.ctrlKey || e.metaKey) {
    if (e.shiftKey && e.key.toLowerCase() === 'p') {
      searchOptionsSelectedIndex = 0;
      displaySearchBar();
      e.preventDefault();
    } else if (e.key.toLowerCase() === 'k') {
      searchOptionsSelectedIndex = 2;
      displaySearchBar();
      e.preventDefault();
    } else if (e.key.toLowerCase() === 'f') {
      searchOptionsSelectedIndex = 3;
      displaySearchBar();
      e.preventDefault();
    }
  }

  // for other keys, only check if it's being displayed
  if (!display) {
    return;
  }

  // no items, abort
  if (filteredCommandInfoItems.length === 0) {
    return;
  }

  if (e.key === ARROW_DOWN_KEY) {
    // if down key is pressed, move the index
    selectedFilteredIndex++;
    if (selectedFilteredIndex >= filteredCommandInfoItems.length) {
      selectedFilteredIndex = 0;
    }

    selectedIndex = commandInfoItems.indexOf(filteredCommandInfoItems[selectedFilteredIndex]);

    scrollElements[selectedFilteredIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
    e.preventDefault();
  } else if (e.key === ARROW_UP_KEY) {
    // if up key is pressed, move the index
    selectedFilteredIndex--;
    if (selectedFilteredIndex < 0) {
      selectedFilteredIndex = filteredCommandInfoItems.length - 1;
    }
    selectedIndex = commandInfoItems.indexOf(filteredCommandInfoItems[selectedFilteredIndex]);
    scrollElements[selectedFilteredIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
    e.preventDefault();
  } else if (e.key === ENTER_KEY) {
    // hide the command palette
    hideCommandPallete();

    selectedIndex = commandInfoItems.indexOf(filteredCommandInfoItems[selectedFilteredIndex]);
    await executeCommand(selectedIndex);
    e.preventDefault();
  } else if (e.key === TAB_KEY) {
    switchSearchOption(e.shiftKey ? -1 : 1);
    e.preventDefault();
  }
}

function switchSearchOption(direction: 1 | -1): void {
  const searchOptionsLength = searchOptions.length;
  const offset = direction === 1 ? 0 : searchOptionsLength;
  searchOptionsSelectedIndex = (searchOptionsSelectedIndex + direction + offset) % searchOptionsLength;
}

async function executeCommand(index: number): Promise<void> {
  // get command id
  const commandId = commandInfoItems[index].id;
  // execute the command
  try {
    await window.executeCommand(commandId);
  } catch (error) {
    console.error('error executing command', error);
  }
}

function handleMousedown(e: MouseEvent): void {
  if (!display) {
    return;
  }

  if (outerDiv && !e.defaultPrevented && e.target instanceof Node && !outerDiv.contains(e.target)) {
    hideCommandPallete();
  }
}

function hideCommandPallete(): void {
  display = false;
  onclose?.();
}

async function clickOnItem(index: number): Promise<void> {
  // hide the command palette
  hideCommandPallete();

  // select the index from the cursor
  selectedIndex = commandInfoItems.indexOf(filteredCommandInfoItems[index]);
  await executeCommand(selectedIndex);
}

async function onInputChange(): Promise<void> {
  // in case of quick pick, filter the items
  selectedFilteredIndex = 0;
  if (filteredCommandInfoItems.length > 0) {
    selectedIndex = commandInfoItems.indexOf(filteredCommandInfoItems[selectedFilteredIndex]);
  }
}

async function onAction(): Promise<void> {
  // When input is cleared, refocus it
  tick()
    .then(() => {
      inputElement?.focus();
    })
    .catch((error: unknown) => {
      console.error('Unable to focus input box', error);
    });
}
</script>

<svelte:window on:keydown={handleKeydown} on:mousedown={handleMousedown} />

{#if display}
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-[var(--pd-modal-fade)] opacity-60 h-full z-50" style='-webkit-app-region: none;'></div>

  <div class="absolute m-auto left-0 right-0 z-50">
    <div class="flex justify-center items-center mt-1">
      <div
        bind:this={outerDiv}
        class="bg-[var(--pd-content-card-bg)] w-[700px] max-h-fit shadow-lg p-2 rounded-sm shadow-[var(--pd-input-field-stroke)] text-base">
        <div class="w-full flex flex-row gap-2 items-center">
          <Input
            aria-label='Command palette command input'
            bind:value={inputValue}
            bind:element={inputElement}
            clearable={true}
            on:input={onInputChange}
            on:action={onAction}
            class="px-1 w-full text-[var(--pd-input-field-focused-text)] bg-[var(--pd-input-field-focused-bg)] border border-[var(--pd-input-field-stroke)] focus:outline-hidden" >
            {#snippet left()}
              <Icon icon={searchIcon} class="pr-1"/>
            {/snippet}
        </Input>
        </div>

        <div class="flex flex-row m-2">
          {#each searchOptions as searchOption, index (index)}
            <Button
              type="tab"
              class="focus:outline-hidden"
              on:click={(): void => {
                searchOptionsSelectedIndex = index;
              }}
              selected={searchOptionsSelectedIndex === index}>
              <div class="flex items-center gap-2">
                {#if searchOption.shortCut}
                  {#each searchOption.shortCut as shortCut, i (i)}
                    <div class='bg-[var(--pd-search-bar-nav-button)] rounded-sm px-0.5 shadow-sm shadow-b-1'>
                      {shortCut}
                    </div>
                  {/each}
                {/if}
                {searchOption.text}
              </div>
            </Button>
          {/each}
        </div>
        <ul class="max-h-[50vh] overflow-y-auto flex flex-col mt-1">
          {#each filteredCommandInfoItems as item, i (item.id)}
            <li class="flex w-full flex-row" bind:this={scrollElements[i]} aria-label={item.id}>
              <button
                onclick={(): Promise<void> => clickOnItem(i)}
                class="text-[var(--pd-dropdown-item-text)] text-left relative w-full rounded-sm {i === selectedFilteredIndex
                  ? 'bg-[var(--pd-modal-dropdown-highlight)] selected'
                  : 'hover:bg-[var(--pd-dropdown-bg)]'}  px-1">
                <div class="flex flex-col w-full">
                  <div class="flex flex-row w-full max-w-[700px] truncate">
                    <div class="text-base py-[2pt]">{item.title}</div>
                  </div>
                </div>
              </button>
            </li>
          {/each}
        </ul>

        {#if filteredCommandInfoItems.length === 0}
          <div class='flex grow items-center flex-col gap-2 py-4'>
            <Icon icon={NotFoundIcon} />
            <div class='text-lg font-bold'>No results matching '{inputValue}' found</div>
            <div class='text-md'>Not what you expected? Double-check your spelling or try searching for:</div>
            <Button icon={faChevronRight} type='link' onclick={(): void => {console.log('Variables clicked');}}>Variables</Button>
          </div>
        {/if}

        <div class="border-[var(--pd-global-nav-bg-border)] border-t-[1px] flex flex-row items-center px-3 pt-2 gap-4 text-sm">
          <span class="flex items-center gap-2 text-[var(--pd-button-tab-text)] border-[var(--pd-button-tab-border-selected)]">
            <Icon icon={EnterIcon} class="bg-[var(--pd-action-button-bg)] rounded-sm p-1.5" size='2.2em'/>
            To select
          </span>
          <div class="flex items-center gap-2 text-[var(--pd-button-tab-text)] border-[var(--pd-button-tab-border-selected)]">
            <Icon icon={ArrowUpIcon} class="bg-[var(--pd-action-button-bg)] rounded-sm p-1.5" size='2.2em'/>
            <Icon icon={ArrowDownIcon} class="bg-[var(--pd-action-button-bg)] rounded-sm p-1.5" size='2.2em'/>
            To navigate
          </div>
          <div class="flex items-center gap-2 text-[var(--pd-button-tab-text)] border-[var(--pd-button-tab-border-selected)]">
            <div class='bg-[var(--pd-action-button-bg)] rounded-sm text-base px-1 py-0.5'>esc</div>
            To close
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
