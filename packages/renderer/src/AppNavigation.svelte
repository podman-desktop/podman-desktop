<svelte:options runes={true} />

<!-- Native scrollbar hidden via Tailwind (no layout space); overlay thumb on hover. -->

<script lang="ts">
import { NavigationPage } from '@desktop-framework/api';
import { AppearanceSettings } from '@desktop-framework/api/appearance';
import { onDestroy, onMount, tick } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import { NavReorder } from '/@/lib/navigation/reorder.svelte';

import AuthActions from './lib/authentication/AuthActions.svelte';
import { CommandRegistry } from './lib/CommandRegistry';
import NewContentOnDashboardBadge from './lib/dashboard/NewContentOnDashboardBadge.svelte';
import AccountIcon from './lib/images/AccountIcon.svelte';
import DashboardIcon from './lib/images/DashboardIcon.svelte';
import SettingsIcon from './lib/images/SettingsIcon.svelte';
import { longPress } from './lib/ui/attachments/longpress';
import NavItem from './lib/ui/NavItem.svelte';
import NavRegistryEntry from './lib/ui/NavRegistryEntry.svelte';
import { handleNavigation } from './navigation';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { navigationRegistry, setNavigationItemOrder } from './stores/navigation/navigation-registry';
import { NavigationUtils } from './stores/navigation/navigation-utils';

interface Props {
  exitSettingsCallback: () => void;
  meta: TinroRouteMeta;
}
let { exitSettingsCallback, meta = $bindable() }: Props = $props();
const navigationUtils = new NavigationUtils();

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
let modifierKeyLabel: string = $derived(isMac ? '⌘' : 'Ctrl+');
let reorderKeyShortcuts = $derived(isMac ? 'Meta+ArrowUp Meta+ArrowDown' : 'Control+ArrowUp Control+ArrowDown');

let dragContainerEl = $state<HTMLDivElement>();

// Single main-nav list sorted by index.
let allVisibleEntries = $derived(navigationUtils.getVisibleOrderedEntries($navigationRegistry));
let visibleItemNames = $derived(allVisibleEntries.map(entry => entry.name));

const reorder = new NavReorder();
let itemTitle = $derived(reorder.isDragging ? undefined : `Hold to reorder. ${modifierKeyLabel}Arrow to move`);

// Ghost preview while reordering: same icon/name as the main nav row.
let dragGhost = $derived(reorder.sourceIndex === undefined ? undefined : allVisibleEntries[reorder.sourceIndex]);
let ghostPointerX = $derived(navEl?.getBoundingClientRect().left ?? 0);

// The browser starts a native drag for <img> icons (e.g. extension items),
// which would steal the pointer from the long-press reorder.
function onNavItemDragStart(e: DragEvent): void {
  e.preventDefault();
}

function saveItemOrder(newOrder: string[] | undefined): void {
  if (newOrder) setNavigationItemOrder(newOrder);
}

function startReorder(sourceIndex: number): void {
  reorder.start(sourceIndex, dragContainerEl);
}

function onReorderPointerMove(e: PointerEvent): void {
  reorder.onPointerMove(e, dragContainerEl, scrollRegionEl);
}

function onReorderPointerUp(): void {
  saveItemOrder(reorder.onPointerUp(visibleItemNames));
}

function onReorderKeyDown(e: KeyboardEvent): void {
  saveItemOrder(reorder.onKeyDown(e, dragContainerEl, visibleItemNames));
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

onMount(async () => {
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

<svelte:window onkeydown={onReorderKeyDown} />
<nav
  bind:this={navEl}
  class="group w-leftnavbar relative h-full flex-shrink-0 flex flex-col bg-[var(--pd-global-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px]"
  aria-label="AppNavigation"
  class:select-none={isDragging || reorder.isDragging}
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
      onpointercancel={reorder.cancel}>
      <div bind:this={dragContainerEl} class="flex flex-col relative" role="list">
        {#each allVisibleEntries as entry, i (entry.link)}
          <div
            data-nav-drag-item={entry.link}
            role="listitem"
            class="touch-none select-none cursor-grab"
            class:opacity-50={reorder.isDragging && reorder.sourceIndex === i}
            class:[&_.tooltip-content]:hidden={reorder.isDragging}
            onpointerdown={reorder.onPointerDown}
            ondragstart={onNavItemDragStart}
            oncontextmenu={reorder.onContextMenu}
            {@attach longPress(startReorder.bind(undefined, i), 0, NavReorder.LONG_PRESS_MS)}
            {@attach reorder.focusPendingRow(entry.link, i)}>
            <NavRegistryEntry
              {entry}
              bind:meta={meta}
              {expanded}
              reorderable
              aria-keyshortcuts={reorderKeyShortcuts}
              title={itemTitle} />
          </div>
        {/each}
        {#if reorder.showDropLine}
          <div
            class="absolute left-2 right-2 h-0.5 rounded-full pointer-events-none z-10 bg-(--pd-global-nav-icon-selected-highlight)"
            style:top="{reorder.dropIndicatorOffsetY}px"
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
      class="fixed pointer-events-none z-50 shadow-[0_10px_30px_var(--pd-shadow-color-strong)] opacity-90 scale-[1.03] bg-(--pd-global-nav-icon-selected-bg) text-(--pd-global-nav-icon) border border-(--pd-global-nav-bg-border) [&_.tooltip-content]:hidden"
      style:top="{reorder.ghostY}px"
      style:left="{ghostPointerX}px"
      style:width="{navWidth}px"
      aria-hidden="true"
      data-testid="nav-drag-ghost">
      <NavRegistryEntry entry={dragGhost} {meta} {expanded} tabindex={-1} />
    </div>
  {/if}

  <div class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-testid="nav-live-region">
    {reorder.announcement}
  </div>
</nav>
