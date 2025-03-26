<script lang="ts">
import Carousel from './Carousel.svelte';

interface Item {
  content: string;
}
</script>


{#snippet card(item: Item)}
  <p>{item.content}</p>
{/snippet}

<div>
  <p class="text-lg first-letter:uppercase font-bold pb-5">Learning center:</p>
  <div class="bg-[var(--pd-content-card-bg)] p-4 rounded-lg">
    <Carousel cards={['card 1', 'card 2', 'card 3'].map((value) => ({ content: value }))} {card} cardWidth={340} />
  </div>
</div>
