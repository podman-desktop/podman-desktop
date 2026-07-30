<svelte:options runes={true} />

<!-- Native scrollbar hidden via Tailwind (no layout space); overlay thumb on hover. -->

<script lang="ts">
import type { DropSlot } from '@podman-desktop/core-api';
import { NavigationPage } from '@podman-desktop/core-api';
import { AppearanceSettings } from '@podman-desktop/core-api/appearance';
import type { IconType } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy, onMount, tick } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import AuthActions from './lib/authentication/AuthActions.svelte';
import { CommandRegistry } from './lib/CommandRegistry';
import NewContentOnDashboardBadge from './lib/dashboard/NewContentOnDashboardBadge.svelte';
import AccountIcon from './lib/images/AccountIcon.svelte';
import DashboardIcon from './lib/images/DashboardIcon.svelte';
import SettingsIcon from './lib/images/SettingsIcon.svelte';
import { longPress } from './lib/ui/attachments/longpress';
import NavItem from './lib/ui/NavItem.svelte';
import NavRegistryEntry from './lib/ui/NavRegistryEntry.svelte';
import { NavDropSlot } from './nav-drop-slot';
import { handleNavigation } from './navigation';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { LONG_PRESS_MS, navigationDragState } from './stores/navigation/navigation-drag-state.svelte';
import type { NavigationRegistryEntry } from './stores/navigation/navigation-registry';
import { navigationRegistry, setNavigationItemOrder } from './stores/navigation/navigation-registry';
import { NavigationUtils } from './stores/navigation/navigation-utils';

interface Props {
  exitSettingsCallback: () => void;
  meta: TinroRouteMeta;
}
let { exitSettingsCallback, meta = $bindable() }: Props = $props();
const navigationUtils = new NavigationUtils();
const navDropSlot = new NavDropSlot();

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

let dragContainerEl = $state<HTMLDivElement>();
let reorderSourceIndex = $state<number | undefined>();
let isReorderDragging = $derived(reorderSourceIndex !== undefined);
let reorderPointerClientY = $state(0);
let reorderPointerOffsetY = $state(0);
let pressedReorderItem: HTMLElement | undefined;
let reorderPointerId = 0;

// Single main-nav list sorted by index (defaults and pinned share one sequence)
let allVisibleEntries = $derived(navigationUtils.getVisibleOrderedEntries($navigationRegistry));
let visibleItemNames = $derived(
  allVisibleEntries.map(entry => navigationUtils.formatNavigationName(entry.name, entry.parentName)),
);
let isPinDragActive = $derived(!!navigationDragState.payload);

interface DragGhostIcon {
  icon: IconType;
  size?: string | number;
}

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

// Ghost preview for pin-drags and internal reorder: same icon/name as the main nav row.
let dragGhost = $derived.by((): { name: string; icon?: DragGhostIcon } | undefined => {
  const payload = navigationDragState.payload;
  if (payload) {
    const found = navigationUtils.findNavigationEntryByLink($navigationRegistry, payload.link);
    if (!found) {
      return undefined;
    }
    return {
      name: navigationUtils.formatNavigationName(found.name, found.parentName),
      icon: resolveNavIcon(found.icon),
    };
  }
  if (reorderSourceIndex !== undefined) {
    const entry = allVisibleEntries[reorderSourceIndex];
    if (entry) {
      return {
        name: navigationUtils.formatNavigationName(entry.name, entry.parentName),
        icon: resolveNavIcon(entry.icon),
      };
    }
  }
  return undefined;
});

let ghostPointerY = $derived(
  (isPinDragActive ? navigationDragState.pointerY : reorderPointerClientY) -
    (isPinDragActive ? navigationDragState.grabOffsetY : reorderPointerOffsetY),
);
let ghostPointerX = $derived(
  isPinDragActive
    ? navigationDragState.pointerX - navigationDragState.grabOffsetX
    : (navEl?.getBoundingClientRect().left ?? 0),
);

let dropSlotIndex = $state<number | undefined>();
let dropIndicatorOffsetY = $state(0);
let showDropLine = $derived(
  dropSlotIndex !== undefined &&
    (isPinDragActive ||
      (reorderSourceIndex !== undefined && !navDropSlot.keepsItemInPlace(reorderSourceIndex, dropSlotIndex))),
);

function getDropSlotAtPointerY(pointerClientY: number): DropSlot {
  if (!dragContainerEl) {
    return { index: allVisibleEntries.length, indicatorY: 0 };
  }
  const items = [...dragContainerEl.querySelectorAll<HTMLElement>('[data-nav-drag-item]')];
  const containerTop = dragContainerEl.getBoundingClientRect().top;
  const rects = items.map(c => c.getBoundingClientRect());
  return navDropSlot.getDropSlot(pointerClientY, rects, containerTop);
}

// Update the drop line for either an external pin drag or an in-list reorder.
function updateDropTargetAtPointerY(pointerClientY: number): void {
  const dropSlot = getDropSlotAtPointerY(pointerClientY);
  dropSlotIndex = dropSlot.index;
  dropIndicatorOffsetY = dropSlot.indicatorY;
}

function placeDraggedItemInMainNavigation(): void {
  const payload = navigationDragState.payload;
  if (!payload || dropSlotIndex === undefined) {
    return;
  }
  const registeredEntry = navigationUtils.findNavigationEntryByLink($navigationRegistry, payload.link);
  if (!registeredEntry) {
    navigationDragState.payload = undefined;
    dropSlotIndex = undefined;
    return;
  }
  const existingEntry = allVisibleEntries.find(entry => entry.link === payload.link);
  const draggedItemName = navigationUtils.formatNavigationName(registeredEntry.name, registeredEntry.parentName);
  const wasInMainNav = existingEntry !== undefined;
  const newOrder = navDropSlot.insertOrMoveAtSlot(visibleItemNames, draggedItemName, dropSlotIndex);
  setNavigationItemOrder(newOrder, registeredEntry);
  const newPos = newOrder.indexOf(draggedItemName) + 1;
  const message = wasInMainNav
    ? `Moved ${draggedItemName} to position ${newPos} of ${newOrder.length}`
    : `Pinned ${draggedItemName} to main navigation at position ${newPos} of ${newOrder.length}`;
  navigationDragState.announcement = message;
  navigationDragState.payload = undefined;
  dropSlotIndex = undefined;
}

const EDGE_SCROLL_PX = 40;
const EDGE_SCROLL_STEP = 12;

// Scroll the nav list when dragging near its top/bottom edge.
function scrollNavigationAtDragEdge(pointerClientY: number): void {
  const el = scrollRegionEl;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  if (pointerClientY < rect.top + EDGE_SCROLL_PX) {
    el.scrollTop = Math.max(0, el.scrollTop - EDGE_SCROLL_STEP);
  } else if (pointerClientY > rect.bottom - EDGE_SCROLL_PX) {
    el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, el.scrollTop + EDGE_SCROLL_STEP);
  }
}

function updateNavigationDropTarget(e: PointerEvent): void {
  scrollNavigationAtDragEdge(e.clientY);
  updateDropTargetAtPointerY(e.clientY);
}

function isPointerWithinMainNavigation(clientX: number, clientY: number): boolean {
  if (!navEl) {
    return false;
  }
  const rect = navEl.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

// Seed the drop line when an external pin drag starts.
$effect(() => {
  if (navigationDragState.payload) {
    updateDropTargetAtPointerY(navigationDragState.pointerY);
  }
});

function onReorderPointerDown(e: PointerEvent): void {
  if (e.button > 0) return;
  pressedReorderItem = e.currentTarget as HTMLElement;
  reorderPointerId = e.pointerId;
  reorderPointerClientY = e.clientY;
  const rect = pressedReorderItem.getBoundingClientRect();
  reorderPointerOffsetY = e.clientY - rect.top;
}

function startNavigationItemReorder(sourceIndex: number): void {
  if (!dragContainerEl) return;
  reorderSourceIndex = sourceIndex;
  updateDropTargetAtPointerY(reorderPointerClientY);
  document.body.style.cursor = 'grabbing';
  pressedReorderItem?.setPointerCapture(reorderPointerId);
  navigator.vibrate?.(15);
}

function onReorderPointerMove(e: PointerEvent): void {
  if (reorderSourceIndex === undefined) return;
  reorderPointerClientY = e.clientY;
  updateNavigationDropTarget(e);
}

function onReorderPointerUp(): void {
  if (reorderSourceIndex === undefined) return;
  if (dropSlotIndex !== undefined && !navDropSlot.keepsItemInPlace(reorderSourceIndex, dropSlotIndex)) {
    moveNavigationItemToSlot(reorderSourceIndex, dropSlotIndex);
  }
  resetReorderDrag();
}

function resetReorderDrag(): void {
  reorderSourceIndex = undefined;
  dropSlotIndex = undefined;
  pressedReorderItem = undefined;
  reorderPointerOffsetY = 0;
  document.body.style.cursor = '';
}

// Commit at the requested slot (before an item, or after the last item).
function moveNavigationItemToSlot(sourceIndex: number, dropSlotIndex: number): void {
  const movedEntry = allVisibleEntries[sourceIndex];
  if (!movedEntry) return;

  const movedItemName = navigationUtils.formatNavigationName(movedEntry.name, movedEntry.parentName);
  const newOrder = navDropSlot.insertOrMoveAtSlot(visibleItemNames, movedItemName, dropSlotIndex);
  setNavigationItemOrder(newOrder);
  const newPos = newOrder.indexOf(movedItemName) + 1;
  navigationDragState.announcement = `Moved ${movedItemName} to position ${newPos} of ${newOrder.length}`;
}

function onReorderContextMenu(e: Event): void {
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
  const sourceIndex = items.indexOf(itemEl);
  if (sourceIndex === -1) return;

  // insert before neighbor above, or after neighbor below
  const dropSlotIndex = e.key === 'ArrowUp' ? sourceIndex - 1 : sourceIndex + 2;
  if (dropSlotIndex < 0 || dropSlotIndex > items.length) return;

  e.preventDefault();
  moveNavigationItemToSlot(sourceIndex, dropSlotIndex);
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
  if (e.currentTarget instanceof HTMLElement) {
    e.currentTarget.setPointerCapture(e.pointerId);
  }
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
function onExternalDragMove(e: PointerEvent): void {
  if (!navigationDragState.payload) {
    return;
  }
  updateNavigationDropTarget(e);
}

function onExternalDragUp(e: PointerEvent): void {
  if (!navigationDragState.payload) {
    return;
  }
  if (isPointerWithinMainNavigation(e.clientX, e.clientY)) {
    placeDraggedItemInMainNavigation();
  } else {
    dropSlotIndex = undefined;
  }
}

onMount(async () => {
  window.addEventListener('pointermove', onExternalDragMove);
  window.addEventListener('pointerup', onExternalDragUp, true);

  const commandRegistry = new CommandRegistry();
  commandRegistry.init();
  navWidth = (await window.getConfigurationValue<number>(NAV_BAR_WIDTH_KEY)) ?? maxWidth;
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
  window.removeEventListener('pointermove', onExternalDragMove);
  window.removeEventListener('pointerup', onExternalDragUp, true);
  document.body.style.cursor = '';
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
      onpointermove={onReorderPointerMove}
      onpointerup={onReorderPointerUp}
      onpointercancel={resetReorderDrag}>
      <div bind:this={dragContainerEl} class="flex flex-col relative" role="list">
        {#each allVisibleEntries as entry, i (entry.link)}
          <div
            data-nav-drag-item
            role="listitem"
            class="touch-none select-none cursor-grab"
            class:opacity-50={isReorderDragging && reorderSourceIndex === i}
            class:[&_.tooltip-content]:hidden={isReorderDragging}
            onpointerdown={onReorderPointerDown}
            oncontextmenu={onReorderContextMenu}
            {@attach longPress(startNavigationItemReorder.bind(undefined, i), 0, LONG_PRESS_MS)}>
            <NavRegistryEntry
              {entry}
              bind:meta={meta}
              {expanded}
              ariaKeyShortcuts={reorderKeyShortcuts}
              title={isReorderDragging ? undefined : `Hold to reorder. ${modifierC}Arrow to move`} />
          </div>
        {/each}
        {#if showDropLine}
          <div
            class="absolute left-2 right-2 h-0.5 rounded-full pointer-events-none z-20 bg-[var(--pd-global-nav-icon-selected-highlight)]"
            style:top="{dropIndicatorOffsetY}px"
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
    class="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-40 hover:bg-[var(--pd-global-nav-icon-selected-highlight)] transition-colors duration-150"
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
    {navigationDragState.announcement}
  </div>
</nav>
