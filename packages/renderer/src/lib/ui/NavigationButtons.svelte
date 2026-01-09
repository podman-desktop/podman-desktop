<script lang="ts">
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';

import { goBack, goForward, navigationHistory } from '/@/stores/navigation-history.svelte';

interface Props {
  class: string;
}

let { class: className = '' }: Props = $props();

let canGoBack = $derived(navigationHistory.index > 0);
let canGoForward = $derived(navigationHistory.index < navigationHistory.stack.length - 1);
let isMac = $derived((await window.getOsPlatform()) === 'darwin');
let swipeCooldown = $state(false);

// Mouse button navigation (button 3 = back, button 4 = forward)
function handleGlobalMouseUp(event: MouseEvent): void {
  if (event.button === 3) {
    event.preventDefault();
    goBack();
  } else if (event.button === 4) {
    event.preventDefault();
    goForward();
  }
}

// Trackpad swipe navigation
function handleWheel(e: WheelEvent): void {
  if (swipeCooldown) return;

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
  swipeCooldown = true;
  setTimeout(() => {
    swipeCooldown = false;
  }, 800);
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
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('mouseup', handleGlobalMouseUp);
  window.addEventListener('wheel', handleWheel);

  return (): void => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mouseup', handleGlobalMouseUp);
    window.removeEventListener('wheel', handleWheel);
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
        onclick={goBack}
        disabled={!canGoBack}>
        <Icon icon={faArrowLeft} />
    </button>
    </div>
    <div class="relative">
    <button
        class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
        title="Forward (hold for history)"
        onclick={goForward}
        disabled={!canGoForward}>
        <Icon icon={faArrowRight} />
    </button>
    </div>
</div>
