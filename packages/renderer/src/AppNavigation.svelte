<svelte:options runes={true} />

<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount, tick } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import { NavigationPage } from '/@api/navigation-page';

import { AppearanceSettings } from '../../main/src/plugin/appearance-settings';
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
let iconWithTitle = $state(false);

const iconSize = '22';
const NAV_BAR_LAYOUT = `${AppearanceSettings.SectionName}.${AppearanceSettings.NavigationAppearance}`;

onDidChangeConfiguration.addEventListener(NAV_BAR_LAYOUT, onDidChangeConfigurationCallback);

let minNavbarWidth = $derived(iconWithTitle ? 'min-w-fit' : 'min-w-leftnavbar');

onMount(async () => {
  const commandRegistry = new CommandRegistry();
  commandRegistry.init();
  iconWithTitle = (await window.getConfigurationValue(NAV_BAR_LAYOUT)) === AppearanceSettings.IconAndTitle;
  await tick();
  handleScroll();
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener(NAV_BAR_LAYOUT, onDidChangeConfigurationCallback);
});

let scrollEl: HTMLDivElement;
let showTopShadow = $state(false);
let showBottomShadow = $state(false);

function handleScroll(): void {
  const scrollTop = scrollEl.scrollTop;
  const scrollHeight = scrollEl.scrollHeight;
  const clientHeight = scrollEl.clientHeight;

  showTopShadow = scrollTop > 5;
  showBottomShadow = scrollTop + clientHeight < scrollHeight - 5;
}

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

<svelte:window on:resize={handleScroll} />
<nav
  class="group w-leftnavbar {minNavbarWidth} flex flex-col bg-[var(--pd-global-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px] relative"
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

    {#each $navigationRegistry as navigationRegistryItem, index (index)}
      {#if navigationRegistryItem.items && navigationRegistryItem.type === 'group'}
        <!-- This is a group, list all items from the entry -->
        <div class="relative min-h-0 flex-1">
          <div
            bind:this={scrollEl}
            class="overflow-y-scroll overflow-x-visible h-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            on:scroll={handleScroll}>
            {#each navigationRegistryItem.items as item, index (index)}
              <NavRegistryEntry entry={item} bind:meta={meta} iconWithTitle={iconWithTitle} />
            {/each}
            <div class="grow"></div>
          </div>

          {#if showTopShadow}
            <div class="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-black/20 to-transparent z-50 pointer-events-none" />
          {/if}
          {#if showBottomShadow}
            <div class="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-black/20 to-transparent z-50 pointer-events-none" />
          {/if}
        </div>
      {:else if navigationRegistryItem.type === 'entry' || navigationRegistryItem.type === 'submenu'}
        <NavRegistryEntry entry={navigationRegistryItem} bind:meta={meta} iconWithTitle={iconWithTitle} />
      {/if}
    {/each}

  <div bind:this={outsideWindow}>
    <NavItem href="/accounts" tooltip="" bind:meta={meta} onClick={authActions?.onButtonClick}>
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
    <SettingsIcon size={iconSize} />
    {#if iconWithTitle}
      <div class="text-xs text-center ml-[2px]" aria-label="Settings title">
        Settings
      </div>
    {/if}
  </NavItem>
</nav>
