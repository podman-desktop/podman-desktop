<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faArrowRight, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Component } from 'svelte';
import { onMount } from 'svelte';
import { get } from 'svelte/store';

import { isDark } from '/@/stores/appearance';
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
  type HistoryEntryIcon,
  navigationHistory,
} from '/@/stores/navigation-history.svelte';

import { longPress } from './attachments/longpress';

interface Props {
  class: string;
}

let { class: className = '' }: Props = $props();

let showDropdown: Direction | undefined = $state(undefined);
let dropdownEntries: HistoryEntry[] = $state([]);
let timeout: ReturnType<typeof setTimeout> | undefined = $state(undefined);
let navContainer: HTMLElement;

let canGoBack = $derived(navigationHistory.index > 0);
let canGoForward = $derived(navigationHistory.index < navigationHistory.stack.length - 1);

interface NavButton {
  direction: Direction;
  icon: IconDefinition | Component | string;
  label: string;
  ariaLabel: string;
  canNavigate: () => boolean;
}
const navButtons: NavButton[] = [
  {
    direction: BACK,
    icon: faArrowLeft,
    label: 'Back (hold for history)',
    ariaLabel: 'Back history',
    canNavigate: (): boolean => canGoBack,
  },
  {
    direction: FORWARD,
    icon: faArrowRight,
    label: 'Forward (hold for history)',
    ariaLabel: 'Forward history',
    canNavigate: (): boolean => canGoForward,
  },
];
let isMac = $derived((await window.getOsPlatform()) === 'darwin');

function resolveIcon(
  icon: HistoryEntryIcon | undefined,
  fallback: IconDefinition,
): IconDefinition | Component | string {
  if (!icon) return fallback;
  if (icon.iconComponent) return icon.iconComponent;
  if (icon.faIcon) return icon.faIcon.definition;
  if (icon.iconImage) {
    if (typeof icon.iconImage === 'string') return icon.iconImage;
    return get(isDark) ? icon.iconImage.dark : icon.iconImage.light;
  }
  return fallback;
}

function entriesToOptions(
  entries: HistoryEntry[],
  fallback: IconDefinition,
): { value: string; label: string; icon: IconDefinition | Component | string }[] {
  return entries.map(entry => ({
    value: String(entry.index),
    label: entry.name,
    icon: resolveIcon(entry.icon, fallback),
  }));
}

let dropdownOptions = $derived(entriesToOptions(dropdownEntries, showDropdown === BACK ? faBackward : faForward));

// Handle mouse buttons 3/4 for back/forward
function handleGlobalMouseUp(event: MouseEvent): void {
  if (event.button === 3) {
    event.preventDefault();
    goBack();
  } else if (event.button === 4) {
    event.preventDefault();
    goForward();
  }
}

function onLongPress(direction: Direction): void {
  const entries = direction === BACK ? getBackEntries() : getForwardEntries();
  if (entries.length > 0) {
    dropdownEntries = entries;
    showDropdown = direction;
  }
}

function onClick(direction: Direction): void {
  // Only navigate if dropdown isn't showing (short click)
  if (!showDropdown) {
    direction === BACK ? goBack() : goForward();
  }
}

function handleHistorySelect(val: string): void {
  window.telemetryTrack('navigation.historySelect', { direction: showDropdown }).catch(console.error);
  closeDropdown();
  goToHistoryIndex(Number(val));
}

function closeDropdown(): void {
  showDropdown = undefined;
  dropdownEntries = [];
}

function handleClickOutside(event: MouseEvent): void {
  if (showDropdown && navContainer && !navContainer.contains(event.target as Node)) {
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
  };
});
</script>

<div
    bind:this={navContainer}
    class="relative flex items-center gap-1 text-[color:var(--pd-global-nav-icon)] {className}"
    style="-webkit-app-region: none;">
    {#each navButtons as btn (btn.direction)}
      <div class="relative">
        <button
          class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
          title={btn.label}
          aria-label={btn.label}
          onclick={onClick.bind(undefined, btn.direction)}
          disabled={!btn.canNavigate()}
          {@attach longPress(onLongPress.bind(undefined, btn.direction))}>
          <Icon icon={btn.icon} />
        </button>
        <Dropdown
          triggerless
          selectOnMouseUp
          opened={showDropdown === btn.direction}
          options={dropdownOptions}
          ariaLabel={btn.ariaLabel}
          onChange={handleHistorySelect}
          class="absolute left-0 top-full z-50 mt-1" />
      </div>
    {/each}
</div>
