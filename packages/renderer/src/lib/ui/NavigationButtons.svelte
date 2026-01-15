<script lang="ts">
import { faArrowLeft, faArrowRight, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';

import HistoryDropdown from '/@/lib/ui/HistoryDropdown.svelte';
import {
  BACK,
  type Direction,
  FORWARD,
  getBackEntries,
  getForwardEntries,
  goBack,
  goForward,
  goToHistoryIndex,
  type HistoryEntry,
  navigationHistory,
} from '/@/stores/navigation-history.svelte';

interface Props {
  class: string;
}

let { class: className = '' }: Props = $props();

let longPressTimer: NodeJS.Timeout | undefined = $state(undefined);
let showDropdown: Direction | undefined = $state(undefined);
let dropdownEntries: HistoryEntry[] = $state([]);
let isLongPressing = $state(false);
let timeout: NodeJS.Timeout | undefined = $state(undefined);

let canGoBack = $derived(navigationHistory.index > 0);
let canGoForward = $derived(navigationHistory.index < navigationHistory.stack.length - 1);
let isMac = $derived((await window.getOsPlatform()) === 'darwin');

function handleGlobalMouseUp(event: MouseEvent): void {
  // Handle mouse buttons 3/4 for back/forward
  if (event.button === 3) {
    event.preventDefault();
    goBack();
    return;
  } else if (event.button === 4) {
    event.preventDefault();
    goForward();
    return;
  }

  // Handle left button release for long-press dropdown
  if (event.button === 0 && isLongPressing) {
    isLongPressing = false;
  }
}

function handleMouseDown(event: MouseEvent, direction: Direction): void {
  if (event.button !== 0) return;

  isLongPressing = true;

  longPressTimer = setTimeout(() => {
    const entries = direction === BACK ? getBackEntries() : getForwardEntries();
    if (entries.length > 0) {
      dropdownEntries = entries;
      showDropdown = direction;
    }
  }, 500);
}

function handleClick(direction: Direction): void {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = undefined;
  }

  // Only navigate if dropdown isn't showing (short click)
  if (!showDropdown) {
    if (direction === BACK) {
      goBack();
    } else {
      goForward();
    }
  }

  isLongPressing = false;
}

function handleMouseLeave(): void {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = undefined;
  }
  if (!showDropdown) {
    isLongPressing = false;
  }
}

function selectEntry(index: number): void {
  window.telemetryTrack('navigation.historySelect', { direction: showDropdown }).catch(console.error);
  showDropdown = undefined;
  dropdownEntries = [];
  goToHistoryIndex(index);
}

function closeDropdown(): void {
  showDropdown = undefined;
  dropdownEntries = [];
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.history-dropdown')) {
    closeDropdown();
  }
}

// Trackpad swipe navigation
function handleWheel(e: WheelEvent): void {
  if (timeout) return;

  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    const SWIPE_THRESHOLD = 30;

    if (e.deltaX < -SWIPE_THRESHOLD) {
      if (canGoBack) {
        goBack();
        triggerSwipeCooldown();
      }
    } else if (e.deltaX > SWIPE_THRESHOLD) {
      if (canGoForward) {
        goForward();
        triggerSwipeCooldown();
      }
    }
  }
}

function triggerSwipeCooldown(): void {
  timeout = setTimeout(() => {
    timeout = undefined;
  }, 500);
}

// Keyboard shortcuts for navigation
function handleKeyDown(e: KeyboardEvent): void {
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return;
  }

  if (isMac) {
    if (e.metaKey) {
      if (e.key === '[' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.key === ']' || e.key === 'ArrowRight') {
        e.preventDefault();
        goForward();
      }
    }
  } else {
    if (e.altKey) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goForward();
      }
    }
  }
}

onMount(() => {
  window.addEventListener('mouseup', handleGlobalMouseUp);
  window.addEventListener('wheel', handleWheel);
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleKeyDown);

  return (): void => {
    window.removeEventListener('mouseup', handleGlobalMouseUp);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleKeyDown);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };
});
</script>

<div
    class="flex items-center gap-1 text-[color:var(--pd-global-nav-icon)] {className}"
    style="-webkit-app-region: none;">
    <div class="relative">
    <button
      class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
      title="Back (hold for history)"
      onmousedown={(e: MouseEvent): void => handleMouseDown(e, BACK)}
      onclick={(): void => handleClick(BACK)}
      onmouseleave={handleMouseLeave}
      disabled={!canGoBack}>
      <Icon icon={faArrowLeft} />
    </button>
    <HistoryDropdown
      show={showDropdown === BACK}
      entries={dropdownEntries}
      fallbackIcon={faBackward}
      {isLongPressing}
      onSelectEntry={selectEntry} />
  </div>
  <div class="relative">
    <button
      class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
      title="Forward (hold for history)"
      onmousedown={(e: MouseEvent): void => handleMouseDown(e, FORWARD)}
      onclick={(): void => handleClick(FORWARD)}
      onmouseleave={handleMouseLeave}
      disabled={!canGoForward}>
      <Icon icon={faArrowRight} />
    </button>
    <HistoryDropdown
      show={showDropdown === FORWARD}
      entries={dropdownEntries}
      fallbackIcon={faForward}
      {isLongPressing}
      onSelectEntry={selectEntry} />
  </div>
</div>
