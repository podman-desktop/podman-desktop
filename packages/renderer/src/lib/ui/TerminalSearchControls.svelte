<script lang="ts">
import { faArrowDown, faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { SearchAddon } from '@xterm/addon-search';
import type { Terminal } from '@xterm/xterm';
import { onDestroy, onMount } from 'svelte';

interface Props {
  terminal: Terminal;
  closeSearch: () => void;
}

let { terminal, closeSearch }: Props = $props();

let searchAddon: SearchAddon | undefined;
let searchTerm: string = $state('');

let input: HTMLInputElement | undefined = $state();

onMount(() => {
  searchAddon = new SearchAddon();
  searchAddon.activate(terminal);
  focus();
});

onDestroy(() => {
  searchAddon?.dispose();
});

function onKeyPressed(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    onSearchNext(true);
  }
}

function onSearchNext(incremental = false): void {
  searchAddon?.findNext(searchTerm, {
    incremental: incremental,
  });
}

function onSearchPrevious(incremental = false): void {
  searchAddon?.findPrevious(searchTerm, {
    incremental: incremental,
  });
}

function onSearchNextIncremental(): void {
  onSearchNext(true);
}

function onSearchPreviousIncremental(): void {
  onSearchPrevious(true);
}

function onSearch(event: Event): void {
  searchTerm = (event.target as HTMLInputElement).value;
  onSearchNext();
}

export function focus(): void {
  input?.focus();
}
</script>

<div
  class="absolute top-1 right-12 z-10 flex flex-row h-[40px] px-1 items-center rounded shadow-lg bg-[var(--pd-terminal-background)]"
  role="search">
  <div
    class="w-200px mx-4">
    <Input
      bind:element={input}
      placeholder="Find"
      aria-label="Find"
      onkeypress={onKeyPressed}
      oninput={onSearch}
      value={searchTerm}
    />
  </div>
  <div class="space-x-1">
    <button aria-label="Previous Match" class="p-2 rounded-sm hover:bg-[var(--pd-action-button-details-bg)]" onclick={onSearchPreviousIncremental}>
      <Icon icon={faArrowUp}/>
    </button>
    <button aria-label="Next Match" class="p-2 rounded-sm hover:bg-[var(--pd-action-button-details-bg)]" onclick={onSearchNextIncremental}>
      <Icon icon={faArrowDown}/>
    </button>
    <button aria-label="Close Search" class="p-2 rounded-sm hover:bg-[var(--pd-action-button-details-bg)]" onclick={closeSearch}>
      <Icon icon={faXmark}/>
    </button>
  </div>
</div>
