<script lang="ts">
import { faThumbtack, faThumbtackSlash } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';

import { statusBarPinned } from '/@/stores/statusbar-pinned';
import { STATUS_BAR_PIN_CONSTANTS } from '/@api/status-bar/pin-constants';
import type { PinOption } from '/@api/status-bar/pin-option';

import PinMenu from './PinMenu.svelte';

let showMenu: boolean = $state(false);
let outsideWindow: HTMLDivElement;
window.events?.receive(STATUS_BAR_PIN_CONSTANTS.TOGGLE_MENU, toggleMenu);

function toggleMenu(): void {
  showMenu = !showMenu;
}

function handleEscape({ key }: KeyboardEvent): void {
  if (key === 'Escape') {
    showMenu = false;
  }
}

function onWindowClick(e: Event): void {
  const target = e.target as HTMLElement;
  // Listen to anything **but** the button that has "data-task-button" attribute with a value of "Help"
  if (target && target.getAttribute('data-task-button') !== 'Pin') {
    showMenu = outsideWindow.contains(target);
  }
}

function onItemClick(option: PinOption): void {
  console.log('onClick', option);
  if (option.pinned) {
    window.unpinStatusBar($state.snapshot(option.value)).catch(console.error);
  } else {
    window.pinStatusBar($state.snapshot(option.value)).catch(console.error);
  }
}
</script>

<svelte:window on:keyup={handleEscape} on:click={onWindowClick}/>

<div bind:this={outsideWindow}>
  {#if showMenu}
    <PinMenu>
      {#each $statusBarPinned as option }
        <DropdownMenu.Item
          title={option.label}
          tooltip={option.label}
          enabled={true}
          icon={option.pinned?faThumbtack:faThumbtackSlash}
          onClick={onItemClick.bind(undefined, option)}
        />
      {/each}
    </PinMenu>
  {/if}
</div>
