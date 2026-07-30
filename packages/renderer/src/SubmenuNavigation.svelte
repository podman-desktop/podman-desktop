<script lang="ts">
import type { DragPayload } from '@podman-desktop/core-api';
import { SettingsNavItem } from '@podman-desktop/ui-svelte';
import { onDestroy } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import {
  navigationRegistry,
  type NavigationRegistryEntry,
  pinToNavbar,
} from '/@/stores/navigation/navigation-registry';
import { NavigationUtils } from '/@/stores/navigation/navigation-utils';

import { longPress } from './lib/ui/attachments/longpress';
import { lastSubmenuPages } from './stores/breadcrumb';
import { LONG_PRESS_MS, navigationDragState } from './stores/navigation/navigation-drag-state.svelte';

interface Props {
  title: string;
  items?: NavigationRegistryEntry[];
  link: string;
  meta: TinroRouteMeta;
}

let { title, items, link, meta }: Props = $props();
const navigationUtils = new NavigationUtils({ navigationRegistry, pinToNavbar });

let pages = $lastSubmenuPages;
if (!pages[title]) {
  pages[title] = link;
  lastSubmenuPages.set(pages);
}

onDestroy(navigationUtils.resetPin);

function createSubmenuPinPayload(item: NavigationRegistryEntry): DragPayload {
  return {
    parentName: title,
    name: item.name,
    link: item.link,
  };
}

function onSubmenuLongPressPin(item: NavigationRegistryEntry): void {
  navigationUtils.beginPin(createSubmenuPinPayload(item));
}

function onSubmenuPinKeyDown(item: NavigationRegistryEntry, event: KeyboardEvent): void {
  navigationUtils.onPinKeyDown(createSubmenuPinPayload(item), event);
}

function onSubmenuItemClick(itemLink: string, e: MouseEvent): void {
  if (navigationUtils.consumePinClick(e)) {
    return;
  }
  pages[title] = itemLink;
}
</script>

<nav
  class="z-1 w-leftsidebar min-w-leftsidebar flex-col justify-between flex transition-all duration-500 ease-in-out bg-[var(--pd-secondary-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px]"
  aria-label={title + ' Navigation Bar'}
  onpointercancel={navigationUtils.resetPin}>
  <div class="flex items-center">
    <div class="pt-4 px-3 mb-5">
      <p
        class="text-xl font-semibold text-[color:var(--pd-secondary-nav-header-text)] border-l-[4px] border-transparent">
        {title}
      </p>
    </div>
  </div>
  <div class="h-full overflow-y-auto" style="margin-bottom:auto" role="list">
    {#each items ?? [] as item (item.link)}
      <div
        role="listitem"
        class="relative touch-none select-none cursor-grab"
        class:opacity-50={navigationDragState.payload?.link === item.link}
        onpointerdown={navigationUtils.onPinPointerDown}
        onclick={onSubmenuItemClick.bind(undefined, item.link)}
        {@attach longPress(onSubmenuLongPressPin.bind(undefined, item), 0, LONG_PRESS_MS)}>
        <SettingsNavItem
          title={navigationUtils.formatNavigationName(item.tooltip, title)}
          href={item.link}
          selected={meta.url.startsWith(item.link)}
          ariaKeyShortcuts={NavigationUtils.KEY_SHORTCUTS}
          onKeyDown={onSubmenuPinKeyDown.bind(undefined, item)}
        ></SettingsNavItem>
      </div>
    {/each}
  </div>
</nav>
