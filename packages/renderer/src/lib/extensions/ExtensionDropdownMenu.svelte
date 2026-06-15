<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Component, Snippet } from 'svelte';
import { onDestroy, onMount, setContext } from 'svelte';

import {
  EXTENSION_ACTIONS_MENU_CHANGE_EVENT,
  getOpenExtensionActionsMenuId,
  isExtensionActionsMenuOpen,
  setOpenExtensionActionsMenuId,
} from './extension-actions-menu.svelte';
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

let menuRevision = $state(0);
let outsideWindow = $state<HTMLButtonElement>();
let clientY = $state(0);
let clientX = $state(0);

const isOpen = $derived.by(() => {
  menuRevision;
  return isExtensionActionsMenuOpen(menuId);
});

function closeMenu(): void {
  if (getOpenExtensionActionsMenuId() === menuId) {
    setOpenExtensionActionsMenuId(undefined);
  }
}

setContext<ExtensionDropdownMenuContext>(EXTENSION_DROPDOWN_MENU_CONTEXT, { closeMenu });

onMount(() => {
  const onMenuChange = (): void => {
    menuRevision += 1;
  };

  window.addEventListener(EXTENSION_ACTIONS_MENU_CHANGE_EVENT, onMenuChange);

  return (): void => {
    window.removeEventListener(EXTENSION_ACTIONS_MENU_CHANGE_EVENT, onMenuChange);
  };
});

onDestroy(() => {
  closeMenu();
});

function handleEscape({ key }: KeyboardEvent): void {
  if (key === 'Escape') {
    closeMenu();
  }
}

function isClickInsideMenuPanel(target: Node): boolean {
  const panel = document.querySelector(`[data-extension-dropdown-menu="${menuId}"]`);
  return !!panel?.contains(target);
}

function onWindowClick(e: MouseEvent): void {
  if (!isExtensionActionsMenuOpen(menuId)) {
    return;
  }

  const target = e.target as Node;
  if (outsideWindow?.contains(target) || isClickInsideMenuPanel(target)) {
    return;
  }

  closeMenu();
}

function onButtonClick(e: MouseEvent): void {
  e.stopPropagation();
  clientY = e.clientY;
  clientX = e.clientX;

  if (isExtensionActionsMenuOpen(menuId)) {
    closeMenu();
    return;
  }

  setOpenExtensionActionsMenuId(menuId);
}
</script>

<svelte:window on:keyup={handleEscape} on:click={onWindowClick} />

{#if !hidden}
  <div class="relative inline-block text-left">
    <button
      aria-label={title.length > 0 ? title : 'kebab menu'}
      aria-expanded={isOpen}
      onclick={onButtonClick}
      title={title}
      bind:this={outsideWindow}
      class="text-[var(--pd-action-button-text)] hover:bg-[var(--pd-action-button-details-bg)] hover:text-[var(--pd-action-button-hover-text)] font-medium rounded-md inline-flex items-center px-2 py-2 text-center">
      <Icon class="h-4 w-4" {icon} />
    </button>
  </div>

  {#if isOpen}
    <ExtensionDropDownMenuItems {menuId} {clientY} {clientX}>
      {@render children?.()}
    </ExtensionDropDownMenuItems>
  {/if}
{/if}
