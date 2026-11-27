<script lang="ts">
import type { StatusBarEntry } from '@desktop-framework/api';
import { tooltip as tooltipAttachment } from '@podman-desktop/ui-svelte';

import { iconClass } from './StatusBarItem';

interface Props {
  entry: StatusBarEntry;
}

let { entry }: Props = $props();

function tooltipText(entry: StatusBarEntry): string {
  return entry.tooltip ?? '';
}

function accessibleName(entry: StatusBarEntry): string | undefined {
  // an entry without text is icon-only: use its tooltip so the button keeps an accessible name
  if (entry.text) {
    return entry.text;
  }
  return tooltipText(entry) || undefined;
}

function opacity(entry: StatusBarEntry): string {
  return entry.enabled ? 'opacity-100' : 'opacity-25';
}

function hoverBackground(entry: StatusBarEntry): string {
  return entry.enabled && typeof entry.command === 'string' ? 'hover:bg-[var(--pd-statusbar-hover-bg)]' : '';
}

function hoverCursor(entry: StatusBarEntry): string {
  return entry.enabled && typeof entry.command === 'string' ? 'hover:cursor-pointer' : '';
}

async function executeCommand(entry: StatusBarEntry): Promise<void> {
  if (typeof entry.command === 'undefined') {
    return;
  }
  const command = entry.command;
  const commandArgs = entry.commandArgs;

  // convert args to a plain object and not as proxy of arguments
  const noProxyCommandArgs = commandArgs ? JSON.parse(JSON.stringify(commandArgs)) : undefined;
  await window.executeStatusBarEntryCommand(command, noProxyCommandArgs);
}
</script>

<button
  onclick={async (): Promise<void> => {
    await executeCommand(entry);
  }}
  class="{opacity(entry)} px-1 py-px flex h-full items-center {hoverBackground(entry)} {hoverCursor(
    entry,
  )} relative inline-block"
  aria-label={accessibleName(entry)}
  {@attach tooltipAttachment(() => tooltipText(entry))}>
  {#if iconClass(entry)}
    <span class={iconClass(entry)} aria-hidden="true" data-task-button="{tooltipText(entry)}"></span>
  {/if}
  {#if entry.text}
    <span class="ml-1">{entry.text}</span>
  {/if}
  {#if entry.highlight}
    <span role="status" class="absolute bg-[var(--pd-notification-dot)] rounded-full p-1 top-[1px] right-[-1px]"></span>
  {/if}
</button>
