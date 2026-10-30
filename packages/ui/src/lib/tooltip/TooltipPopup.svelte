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

export function nextTooltipId(): string {
  tooltipIdCounter += 1;
  return `pd-tooltip-${tooltipIdCounter}`;
}
</script>

<script lang="ts">
import type { Placement } from '@floating-ui/dom';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import type { Snippet } from 'svelte';

interface Props {
  reference: HTMLElement;
  id: string;
  placement?: Placement;
  tip?: string;
  tipSnippet?: Snippet;
  class?: string;
}

let { reference, id, placement = 'top', tip, tipSnippet, class: className }: Props = $props();

let tooltipElement: HTMLElement | undefined = $state(undefined);
let isPositioned = $state(false);

const tooltipInnerClasses =
  'pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-inner-border)] backdrop-blur-sm';

async function updateTooltipPosition(): Promise<void> {
  if (!tooltipElement) return;

  const { x, y } = await computePosition(reference, tooltipElement, {
    placement,
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

$effect((): (() => void) | undefined => {
  if (!tooltipElement) return undefined;

  // Initial positioning
  updateTooltipPosition().catch(console.error);

  // Setup auto-update for dynamic positioning
  return autoUpdate(reference, tooltipElement, () => {
    updateTooltipPosition().catch(console.error);
  });
});
</script>

<div
  bind:this={tooltipElement}
  class="fixed tooltip-content pointer-events-none text-[12px] leading-[16px] z-[9999] rounded-[9px] border-[1px] border-[var(--pd-tooltip-outer-border)] shadow-[0_4px_12px_var(--pd-shadow-color)]"
  class:opacity-0={!isPositioned}
  style="left: 0; top: 0;">
  <div class="{tooltipInnerClasses} {className}" role="tooltip" id={id}>
    {#if tip}
      {tip}
    {:else}
      {@render tipSnippet?.()}
    {/if}
  </div>
</div>
