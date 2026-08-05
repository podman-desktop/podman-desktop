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
let state = $state('initial');
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

  // update the state
  if (name === 'Minimize') {
    state = 'minimized';
  } else if (name === 'Maximize') {
    if (state === 'maximized') {
      state = 'restored';
    } else {
      state = 'maximized';
    }
  } else if (name === 'Close') {
    state = 'closed';
  }

  if (state === 'maximized') {
    icon = WindowsUnmaxIcon;
    titleName = 'Restore';
  } else if (state === 'restored') {
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
