<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { get } from 'svelte/store';

import { tooltipHidden } from './tooltip-store';

interface TooltipProps {
  tip?: string;
  class?: string;
  /** positional flags */
  top?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  bottom?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  left?: boolean;
  right?: boolean;
  /** forwarded HTML attributes */
  [key: string]: unknown;
}

interface Position {
  tp: number;
  lp: number;
}

const propsData = $props() as TooltipProps;

// Forward all unknown attributes to the wrapper element (class handled separately)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { class: _classIgnored, ...restProps } = propsData;

let hasSlotContent = false;

const EDGE = 8;
const SHIFT_RIGHT_VERT = 10;

let wrapperEl: HTMLElement | null = null;
let slotContainer: HTMLElement | null = null;
let tooltipOuter: HTMLDivElement | null = null;
let tooltipInner: HTMLDivElement | null = null;

$effect(() => {
  const { tip } = propsData;

  if (!tooltipInner) return;

  while (tooltipInner.firstChild) tooltipInner.removeChild(tooltipInner.firstChild);

  if (tip?.trim().length) {
    tooltipInner.append(document.createTextNode(tip));
    hasSlotContent = false;
  }
});

function contentAvailable(): boolean {
  if (propsData.tip?.trim().length) return true;
  if (hasSlotContent) return true;
  return !!tooltipInner?.textContent?.trim().length;
}

function calculatePosition(rect: DOMRect, tipRect: DOMRect): Position {
  const { top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight } = propsData;

  let tp = 0;
  let lp = 0;

  // vertical position
  if (top || topLeft || topRight) {
    tp = rect.top + window.scrollY - tipRect.height - EDGE;
  } else if (bottom || bottomLeft || bottomRight) {
    tp = rect.bottom + window.scrollY + EDGE;
  } else {
    tp = rect.top + window.scrollY + rect.height / 2 - tipRect.height / 2;
    if (right) tp -= SHIFT_RIGHT_VERT;
  }

  // horizontal position
  if (left) {
    lp = rect.left + window.scrollX - tipRect.width - EDGE;
  } else if (right) {
    lp = rect.right + window.scrollX + EDGE;
  } else if (topLeft || bottomLeft) {
    lp = rect.left + window.scrollX - tipRect.width * 0.8;
  } else if (topRight || bottomRight) {
    lp = rect.left + window.scrollX; // 0% shift
  } else {
    lp = rect.left + window.scrollX + rect.width / 2 - tipRect.width / 2;
  }

  return { tp, lp };
}

function showTooltip(): void {
  if (get(tooltipHidden)) return;
  if (!contentAvailable()) return;
  if (!wrapperEl || !tooltipOuter || !tooltipInner) return;

  if (propsData.tip) tooltipInner.textContent = propsData.tip;

  const rect = wrapperEl.getBoundingClientRect();
  const tipRect = tooltipOuter.getBoundingClientRect();
  const { tp, lp } = calculatePosition(rect, tipRect);
  tooltipOuter.style.top = `${tp}px`;
  tooltipOuter.style.left = `${lp}px`;
  tooltipOuter.classList.remove('opacity-0');
}

const hideTooltip = (): void => {
  tooltipOuter?.classList.add('opacity-0');
};

function attachTooltip(): void {
  if (tooltipOuter && !document.body.contains(tooltipOuter)) {
    document.body.appendChild(tooltipOuter);
  }
  hideTooltip();
}

function detachTooltip(): void {
  tooltipOuter?.parentNode?.removeChild(tooltipOuter);
}

const updateTooltipVisibility = (): void => {
  get(tooltipHidden) ? detachTooltip() : attachTooltip();
};

onMount(() => {
  tooltipOuter = document.createElement('div');
  tooltipInner = document.createElement('div');

  tooltipOuter.className =
    'whitespace-nowrap absolute tooltip opacity-0 inline-block transition-opacity duration-150 ease-in-out pointer-events-none text-sm z-60';

  if (propsData.left) tooltipOuter.classList.add('left');
  if (propsData.right) tooltipOuter.classList.add('right');
  if (propsData.top) tooltipOuter.classList.add('top');
  if (propsData.bottom) tooltipOuter.classList.add('bottom');
  if (propsData.topLeft) tooltipOuter.classList.add('top-left');
  if (propsData.topRight) tooltipOuter.classList.add('top-right');
  if (propsData.bottomLeft) tooltipOuter.classList.add('bottom-left');
  if (propsData.bottomRight) tooltipOuter.classList.add('bottom-right');

  const { tip } = propsData;

  const extra = propsData.class?.trim();

  tooltipInner.className =
    'inline-block py-2 px-4 rounded-md bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-border)]';

  if (extra) tooltipInner.classList.add(...extra.split(/\s+/));

  if (tip?.trim().length) {
    tooltipInner.append(document.createTextNode(tip));
  } else if (slotContainer) {
    while (slotContainer.firstChild) {
      const node = slotContainer.firstChild;
      const isMeaningful =
        node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent!.trim().length);
      tooltipInner.appendChild(node);
      if (isMeaningful) hasSlotContent = true;
    }
  }

  if (contentAvailable()) {
    tooltipInner.setAttribute('aria-label', 'tooltip');
  }

  tooltipOuter.appendChild(tooltipInner);
  document.body.appendChild(tooltipOuter);

  wrapperEl?.addEventListener('mouseenter', showTooltip);
  wrapperEl?.addEventListener('mouseleave', hideTooltip);
  wrapperEl?.addEventListener('click', hideTooltip);

  const unsub = tooltipHidden.subscribe((): void => updateTooltipVisibility());

  onDestroy(unsub);
});

onDestroy(() => {
  wrapperEl?.removeEventListener('mouseenter', showTooltip);
  wrapperEl?.removeEventListener('mouseleave', hideTooltip);
  wrapperEl?.removeEventListener('click', hideTooltip);
  tooltipOuter?.remove();
});
</script>

<div class="relative inline-block" bind:this={wrapperEl} {...restProps}>
  <span class="group tooltip-slot flex flex-col items-center">
    <slot />
  </span>
  <!-- Hidden container to capture named tip slot content (if provided) -->
  <div style="display: none;" bind:this={slotContainer}>
    <slot name="tip" />
  </div>
</div>
