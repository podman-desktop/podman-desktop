<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { Terminal } from '@xterm/xterm';
import { onDestroy } from 'svelte';

import NoLogIcon from '/@/lib/ui/NoLogIcon.svelte';
import TerminalWindow from '/@/lib/ui/TerminalWindow.svelte';

import { ContainerTtySession } from './container-tty-session';
import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  container: ContainerInfoUI;
  screenReaderMode?: boolean;
}

let { container, screenReaderMode = false }: Props = $props();
let terminal: Terminal | undefined = $state(undefined);
const session = new ContainerTtySession();
const status = session.status;
const closed = $derived($status === 'disconnected');
const containerState = $derived(container.state);
const containerId = $derived(container.id);
const engineId = $derived(container.engineId);

$effect(() => session.update(terminal, engineId, containerId, containerState));
onDestroy(() => session.dispose());
</script>

<div class="h-full" class:hidden={containerState !== 'RUNNING' || closed}>
  <TerminalWindow class="h-full" bind:terminal screenReaderMode={screenReaderMode} disableStdIn={false} showCursor={true} />
</div>

<EmptyScreen
  hidden={!closed || containerState !== 'RUNNING'}
  icon={NoLogIcon}
  title="No TTY"
  message="TTY has stopped" />

<EmptyScreen
  hidden={containerState === 'RUNNING'}
  icon={NoLogIcon}
  title="No TTY"
  message="Container is not running" />
