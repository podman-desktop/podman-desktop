<script lang="ts">
interface Props {
  show: boolean;
  entries: { index: number; name: string }[];
  hoveredEntryIndex: number | undefined;
  isLongPressing: boolean;
  onSelectEntry: (index: number) => void;
  onSetHoveredIndex: (index: number | undefined) => void;
}

let { show, entries, hoveredEntryIndex, isLongPressing, onSelectEntry, onSetHoveredIndex }: Props = $props();
</script>

{#if show && entries.length > 0}
  <div
    class="history-dropdown absolute left-0 top-full z-50 mt-1 overflow-y-auto overflow-x-hidden rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] border border-[var(--pd-dropdown-border)] text-nowrap max-h-[300px]"
    style="-webkit-app-region: none;">
    <div class="bg-[var(--pd-dropdown-header-bg)]">
      {#each entries as entry (entry.index)}
        <button
          class="flex items-center px-3 py-2 w-full cursor-pointer hover:bg-[var(--pd-dropdown-item-hover-bg)]"
          class:bg-[var(--pd-dropdown-item-hover-bg)]={hoveredEntryIndex === entry.index}
          onclick={(): void => onSelectEntry(entry.index)}
          onmouseup={(): void => {
            if (isLongPressing) {
              onSelectEntry(entry.index);
            }
          }}
          onmouseenter={(): void => onSetHoveredIndex(entry.index)}
          onmouseleave={(): void => onSetHoveredIndex(undefined)}>
          <span class="text-sm text-[var(--pd-dropdown-item-text)] text-left truncate">
            {entry.name}
          </span>
        </button>
      {/each}
    </div>
  </div>
{/if}

