<script lang="ts">
import Carousel from './Carousel.svelte';

let { overflow = false, cards = ['card 1', 'card 2', 'card 3'] }: { overflow?: boolean; cards?: string[] } = $props();
</script>


{#snippet card(cardItem: string)}
<p>{cardItem}</p>
{/snippet}

<div>
  <p class="text-lg first-letter:uppercase font-bold pb-5">Learning center:</p>
  <div class="bg-[var(--pd-content-card-bg)] p-4 rounded-lg">
    <Carousel {cards} {card} cardWidth={340} {overflow} />
  </div>
</div>
