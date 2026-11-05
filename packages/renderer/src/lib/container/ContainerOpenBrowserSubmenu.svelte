<script lang="ts">
import type { Port } from '@desktop-framework/extension-api';
import { faChevronRight, faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { tick } from 'svelte';

import ContainerOpenBrowserPortItems from './ContainerOpenBrowserPortItems.svelte';

interface Props {
  ports: Port[];
  // true when rendered as an item of a kebab (dropdown) menu, false when rendered as a button
  menu?: boolean;
  detailed?: boolean;
}

let { ports, menu = false, detailed = false }: Props = $props();

let submenuOpen = $state(false);
let openOnLeft = $state(false);
let parentElement: HTMLDivElement | undefined = $state();
let submenuElement: HTMLDivElement | undefined = $state();

async function openSubmenu(focusFirstItem = false): Promise<void> {
  // the kebab menu is usually at the right edge of the screen: open the submenu on the side having room for it
  const rect = parentElement?.getBoundingClientRect();
  openOnLeft = !!rect && window.innerWidth - rect.right < rect.width;
  submenuOpen = true;
  if (focusFirstItem) {
    await tick();
    submenuElement?.querySelector('button')?.focus();
  }
}

function closeSubmenu(focusParent = false): void {
  submenuOpen = false;
  if (focusParent) {
    parentElement?.querySelector('button')?.focus();
  }
}

function onParentClick(event: MouseEvent): void {
  // the kebab menu closes itself on any window click: keep it open when toggling the submenu
  // hovering already opens it, so a click only opens (never toggles it closed under the cursor)
  event.stopPropagation();
  if (!submenuOpen) {
    openSubmenu(event.detail === 0).catch(console.error);
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (!submenuOpen && event.key === 'ArrowRight') {
    event.preventDefault();
    openSubmenu(true).catch(console.error);
  } else if (submenuOpen && event.key === 'ArrowLeft') {
    event.preventDefault();
    closeSubmenu(true);
  }
}
</script>

{#if menu}
  <div
    class="relative"
    role="none"
    bind:this={parentElement}
    onmouseenter={(): Promise<void> => openSubmenu()}
    onmouseleave={(): void => closeSubmenu()}
    onkeydown={onKeydown}>
    <button
      type="button"
      title="Open Browser"
      aria-haspopup="menu"
      aria-expanded={submenuOpen}
      class="block w-full p-2.5 text-left text-[var(--pd-dropdown-item-text)] hover:bg-[var(--pd-dropdown-item-hover-bg)] hover:text-[var(--pd-dropdown-item-hover-text)] hover:rounded-md hover:cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--pd-button-focus-ring)"
      onclick={onParentClick}>
      <span class="flex items-center whitespace-nowrap h-4">
        <Icon class="w-4 text-md" icon={faExternalLinkSquareAlt} />
        <span class="ml-2 grow">Open Browser</span>
        <Icon class="ml-4 w-3 text-xs" icon={faChevronRight} />
      </span>
    </button>
    {#if submenuOpen}
      <div
        bind:this={submenuElement}
        role="menu"
        aria-label="Exposed ports"
        class="absolute top-0 z-20 rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] divide-y divide-[var(--pd-dropdown-divider)]"
        class:right-full={openOnLeft}
        class:left-full={!openOnLeft}>
        <ContainerOpenBrowserPortItems ports={ports} />
      </div>
    {/if}
  </div>
{:else}
  <DropdownMenu title="Open Browser" icon={faExternalLinkSquareAlt} shownAsMenuActionItem={detailed}>
    <div role="menu" aria-label="Exposed ports">
      <ContainerOpenBrowserPortItems ports={ports} />
    </div>
  </DropdownMenu>
{/if}
