<script lang="ts">
import { type Component, onMount } from 'svelte';

import WindowsExitIcon from '/@/lib/images/WindowsExitIcon.svelte';
import WindowsMaxIcon from '/@/lib/images/WindowsMaxIcon.svelte';
import WindowsMinIcon from '/@/lib/images/WindowsMinIcon.svelte';
import WindowsUnmaxIcon from '/@/lib/images/WindowsUnmaxIcon.svelte';

const iconSize = '16';

interface Props {
  name: string;
  action?: () => void;
}

let { name, action = (): void => {} }: Props = $props();

let icon = $state<Component>(WindowsMinIcon);
let windowState = $state('initial');
let titleName = $state<string>();

onMount(() => {
  if (name === 'Minimize') {
    icon = WindowsMinIcon;
  } else if (name === 'Maximize') {
    icon = WindowsMaxIcon;
  } else if (name === 'Close') {
    icon = WindowsExitIcon;
  }
  titleName = name;
});

function executeAction(): void {
  // perform action
  action();

  // update the window state
  if (name === 'Minimize') {
    windowState = 'minimized';
  } else if (name === 'Maximize') {
    if (windowState === 'maximized') {
      windowState = 'restored';
    } else {
      windowState = 'maximized';
    }
  } else if (name === 'Close') {
    windowState = 'closed';
  }

  if (windowState === 'maximized') {
    icon = WindowsUnmaxIcon;
    titleName = 'Restore';
  } else if (windowState === 'restored') {
    icon = WindowsMaxIcon;
    titleName = 'Maximize';
  }
}
</script>

<button
  onclick={executeAction}
  aria-label={name}
  title={titleName}
  class="h-[32px] w-[45px] cursor-pointer {name === 'Close'
    ? 'hover:bg-(--pd-titlebar-windows-hover-exit-bg) hover:text-(--pd-titlebar-windows-hover-exit-text)'
    : 'hover:bg-(--pd-titlebar-windows-hover-bg)'} text-(--pd-titlebar-icon) flex place-items-center justify-center">
  {#if icon}
    {@const Icon = icon}
    <Icon size={iconSize} />
  {/if}
</button>
