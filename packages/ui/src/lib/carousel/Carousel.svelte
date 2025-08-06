<script lang="ts" generics="T">
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { onDestroy, onMount, type Snippet } from 'svelte';

import Icon from '../icons/Icon.svelte';

interface Props<T> {
  cards: T[];
  cardWidth?: number;
  card: Snippet<[T]>;
}
let { cards, card, cardWidth = 340 }: Props<T> = $props();

let resizeObserver: ResizeObserver;

let cardsFit = $state(1);
let startIndex = $state(0);
// eslint-disable-next-line sonarjs/pseudo-random
const containerId = Math.random().toString(36).slice(-6);

const visibleCards = $derived(cards.slice(startIndex, startIndex + cardsFit));
const previousPreviewCard = $derived(startIndex > 0 ? cards[startIndex - 1] : undefined);
const nextPreviewCard = $derived(startIndex + cardsFit < cards.length ? cards[startIndex + cardsFit] : undefined);

function calcCardsToFit(width: number): number {
  const cf = Math.floor(width / cardWidth);
  return cf === 0 ? 1 : cf;
}

function update(entries: ResizeObserverEntry[]): void {
  const width = entries[0].contentRect.width;
  cardsFit = calcCardsToFit(width);
  if (startIndex + cardsFit > cards.length) {
    startIndex = Math.max(0, cards.length - cardsFit);
  }
}

onMount(() => {
  const cardsContainer = document.getElementById(`carousel-cards-${containerId}`);
  const initialWidth = cardsContainer?.offsetWidth as number;
  cardsFit = calcCardsToFit(initialWidth);
  resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(cardsContainer as Element);
});

onDestroy(() => {
  resizeObserver.disconnect();
});

function rotateLeft(): void {
  if (startIndex > 0) {
    startIndex--;
  }
}

function rotateRight(): void {
  if (startIndex + cardsFit < cards.length) {
    startIndex++;
  }
}
</script>

<div class="flex flex-row items-center relative">
  <button
    id="left"
    onclick={rotateLeft}
    aria-label="Rotate left"
    class="absolute h-8 w-8 left-2 z-10 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] rounded-full"
    hidden={!previousPreviewCard}>
    <Icon class="w-8 h-8" icon={faChevronLeft} />
  </button>

  <div id="carousel-cards-{containerId}" class="flex grow overflow-hidden relative gap-3">
    <!-- Previous card preview (1/4 visible) -->
    {#if previousPreviewCard}
      <div 
        class="flex-shrink-0 overflow-hidden"
        style="width: {cardWidth / 4}px;"
      >
        <div style="width: {cardWidth}px; transform: translateX(-{cardWidth * 3/4}px);">
          {@render card(previousPreviewCard)}
        </div>
        <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--pd-content-card-border)] to-transparent pointer-events-none" style="width: {cardWidth/4}px;"></div>
      </div>
    {/if}

    <!-- Main visible cards -->
    <div class="flex gap-3">
      {#each visibleCards as cardValue, index (startIndex + index)}
        {@render card(cardValue)}
      {/each}
    </div>

    <!-- Next card preview (1/4 visible) -->
    {#if nextPreviewCard}
      <div 
        class="flex-shrink-0 overflow-hidden"
        style="width: {cardWidth / 4}px;"
      >
        <div style="width: {cardWidth}px; transform: translateX(0);">
          {@render card(nextPreviewCard)}
        </div>
        <div class="absolute top-0 right-0 h-full bg-gradient-to-l from-[var(--pd-content-card-border)] to-transparent pointer-events-none" style="width: {cardWidth/4}px;"></div>
      </div>
    {/if}
  </div>

  <button
    id="right"
    onclick={rotateRight}
    aria-label="Rotate right"
    class="absolute h-8 w-8 right-2 z-10 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] rounded-full"
    hidden={!nextPreviewCard}>
    <Icon class="h-8 w-8" icon={faChevronRight} />
  </button>
</div>
