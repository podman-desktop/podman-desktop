<script lang="ts">
import { onDestroy, onMount, type Snippet, tick } from 'svelte';

let dropDownHeight = $state(0);
let dropDownWidth = $state(0);
let dropDownElement = $state<HTMLElement>();
let menuStyle = $state('');

interface Props {
  menuId: string;
  clientY: number;
  clientX: number;
  children?: Snippet;
}

let { menuId, clientY, clientX, children }: Props = $props();

const STATUS_BAR_HEIGHT = 24;
const VIEWPORT_MARGIN = 8;

async function positionMenu(): Promise<void> {
  await tick();
  if (!dropDownElement || dropDownHeight === 0 || dropDownWidth === 0) {
    return;
  }

  const innerHeight = window.innerHeight;
  const innerWidth = window.innerWidth;

  let top =
    innerHeight - clientY - STATUS_BAR_HEIGHT < dropDownHeight
      ? clientY - dropDownHeight - VIEWPORT_MARGIN
      : clientY + 20;
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, innerHeight - dropDownHeight - VIEWPORT_MARGIN));

  let left = innerWidth - clientX < dropDownWidth ? clientX - dropDownWidth : clientX;
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, innerWidth - dropDownWidth - VIEWPORT_MARGIN));

  menuStyle = `top: ${top}px; left: ${left}px;`;
}

$effect(() => {
  positionMenu().catch(console.error);
});

onMount(() => {
  window.dispatchEvent(new Event('tooltip-hide'));
});

onDestroy(() => {
  window.dispatchEvent(new Event('tooltip-show'));
});
</script>

<div
  data-extension-dropdown-menu={menuId}
  title="Drop Down Menu Items"
  bind:clientHeight={dropDownHeight}
  bind:clientWidth={dropDownWidth}
  bind:this={dropDownElement}
  style={menuStyle}
  class="fixed z-50 min-w-[15rem] rounded-md shadow-lg bg-[var(--pd-dropdown-bg)] ring-2 ring-[var(--pd-dropdown-ring)] hover:ring-[var(--pd-dropdown-hover-ring)] divide-y divide-[var(--pd-dropdown-divider)] focus:outline-hidden">
  {@render children?.()}
</div>
