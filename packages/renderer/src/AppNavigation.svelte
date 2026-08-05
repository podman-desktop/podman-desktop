<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { DropSlot } from '@podman-desktop/core-api';
import { NavigationPage } from '@podman-desktop/core-api';
import { AppearanceSettings } from '@podman-desktop/core-api/appearance';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Component } from 'svelte';
import { onDestroy, onMount, tick } from 'svelte';
import type { IconSize } from 'svelte-fa';
import type { TinroRouteMeta } from 'tinro';

import AuthActions from './lib/authentication/AuthActions.svelte';
import { CommandRegistry } from './lib/CommandRegistry';
import NewContentOnDashboardBadge from './lib/dashboard/NewContentOnDashboardBadge.svelte';
import AccountIcon from './lib/images/AccountIcon.svelte';
import DashboardIcon from './lib/images/DashboardIcon.svelte';
import PreferencesIcon from './lib/images/PreferencesIcon.svelte';
import SettingsIcon from './lib/images/SettingsIcon.svelte';
import { longPress } from './lib/ui/attachments/longpress';
import NavItem from './lib/ui/NavItem.svelte';
import NavRegistryEntry from './lib/ui/NavRegistryEntry.svelte';
import { applyExternalInsert, applyInsertSlotReorder, computeDropSlot, isNoOpInsert } from './nav-drop-slot';
import { handleNavigation } from './navigation';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { LONG_PRESS_MS, navigationDragState } from './stores/navigation/navigation-drag-state.svelte';
import type { NavigationRegistryEntry } from './stores/navigation/navigation-registry';
import { navigationRegistry, promoteToNavbar, setNavigationItemOrder } from './stores/navigation/navigation-registry';

interface Props {
  exitSettingsCallback: () => void;
  meta: TinroRouteMeta;
}
let { exitSettingsCallback, meta = $bindable() }: Props = $props();

let authActions = $state<AuthActions>();
let outsideWindow = $state<HTMLDivElement>();
let scrollRegionEl = $state<HTMLDivElement>();
let navEl = $state<HTMLElement>();

const iconSize = '24';
const NAV_BAR_WIDTH_KEY = `${AppearanceSettings.SectionName}.${AppearanceSettings.NavigationBarWidth}`;

const minWidth = 50;
const maxWidth = 240;
const expandedThreshold = 70;

let navWidth = $state(160);
let expanded = $derived(navWidth > expandedThreshold);
let isDragging = $state(false);
let isMac: boolean = $state(false);
let modifierC: string = $derived(isMac ? '⌘' : 'Ctrl+');
let reorderKeyShortcuts = $derived(isMac ? 'Meta+ArrowUp Meta+ArrowDown' : 'Control+ArrowUp Control+ArrowDown');
let navAnnounce = $state('');

function flattenNavigationEntries(entries: NavigationRegistryEntry[]): NavigationRegistryEntry[] {
  const flat: NavigationRegistryEntry[] = [];
  for (const entry of entries) {
    if (entry.items && entry.type === 'group') {
      flat.push(...entry.items);
    } else if (entry.type === 'submenu') {
      flat.push(entry);
      for (const child of entry.items ?? []) {
        if (child.index !== undefined) {
          const prefixedName = `${entry.name} > ${child.name}`;
          flat.push({ ...child, name: prefixedName, tooltip: prefixedName });
        }
      }
    } else {
      flat.push(entry);
    }
  }
  return flat.map(entry => ({ ...entry }));
}

let flatNavigationEntries = $derived(flattenNavigationEntries($navigationRegistry));

function entryIdentifier(entry: NavigationRegistryEntry): string {
  // Prefixed names are unique and match context-menu pin keys in itemOrder.
  return entry.name.includes(' > ') ? entry.name : entry.link;
}

let dragContainerEl = $state<HTMLDivElement>();
let dragIndex = $state<number | undefined>();
let dragInsertIndex = $state<number | undefined>();
let isReorderDragging = $state(false);
let reorderPointerY = $state(0);
let reorderGrabOffsetY = $state(0);
let pendingReorderEl: HTMLElement | undefined;
let pendingPointerId = 0;

// Single main-nav list sorted by index (defaults and pinned share one sequence)
let allVisibleEntries = $derived(
  flatNavigationEntries
    .filter(e => !e.hidden && e.index !== undefined)
    .toSorted((a, b) => (a.index ?? 0) - (b.index ?? 0)),
);
let isExternalDragActive = $derived(!!navigationDragState.payload);

function findEntryByLink(entries: NavigationRegistryEntry[], link: string): NavigationRegistryEntry | undefined {
  for (const entry of entries) {
    if (entry.link === link) {
      return entry;
    }
    const child = findEntryByLink(entry.items ?? [], link);
    if (child) {
      return child;
    }
  }
  return undefined;
}

type DragGhostIcon = {
  icon: IconDefinition | Component | string | { light: string; dark: string };
  size?: IconSize | number | string;
};

function resolveNavIcon(entryIcon: NavigationRegistryEntry['icon']): DragGhostIcon | undefined {
  if (entryIcon?.faIcon) {
    return { icon: entryIcon.faIcon.definition, size: entryIcon.faIcon.size };
  }
  if (entryIcon?.iconComponent) {
    return { icon: entryIcon.iconComponent, size: '24' };
  }
  if (entryIcon?.iconImage) {
    return { icon: entryIcon.iconImage, size: 22 };
  }
  return undefined;
}

/** Ghost preview for pin-drags and internal reorder: same icon/name as the main nav row. */
let dragGhost = $derived.by((): { name: string; icon?: DragGhostIcon } | undefined => {
  const payload = navigationDragState.payload;
  if (payload) {
    const found = findEntryByLink($navigationRegistry, payload.link);
    return {
      name: payload.name,
      icon: resolveNavIcon(found?.icon ?? { iconComponent: PreferencesIcon }),
    };
  }
  if (isReorderDragging && dragIndex !== undefined) {
    const entry = allVisibleEntries[dragIndex];
    if (entry) {
      return { name: entry.name, icon: resolveNavIcon(entry.icon) };
    }
  }
  return undefined;
});

let ghostPointerY = $derived(
  (isExternalDragActive ? navigationDragState.pointerY : reorderPointerY) -
    (isExternalDragActive ? navigationDragState.grabOffsetY : reorderGrabOffsetY),
);
let ghostPointerX = $derived(
  isExternalDragActive
    ? navigationDragState.pointerX - navigationDragState.grabOffsetX
    : (navEl?.getBoundingClientRect().left ?? 0),
);

let dropIndex = $state<number | undefined>();
let dropIndicatorY = $state(0);
let showDropLine = $derived(
  dropIndex !== undefined &&
    (isExternalDragActive || (isReorderDragging && dragIndex !== undefined && !isNoOpInsert(dragIndex, dropIndex))),
);

function readDropSlot(clientY: number): DropSlot {
  if (!dragContainerEl) {
    return { index: allVisibleEntries.length, indicatorY: 0 };
  }
  const items = [...dragContainerEl.querySelectorAll<HTMLElement>('[data-nav-drag-item]')];
  const containerTop = dragContainerEl.getBoundingClientRect().top;
  const rects = items.map(c => c.getBoundingClientRect());
  return computeDropSlot(clientY, rects, containerTop);
}

/** Track drop line anywhere in the visible nav list (not only the pinned block). */
function updateExternalDropFromY(clientY: number): void {
  const slot = readDropSlot(clientY);
  dropIndex = slot.index;
  dropIndicatorY = slot.indicatorY;
}

function commitExternalDrop(): void {
  const payload = navigationDragState.payload;
  if (!payload || dropIndex === undefined) {
    return;
  }
  const visualIds = allVisibleEntries.map(e => entryIdentifier(e));
  const orderId = payload.name.includes(' > ') ? payload.name : payload.link;
  const wasInMainNav = allVisibleEntries.some(e => entryIdentifier(e) === orderId || e.link === payload.link);
  const newOrder = applyExternalInsert(visualIds, orderId, dropIndex);
  setNavigationItemOrder(newOrder);
  if (!findEntryByLink($navigationRegistry, payload.link)) {
    promoteToNavbar(payload.name, payload.link);
  }
  const newPos = newOrder.indexOf(orderId) + 1;
  const message = wasInMainNav
    ? `Moved ${payload.name} to position ${newPos} of ${newOrder.length}`
    : `Pinned ${payload.name} to main navigation at position ${newPos} of ${newOrder.length}`;
  navAnnounce = message;
  navigationDragState.payload = undefined;
  dropIndex = undefined;
}

const EDGE_SCROLL_PX = 40;
const EDGE_SCROLL_STEP = 12;

/** Scroll the nav list when dragging near its top/bottom edge. */
function maybeAutoScroll(clientY: number): void {
  const el = scrollRegionEl;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  if (clientY < rect.top + EDGE_SCROLL_PX) {
    el.scrollTop = Math.max(0, el.scrollTop - EDGE_SCROLL_STEP);
  } else if (clientY > rect.bottom - EDGE_SCROLL_PX) {
    el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, el.scrollTop + EDGE_SCROLL_STEP);
  }
}

function isPointerOverMainNav(clientX: number, clientY: number): boolean {
  if (!navEl) {
    return false;
  }
  const rect = navEl.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

// Seed drop-line when an external pin-drag starts.
$effect(() => {
  if (navigationDragState.payload) {
    updateExternalDropFromY(navigationDragState.pointerY);
  }
});

function onItemPointerDown(e: PointerEvent): void {
  if (e.button > 0) return;
  pendingReorderEl = e.currentTarget as HTMLElement;
  pendingPointerId = e.pointerId;
  reorderPointerY = e.clientY;
  const rect = pendingReorderEl.getBoundingClientRect();
  reorderGrabOffsetY = e.clientY - rect.top;
}

function onLongPressReorder(index: number): void {
  if (!dragContainerEl) return;
  dragIndex = index;
  dragInsertIndex = index;
  const slot = readDropSlot(reorderPointerY);
  dropIndex = slot.index;
  dropIndicatorY = slot.indicatorY;
  isReorderDragging = true;
  document.body.style.cursor = 'grabbing';
  pendingReorderEl?.setPointerCapture(pendingPointerId);
  navigator.vibrate?.(15);
}

function onDragMove(e: PointerEvent): void {
  if (dragIndex === undefined) return;
  reorderPointerY = e.clientY;
  maybeAutoScroll(e.clientY);
  const slot = readDropSlot(e.clientY);
  dragInsertIndex = slot.index;
  dropIndex = slot.index;
  dropIndicatorY = slot.indicatorY;
}

function onDragUp(): void {
  if (dragIndex === undefined) return;
  if (dragInsertIndex !== undefined && !isNoOpInsert(dragIndex, dragInsertIndex)) {
    commitReorder(dragIndex, dragInsertIndex);
  }
  resetDrag();
}

function resetDrag(): void {
  dragIndex = undefined;
  dragInsertIndex = undefined;
  isReorderDragging = false;
  dropIndex = undefined;
  pendingReorderEl = undefined;
  reorderGrabOffsetY = 0;
  document.body.style.cursor = '';
}

function getOrderedIds(): string[] {
  return allVisibleEntries.map(e => entryIdentifier(e));
}

function persistOrderedIds(ids: string[]): void {
  setNavigationItemOrder(ids);
}

/** Commit using insert-slot index (insert before `insertIndex`, or after last when insertIndex === length). */
function commitReorder(fromIndex: number, insertIndex: number): void {
  const movedEntry = allVisibleEntries[fromIndex];
  if (!movedEntry) return;

  const movedId = entryIdentifier(movedEntry);
  const newOrder = applyInsertSlotReorder(getOrderedIds(), movedId, fromIndex, insertIndex);
  persistOrderedIds(newOrder);
  const newPos = newOrder.indexOf(movedId) + 1;
  navAnnounce = `Moved ${movedEntry.name} to position ${newPos} of ${newOrder.length}`;
}

function onItemContextMenu(e: Event): void {
  if (isReorderDragging) e.preventDefault();
}

// --- Keyboard reorder: modifier+Arrow to move focused nav item ---
function onKeyDown(e: KeyboardEvent): void {
  if (!e.ctrlKey && !e.metaKey) return;
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

  const focused = document.activeElement as HTMLElement | null;
  if (!focused || !dragContainerEl?.contains(focused)) return;

  const itemEl = focused.closest('[data-nav-drag-item]') as HTMLElement | null;
  if (!itemEl) return;

  const items = [...dragContainerEl.querySelectorAll<HTMLElement>('[data-nav-drag-item]')];
  const currentIdx = items.indexOf(itemEl);
  if (currentIdx === -1) return;

  // insert before neighbor above, or after neighbor below
  const insertIndex = e.key === 'ArrowUp' ? currentIdx - 1 : currentIdx + 2;
  if (insertIndex < 0 || insertIndex > items.length) return;

  e.preventDefault();
  commitReorder(currentIdx, insertIndex);
}

$effect(() => {
  document.documentElement.style.setProperty('--spacing-leftnavbar', `${navWidth}px`);
});

/** Custom overlay scrollbar: thumb position and height (0–1) */
let scrollThumbTop = $state(0);
let scrollThumbHeight = $state(1);
let scrollThumbVisible = $state(false);

function updateScrollThumb(): void {
  const el = scrollRegionEl;
  if (!el) return;
  const { scrollTop, scrollHeight, clientHeight } = el;
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) {
    scrollThumbVisible = false;
    return;
  }
  scrollThumbVisible = true;
  scrollThumbHeight = Math.max(0.1, clientHeight / scrollHeight);
  scrollThumbTop = scrollTop / scrollHeight;
}

function onScrollRegionScroll(): void {
  updateScrollThumb();
}

function onScrollRegionPointerDown(e: MouseEvent): void {
  const el = scrollRegionEl;
  const target = e.target as HTMLElement | null;
  const thumb = target?.closest('[data-nav-scroll-thumb]');
  if (!el || !target || thumb) return;
  // Do not treat clicks on nav links / controls as "jump scroll" — that steals the first click (odockal feedback).
  if (target.closest('a, button, [role="button"], input, select, textarea')) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const frac = y / rect.height;
  el.scrollTop = frac * (el.scrollHeight - el.clientHeight);
}

function onThumbPointerDown(e: MouseEvent): void {
  e.preventDefault();
  const el = scrollRegionEl;
  if (!el) return;
  const scrollEl = el;
  const startY = e.clientY;
  const startScrollTop = scrollEl.scrollTop;
  const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

  function move(ev: MouseEvent): void {
    const dy = ev.clientY - startY;
    const ratio = scrollEl.clientHeight / scrollEl.scrollHeight;
    scrollEl.scrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + dy / ratio));
  }
  function up(): void {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
  }
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
}

function onThumbWheel(e: WheelEvent): void {
  if (scrollRegionEl) {
    scrollRegionEl.scrollTop += e.deltaY;
    e.preventDefault();
  }
}

// --- Resize handle logic ---
let resizeStartX = 0;
let resizeStartWidth = 0;
function onResizeHandlePointerDown(e: PointerEvent): void {
  e.preventDefault();
  isDragging = true;
  resizeStartX = e.clientX;
  resizeStartWidth = navWidth;
  window.addEventListener('pointermove', onResizeMove);
  window.addEventListener('pointerup', onResizeUp);
}

function onResizeMove(e: PointerEvent): void {
  const dx = e.clientX - resizeStartX;
  navWidth = Math.round(Math.max(minWidth, Math.min(maxWidth, resizeStartWidth + dx)));
}

function onResizeUp(): void {
  isDragging = false;
  window.removeEventListener('pointermove', onResizeMove);
  window.removeEventListener('pointerup', onResizeUp);
  persistWidth();
}

function onResizeHandleDblClick(): void {
  toggleNavWidth();
}

function toggleNavWidth(): void {
  navWidth = expanded ? minWidth : maxWidth;
  persistWidth();
}

function persistWidth(): void {
  window.updateConfigurationValue(NAV_BAR_WIDTH_KEY, Math.round(navWidth))?.catch(console.error);
}

let scrollRegionCleanup: (() => void) | undefined;
let externalDragCleanup: (() => void) | undefined;

function onExternalDragMove(e: PointerEvent): void {
  if (!navigationDragState.payload) {
    return;
  }
  maybeAutoScroll(e.clientY);
  updateExternalDropFromY(e.clientY);
}

function onExternalDragUp(e: PointerEvent): void {
  if (!navigationDragState.payload) {
    return;
  }
  if (isPointerOverMainNav(e.clientX, e.clientY)) {
    commitExternalDrop();
  } else {
    dropIndex = undefined;
  }
}

onMount(async () => {
  window.addEventListener('pointermove', onExternalDragMove);
  window.addEventListener('pointerup', onExternalDragUp, true);
  externalDragCleanup = (): void => {
    window.removeEventListener('pointermove', onExternalDragMove);
    window.removeEventListener('pointerup', onExternalDragUp, true);
  };

  const commandRegistry = new CommandRegistry();
  commandRegistry.init();
  const configuredWidth = await window.getConfigurationValue<number>(NAV_BAR_WIDTH_KEY);
  if (typeof configuredWidth === 'number') {
    navWidth = Math.max(minWidth, Math.min(maxWidth, configuredWidth));
  }
  isMac = (await window.getOsPlatform()) === 'darwin';
  await tick();
  const el = scrollRegionEl;
  if (el) {
    const ro = new ResizeObserver(updateScrollThumb);
    ro.observe(el);
    el.addEventListener('scroll', updateScrollThumb);
    updateScrollThumb();
    scrollRegionCleanup = (): void => {
      ro.disconnect();
      el.removeEventListener('scroll', updateScrollThumb);
    };
  }
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener(NAV_BAR_WIDTH_KEY, onDidChangeConfigurationCallback);
  window.removeEventListener('pointermove', onResizeMove);
  window.removeEventListener('pointerup', onResizeUp);
  isDragging = false;
  scrollRegionCleanup?.();
  externalDragCleanup?.();
});

function handleClick(): void {
  if (meta.url.startsWith('/preferences')) {
    exitSettingsCallback();
  } else {
    handleNavigation({ page: NavigationPage.RESOURCES });
  }
}

// --- Configuration persistence ---
onDidChangeConfiguration.addEventListener(NAV_BAR_WIDTH_KEY, onDidChangeConfigurationCallback);

function onDidChangeConfigurationCallback(e: Event): void {
  if ('detail' in e) {
    const detail = e.detail as { key: string; value: unknown };
    if (NAV_BAR_WIDTH_KEY === detail?.key && typeof detail.value === 'number') {
      navWidth = Math.max(minWidth, Math.min(maxWidth, detail.value));
    }
  }
}
</script>

<svelte:window onkeydown={onKeyDown} />
<nav
  bind:this={navEl}
  class="group w-leftnavbar relative h-full flex-shrink-0 flex flex-col bg-[var(--pd-global-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px]"
  aria-label="AppNavigation"
  class:select-none={isDragging || isReorderDragging}
  style:width="{navWidth}px">
  <NavItem href="/" tooltip="Dashboard" bind:meta={meta} {expanded}>
    <div class="flex items-center w-full">
      <div class="flex items-center justify-center flex-shrink-0 w-6 relative">
        <DashboardIcon size={iconSize} />
        <NewContentOnDashboardBadge />
      </div>
      {#if expanded}
        <span class="text-sm truncate ml-3 flex-1 min-w-0" aria-label="Dashboard title">Dashboard</span>
      {/if}
    </div>
  </NavItem>
  <div
    class="group/nav-scroll flex-1 min-h-0 relative flex flex-col"
    role="region"
    aria-label="Navigation extensions and pages">
    <div
      id="nav-scroll-region"
      bind:this={scrollRegionEl}
      class="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent"
      role="region"
      aria-label="Scrollable navigation list"
      onscroll={onScrollRegionScroll}
      onpointerdown={onScrollRegionPointerDown}
      onpointermove={onDragMove}
      onpointerup={onDragUp}
      onpointercancel={resetDrag}>
      <div bind:this={dragContainerEl} class="flex flex-col relative" role="list">
        {#each allVisibleEntries as entry, i (entry.link)}
          <div
            data-nav-drag-item
            role="listitem"
            class="touch-none select-none cursor-grab"
            class:opacity-50={isReorderDragging && dragIndex === i}
            class:[&_.tooltip-content]:hidden={isReorderDragging}
            title={isReorderDragging ? undefined : `Hold to reorder. ${modifierC}Arrow to move`}
            aria-keyshortcuts={reorderKeyShortcuts}
            onpointerdown={onItemPointerDown}
            oncontextmenu={onItemContextMenu}
            {@attach longPress(onLongPressReorder.bind(undefined, i), 0, LONG_PRESS_MS)}>
            <NavRegistryEntry {entry} bind:meta={meta} {expanded} />
          </div>
        {/each}
        {#if showDropLine}
          <div
            class="absolute left-2 right-2 h-0.5 rounded-full pointer-events-none z-20 bg-[var(--pd-global-nav-icon-selected-highlight)]"
            style:top="{dropIndicatorY}px"
            aria-hidden="true"></div>
        {/if}
      </div>
    </div>
    {#if scrollThumbVisible}
      <div
        class="pointer-events-auto absolute right-0.5 top-[var(--nav-thumb-top)] h-[var(--nav-thumb-height)] w-1 min-h-6 rounded-sm bg-[var(--pd-global-nav-bg-border)] opacity-0 transition-opacity duration-150 group-hover/nav-scroll:opacity-100 hover:bg-[var(--pd-content-header)]"
        style="--nav-thumb-top: {scrollThumbTop * 100}%; --nav-thumb-height: {scrollThumbHeight * 100}%;"
        data-nav-scroll-thumb
        role="scrollbar"
        aria-controls="nav-scroll-region"
        aria-valuenow={Math.round(scrollThumbTop * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabindex="-1"
        onpointerdown={onThumbPointerDown}
        onwheel={onThumbWheel}
        title="Scroll"></div>
    {/if}
  </div>

  <div
    class="flex-shrink-0 w-full border-t border-[var(--pd-global-nav-bg-border)]"
    aria-hidden="true"></div>

    <div bind:this={outsideWindow}>
      <NavItem href="/accounts" tooltip="Accounts" bind:meta={meta} onClick={(event): void => authActions?.onButtonClick(event)} {expanded}>
          <div class="flex items-center w-full">
            <div class="flex-shrink-0 flex items-center justify-center w-6">
              <AccountIcon size={iconSize} />
            </div>
            {#if expanded}
              <span class="text-sm truncate ml-3" aria-label="Accounts title">
                Accounts
              </span>
            {/if}
          </div>
        <AuthActions bind:this={authActions} outsideWindow={outsideWindow} />
      </NavItem>
    </div>

  <NavItem href="/preferences" tooltip="Settings" bind:meta={meta} onClick={handleClick} {expanded}>
    <div class="flex items-center w-full">
      <div class="flex-shrink-0 flex items-center justify-center w-6">
        <SettingsIcon size={iconSize} />
      </div>
      {#if expanded}
        <span class="text-sm truncate ml-3" aria-label="Settings title">
          Settings
        </span>
      {/if}
    </div>
  </NavItem>

  <!-- Resize handle -->
  <div
    class="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-50 hover:bg-[var(--pd-global-nav-icon-selected-highlight)] transition-colors duration-150"
    class:bg-[var(--pd-global-nav-icon-selected-highlight)]={isDragging}
    role="separator"
    aria-orientation="vertical"
    aria-label="Resize navigation bar"
    aria-valuenow={navWidth}
    aria-valuemin={minWidth}
    aria-valuemax={maxWidth}
    {@attach longPress(toggleNavWidth)}
    onpointerdown={onResizeHandlePointerDown}
    ondblclick={onResizeHandleDblClick}></div>

  {#if dragGhost}
    <div
      class="fixed pointer-events-none z-50 shadow-lg opacity-90 scale-[1.03] bg-(--pd-global-nav-bg) text-(--pd-global-nav-icon-selected) border border-(--pd-global-nav-bg-border)"
      style:top="{ghostPointerY}px"
      style:left="{ghostPointerX}px"
      style:width="{navWidth}px"
      aria-hidden="true"
      data-testid="nav-drag-ghost">
      <div class="flex py-2 px-2.5 items-center min-h-9">
        <div class="flex items-center w-full min-w-0">
          <div class="relative flex w-6 shrink-0 items-center justify-center text-(--pd-global-nav-icon-selected)">
            {#if dragGhost.icon}
              <Icon icon={dragGhost.icon.icon} size={dragGhost.icon.size} ariaHidden />
            {/if}
          </div>
          {#if expanded}
            <div class="text-sm truncate ml-3 flex-1 min-w-0">{dragGhost.name}</div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <div class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-testid="nav-live-region">
    {navAnnounce}
  </div>
</nav>
