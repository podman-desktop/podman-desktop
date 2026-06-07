<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import { registerDeveloperSandboxPromptPrototype } from '/@/lib/kube/developer-sandbox-prompt-prototype';
import { activePrototype, currentScreen } from '/@/stores/prototype';

function handleChange(value: string): void {
  currentScreen.set(value);
}

$effect(() => {
  if ($activePrototype?.name === 'Developer Sandbox prompt') {
    const hasCurrentScreen = $activePrototype.screens.some(screen => screen.value === 'current');
    if (!hasCurrentScreen) {
      registerDeveloperSandboxPromptPrototype();
    }
  }
});
</script>

{#if $activePrototype}
  <div class="flex items-center gap-2 pr-2" style="-webkit-app-region: none;">
    <span class="text-sm font-medium text-lime-400 whitespace-nowrap select-none">
      Prototype: {$activePrototype.name}
    </span>

    <div class="prototype-dropdown">
      <Dropdown
        ariaLabel="Prototype screen selector"
        name="prototype-screen"
        class="min-w-60"
        value={$currentScreen}
        onChange={handleChange}
        options={$activePrototype.screens} />
    </div>
  </div>
{/if}

<style>
  .prototype-dropdown :global(button) {
    border: 1px solid rgb(239 68 68);
    border-radius: 4px;
  }
</style>
