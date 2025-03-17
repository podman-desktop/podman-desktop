<script lang="ts">
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { Snippet } from 'svelte';
import { fade, slide } from 'svelte/transition';
import Fa from 'svelte-fa';

interface Props {
  expanded?: boolean;
  initialized?: boolean;
  title?: Snippet;
  children?: Snippet;
  onclick?: (expanded: boolean) => void;
}
let {
  expanded = $bindable(true),
  initialized = $bindable(true),
  title = undefined,
  children = undefined,
  onclick,
}: Props = $props();

function toggle(): void {
  expanded = !expanded;
  onclick?.(expanded);
}
</script>

<div class="flex flex-col w-full gap-2">
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
  <div role="region" transition:slide={{ duration: 250 }}>
    <div transition:fade={{ duration: 250 }}>
      {@render children?.()}
    </div>
  </div>
{/if}
{/if}
</div>
