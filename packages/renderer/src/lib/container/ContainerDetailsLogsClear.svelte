<script lang="ts">
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Terminal } from '@xterm/xterm';
import { SvelteDate } from 'svelte/reactivity';

import { isMultiplexedLog } from '/@/lib/stream/stream-utils';
import { containerLogsClearTimestamps } from '/@/stores/container-logs';

import type { ContainerInfoUI } from './ContainerInfoUI';

const { terminal, container }: { terminal: Terminal; container: ContainerInfoUI } = $props();

let clearTimestamp: string = $state('');

let lastLog = false;

$effect(() => {
  if (clearTimestamp) {
    $containerLogsClearTimestamps[container.id] = clearTimestamp;
  }
});

async function getLastLogTimestamp(): Promise<void> {
  lastLog = true;
  await window.logsContainer({
    engineId: container.engineId,
    containerId: container.id,
    callback,
    timestamps: true,
    tail: 1,
  });
}

function callback(name: string, data: string): void {
  let timestamp: string;
  if (name === 'data' && data && lastLog) {
    lastLog = false;
    if (isMultiplexedLog(data)) {
      timestamp = data.substring(8).split(' ', 1)[0];
    } else {
      timestamp = data.split(' ', 1)[0];
    }
    const datenow = new SvelteDate(timestamp);
    datenow.setSeconds(datenow.getSeconds() + 1);
    clearTimestamp = datenow.toISOString();
  }
}

async function clear(): Promise<void> {
  await getLastLogTimestamp();
  terminal.clear();
}
</script>

<div class="absolute top-0 right-2 px-1 z-50 m-1 opacity-50 space-x-1">
  <button title="Clear logs" onclick={clear} class="">
    <Icon
      class="cursor-pointer rounded-full bg-[var(--pd-button-disabled)] min-h-8 w-8 p-1.5 hover:bg-[var(--pd-button-primary-hover-bg)]"
      icon={faEraser}
    />
  </button>
</div>
