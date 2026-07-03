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

<script module lang="ts">
let tooltipIdCounter = 0;

function nextTooltipId(): string {
  tooltipIdCounter += 1;
  return `pd-tooltip-${tooltipIdCounter}`;
}
</script>

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
}: Props = $props();

const tooltipId = nextTooltipId();

let referenceElement: HTMLElement | undefined = $state(undefined);
let tooltipElement: HTMLElement | undefined = $state(undefined);
let isVisible = $state(false);
let isPositioned = $state(false);
let cleanupAutoUpdate: (() => void) | undefined;

const tooltipInnerClasses =
  'pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-inner-border)] backdrop-blur-sm';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function getTooltipAriaTarget(root: HTMLElement | undefined): HTMLElement | undefined {
  if (!root) return undefined;
  return root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? root;
}

function setTooltipAriaDescribedBy(root: HTMLElement | undefined, id: string | undefined): void {
  const target = getTooltipAriaTarget(root);
  if (!target) return;

  if (id) {
    target.setAttribute('aria-describedby', id);
  } else {
    target.removeAttribute('aria-describedby');
  }
}

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
  // Reset width to auto before measuring so tooltips can shrink
  tooltipElement.style.width = 'auto';
  const rect = tooltipElement.getBoundingClientRect();
  tooltipElement.style.width = `${Math.ceil(rect.width)}px`;

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

function handleFocusOut(event: FocusEvent): void {
  if (referenceElement?.contains(event.relatedTarget as Node)) return;
  handleMouseLeave();
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

$effect(() => {
  const shouldDescribe = isVisible && !$tooltipHidden && (tip ?? tipSnippet);
  setTooltipAriaDescribedBy(referenceElement, shouldDescribe ? tooltipId : undefined);

  return (): void => {
    setTooltipAriaDescribedBy(referenceElement, undefined);
  };
});
</script>

<div class={containerClass ?? 'relative inline-block'}>
  <span
    data-testid="tooltip-trigger"
    class="group tooltip-slot {className}"
    bind:this={referenceElement}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onfocusin={handleMouseEnter}
    onfocusout={handleFocusOut}>
    {@render children?.()}
  </span>
  {#if isVisible && !$tooltipHidden && (tip ?? tipSnippet)}
    <div
      bind:this={tooltipElement}
      class="fixed tooltip-content pointer-events-none text-[12px] leading-[16px] z-[9999] rounded-[9px] border-[1px] border-[var(--pd-tooltip-outer-border)] shadow-[0_4px_12px_var(--pd-shadow-color)]"
      class:opacity-0={!isPositioned}
      style="left: 0; top: 0;">
      {#if tip}
        <div class="{tooltipInnerClasses} {className}" role="tooltip" id={tooltipId}>
          {tip}
        </div>
      {/if}
      {#if tipSnippet && !tip}
        <div class="{tooltipInnerClasses} {className}" role="tooltip" id={tooltipId}>
          {@render tipSnippet?.()}
        </div>
      {/if}
    </div>
  {/if}
</div>
