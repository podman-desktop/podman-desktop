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
let isMac = $state(false);

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

// Keyboard shortcuts for navigation
// macOS: Cmd+[ or Cmd+Left (back), Cmd+] or Cmd+Right (forward)
// Windows/Linux: Alt+Left (back), Alt+Right (forward)
function handleKeyDown(e: KeyboardEvent): void {
  // Don't intercept shortcuts when typing in input fields
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return;
  }

  if (isMac) {
    // macOS: Cmd+[ or Cmd+Left (back), Cmd+] or Cmd+Right (forward)
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
    // Windows/Linux: Alt+Left and Alt+Right
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

onMount(async () => {
  const platform = await window.getOsPlatform();
  isMac = platform === 'darwin';
});

onMount(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('mouseup', handleGlobalMouseUp);
  return (): void => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mouseup', handleGlobalMouseUp);
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
