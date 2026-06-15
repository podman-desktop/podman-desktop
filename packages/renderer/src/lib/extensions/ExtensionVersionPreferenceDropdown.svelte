<script lang="ts">
import { faArrowDown, faArrowUp, faCaretDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import type { ExtensionVersionOption } from './extension-version-preference';

interface Props {
  id: string;
  value: string;
  disabled?: boolean;
  options: ExtensionVersionOption[];
  ariaLabel: string;
  onChange: (value: string) => void | Promise<void>;
}

let { id, value = $bindable(), disabled = false, options, ariaLabel, onChange }: Props = $props();

let opened = $state(false);
let container = $state<HTMLElement>();

const selectedVersionLabel = $derived(value ? `v${value}` : '');

function close(): void {
  opened = false;
}

function toggle(event: MouseEvent): void {
  event.stopPropagation();
  if (disabled) {
    return;
  }
  opened = !opened;
}

async function select(event: Event, option: ExtensionVersionOption): Promise<void> {
  event.preventDefault();
  event.stopPropagation();
  if (option.value === value) {
    close();
    return;
  }

  await onChange(option.value);
  close();
}

function onWindowClick(event: MouseEvent): void {
  if (opened && container && !container.contains(event.target as Node)) {
    close();
  }
}

function getStatusLabel(option: ExtensionVersionOption): string {
  if (option.status === 'current') {
    return 'Current';
  }
  if (option.status === 'upgrade') {
    return 'Upgrade';
  }
  return 'Downgrade';
}
</script>

<svelte:window onclick={onWindowClick} />

<div class="relative w-56 shrink-0" class:cursor-not-allowed={disabled} bind:this={container}>
  <div
    class="group relative flex min-h-9 flex-row items-center border-b bg-[var(--pd-input-field-bg)] px-1 py-1"
    class:border-[var(--pd-input-field-stroke)]={!disabled}
    class:hover:border-[var(--pd-input-field-hover-stroke)]={!disabled}
    class:hover:bg-[var(--pd-input-field-hover-bg)]={!disabled}
    class:border-[var(--pd-input-field-stroke-readonly)]={disabled}
    class:cursor-not-allowed={disabled}
    aria-label={ariaLabel}>
    <button
      {id}
      type="button"
      class="flex w-full items-center gap-2 px-1 text-start outline-0"
      class:text-[color:var(--pd-input-field-focused-text)]={!disabled}
      class:text-[color:var(--pd-input-field-disabled-text)]={disabled}
      class:cursor-pointer={!disabled}
      class:pointer-events-none={disabled}
      disabled={disabled}
      onclick={toggle}>
      <span class="grow truncate font-medium">{selectedVersionLabel}</span>
      <span
        class:text-[var(--pd-input-field-stroke)]={!disabled}
        class:text-[var(--pd-input-field-disabled-text)]={disabled}
        class:group-hover:text-[var(--pd-input-field-hover-stroke)]={!disabled}>
        <Icon icon={faCaretDown} />
      </span>
    </button>
  </div>

  {#if opened}
    <div
      class="absolute top-full right-0 z-10 mt-1 min-w-full w-max max-h-80 overflow-y-auto rounded-md border border-[var(--pd-input-field-hover-stroke)] bg-[var(--pd-dropdown-bg)] shadow-lg">
      {#each options as option (option.value)}
        <button
          type="button"
          aria-label="{getStatusLabel(option)} to v{option.value}"
          class="flex w-full items-center justify-between gap-4 px-3 py-2 text-start transition-colors hover:cursor-pointer hover:bg-[var(--pd-dropdown-item-hover-bg)] hover:text-[var(--pd-dropdown-item-hover-text)]"
          class:bg-[var(--pd-dropdown-item-hover-bg)]={option.value === value}
          class:text-[var(--pd-dropdown-item-hover-text)]={option.value === value}
          onclick={(event): void => {
            select(event, option).catch(() => undefined);
          }}>
          <span class="inline-flex min-w-0 items-center gap-2">
            <span class="inline-flex w-4 shrink-0 justify-center">
              {#if option.status === 'current'}
                <Icon icon={faCheck} size="sm" />
              {:else if option.status === 'upgrade'}
                <Icon icon={faArrowUp} size="sm" />
              {:else}
                <Icon icon={faArrowDown} size="sm" />
              {/if}
            </span>
            <span class="truncate font-medium">v{option.value}</span>
          </span>
          <span class="shrink-0 text-xs text-[var(--pd-content-text)]">{getStatusLabel(option)}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
