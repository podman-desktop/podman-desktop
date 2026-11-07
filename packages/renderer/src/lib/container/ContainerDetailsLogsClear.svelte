<script lang="ts">
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Terminal } from '@xterm/xterm';
import { SvelteDate } from 'svelte/reactivity';

import { containerLogsClearTimestamps } from '/@/stores/container-logs';

import type { ContainerInfoUI } from './ContainerInfoUI';

const { terminal, container }: { terminal: Terminal; container: ContainerInfoUI } = $props();

let lastLog = false;

async function getLastLogTimestamp(): Promise<void> {
  lastLog = true;
  // the page can switch to another container before the callback runs
  const containerId = container.id;
  await window.logsContainer({
    engineId: container.engineId,
    containerId,
    callback: (name: string, data: string): void => callback(containerId, name, data),
    timestamps: true,
    tail: 1,
  });
}

function callback(containerId: string, name: string, data: string): void {
  if (name === 'data' && data && lastLog) {
    lastLog = false;
    const timestamp = data.split(' ', 1)[0];
    const datenow = new SvelteDate(timestamp);
    datenow.setSeconds(datenow.getSeconds() + 1);
    $containerLogsClearTimestamps[containerId] = datenow.toISOString();
  }
}

async function clear(): Promise<void> {
  await getLastLogTimestamp();
  terminal.clear();
}
</script>

<button title="Clear logs" onclick={clear} class="flex">
  <Icon
    class="cursor-pointer rounded-full bg-[var(--pd-button-disabled)] min-h-6 w-6 p-1 hover:bg-[var(--pd-button-close-hover-bg)]"
    icon={faEraser}
  />
</button>
