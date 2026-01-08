<script lang="ts">
import { onMount } from 'svelte';

import CommandPalette from '/@/lib/dialogs/CommandPalette.svelte';
import DesktopIcon from '/@/lib/images/DesktopIcon.svelte';
import NavigationButtons from '/@/lib/ui/NavigationButtons.svelte';
import WindowControlButtons from '/@/lib/window-control-buttons/ControlButtons.svelte';

import SearchButton from './SearchButton.svelte';

let platform: string = $state('');

const title = 'Podman Desktop';
let commandPaletteVisible = $state(false);

onMount(async () => {
  platform = await window.getOsPlatform();
});

function openCommandPalette(): void {
  commandPaletteVisible = true;
}

function closeCommandPalette(): void {
  commandPaletteVisible = false;
}
</script>

<header
  id="navbar"
  class="bg-[var(--pd-titlebar-bg)] body-font relative {platform === 'win32'
    ? 'min-h-[32px]'
    : 'min-h-[38px]'} border-[var(--pd-global-nav-bg-border)] border-b-[1px]"
  style="-webkit-app-region: drag;">
  <div class="select-none grid grid-cols-3 items-center h-full w-full">
    <!-- left -->
    <div class="flex flex-row grow pl-[7px] items-center gap-x-2">
      {#if platform !== 'darwin'}
        <DesktopIcon size={platform === 'win32' ? '20' : '18'} />
      {/if}
      {#if  platform === 'win32'}
        <div class="text-left text-base leading-3 text-[color:var(--pd-titlebar-text)]">{title}</div>
      {/if}
      {#if platform === 'darwin'}
        <div class="pl-20">
          <NavigationButtons />
        </div>
      {:else}
        <NavigationButtons />
      {/if}
    </div>

    <!-- center -->
    <div class="flex flex-row grow items-center justify-center w-full">
      <SearchButton onclick={openCommandPalette}/>
    </div>

    <!-- right -->
    <div class="flex flex-row grow justify-end">
      {#if platform !== 'darwin'}
        <WindowControlButtons platform={platform} />
      {/if}
    </div>
  </div>
</header>

<CommandPalette display={commandPaletteVisible} onclose={closeCommandPalette}/>
