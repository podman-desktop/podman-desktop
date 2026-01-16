<script lang="ts">
import { faHistory, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';
import { get } from 'svelte/store';

import { isDark } from '/@/stores/appearance';
import type { HistoryEntry, HistoryEntryIcon } from '/@/stores/navigation-history.svelte';

interface Props {
  show: boolean;
  fallbackIcon?: IconDefinition | Component | string;
  entries: HistoryEntry[];
  onSelectEntry: (index: number) => void;
}

let { show, entries, fallbackIcon = faHistory, onSelectEntry }: Props = $props();

// Extract icon value from registry icon object
function getIcon(icon: HistoryEntryIcon | undefined): IconDefinition | Component | string {
  if (!icon) return fallbackIcon;

  if (icon.iconComponent) return icon.iconComponent;
  if (icon.faIcon) return icon.faIcon.definition;

  if (icon.iconImage) {
    if (typeof icon.iconImage === 'string') return icon.iconImage;
    return get(isDark) ? icon.iconImage.dark : icon.iconImage.light;
  }

  return fallbackIcon;
}
</script>

{#if show && entries.length > 0}
  <div
    aria-label="History dropdown"
    class="history-dropdown absolute left-0 top-full z-50 mt-1 rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] overflow-y-auto overflow-x-hidden text-nowrap max-h-[300px]"
    style="-webkit-app-region: none;">
    {#each entries as entry (entry.index)}
      <div
        aria-label={`History entry: ${entry.name}`}
        role="button"
        tabindex="0"
        onmouseup={onSelectEntry.bind(undefined, entry.index)}>
        <DropdownMenu.Item
          title={entry.name}
          icon={getIcon(entry.icon)} />
      </div>
    {/each}
  </div>
{/if}
