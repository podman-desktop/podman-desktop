<svelte:options runes={true} />

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
</script>

{#if !entry.hidden}
  <NavItem href={entry.link} counter={entry.counter} tooltip={entry.tooltip} ariaLabel={entry.name} bind:meta={meta} {expanded}>
    <div class="flex items-center w-full">
      <div class="flex-shrink-0 flex items-center justify-center w-6 relative">
        {#if entry.icon === undefined}
          {entry.name}
        {:else if entry.icon.faIcon}
          <Icon icon={entry.icon.faIcon.definition} size={entry.icon.faIcon.size} />
        {:else if entry.icon.iconComponent}
          <!-- svelte-ignore svelte_component_deprecated -->
          <svelte:component this={entry.icon.iconComponent} size="24" />
        {:else if entry.icon.iconImage && typeof entry.icon.iconImage === 'string'}
          <img src={entry.icon.iconImage} width="22" height="22" alt={entry.name} />
        {/if}
        {#if entry.pinned && !expanded}
          <div
            class="absolute top-0 right-[-9px] flex items-center justify-center text-[color:var(--pd-global-nav-icon-selected-highlight)]"
            title="Pinned to top"
            aria-label={`${entry.name} is pinned to top`}>
            <Icon icon={faThumbtack} size="xs" />
          </div>
        {/if}
      </div>
      {#if expanded}
        {#if entry.icon}
          <div class="text-sm truncate ml-3 flex-1 min-w-0" aria-label={`${entry.name} title`}>
            {entry.name}
          </div>
        {/if}
        {#if entry.pinned}
          <div
            class="flex-shrink-0 flex items-center justify-center w-4 ml-1 text-[color:var(--pd-global-nav-icon-selected-highlight)]"
            title="Pinned to top"
            aria-label={`${entry.name} is pinned to top`}>
            <Icon icon={faThumbtack} size="xs" />
          </div>
        {/if}
      {/if}
    </div>
  </NavItem>
{/if}
