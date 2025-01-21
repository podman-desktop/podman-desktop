<script lang="ts">
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { Snippet } from 'svelte';
import Fa from 'svelte-fa';

import { fadeSlide } from '../utils/animations';

let {
  expanded = $bindable(true),
  initialized = $bindable(true),
  title = undefined,
  children = undefined,
  onclick,
}: {
  expanded?: boolean;
  initialized?: boolean;
  title?: Snippet;
  children?: Snippet;
  onclick?: (expanded: boolean) => void;
} = $props();

function toggle(): void {
  expanded = !expanded;
  onclick?.(expanded);
}
</script>

<div class="flex flex-col w-full">
  <button onclick={(): void => toggle()} aria-expanded="{expanded}">
    <div class="flex flex-row space-x-1 items-center">
      {#if expanded}
        <Fa class="w-4" icon={faChevronDown} />
      {:else}
        <Fa class="w-4" icon={faChevronRight} />
      {/if}
      {@render title?.()}
    </div>
  </button>
{#if initialized}
{#if expanded}
  <div role="region" class="pt-5" transition:fadeSlide={{ duration: 250 }}>
    {@render children?.()}
  </div>
{/if}
{/if}
</div>