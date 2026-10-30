<script lang="ts">
import type { Placement } from '@floating-ui/dom';
import type { Snippet } from 'svelte';

import { tooltipHidden } from './tooltip-store';
import TooltipPopup, { nextTooltipId } from './TooltipPopup.svelte';

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
let isVisible = $state(false);

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

function handleMouseEnter(): void {
  if ($tooltipHidden || (!tip && !tipSnippet)) return;

  isVisible = true;
}

function handleMouseLeave(): void {
  isVisible = false;
}

function handleFocusOut(event: FocusEvent): void {
  if (referenceElement?.contains(event.relatedTarget as Node)) return;
  handleMouseLeave();
}

$effect(() => {
  if ($tooltipHidden) {
    handleMouseLeave();
  }
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
  {#if isVisible && !$tooltipHidden && (tip ?? tipSnippet) && referenceElement}
    <TooltipPopup
      reference={referenceElement}
      id={tooltipId}
      placement={getPreferredPlacement()}
      tip={tip}
      tipSnippet={tipSnippet}
      class={className} />
  {/if}
</div>
