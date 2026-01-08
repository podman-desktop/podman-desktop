<script lang="ts">
import { faHistory, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';

interface Props {
  show: boolean;
  icon?: IconDefinition | string;
  entries: { index: number; name: string }[];
  hoveredEntryIndex: number | undefined;
  isLongPressing: boolean;
  onSelectEntry: (index: number) => void;
  onSetHoveredIndex: (index: number | undefined) => void;
}

let {
  show,
  entries,
  icon = faHistory,
  hoveredEntryIndex,
  isLongPressing,
  onSelectEntry,
  onSetHoveredIndex,
}: Props = $props();
</script>

{#if show && entries.length > 0}
  <div
    class="history-dropdown absolute left-0 top-full z-50 mt-1 rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] overflow-y-auto overflow-x-hidden text-nowrap max-h-[300px]"
    style="-webkit-app-region: none;">
    {#each entries as entry (entry.index)}
      <div
        role="button"
        tabindex="0"
        class:bg-[var(--pd-dropdown-item-hover-bg)]={hoveredEntryIndex === entry.index}
        onmouseup={(): void => {
          if (isLongPressing) {
            onSelectEntry(entry.index);
          }
        }}
        onmouseenter={(): void => onSetHoveredIndex(entry.index)}
        onmouseleave={(): void => onSetHoveredIndex(undefined)}
        onkeydown={(e): void => {
          if (e.key === 'Enter') onSelectEntry(entry.index);
        }}>
        <DropdownMenu.Item
          title={entry.name}
          icon={icon}
          onClick={(): void => onSelectEntry(entry.index)} />
      </div>
    {/each}
  </div>
{/if}
