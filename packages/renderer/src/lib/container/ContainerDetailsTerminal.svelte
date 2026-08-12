<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { TerminalSettings } from '@podman-desktop/core-api/terminal';
import { EmptyScreen } from '@podman-desktop/ui-svelte';
import { FitAddon } from '@xterm/addon-fit';
import { SerializeAddon } from '@xterm/addon-serialize';
import type { IDisposable } from '@xterm/xterm';
import { Terminal } from '@xterm/xterm';
import { onDestroy, onMount } from 'svelte';
import { router } from 'tinro';

import { getTerminalTheme } from '/@/lib/terminal/terminal-theme';
import NoLogIcon from '/@/lib/ui/NoLogIcon.svelte';
import { getExistingTerminal, registerTerminal } from '/@/stores/container-terminal-store';

import type { ContainerInfoUI } from './ContainerInfoUI';

interface ContainerDetailsTerminalProps {
  container: ContainerInfoUI;
  screenReaderMode?: boolean;
}

let { container, screenReaderMode = false }: ContainerDetailsTerminalProps = $props();
let terminalXtermDiv: HTMLDivElement;
let shellTerminal: Terminal;
let currentRouterPath: string;
let sendCallbackId: number | undefined;
let terminalContent: string = '';
let serializeAddon: SerializeAddon;
let lastState = $state('');
let containerState = $derived(container.state);
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let onDataDisposable: IDisposable | undefined;
let reconnecting = false;
let resizeHandler: (() => void) | undefined;
let destroyed = false;

function registerInputHandler(callbackId: number): void {
  onDataDisposable?.dispose();
  onDataDisposable = shellTerminal?.onData(data => {
    window.shellInContainerSend(callbackId, data).catch((error: unknown) => console.log(String(error)));
  });
}

$effect(() => {
  if (lastState !== '' && lastState !== 'RUNNING' && containerState === 'RUNNING') {
    restartTerminal().catch((err: unknown) => {
      console.error('Error restarting terminal', err);
      scheduleReconnect();
    });
  }
  lastState = container.state;
});

async function restartTerminal(): Promise<void> {
  if (destroyed || reconnecting) return;
  reconnecting = true;
  try {
    clearReconnectTimer();
    ignoreFirstData = true;
    await executeShellIntoContainer();
    window.dispatchEvent(new Event('resize'));
  } finally {
    reconnecting = false;
  }
}

function clearReconnectTimer(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = undefined;
  }
}

function scheduleReconnect(): void {
  if (destroyed || reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = undefined;
    if (!destroyed && container.state === 'RUNNING') {
      restartTerminal().catch((err: unknown) => {
        console.error('Error restarting terminal', err);
        scheduleReconnect();
      });
    }
  }, 2000);
}

// update current route scheme
router.subscribe(route => {
  currentRouterPath = route.path;
});

let ignoreFirstData = false;

function createDataCallback(): (data: Buffer) => void {
  let ignorePrompt = ignoreFirstData;
  ignoreFirstData = false;
  return (data: Buffer) => {
    if (ignorePrompt) {
      ignorePrompt = false;
      return;
    }
    shellTerminal.write(data.toString());
  };
}

function receiveEndCallback(): void {
  if (destroyed || !sendCallbackId) return;

  if (reconnecting) {
    scheduleReconnect();
    return;
  }

  if (containerState === 'RUNNING') {
    restartTerminal().catch((err: unknown) => {
      console.error(`Error opening terminal for container ${container.id}`, err);
      scheduleReconnect();
    });
  } else {
    scheduleReconnect();
  }
}

// call exec command
async function executeShellIntoContainer(): Promise<void> {
  if (destroyed || container.state !== 'RUNNING') {
    return;
  }
  // grab logs of the container
  const callbackId = await window.shellInContainer(
    container.engineId,
    container.id,
    createDataCallback(),
    () => {},
    receiveEndCallback,
  );
  if (destroyed) {
    return;
  }
  await window.shellInContainerResize(callbackId, shellTerminal.cols, shellTerminal.rows);
  if (destroyed) {
    return;
  }
  registerInputHandler(callbackId);
  sendCallbackId = callbackId;
}

// refresh
async function refreshTerminal(): Promise<void> {
  // missing element, return
  if (!terminalXtermDiv) {
    return;
  }

  // grab font size
  const fontSize = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.FontSize,
  );
  if (destroyed) {
    return;
  }
  const lineHeight = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.LineHeight,
  );
  if (destroyed) {
    return;
  }

  const scrollback = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.Scrollback,
  );
  if (destroyed) {
    return;
  }

  // get terminal if any
  const existingTerminal = getExistingTerminal(container.engineId, container.id);

  shellTerminal = new Terminal({
    fontSize,
    lineHeight,
    screenReaderMode,
    theme: getTerminalTheme(),
    scrollback,
  });
  if (existingTerminal) {
    ignoreFirstData = true;
    shellTerminal.options = {
      fontSize,
      lineHeight,
    };
    shellTerminal.write(existingTerminal.terminal);
  }

  const fitAddon = new FitAddon();
  serializeAddon = new SerializeAddon();
  shellTerminal.loadAddon(fitAddon);
  shellTerminal.loadAddon(serializeAddon);

  shellTerminal.open(terminalXtermDiv);

  // call fit addon each time we resize the window
  resizeHandler = (): void => {
    // the container may be gone by the time a resize event is delivered: it can be removed,
    // or its engine may no longer be available, and the prop then resolves to undefined
    if (!container) {
      return;
    }
    const containerId = container.id;
    if (currentRouterPath === `/containers/${containerId}/terminal`) {
      fitAddon.fit();
      if (sendCallbackId) {
        window
          .shellInContainerResize(sendCallbackId, shellTerminal.cols, shellTerminal.rows)
          .catch((err: unknown) => console.error(`Error resizing terminal for container ${containerId}`, err));
      }
    }
  };
  window.addEventListener('resize', resizeHandler);
  fitAddon.fit();
}
onMount(async () => {
  await refreshTerminal();
  await executeShellIntoContainer();
});

onDestroy(() => {
  destroyed = true;
  // without this the listener stays on window for the lifetime of the application, and a new
  // one is added every time the terminal tab is opened again
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = undefined;
  }
  clearReconnectTimer();
  onDataDisposable?.dispose();
  terminalContent = serializeAddon?.serialize() ?? '';
  registerTerminal({
    engineId: container.engineId,
    containerId: container.id,
    terminal: terminalContent,
    callbackId: sendCallbackId,
  });
  serializeAddon?.dispose();
  shellTerminal?.dispose();
  sendCallbackId = undefined;
});
</script>

<div
  class="h-full p-[5px] pr-0 bg-[var(--pd-terminal-background)]"
  bind:this={terminalXtermDiv}
  class:hidden={container.state !== 'RUNNING'}>
</div>

<EmptyScreen
  hidden={container.state === 'RUNNING'}
  icon={NoLogIcon}
  title="No Terminal"
  message="Container is not running" />
