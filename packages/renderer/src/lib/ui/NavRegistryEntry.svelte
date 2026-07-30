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
  ariaKeyShortcuts?: string;
  titleTooltip?: string;
}

let { entry, meta = $bindable(), expanded = false, ariaKeyShortcuts, titleTooltip }: NavRegistryEntryProps = $props();
let isPinned = $derived(entry.name.includes(' > '));
</script>

{#if !entry.hidden}
  <NavItem
    href={entry.link}
    counter={entry.counter}
    tooltip={entry.tooltip}
    ariaLabel={entry.name}
    {ariaKeyShortcuts}
    {titleTooltip}
    bind:meta={meta}
    {expanded}>
    <div class="flex items-center w-full">
      <div class="relative flex-shrink-0 flex items-center justify-center w-6">
        {#if entry.icon === undefined}
          {entry.name}
        {:else if entry.icon.faIcon}
          <Icon icon={entry.icon.faIcon.definition} size={entry.icon.faIcon.size} />
        {:else if entry.icon.iconComponent}
          <!-- svelte-ignore svelte_component_deprecated -->
          <svelte:component this={entry.icon.iconComponent} size="24" />
        {:else if entry.icon.iconImage}
          <Icon icon={entry.icon.iconImage} size={22} title={entry.name} />
        {/if}
        {#if isPinned}
          <span
            class="absolute bottom-0 left-0 flex size-2 items-center justify-center leading-none text-[color:var(--pd-global-nav-icon)] [-webkit-text-stroke:1px_var(--pd-global-nav-bg)]"
            data-testid="nav-pin-badge"
            aria-hidden="true">
            <Icon icon={faThumbtack} class="text-current" ariaHidden />
          </span>
        {/if}
      </div>
      {#if expanded}
        <div class="text-sm truncate ml-3 flex-1 min-w-0" aria-label={`${entry.name} title`}>
          {entry.name}
        </div>
      {/if}
    </div>
  </NavItem>
{/if}
