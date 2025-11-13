<script lang="ts">
import { createBubbler } from 'svelte/legacy';

import { Input } from '..';

interface Props {
  title?: string;
  searchTerm?: string;
  oninput?: (event: Event) => void;
  class?: string;
  placeholder?: string;
}

const bubble = createBubbler();

let {
  title = '',
  searchTerm = $bindable(''),
  oninput = bubble('input'),
  class: className = '',
  placeholder,
}: Props = $props();

const appliedPlaceholder = $derived(placeholder ?? `Search ${title}...`);
const appliedAriaLabel = $derived(placeholder ? `Search: ${placeholder}` : `Search ${title}`);
</script>

<Input
  class={className}
  id="search-{title}"
  name="search-{title}"
  placeholder={appliedPlaceholder}
  bind:value={searchTerm}
  aria-label={appliedAriaLabel}
  clearable
  {oninput}>
  {#snippet left()}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4 mx-1 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  {/snippet}
</Input>
