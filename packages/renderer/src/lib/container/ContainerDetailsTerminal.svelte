<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { TerminalSettings } from '@podman-desktop/core-api/terminal';
import { EmptyScreen } from '@podman-desktop/ui-svelte';
import { FitAddon } from '@xterm/addon-fit';
import { SerializeAddon } from '@xterm/addon-serialize';
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

$effect(() => {
  if (lastState === 'STARTING' && containerState === 'RUNNING') {
    restartTerminal().catch((err: unknown) => console.error('Error restarting terminal', err));
  }
  lastState = container.state;
});

async function restartTerminal(): Promise<void> {
  ignoreFirstData = true;
  await executeShellIntoContainer();
  window.dispatchEvent(new Event('resize'));
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
  // need to reopen a new terminal if container is running
  if (sendCallbackId && containerState === 'RUNNING') {
    window
      .shellInContainer(container.engineId, container.id, createDataCallback(), () => {}, receiveEndCallback)
      .then(id => {
        sendCallbackId = id;
        shellTerminal?.onData(async data => {
          await window.shellInContainerSend(id, data);
        });
      })
      .catch((err: unknown) => console.error(`Error opening terminal for container ${container.id}`, err));
  }
}

// call exec command
async function executeShellIntoContainer(): Promise<void> {
  if (container.state !== 'RUNNING') {
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
  await window.shellInContainerResize(callbackId, shellTerminal.cols, shellTerminal.rows);
  // pass data from xterm to container
  shellTerminal?.onData(data => {
    window.shellInContainerSend(callbackId, data).catch((error: unknown) => console.log(String(error)));
  });

  // store it
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
  const lineHeight = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.LineHeight,
  );

  const scrollback = await window.getConfigurationValue<number>(
    TerminalSettings.SectionName + '.' + TerminalSettings.Scrollback,
  );

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
  window.addEventListener('resize', () => {
    if (currentRouterPath === `/containers/${container.id}/terminal`) {
      fitAddon.fit();
      if (sendCallbackId) {
        window
          .shellInContainerResize(sendCallbackId, shellTerminal.cols, shellTerminal.rows)
          .catch((err: unknown) => console.error(`Error resizing terminal for container ${container.id}`, err));
      }
    }
  });
  fitAddon.fit();
}
onMount(async () => {
  await refreshTerminal();
  await executeShellIntoContainer();
});

onDestroy(() => {
  terminalContent = serializeAddon.serialize();
  // register terminal for reusing it
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
