<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { Component, Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';

import Icon from '../icons/Icon.svelte';

interface Props {
  title: string;
  tooltip?: string;
  icon: IconDefinition | Component | string;
  enabled?: boolean;
  hidden?: boolean;
  children?: Snippet;
}

let { title, tooltip = '', icon, enabled = true, hidden = false, children }: Props = $props();

let open = $state(false);
let openOnLeft = $state(false);
let parentElement: HTMLDivElement | undefined = $state();
// not reactive: only read by placeSubmenu when the submenu is mounted
let focusFirstItemOnOpen = false;

const enabledClasses =
  'hover:bg-[var(--pd-dropdown-item-hover-bg)] hover:text-[var(--pd-dropdown-item-hover-text)] hover:rounded-md text-[var(--pd-dropdown-item-text)] hover:cursor-pointer';
const disabledClasses = 'text-[var(--pd-dropdown-disabled-item-text)] bg-[var(--pd-dropdown-disabled-item-bg)]';

function openSubmenu(focusFirstItem = false): void {
  if (!enabled || open) {
    return;
  }
  focusFirstItemOnOpen = focusFirstItem;
  openOnLeft = false;
  open = true;
}

// Runs once the submenu is in the DOM
const placeSubmenu: Attachment<HTMLElement> = submenu => {
  // open on the left when there is no room on the right (e.g. kebab menu at the right edge of the window)
  if (submenu.getBoundingClientRect().right > window.innerWidth) {
    openOnLeft = true;
  }
  if (focusFirstItemOnOpen) {
    submenu.querySelector<HTMLElement>('button, [href], [tabindex]')?.focus();
  }
};

function closeSubmenu(focusParent = false): void {
  open = false;
  if (focusParent) {
    parentElement?.querySelector<HTMLElement>('button')?.focus();
  }
}

function onParentClick(event: MouseEvent): void {
  // the dropdown menu closes itself on any window click: keep it open when clicking the submenu entry
  event.stopPropagation();
  // hovering already opens the submenu, so a click only opens it (never toggles it closed under the cursor)
  // event.detail is 0 when the click comes from the keyboard (Enter / Space)
  openSubmenu(event.detail === 0);
}

function onKeydown(event: KeyboardEvent): void {
  if (!open && event.key === 'ArrowRight') {
    event.preventDefault();
    openSubmenu(true);
  } else if (open && event.key === 'ArrowLeft') {
    event.preventDefault();
    closeSubmenu(true);
  }
}
</script>

{#if !hidden}
  <div
    class="relative"
    role="none"
    bind:this={parentElement}
    onmouseenter={(): void => openSubmenu()}
    onmouseleave={(): void => closeSubmenu()}
    onkeydown={onKeydown}>
    <button
      type="button"
      title={tooltip !== '' ? tooltip : title}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-disabled={!enabled}
      class="block w-full p-2.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--pd-button-focus-ring) {enabled
        ? enabledClasses
        : disabledClasses}"
      onclick={onParentClick}>
      <span class="flex items-center no-underline whitespace-nowrap h-4">
        <Icon class="w-4 text-md" icon={icon} />
        <span class="ml-2 grow">{title}</span>
        <Icon class="ml-4 w-3 text-xs" icon={faChevronRight} />
      </span>
    </button>
    {#if open}
      <div
        {@attach placeSubmenu}
        role="menu"
        aria-label={title}
        class="absolute top-0 z-20 rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] divide-y divide-[var(--pd-dropdown-divider)]"
        class:right-full={openOnLeft}
        class:left-full={!openOnLeft}>
        {@render children?.()}
      </div>
    {/if}
  </div>
{/if}
