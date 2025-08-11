<script lang="ts" generics="T">
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { onDestroy, onMount, type Snippet } from 'svelte';

import Icon from '../icons/Icon.svelte';

interface Props<T> {
  cards: T[];
  cardWidth?: number;
  card: Snippet<[T]>;
}
let { cards, card, cardWidth = 350 }: Props<T> = $props();

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

// Calculate total width of all cards
const totalCardsWidth = $derived(cards.length * cardWidth + (cards.length - 1) * GAP);

// Check if we can scroll left or right
const canScrollLeft = $derived(scrollPosition > 0);
const canScrollRight = $derived(scrollPosition < maxScroll);

function updateScrollLimits(): void {
  maxScroll = Math.max(0, totalCardsWidth - containerWidth);
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
  const scrollAmount = cardWidth + GAP;
  scrollToPosition(scrollPosition - scrollAmount);
}

function scrollRight(): void {
  const scrollAmount = cardWidth + GAP;
  scrollToPosition(scrollPosition + scrollAmount);
}

function handleWheel(event: WheelEvent): void {
  event.preventDefault();
  const scrollAmount = event.deltaY > 0 ? 100 : -100;
  scrollToPosition(scrollPosition + scrollAmount);
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

<div class="flex flex-row items-center relative">
  <button
    id="left"
    onclick={scrollLeft}
    aria-label="Scroll left"
    class="absolute h-full w-12 z-20 flex items-center justify-center"
    class:opacity-0={!canScrollLeft}
    class:opacity-100={canScrollLeft}
    class:pointer-events-none={!canScrollLeft}>

    <div class="h-8 w-8 z-20 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] transition-opacity duration-200 rounded-full flex items-center justify-center">
      <Icon class="w-4 h-4" icon={faChevronLeft} />
    </div>
  </button>

  <!-- Left edge shadow for partially visible cards -->
  {#if canScrollLeft}
    <div 
      class="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--pd-content-card-bg)] to-[var(--pd-content-card-border)/1] pointer-events-none z-10 w-[60px]">
    </div>
  {/if}

  <div 
    id="carousel-cards-{containerId}" 
    role="carousel-cards-{containerId}"
    class="flex grow overflow-hidden relative cursor-grab select-none"
    class:cursor-grabbing={isDragging}
    onmousedown={handleMouseDown}
    onwheel={handleWheel}>
    
    <!-- Scrollable container with all cards -->
    <div 
      class="flex gap-3 transition-transform duration-300 ease-out"
      style="transform: translateX(-{scrollPosition}px);">
      {#each cards as cardValue (cardValue)}
        <div style="width: {cardWidth}px; flex-shrink: 0;">
          {@render card(cardValue)}
        </div>
      {/each}
    </div>

    <!-- Right edge shadow for partially visible cards -->
    {#if canScrollRight}
      <div 
        class="absolute top-0 right-0 h-full bg-gradient-to-l from-[var(--pd-content-card-bg)] to-[var(--pd-content-card-border)/1] pointer-events-none z-10 w-[60px]">
      </div>
    {/if}
  </div>

  <button
    id="right"
    onclick={scrollRight}
    aria-label="Scroll right"
    class="absolute h-full w-12 right-0 z-20 flex items-center justify-center"
    class:opacity-0={!canScrollRight}
    class:opacity-100={canScrollRight}
    class:pointer-events-none={!canScrollRight}>

    <div class="h-8 w-8 z-20 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] transition-opacity duration-200 rounded-full flex items-center justify-center">
      <Icon class="w-4 h-4" icon={faChevronRight} />
    </div>
  </button>
</div>
