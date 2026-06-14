<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Component, Snippet } from 'svelte';
import { onDestroy, onMount, setContext } from 'svelte';

import { closeOtherExtensionActionsMenus, registerExtensionActionsMenu } from './extension-actions-menu.svelte';
import { EXTENSION_DROPDOWN_MENU_CONTEXT, type ExtensionDropdownMenuContext } from './extension-dropdown-menu-context';
import ExtensionDropDownMenuItems from './ExtensionDropDownMenuItems.svelte';

interface Props {
  menuId: string;
  icon?: IconDefinition | Component | string;
  hidden?: boolean;
  title?: string;
  children?: Snippet;
}

let { menuId, icon = faEllipsisVertical, hidden = false, title = '', children }: Props = $props();

let showMenu = $state(false);
let outsideWindow = $state<HTMLButtonElement>();
let clientY = $state(0);
let clientX = $state(0);

function closeMenu(): void {
  showMenu = false;
}

setContext<ExtensionDropdownMenuContext>(EXTENSION_DROPDOWN_MENU_CONTEXT, { closeMenu });

onMount(() => {
  return registerExtensionActionsMenu(menuId, closeMenu);
});

onDestroy(() => {
  closeMenu();
});

function handleEscape({ key }: KeyboardEvent): void {
  if (key === 'Escape') {
    closeMenu();
  }
}

function onWindowClick(e: MouseEvent): void {
  if (!hidden) {
    showMenu = outsideWindow?.contains(e.target as Node) ?? false;
  }
}

function onButtonClick(e: MouseEvent): void {
  clientY = e.clientY;
  clientX = e.clientX;
  closeOtherExtensionActionsMenus(menuId);
  showMenu = !showMenu;
}
</script>

<svelte:window on:keyup={handleEscape} on:click={onWindowClick} />

{#if !hidden}
  <div class="relative inline-block text-left">
    <button
      aria-label={title.length > 0 ? title : 'kebab menu'}
      onclick={onButtonClick}
      title={title}
      bind:this={outsideWindow}
      class="text-[var(--pd-action-button-text)] hover:bg-[var(--pd-action-button-details-bg)] hover:text-[var(--pd-action-button-hover-text)] font-medium rounded-md inline-flex items-center px-2 py-2 text-center">
      <Icon class="h-4 w-4" {icon} />
    </button>
  </div>

  {#if showMenu}
    <ExtensionDropDownMenuItems {menuId} {clientY} {clientX}>
      {@render children?.()}
    </ExtensionDropDownMenuItems>
  {/if}
{/if}
