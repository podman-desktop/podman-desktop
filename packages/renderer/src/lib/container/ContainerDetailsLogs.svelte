<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { mount, onDestroy, onMount } from 'svelte';

import { isMultiplexedLog } from '/@/lib/stream/stream-utils';
import NoLogIcon from '/@/lib/ui/NoLogIcon.svelte';
import TerminalWindow from '/@/lib/ui/TerminalWindow.svelte';
import { containerLogsClearTimestamps } from '/@/stores/container-logs';

import ContainerDetailsLogsClear from './ContainerDetailsLogsClear.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  container: ContainerInfoUI;
}

const { container }: Props = $props();

// logs has been initialized
let noLogs = $state(true);

// the terminal displaying the logs
let logsTerminal = $state<Terminal>();

// save previous container
let refContainer: ContainerInfoUI;

let lastLogTimestamp: string | undefined = $derived($containerLogsClearTimestamps[container.id] ?? undefined);

// need to refresh logs when container is switched or state changes
$effect(() => {
  if (
    refContainer &&
    (refContainer.id !== container.id || (refContainer.state !== container.state && container.state !== 'EXITED'))
  ) {
    logsTerminal?.clear();
    fetchContainerLogs().catch((err: unknown) => console.error(`Error fetching container logs ${container.id}`, err));
  }
  refContainer = container;
});

// the div containing the terminal
let terminalParentDiv: HTMLDivElement;

function callback(name: string, data: string): void {
  if (name === 'first-message') {
    noLogs = false;
    // clear on the first message
    logsTerminal?.clear();
  } else if (name === 'data') {
    noLogs = false;
    if (isMultiplexedLog(data)) {
      logsTerminal?.write(data.substring(8) + '\r');
    } else {
      logsTerminal?.write(data + '\r');
    }
  }
  if (!noLogs) {
    window.dispatchEvent(new Event('resize'));
  }
}

async function fetchContainerLogs(): Promise<void> {
  // grab logs of the container
  await window.logsContainer({
    engineId: container.engineId,
    containerId: container.id,
    callback,
    since: lastLogTimestamp,
  });
}

function afterTerminalInit(): void {
  if (!logsTerminal) {
    throw new Error('terminal was not set by TerminalWindow. Should not happen');
  }
  // mount the svelte5 component to the terminal xterm element
  let xtermElement = terminalParentDiv.querySelector('.xterm');
  xtermElement ??= terminalParentDiv;
  // add svelte component using this xterm element
  mount(ContainerDetailsLogsClear, {
    target: xtermElement,
    props: {
      terminal: logsTerminal,
      container: container,
    },
  });
}

onMount(async () => {
  await fetchContainerLogs();
});

onDestroy(() => {
  logsTerminal?.dispose();
});
</script>

<EmptyScreen icon={NoLogIcon} title="No Log" message="Log output of {container.name}" hidden={noLogs === false} />

<div
  class="min-w-full flex flex-col"
  class:invisible={noLogs === true}
  class:h-0={noLogs === true}
  class:h-full={noLogs === false}
  bind:this={terminalParentDiv}>
  <TerminalWindow search on:init={afterTerminalInit} class="h-full" bind:terminal={logsTerminal} convertEol disableStdIn />
</div>
