<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { mount, onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import { containerLogsCleared, getKeyValue } from '/@/stores/container-logs-cleared';

import { isMultiplexedLog } from '../stream/stream-utils';
import NoLogIcon from '../ui/NoLogIcon.svelte';
import TerminalWindow from '../ui/TerminalWindow.svelte';
import ContainerDetailsLogsClear from './ContainerDetailsLogsClear.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

export let container: ContainerInfoUI;

// Log
let refContainer: ContainerInfoUI;
// logs has been initialized
let noLogs = true;

// need to refresh logs when container is switched or state changes
$: {
  if (
    refContainer &&
    (refContainer.id !== container.id || (refContainer.state !== container.state && container.state !== 'EXITED'))
  ) {
    clearTerminal();
    fetchContainerLogs().catch((err: unknown) => console.error(`Error fetching container logs ${container.id}`, err));
  }
  refContainer = container;
}
let terminalParentDiv: HTMLDivElement;

let logsTerminal: Terminal;

let logsLength = 0;
let skip = 0;
let cancellableTokenId: number | undefined = undefined;
let containerLogsClearedUnsubscriber: Unsubscriber | undefined = undefined;

let containerDetailsLogsClearSetRevert: ((revert: boolean) => void) | undefined = undefined;

$: {
  if (skip > 0 && logsLength === skip) {
    containerDetailsLogsClearSetRevert?.(true);
  } else {
    containerDetailsLogsClearSetRevert?.(false);
  }
}

function callback(name: string, data: string): void {
  if (name === 'first-message') {
    noLogs = false;
    // clear on the first message
    clearTerminal();
  } else if (name === 'data') {
    noLogs = false;
    if (isMultiplexedLog(data)) {
      addDataToTerminal(data.substring(8));
    } else {
      addDataToTerminal(data);
    }
  }
  if (!noLogs) {
    window.dispatchEvent(new Event('resize'));
  }
}

async function fetchContainerLogs(): Promise<void> {
  containerLogsClearedUnsubscriber?.();
  containerLogsClearedUnsubscriber = containerLogsCleared.subscribe(cleared => {
    skip = cleared.get(getKeyValue(container.id, container.engineId)) ?? 0;
  });

  if (cancellableTokenId) {
    await window.cancelToken(cancellableTokenId);
  }
  cancellableTokenId = await window.getCancellableTokenSource();
  // grab logs of the container
  await window.logsContainer({ engineId: container.engineId, containerId: container.id, callback, cancellableTokenId });
}

function afterTerminalInit(): void {
  // mount the svelte5 component to the terminal xterm element
  let xtermElement = terminalParentDiv.querySelector('.xterm');
  xtermElement ??= terminalParentDiv;
  // add svelte component using this xterm element
  const { setRevert } = mount(ContainerDetailsLogsClear, {
    target: xtermElement,
    props: {
      terminal: logsTerminal,
      onclear: async () => {
        if (logsLength === skip) {
          setSkip(0);
        } else {
          setSkip(logsLength);
        }
        await fetchContainerLogs();
      },
    },
  });
  containerDetailsLogsClearSetRevert = setRevert;
}

function setSkip(n: number): void {
  const storeValue = $containerLogsCleared;
  if (n) {
    storeValue.set(getKeyValue(container.id, container.engineId), n);
  } else {
    storeValue.delete(getKeyValue(container.id, container.engineId));
  }
  containerLogsCleared.set(storeValue);
}

function clearTerminal(): void {
  logsTerminal?.clear();
  logsLength = 0;
}

function addDataToTerminal(data: string): void {
  if (logsLength >= skip) {
    logsTerminal?.write(data + '\r');
  }
  logsLength += data.length + 1;
}

onMount(async () => {
  await fetchContainerLogs();
});

onDestroy(async () => {
  logsTerminal?.dispose();
  containerLogsClearedUnsubscriber?.();
  if (cancellableTokenId) {
    await window.cancelToken(cancellableTokenId);
  }
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
