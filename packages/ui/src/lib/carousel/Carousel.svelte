<script lang="ts" generics="T">
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { onDestroy, onMount, type Snippet } from 'svelte';

import Icon from '../icons/Icon.svelte';

interface Props<T> {
  cards: T[];
  cardWidth?: number;
  card: Snippet<[T]>;
  // let the track run past its column to the edge of the nearest @container ancestor
  // (the column must be centered in that container),
  // with page-colored fades on both sides and 24px nav arrows straddling the column edges
  overflow?: boolean;
}
let { cards, card, cardWidth = 360, overflow = false }: Props<T> = $props();

// span the whole @container plus its 24px gutters; the left padding keeps the first card on the column edge
// at rest, and scrolled cards slide into it up to the window edge (percentages resolve against the column)
const trackClass = $derived(
  overflow
    ? 'shrink-0 w-[calc(100cqw+3rem)] -ml-[calc((100cqw-100%)/2+1.5rem)] pl-[calc((100cqw-100%)/2+1.5rem)]'
    : 'grow',
);
// overflow: each fade starts on the column edge and fills the breakout out to the window edge
const BREAKOUT = 'w-[calc((100cqw-100%)/2+1.5rem)]';
const leftFadeClass = $derived(
  overflow ? `right-full ${BREAKOUT} bg-gradient-to-l` : 'left-0 w-[60px] bg-gradient-to-r',
);
const rightFadeClass = $derived(
  overflow ? `left-full ${BREAKOUT} bg-gradient-to-r` : 'right-0 w-[60px] bg-gradient-to-l',
);
const fadeFrom = $derived(
  overflow
    ? 'from-(--pd-content-bg)/75 to-(--pd-content-bg)'
    : 'from-[var(--pd-content-card-bg)] to-[var(--pd-content-card-border)/1]',
);
const navButtonClass = $derived(
  overflow
    ? 'absolute top-1/2 -translate-y-1/2 w-6 h-6 z-20 rounded-full select-none flex bg-(--pd-content-bg) transition-opacity duration-200 motion-reduce:transition-none'
    : 'absolute h-full w-12 z-20 flex items-center justify-center',
);
const navIconClass = $derived(overflow ? 'w-3 h-3' : 'w-4 h-4');
// the nav fill is transparent in high contrast; the page-colored button underneath keeps the arrow off the card text
const navFillClass =
  'flex grow items-center justify-center rounded-full bg-(--pd-content-card-carousel-nav) hover:bg-(--pd-content-card-carousel-hover-nav)';

let resizeObserver: ResizeObserver;
let cardsContainer: HTMLElement;

let containerWidth = $state(0);
let scrollPosition = $state(0);
let maxScroll = $state(0);
let isDragging = $state(false);
let dragStartX = $state(0);
let dragStartScroll = $state(0);

// 12px gap between cards
const GAP = 12;

// eslint-disable-next-line sonarjs/pseudo-random
const containerId = Math.random().toString(36).slice(-6);

// width of the column the carousel sits in (the outer wrapper)
let columnWidth = $state(0);
// overflow: exactly three cards span the column, so each scroll step realigns them with it
const slotWidth = $derived(overflow && columnWidth > 0 ? (columnWidth - 2 * GAP) / 3 : cardWidth);

// Calculate total width of all cards
const totalCardsWidth = $derived(cards.length * slotWidth + (cards.length - 1) * GAP);

// Check if we can scroll left or right
const canScrollLeft = $derived(scrollPosition > 0);
const canScrollRight = $derived(scrollPosition < maxScroll);

function updateScrollLimits(): void {
  // overflow: the track runs to the window edge, but the last card should come to rest on the column edge
  const visibleWidth = overflow && columnWidth > 0 ? columnWidth : containerWidth;
  maxScroll = Math.max(0, totalCardsWidth - visibleWidth);
  scrollPosition = Math.min(scrollPosition, maxScroll);
}

function update(entries: ResizeObserverEntry[]): void {
  containerWidth = entries[0].contentRect.width;
  updateScrollLimits();
}

function scrollToPosition(newPosition: number): void {
  scrollPosition = Math.max(0, Math.min(newPosition, maxScroll));
}

function scrollLeft(): void {
  const scrollAmount = slotWidth + GAP;
  scrollToPosition(scrollPosition - scrollAmount);
}

function scrollRight(): void {
  const scrollAmount = slotWidth + GAP;
  scrollToPosition(scrollPosition + scrollAmount);
}

function handleWheel(event: WheelEvent): void {
  // Check if it's a horizontal scroll event (most trackpads and some mice support this)
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    // Natural horizontal scroll
    event.preventDefault();
    event.stopPropagation();
    const scrollAmount = event.deltaX > 0 ? 25 : -25;
    scrollToPosition(scrollPosition + scrollAmount);
  }
}

function handleMouseDown(event: MouseEvent): void {
  isDragging = true;
  dragStartX = event.clientX;
  dragStartScroll = scrollPosition;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event: MouseEvent): void {
  if (!isDragging) return;
  const deltaX = dragStartX - event.clientX;
  scrollToPosition(dragStartScroll + deltaX);
}

function handleMouseUp(): void {
  isDragging = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

onMount(() => {
  cardsContainer = document.getElementById(`carousel-cards-${containerId}`) as HTMLElement;
  containerWidth = cardsContainer?.offsetWidth || 0;
  updateScrollLimits();

  resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(cardsContainer);

  // Add wheel event listener
  cardsContainer.addEventListener('wheel', handleWheel, { passive: false });
});

onDestroy(() => {
  resizeObserver?.disconnect();
  cardsContainer?.removeEventListener('wheel', handleWheel);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});

$effect(() => {
  updateScrollLimits();
});
</script>

<div class="flex flex-row items-center relative" bind:clientWidth={columnWidth}>
  <button
    id="left"
    onclick={scrollLeft}
    aria-label="Scroll left"
    class="{navButtonClass} {overflow ? 'left-0 -translate-x-1/2' : ''}"
    class:opacity-0={!canScrollLeft}
    class:opacity-100={canScrollLeft}
    class:pointer-events-none={!canScrollLeft}>

    {#if overflow}
      <span class={navFillClass}><Icon class={navIconClass} icon={faChevronLeft} /></span>
    {:else}
      <div class="h-8 w-8 z-20 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] transition-opacity duration-200 rounded-full flex items-center justify-center">
        <Icon class={navIconClass} icon={faChevronLeft} />
      </div>
    {/if}
  </button>

  <!-- Edge shadows for partially visible cards -->
  {#if canScrollLeft}
    <div class="absolute top-0 h-full pointer-events-none z-10 {fadeFrom} {leftFadeClass}"></div>
  {/if}
  {#if canScrollRight}
    <div class="absolute top-0 h-full pointer-events-none z-10 {fadeFrom} {rightFadeClass}"></div>
  {/if}

  <div
    id="carousel-cards-{containerId}"
    role="carousel-cards-{containerId}"
    aria-label="Carousel container"
    class="flex {trackClass} overflow-hidden relative cursor-grab select-none"
    class:cursor-grabbing={isDragging}
    onmousedown={handleMouseDown}
    onwheel={handleWheel}>

    <!-- Scrollable container with all cards -->
    <div 
      class="flex gap-3 transition-transform duration-300 ease-out"
      style="transform: translateX(-{scrollPosition}px);">
      {#each cards as cardValue (cardValue)}
        <div
          class={overflow ? 'flex shrink-0 *:w-full *:min-w-0' : 'flex grow min-w-[360px]'}
          style={overflow ? `width: ${slotWidth}px;` : undefined}>
          {@render card(cardValue)}
        </div>
      {/each}
    </div>
  </div>

  <button
    id="right"
    onclick={scrollRight}
    aria-label="Scroll right"
    class="{navButtonClass} right-0 {overflow ? 'translate-x-1/2' : ''}"
    class:opacity-0={!canScrollRight}
    class:opacity-100={canScrollRight}
    class:pointer-events-none={!canScrollRight}>

    {#if overflow}
      <span class={navFillClass}><Icon class={navIconClass} icon={faChevronRight} /></span>
    {:else}
      <div class="h-8 w-8 z-20 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] transition-opacity duration-200 rounded-full flex items-center justify-center">
        <Icon class={navIconClass} icon={faChevronRight} />
      </div>
    {/if}
  </button>
</div>
