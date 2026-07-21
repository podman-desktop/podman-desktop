<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { TerminalSettings } from '@podman-desktop/core-api/terminal';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';

import { getTerminalTheme } from '/@/lib/terminal/terminal-theme';
import TerminalSearchControls from '/@/lib/ui/TerminalSearchControls.svelte';

interface Props {
  terminal?: Terminal;
  convertEol?: boolean;
  disableStdIn?: boolean;
  screenReaderMode?: boolean;
  showCursor?: boolean;
  search?: boolean;
  class?: string;
}

let {
  terminal = $bindable(),
  convertEol,
  disableStdIn = true,
  screenReaderMode,
  showCursor = false,
  search = false,
  class: className,
}: Props = $props();

let logsXtermDiv: HTMLDivElement | undefined;
let terminalWindowDiv: HTMLDivElement | undefined;
let resizeHandler: () => void;
let searchControls: TerminalSearchControls | undefined = $state();
let searchVisible = $state(false);

const dispatch = createEventDispatcher();

async function refreshTerminal(): Promise<void> {
  // missing element, return
  if (!logsXtermDiv) {
    return;
  }
  // grab font size
  const fontSize = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.FontSize,
  );
  const lineHeight = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.LineHeight,
  );

  const scrollback = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.Scrollback,
  );

  terminal = new Terminal({
    fontSize,
    lineHeight,
    disableStdin: disableStdIn,
    theme: getTerminalTheme(),
    convertEol: convertEol,
    screenReaderMode: screenReaderMode,
    scrollback,
  });
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  terminal.open(logsXtermDiv);
  if (!showCursor) {
    // disable cursor
    terminal.write('\x1b[?25l');
  }

  // call fit addon each time we resize the window
  resizeHandler = (): void => {
    fitAddon.fit();
  };
  window.addEventListener('resize', resizeHandler);

  fitAddon.fit();
}

onMount(async () => {
  terminalWindowDiv?.addEventListener('keydown', onKeyDown, true);
  await refreshTerminal();
  dispatch('init');
});

onDestroy(() => {
  terminalWindowDiv?.removeEventListener('keydown', onKeyDown, true);
  window.removeEventListener('resize', resizeHandler);
  terminal?.dispose();
});

function onKeyDown(event: KeyboardEvent): void {
  if (search && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
    event.preventDefault();
    event.stopPropagation();
    searchVisible = true;
    tick()
      .then(() => searchControls?.focus())
      .catch((error: unknown) => console.error('Error focusing terminal search controls', error));
  } else if (searchVisible && event.key === 'Escape') {
    event.preventDefault();
    closeSearch();
  }
}

function closeSearch(): void {
  searchVisible = false;
  tick()
    .then(() => terminal?.focus())
    .catch((error: unknown) => console.error('Error restoring terminal focus', error));
}
</script>

<div
  class="{className} relative overflow-hidden bg-[var(--pd-terminal-background)]"
  role="term"
  bind:this={terminalWindowDiv}>
  <div class="h-full p-[5px] pr-0" bind:this={logsXtermDiv}></div>
  {#if search && terminal && searchVisible}
    <TerminalSearchControls bind:this={searchControls} {terminal} {closeSearch} />
  {/if}
</div>
