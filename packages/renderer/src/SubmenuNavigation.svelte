<script lang="ts">
import { SettingsNavItem } from '@podman-desktop/ui-svelte';
import { onDestroy } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import { longPress } from './lib/ui/attachments/longpress';
import { lastSubmenuPages } from './stores/breadcrumb';
import { LONG_PRESS_MS } from './stores/navigation/navigation-drag-state.svelte';
import {
  beginPin,
  consumePinClick,
  navigationPinSource,
  onPinPointerDown,
  resetPin,
} from './stores/navigation/navigation-pin-source.svelte';
import type { NavigationRegistryEntry } from './stores/navigation/navigation-registry';

interface Props {
  title: string;
  items: NavigationRegistryEntry[];
  link: string;
  meta: TinroRouteMeta;
}

let { title, items, link, meta }: Props = $props();

let pages = $lastSubmenuPages;
if (!pages[title]) {
  pages[title] = link;
  lastSubmenuPages.set(pages);
}

onDestroy(resetPin);

function onLongPressPin(item: NavigationRegistryEntry): void {
  beginPin({
    name: `${title} > ${item.name}`,
    link: item.link,
  });
}

function onSubmenuItemClick(itemLink: string, e: MouseEvent): void {
  if (consumePinClick(e)) {
    return;
  }
  pages[title] = itemLink;
}
</script>

<nav
  class="z-1 w-leftsidebar min-w-leftsidebar flex-col justify-between flex transition-all duration-500 ease-in-out bg-[var(--pd-secondary-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px]"
  aria-label={title + ' Navigation Bar'}
  onpointercancel={resetPin}>
  <div class="flex items-center">
    <div class="pt-4 px-3 mb-5">
      <p
        class="text-xl font-semibold text-[color:var(--pd-secondary-nav-header-text)] border-l-[4px] border-transparent">
        {title}
      </p>
    </div>
  </div>
  <div class="h-full overflow-y-auto mb-auto" role="list">
    {#each items ?? [] as item, index (index)}
      <div
        role="listitem"
        class="relative touch-none select-none cursor-grab"
        class:opacity-50={navigationPinSource.draggingLink === item.link}
        title={navigationPinSource.draggingLink ? undefined : 'Hold to pin to navigation'}
        onpointerdown={onPinPointerDown}
        onclick={onSubmenuItemClick.bind(undefined, item.link)}
        {@attach longPress(onLongPressPin.bind(undefined, item), 0, LONG_PRESS_MS)}>
        <SettingsNavItem
          title={item.tooltip}
          href={item.link}
          selected={meta.url.startsWith(item.link)}
        ></SettingsNavItem>
      </div>
    {/each}
  </div>
</nav>
