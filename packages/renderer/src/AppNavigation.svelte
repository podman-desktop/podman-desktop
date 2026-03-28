<svelte:options runes={true} />

<!-- Native scrollbar hidden via Tailwind (no layout space); overlay thumb on hover. -->

<script lang="ts">
import { NavigationPage } from '@podman-desktop/core-api';
import { AppearanceSettings } from '@podman-desktop/core-api/appearance';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount, tick } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import AuthActions from './lib/authentication/AuthActions.svelte';
import { CommandRegistry } from './lib/CommandRegistry';
import NewContentOnDashboardBadge from './lib/dashboard/NewContentOnDashboardBadge.svelte';
import AccountIcon from './lib/images/AccountIcon.svelte';
import DashboardIcon from './lib/images/DashboardIcon.svelte';
import SettingsIcon from './lib/images/SettingsIcon.svelte';
import NavItem from './lib/ui/NavItem.svelte';
import NavRegistryEntry from './lib/ui/NavRegistryEntry.svelte';
import { handleNavigation } from './navigation';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { navigationRegistry } from './stores/navigation/navigation-registry';

interface Props {
  exitSettingsCallback: () => void;
  meta: TinroRouteMeta;
}
let { exitSettingsCallback, meta = $bindable() }: Props = $props();

let authActions = $state<AuthActions>();
let outsideWindow = $state<HTMLDivElement>();
let scrollRegionEl = $state<HTMLDivElement>();
let iconWithTitle = $state(false);

const iconSize = '22';
const NAV_BAR_LAYOUT = `${AppearanceSettings.SectionName}.${AppearanceSettings.NavigationAppearance}`;

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
  const thumb = (e.target as HTMLElement).closest('[data-nav-scroll-thumb]');
  if (!el || thumb) return;
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

onDidChangeConfiguration.addEventListener(NAV_BAR_LAYOUT, onDidChangeConfigurationCallback);

let minNavbarWidth = $derived(iconWithTitle ? 'min-w-fit' : 'min-w-leftnavbar');

let scrollRegionCleanup: (() => void) | undefined;

onMount(async () => {
  const commandRegistry = new CommandRegistry();
  commandRegistry.init();
  iconWithTitle = (await window.getConfigurationValue(NAV_BAR_LAYOUT)) === AppearanceSettings.IconAndTitle;
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
  onDidChangeConfiguration.removeEventListener(NAV_BAR_LAYOUT, onDidChangeConfigurationCallback);
  scrollRegionCleanup?.();
});

function handleClick(): void {
  if (meta.url.startsWith('/preferences')) {
    exitSettingsCallback();
  } else {
    handleNavigation({ page: NavigationPage.RESOURCES });
  }
}

function onDidChangeConfigurationCallback(e: Event): void {
  if ('detail' in e) {
    const detail = e.detail as { key: string; value: string };
    if (NAV_BAR_LAYOUT === detail?.key) {
      iconWithTitle = detail.value === AppearanceSettings.IconAndTitle;
    }
  }
}
</script>

<svelte:window />
<nav
  class="group w-leftnavbar {minNavbarWidth} h-full flex flex-col overflow-hidden bg-[var(--pd-global-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px]"
  aria-label="AppNavigation">
  <NavItem href="/" tooltip="Dashboard" bind:meta={meta}>
    <div class="relative w-full">
      <div class="flex flex-col items-center w-full h-full">
        <div class="flex items-center w-fit h-full relative">
          <DashboardIcon size={iconSize} />
          <NewContentOnDashboardBadge />
        </div>
        {#if iconWithTitle}
          <div class="text-xs text-center ml-[2px]" aria-label="Dashboard title">
            Dashboard
          </div>
        {/if}
      </div>
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
      onpointerdown={onScrollRegionPointerDown}>
      {#each $navigationRegistry as navigationRegistryItem, index (index)}
        {#if navigationRegistryItem.items && navigationRegistryItem.type === 'group'}
          <!-- This is a group, list all items from the entry -->
          {#each navigationRegistryItem.items as item, index (index)}
            <NavRegistryEntry entry={item} bind:meta={meta} iconWithTitle={iconWithTitle} />
          {/each}
        {:else if navigationRegistryItem.type === 'entry' || navigationRegistryItem.type === 'submenu'}
          <NavRegistryEntry entry={navigationRegistryItem} bind:meta={meta} iconWithTitle={iconWithTitle} />
        {/if}
      {/each}
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
    <NavItem href="/accounts" tooltip="" bind:meta={meta} onClick={(event): void => authActions?.onButtonClick(event)}>
      <Tooltip bottomRight tip="Accounts">
        <div class="flex flex-col items-center w-full h-full">
          <AccountIcon size={iconSize} />
          {#if iconWithTitle}
            <div class="text-xs text-center ml-[2px]" aria-label="Accounts title">
              Accounts
            </div>
          {/if}
        </div>
      </Tooltip>
      <AuthActions bind:this={authActions} outsideWindow={outsideWindow} />
    </NavItem>
  </div>

  <NavItem href="/preferences" tooltip="Settings" bind:meta={meta} onClick={handleClick}>
    <div class="flex flex-col items-center w-full">
      <SettingsIcon size={iconSize} />
    {#if iconWithTitle}
      <div class="text-xs text-center ml-[2px]" aria-label="Settings title">
        Settings
      </div>
    {/if}
    </div>
  </NavItem>
</nav>
