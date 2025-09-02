<script lang="ts">
import { faBars, faCheck, faGripVertical, faUndo } from '@fortawesome/free-solid-svg-icons';
import { scale } from 'svelte/transition';

import { Icon } from '../icons';
import type { LayoutEditItem } from './LayoutEditor';

interface Props {
  items: LayoutEditItem[];
  title?: string;
  enableReorder?: boolean;
  enableToggle?: boolean;
  onReset?: () => void;
  resetButtonLabel?: string;
  class?: string;
}

let {
  items = $bindable([]),
  title = 'Select items',
  enableReorder = false,
  enableToggle = false,
  onReset,
  resetButtonLabel = 'Reset to default',
  class: className = '',
}: Props = $props();

// Create a reactive set derived from items (read-only)
let enabledItems = $derived(new Set(items.filter(item => item.enabled).map(item => item.id)));

let isResetDisabled = $state(true);
$effect(() => {
  // Reset callback must be provided
  if (!onReset) {
    isResetDisabled = true;
    return;
  }

  // Reset is disabled if all items are enabled and in original order
  const allEnabled = items.every(item => item.enabled);

  // Check if items are in their original order
  // Each item's current array position should match its originalOrder
  const isInOriginalOrder = items.every((item, index) => item.originalOrder === index);

  isResetDisabled = allEnabled && isInOriginalOrder;
});

let isOpen = $state(false);
let containerElement: HTMLDivElement;

// Drag and drop state (custom implementation)
let draggedIndex: number | undefined = $state(undefined);
let dragOverIndex: number | undefined = $state(undefined);
let isDraggingActive = $state(false);
let isGripHovered: boolean = $state(false);

async function toggleDropdown(): Promise<void> {
  isOpen = !isOpen;
}

function closeDropdown(): void {
  isOpen = false;
}

async function handleItemToggle(item: LayoutEditItem): Promise<void> {
  if (!enableToggle || isDraggingActive) return;
  items = items.map(i => (i.id === item.id ? { ...i, enabled: !i.enabled } : i));
}

// Creates a visual preview of the list while dragging.
function createDragPreview(dragIndex: number, hoverIndex: number): LayoutEditItem[] {
  const newItems = [...items];
  const draggedItem = newItems[dragIndex];
  newItems.splice(dragIndex, 1);
  newItems.splice(hoverIndex, 0, draggedItem);
  return newItems;
}

// Starts the drag operation on mouse down.
function startDrag(event: MouseEvent, index: number): void {
  // Only react to left-click
  if (event.button !== 0) return;
  event.preventDefault();

  isDraggingActive = true;
  draggedIndex = index;
  dragOverIndex = index;
}

// Handles mouse movement anywhere on the window during a drag.
function handleWindowMouseMove(event: MouseEvent): void {
  if (!isDraggingActive) return;

  const targetElement = (event.target as Element).closest('[data-item-id]');
  if (!targetElement) return;

  const allItemElements = Array.from(containerElement.querySelectorAll('[data-item-id]'));
  const hoverIndex = allItemElements.findIndex(el => el === targetElement);

  if (hoverIndex !== -1 && dragOverIndex !== hoverIndex) {
    dragOverIndex = hoverIndex;
  }
}

// Stops the drag operation on mouse up.
function stopDrag(): void {
  if (!isDraggingActive || draggedIndex === undefined || dragOverIndex === undefined) {
    return;
  }

  if (draggedIndex !== dragOverIndex) {
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dragOverIndex, 0, draggedItem);

    items = newItems;
  }
  resetDragging();
}

function resetDragging(): void {
  setTimeout(() => {
    isDraggingActive = false;
    draggedIndex = undefined;
    dragOverIndex = undefined;
  }, 0);
}

// Keyboard navigation for drag handles
function handleGripKeydown(event: KeyboardEvent, index: number): void {
  const { key } = event;

  // Prevent Space/Enter from toggling the item
  if (key === ' ' || key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // Handle arrow key reordering
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    event.preventDefault();
    event.stopPropagation();

    const newIndex = key === 'ArrowUp' ? Math.max(0, index - 1) : Math.min(items.length - 1, index + 1);

    if (newIndex !== index) {
      // Reorder the items
      const newItems = [...items];
      const [movedItem] = newItems.splice(index, 1);
      newItems.splice(newIndex, 0, movedItem);
      items = newItems;

      // Update focus to follow the moved item
      setTimeout(() => {
        const gripElements = containerElement.querySelectorAll('[data-grip-index]');
        const targetGrip = gripElements[newIndex] as HTMLElement;
        targetGrip?.focus();
      }, 0);
    }
  }
}

// Window event handlers
function handleWindowClick(e: Event): void {
  if (isOpen && e.target instanceof Node && !containerElement?.contains(e.target)) {
    closeDropdown();
  }
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isOpen) {
    closeDropdown();
  }
}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} onmousemove={handleWindowMouseMove} onmouseup={stopDrag} />
<svelte:body class:cursor-grabbing={isDraggingActive} />

<div class="relative inline-block {className}" bind:this={containerElement}>
  <button
    class="cursor-pointer text-[var(--pd-action-button-text)] hover:text-[var(--pd-action-button-hover-text)] transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center p-1"
    class:text-[var(--pd-action-button-hover-text)]={isOpen}
    onclick={toggleDropdown}
    title={title}
    tabindex="0"
  >
    <Icon icon={faBars} />
  </button>

  {#if isOpen}
    <div 
      class="origin-top-right absolute z-50 right-0 top-full mt-1 overflow-y-auto overflow-x-hidden rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] border border-[var(--pd-dropdown-border)] text-nowrap"
      transition:scale={{ duration: 200, start: 0.95, opacity: 0 }}
    >
      <div class="bg-[var(--pd-dropdown-header-bg)]">
        {#each (isDraggingActive && draggedIndex !== undefined && dragOverIndex !== undefined) ? createDragPreview(draggedIndex, dragOverIndex) : items as item, index (item.id)}
          {@const originalIndex = items.findIndex(originalItem => originalItem.id === item.id)}
            <button
              class="flex items-center justify-between px-3 py-2 w-full"
              class:cursor-pointer={!isDraggingActive && !isGripHovered}
              class:cursor-default={!isDraggingActive && isGripHovered}
              class:cursor-grabbing={isDraggingActive}
              class:hover:bg-[var(--pd-dropdown-item-hover-bg)]={!isDraggingActive}
              class:bg-[var(--pd-dropdown-item-hover-bg)]={isDraggingActive && dragOverIndex === index}
              class:opacity-60={isDraggingActive && draggedIndex === originalIndex}
              data-item-id={item.id}
              onclick={(): Promise<void> => handleItemToggle(item)}
            >
              <div class="flex items-center justify-start gap-3 flex-1">
                <div class="w-4 h-4 flex items-center justify-center flex-shrink-0 pointer-events-none">
                  {#if enabledItems.has(item.id)}
                    <Icon icon={faCheck}/>
                  {/if}
                </div>
                <span class="text-sm text-[var(--pd-dropdown-item-text)] pr-10 flex-1 text-left">
                  {item.label}
                </span>
              </div>

              {#if enableReorder}
              <div
                class="text-[var(--pd-dropdown-item-text)] flex-shrink-0 rounded-sm p-1"
                class:cursor-grab={!isDraggingActive}
                class:cursor-grabbing={isDraggingActive}
                draggable={true}
                role="button"
                tabindex="0"
                data-grip-index={originalIndex}
                onmousedown={(e): void => startDrag(e, originalIndex)}
                onclick={(e): void => e.stopPropagation()}
                onkeydown={(e): void => handleGripKeydown(e, originalIndex)}
                onmouseenter={(): void => {isGripHovered = true;}}
                onmouseleave={(): void => {isGripHovered = false;}}
                title="Use arrow keys to reorder, or drag with mouse"
              >
                <Icon icon={faGripVertical} class="text-[var(--pd-dropdown-item-text)]"/>
              </div>
            {/if}
          </button>
        {/each}
      </div>
      
      <div class="flex items-center justify-between">
        {#if onReset}
          <button
            class="flex items-center justify-start px-3 pb-2 w-full transition-colors select-none"
            class:cursor-pointer={!isResetDisabled}
            class:cursor-not-allowed={isResetDisabled}
            class:hover:bg-[var(--pd-dropdown-item-hover-bg)]={!isResetDisabled}
            class:opacity-50={isResetDisabled}
            class:text-[var(--pd-dropdown-item-disabled-text)]={isResetDisabled}
            onclick={isResetDisabled ? undefined : onReset}
            disabled={isResetDisabled}
            tabindex={isResetDisabled ? -1 : 0}
          >
            <div class="flex items-center justify-start gap-3 flex-1 border-t border-gray-600 pt-2">
              <div class="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <Icon icon={faUndo} size='0.8x'/>
              </div>
              <span class="text-sm text-[var(--pd-dropdown-item-text)] select-none flex-1 text-left">
                {resetButtonLabel}
              </span>
            </div>
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
