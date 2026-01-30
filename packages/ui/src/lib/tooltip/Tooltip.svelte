<style>
.tooltip-content {
  max-width: 400px;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  white-space: normal;
}

.tooltip-content :global(.flex) {
  min-width: 0;
}

.tooltip-content :global(.flex-row) {
  flex-wrap: wrap;
}
</style>

<script lang="ts">
import type { Placement } from '@floating-ui/dom';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import type { Snippet } from 'svelte';

import { tooltipHidden } from './tooltip-store';

interface Props {
  tip?: string;
  top?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  right?: boolean;
  bottom?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  left?: boolean;
  class?: string;
  containerClass?: string;
  tipSnippet?: Snippet;
  children?: Snippet;
  'aria-label'?: string;
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
  class: className,
  containerClass,
  tipSnippet,
  children,
  'aria-label': ariaLabel,
}: Props = $props();

let referenceElement: HTMLElement | undefined = $state(undefined);
let tooltipElement: HTMLElement | undefined = $state(undefined);
let isVisible = $state(false);
let isPositioned = $state(false);
let cleanupAutoUpdate: (() => void) | undefined;

const tooltipInnerClasses =
  'pt-[4px] pb-[5px] px-2 rounded-lg bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-inner-border)] backdrop-blur-sm';

function getPreferredPlacement(): Placement {
  if (top) return 'top';
  if (topLeft) return 'top-start';
  if (topRight) return 'top-end';
  if (bottom) return 'bottom';
  if (bottomLeft) return 'bottom-start';
  if (bottomRight) return 'bottom-end';
  if (left) return 'left';
  if (right) return 'right';
  return 'top';
}

async function updateTooltipPosition(): Promise<void> {
  if (!referenceElement || !tooltipElement) return;

  const { x, y } = await computePosition(referenceElement, tooltipElement, {
    placement: getPreferredPlacement(),
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  });

  // Re-check after async operation - element may have been unmounted
  if (!tooltipElement) return;

  // Round position to avoid sub-pixel positioning
  Object.assign(tooltipElement.style, {
    left: `${Math.round(x)}px`,
    top: `${Math.round(y)}px`,
  });

  // Round dimensions to avoid sub-pixel clipping
  const rect = tooltipElement.getBoundingClientRect();
  tooltipElement.style.width = `${Math.round(rect.width)}px`;

  isPositioned = true;
}

function handleMouseEnter(): void {
  if ($tooltipHidden || (!tip && !tipSnippet)) return;

  isVisible = true;
  isPositioned = false;
}

function handleMouseLeave(): void {
  isVisible = false;
  isPositioned = false;

  if (cleanupAutoUpdate) {
    cleanupAutoUpdate();
    cleanupAutoUpdate = undefined;
  }
}

$effect((): (() => void) => {
  if (isVisible && referenceElement && tooltipElement) {
    // Initial positioning
    updateTooltipPosition().catch(console.error);

    // Setup auto-update for dynamic positioning
    cleanupAutoUpdate = autoUpdate(referenceElement, tooltipElement, () => {
      updateTooltipPosition().catch(console.error);
    });
  }

  return (): void => {
    if (cleanupAutoUpdate) {
      cleanupAutoUpdate();
      cleanupAutoUpdate = undefined;
    }
  };
});
</script>

<div class={containerClass ?? 'relative inline-block'} aria-label={ariaLabel}>
  <span
    role="none"
    data-testid="tooltip-trigger"
    class="group tooltip-slot {className}"
    bind:this={referenceElement}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}>
    {@render children?.()}
  </span>
  {#if isVisible && !$tooltipHidden && (tip ?? tipSnippet)}
    <div
      bind:this={tooltipElement}
      class="fixed tooltip-content pointer-events-none text-base/4 z-[9999] rounded-[9px] border-[1px] border-[var(--pd-tooltip-outer-border)] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      class:opacity-0={!isPositioned}
      style="left: 0; top: 0;">
      {#if tip}
        <div class="{tooltipInnerClasses} {className}" aria-label="tooltip">
          {tip}
        </div>
      {/if}
      {#if tipSnippet && !tip}
        <div class="{tooltipInnerClasses} {className}" aria-label="tooltip">
          {@render tipSnippet?.()}
        </div>
      {/if}
    </div>
  {/if}
</div>
