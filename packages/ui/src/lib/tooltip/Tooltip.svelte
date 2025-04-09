<style>
.tooltip.top {
  left: 50%;
  transform: translate(-50%, -100%);
  margin-top: -8px;
}
.tooltip.bottom {
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 100%);
  margin-bottom: -8px;
}
.tooltip.left {
  left: 0;
  transform: translateX(-100%);
  margin-left: -8px;
}
.tooltip.right {
  right: 0;
  transform: translate(100%, -50%);
  margin-top: -10px;
  margin-right: -8px;
}
.tooltip.top-left {
  left: 0;
  transform: translate(-80%, -100%);
  margin-top: -8px;
}
.tooltip.bottom-left {
  left: 0;
  bottom: 0;
  transform: translate(-80%, 100%);
  margin-top: -8px;
}
.tooltip.bottom-right {
  left: 0;
  bottom: 0;
  transform: translate(0%, 100%);
  margin-top: -8px;
}
.tooltip.top-right {
  left: 0;
  transform: translate(0%, -100%);
  margin-top: -8px;
}
.tooltip-slot:hover + .tooltip {
  opacity: 1;
  visibility: initial;
}
</style>

<script lang="ts">
import type { Snippet } from 'svelte';

import { tooltipHidden } from './tooltip-store';

interface Props {
  tip?: string | Snippet;
  top?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  right?: boolean;
  bottom?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  left?: boolean;
  class?: string;
  'aria-label'?: string;
  children?: Snippet;
}
let {
  tip = undefined,
  top = false,
  topLeft = false,
  topRight = false,
  right = false,
  bottom = false,
  bottomLeft = false,
  bottomRight = false,
  left = false,
  class: className = '',
  'aria-label': ariaLabel,
  children = undefined,
}: Props = $props();

function isSnippet(obj: string | Snippet): obj is Snippet {
  return obj.length === 1;
}
</script>

<div class="relative inline-block">
  <span class="group tooltip-slot {className}">
    {@render children?.()}
  </span>
  <div
    class="whitespace-nowrap absolute tooltip opacity-0 inline-block transition-opacity duration-150 ease-in-out pointer-events-none text-sm z-60"
    class:left={left}
    class:right={right}
    class:bottom={bottom}
    class:top={top}
    class:top-left={topLeft}
    class:top-right={topRight}
    class:bottom-left={bottomLeft}
    class:bottom-right={bottomRight}>
    {#if tip && !$tooltipHidden}
      {#if !isSnippet(tip)}
        <div
          class="inline-block py-2 px-4 rounded-md bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-border)] {className}"
          aria-label="{ariaLabel ?? 'tooltip'}">
          {tip}
        </div>
      {:else}
        <div
          class="inline-block rounded-md bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-border)] {className}"
          aria-label="{ariaLabel ?? 'tooltip'}">
          {@render tip()}
        </div>
      {/if}
    {/if}
  </div>
</div>
