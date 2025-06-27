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
// eslint-disable-next-line sonarjs/pseudo-random
const containerId = Math.random().toString(36).slice(-6);

const visibleCards = $derived(cards.slice(0, cardsFit));

function calcCardsToFit(width: number): number {
  const cf = Math.floor(width / cardWidth);
  return cf === 0 ? 1 : cf;
}

function update(entries: ResizeObserverEntry[]): void {
  const width = entries[0].contentRect.width;
  cardsFit = calcCardsToFit(width);
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
  cards = [cards[cards.length - 1], ...cards.slice(0, cards.length - 1)];
}

function rotateRight(): void {
  cards = [...cards.slice(1, cards.length), cards[0]];
}
</script>

<div class="flex flex-row items-center">
  <button
    id="left"
    onclick={rotateLeft}
    aria-label="Rotate left"
    class="h-8 w-8 mr-3 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] rounded-full disabled:bg-[var(--pd-content-card-carousel-disabled-nav)]"
    disabled={visibleCards.length === cards.length}>
    <Icon class="w-8 h-8" icon={faChevronLeft} />
  </button>

  <div id="carousel-cards-{containerId}" class="flex grow gap-3 overflow-hidden">
    {#each visibleCards as cardValue, index (index)}
    {@render card(cardValue)}
    {/each}
  </div>

  <button
    id="right"
    onclick={rotateRight}
    aria-label="Rotate right"
    class="h-8 w-8 ml-3 bg-[var(--pd-content-card-carousel-nav)] hover:bg-[var(--pd-content-card-carousel-hover-nav)] rounded-full disabled:bg-[var(--pd-content-card-carousel-disabled-nav)]"
    disabled={visibleCards.length === cards.length}>
    <Icon class="h-8 w-8" icon={faChevronRight} />
  </button>
</div>
