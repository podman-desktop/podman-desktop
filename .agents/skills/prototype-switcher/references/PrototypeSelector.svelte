<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import { activePrototype, currentScreen, type PrototypeScreen } from '/@/stores/prototype';

let prototype = $state<{ name: string; screens: PrototypeScreen[] } | undefined>();
let selectedScreen = $state('');

$effect(() => {
  const unsubPrototype = activePrototype.subscribe(p => {
    prototype = p;
  });
  const unsubScreen = currentScreen.subscribe(s => {
    selectedScreen = s;
  });
  return (): void => {
    unsubPrototype();
    unsubScreen();
  };
});

function handleChange(value: string): void {
  currentScreen.set(value);
}
</script>

{#if prototype}
  <div class="flex items-center gap-2 pr-2" style="-webkit-app-region: none;">
    <span class="text-sm font-medium text-lime-400 whitespace-nowrap select-none">
      Prototype: {prototype.name}
    </span>

    <div class="prototype-dropdown">
      <Dropdown
        ariaLabel="Prototype screen selector"
        name="prototype-screen"
        class="min-w-60"
        value={selectedScreen}
        onChange={handleChange}
        options={prototype.screens} />
    </div>
  </div>
{/if}

<style>
  .prototype-dropdown :global(> div) {
    border: 1px solid rgb(239 68 68);
    border-radius: 4px;
  }
</style>
