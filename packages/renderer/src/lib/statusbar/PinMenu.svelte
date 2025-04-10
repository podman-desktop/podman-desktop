<script lang="ts">
import { onDestroy, onMount } from 'svelte';

let dropDownHeight: number;
let dropDownElement: HTMLElement;

const STATUS_BAR_HEIGHT = 26;

function updateMenuLocation(): void {
  dropDownElement.style.top = `${window.innerHeight - dropDownHeight - STATUS_BAR_HEIGHT}px`;
  dropDownElement.style.left = '1px';
}

onMount(() => {
  updateMenuLocation();
  window.addEventListener('resize', updateMenuLocation);
});

onDestroy(() => window.removeEventListener('resize', updateMenuLocation));
</script>

<div
  bind:offsetHeight={dropDownHeight}
  bind:this={dropDownElement}
  class="absolute z-10"
  data-testid="pin-menu">
  <div
    title="Pin Menu"
    class="z-10 m-1 rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] divide-y divide-[var(--pd-dropdown-divider)] focus:outline-hidden">
    <slot />
  </div>
</div>
