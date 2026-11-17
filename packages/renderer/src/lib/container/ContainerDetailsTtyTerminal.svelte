<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';

import NoLogIcon from '/@/lib/ui/NoLogIcon.svelte';
import TerminalWindow from '/@/lib/ui/TerminalWindow.svelte';

import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  container: ContainerInfoUI;
  screenReaderMode?: boolean;
}

let { container, screenReaderMode = false }: Props = $props();
let attachContainerTerminal: Terminal | undefined = $state(undefined);
let closed = $state(false);
const containerState = $derived(container.state);
const containerId = $derived(container.id);
const engineId = $derived(container.engineId);

$effect(() => {
  const terminal = attachContainerTerminal;
  if (!terminal || containerState !== 'RUNNING') {
    return;
  }

  let active = true;
  let callbackId: number | undefined;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

  const input = terminal.onData(data => {
    if (callbackId === undefined) {
      return;
    }
    window
      .attachContainerSend(callbackId, data)
      .catch((err: unknown) => console.log(`Error sending data to container ${containerId}`, err));
  });

  function scheduleReconnect(): void {
    if (!active || reconnectTimer) return;
    closed = true;
    callbackId = undefined;
    reconnectTimer = setTimeout(attachToContainer, 2000);
  }

  function attachToContainer(): void {
    reconnectTimer = undefined;
    closed = false;
    window
      .attachContainer(
        engineId,
        containerId,
        data => {
          if (active) terminal?.write(data.toString());
        },
        scheduleReconnect,
        scheduleReconnect,
      )
      .then(id => {
        if (active) callbackId = id;
      })
      .catch((err: unknown) => {
        scheduleReconnect();
        console.error(`Error attaching to container ${containerId}`, err);
      });
  }

  attachToContainer();

  return (): void => {
    active = false;
    clearTimeout(reconnectTimer);
    input.dispose();
  };
});
</script>

<div class="h-full" class:hidden={container.state !== 'RUNNING' || closed}>
  <TerminalWindow class="h-full" bind:terminal={attachContainerTerminal} screenReaderMode={screenReaderMode} disableStdIn={false} showCursor={true} />
</div>

<EmptyScreen
  hidden={!closed || container.state !== 'RUNNING'}
  icon={NoLogIcon}
  title="No TTY"
  message="TTY has stopped" />

<EmptyScreen
  hidden={container.state === 'RUNNING'}
  icon={NoLogIcon}
  title="No TTY"
  message="Container is not running" />
