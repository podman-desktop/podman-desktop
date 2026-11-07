<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { onDestroy, onMount } from 'svelte';

import NoLogIcon from '/@/lib/ui/NoLogIcon.svelte';
import TerminalWindow from '/@/lib/ui/TerminalWindow.svelte';
import { containerLogsClearTimestamps } from '/@/stores/container-logs';

import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  container: ContainerInfoUI;
  // gets the logs terminal while it is showing logs, undefined otherwise
  onTerminalChange?: (terminal: Terminal | undefined) => void;
}

const { container, onTerminalChange }: Props = $props();

// logs has been initialized
let noLogs = $state(true);

// the terminal displaying the logs
let logsTerminal = $state<Terminal>();

// nothing to clear on the "No Log" screen
$effect(() => {
  onTerminalChange?.(noLogs ? undefined : logsTerminal);
});

// save previous container
let refContainer: ContainerInfoUI;

let lastLogTimestamp: string | undefined = $derived($containerLogsClearTimestamps[container.id] ?? undefined);

// need to refresh logs when container is switched or state changes
$effect(() => {
  if (
    refContainer &&
    (refContainer.id !== container.id || (refContainer.state !== container.state && container.state !== 'EXITED'))
  ) {
    // the new container may have no logs at all
    if (refContainer.id !== container.id) {
      noLogs = true;
    }
    logsTerminal?.clear();
    fetchContainerLogs().catch((err: unknown) => console.error(`Error fetching container logs ${container.id}`, err));
  }
  refContainer = container;
});

function callback(name: string, data: string): void {
  if (name === 'first-message') {
    noLogs = false;
    // clear on the first message
    logsTerminal?.clear();
  } else if (name === 'data') {
    noLogs = false;
    logsTerminal?.write(data + '\r');
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

onMount(async () => {
  await fetchContainerLogs();
});

onDestroy(() => {
  logsTerminal?.dispose();
  // don't leave the disposed terminal with the parent
  onTerminalChange?.(undefined);
});
</script>

<EmptyScreen icon={NoLogIcon} title="No Log" message="Log output of {container.name}" hidden={noLogs === false} />

<div
  class="min-w-full flex flex-col"
  class:invisible={noLogs === true}
  class:h-0={noLogs === true}
  class:h-full={noLogs === false}>
  <TerminalWindow search class="h-full" bind:terminal={logsTerminal} convertEol disableStdIn />
</div>
