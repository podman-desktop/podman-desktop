<script lang="ts">
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { TinroRouteMeta } from 'tinro';

import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';

import NavItem from './NavItem.svelte';

interface NavRegistryEntryProps {
  entry: NavigationRegistryEntry;
  meta: TinroRouteMeta;
  expanded: boolean;
}

let { entry, meta = $bindable(), expanded = false }: NavRegistryEntryProps = $props();

const isPinned = $derived(entry.name.includes(' > '));
const uri = $derived(encodeURI(entry.link));
const selected = $derived(meta.url === uri || (uri !== '/' && meta.url.startsWith(uri)));
</script>

{#if !entry.hidden}
  <NavItem href={entry.link} counter={entry.counter} tooltip={entry.tooltip} ariaLabel={entry.name} bind:meta={meta} {expanded}>
    <div class="flex items-center w-full">
      <div class="relative flex size-6 shrink-0 items-center justify-center">
        {#if entry.icon === undefined}
          {entry.name}
        {:else if entry.icon.faIcon}
          <Icon icon={entry.icon.faIcon.definition} size={entry.icon.faIcon.size} />
        {:else if entry.icon.iconComponent}
          <Icon icon={entry.icon.iconComponent} size="24" />
        {:else if entry.icon.iconImage}
          <Icon icon={entry.icon.iconImage} size={22} title={entry.name} />
        {/if}
        {#if isPinned}
          <span
            class="pointer-events-none absolute -bottom-0.5 -left-0.5 flex size-2 items-center justify-center rounded-full bg-(--pd-global-nav-bg) text-(--pd-global-nav-icon)"
            class:bg-(--pd-global-nav-icon-selected-bg)={selected}
            aria-hidden="true"
            data-testid="nav-pin-badge">
            <Icon icon={faThumbtack} size="xs" />
          </span>
        {/if}
      </div>
      {#if expanded && entry.icon}
        <div class="ml-3 min-w-0 flex-1 truncate text-sm" aria-label={`${entry.name} title`}>
          {entry.name}
        </div>
      {/if}
    </div>
  </NavItem>
{/if}
