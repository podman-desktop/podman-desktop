<script lang="ts">
import { onDestroy, onMount } from 'svelte';

let dropDownWidth: number;
let dropDownElement: HTMLElement;
let sideAlign: string;

export let clientX: number;

// When initializing the widget, set the placement on top or on bottom
// depending on the clientY position (cursor position) and the height of the dropdown menu to display
onMount(() => {
  dropDownElement.style.top = '20px';

  // When initializing the widget, set the placement on left or right
  // depending on the clientX position (cursor position) and the width of the dropdown menu to display
  if (window.innerWidth - clientX < dropDownWidth) {
    sideAlign = 'right-0 origin-top-right';
  } else {
    sideAlign = 'left-0 origin-top-left';
  }
  window.dispatchEvent(new Event('tooltip-hide'));
});

onDestroy(() => {
  window.dispatchEvent(new Event('tooltip-show'));
});
</script>

<div
  title="Drop Down Menu Items"
  bind:clientWidth={dropDownWidth}
  bind:this={dropDownElement}
  class="{sideAlign} absolute z-10 m-2 rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] divide-y divide-[var(--pd-dropdown-divider)] focus:outline-hidden">
  <slot />
</div>
