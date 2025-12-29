<script lang="ts">
import { onMount } from 'svelte';

import CommandPalette from '/@/lib/dialogs/CommandPalette.svelte';
import DesktopIcon from '/@/lib/images/DesktopIcon.svelte';
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
  class="bg-[var(--pd-titlebar-bg)] body-font z-999 relative {platform === 'win32'
    ? 'min-h-[32px]'
    : 'min-h-[38px]'} border-[var(--pd-global-nav-bg-border)] border-b-[1px]"
  style="-webkit-app-region: drag;">
  <div class="flex select-none">
    <!-- On Linux, title is centered and we have control buttons in the title bar-->
    {#if platform === 'linux'}
      <div class="flex mx-auto flex-row pt-[7px] pb-[6px] items-center">
        <div class="absolute left-[10px] top-[10px]">
          <DesktopIcon size="18" />
        </div>
        <SearchButton onclick={openCommandPalette}/>
        <WindowControlButtons platform={platform} />
      </div>
    {:else if platform === 'win32'}
      <div class="flex flex-row pt-[10px] pb-[10px] items-center">
        <div class="absolute left-[7px] top-[7px]">
          <DesktopIcon size="20" />
        </div>
        <SearchButton onclick={openCommandPalette}/>
        <div class="ml-[35px] text-left text-base leading-3 text-[color:var(--pd-titlebar-text)]">{title}</div>
        <WindowControlButtons platform={platform} />
      </div>
    {:else if platform === 'darwin'}
      <SearchButton onclick={openCommandPalette}/>
    {/if}
    <CommandPalette display={commandPaletteVisible} onclose={closeCommandPalette}/>
  </div>
</header>
