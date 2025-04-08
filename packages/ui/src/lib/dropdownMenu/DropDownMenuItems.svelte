<script lang="ts">
import { onDestroy, onMount, type Snippet } from 'svelte';

// Provide default values for dropdown height and width
// for onMount validations.
let dropDownHeight = $state(0);
let dropDownWidth = $state(0);
let dropDownElement: HTMLElement;
let sideAlign = $state<string>();

interface Props {
  clientY: number;
  clientX: number;
  children?: Snippet;
}

let { clientY, clientX, children }: Props = $props();

const STATUS_BAR_HEIGHT = 24;

// When initializing the widget, set the placement on top or on bottom
// depending on the clientY position (cursor position) and the height of the dropdown menu to display
onMount(() => {
  const innerHeight = window.innerHeight;
  if (innerHeight - clientY - STATUS_BAR_HEIGHT < dropDownHeight) {
    dropDownElement.style.top = `-${dropDownHeight}px`;
  } else {
    dropDownElement.style.top = '20px';
  }

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
  bind:clientHeight={dropDownHeight}
  bind:clientWidth={dropDownWidth}
  bind:this={dropDownElement}
  class="{sideAlign} absolute z-10 m-2 rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] divide-y divide-[var(--pd-dropdown-divider)] focus:outline-hidden">
  {@render children?.()}
</div>
