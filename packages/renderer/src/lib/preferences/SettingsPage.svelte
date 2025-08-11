<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  title: string;
  subtitle?: Snippet;
  actions?: Snippet;
  header?: Snippet;
  children?: Snippet;
}

let { title, subtitle, actions, header, children }: Props = $props();
</script>

<div class="flex flex-col min-w-full h-full" role="region" aria-label={title}>
  <div class="min-w-full px-5 py-4" role="region" aria-label="Header">
    <div class="flex flex-row">
      <div class="grow">
        <div
          class="capitalize text-xl font-bold text-[color:var(--pd-invert-content-header-text)] pt-[3px]"
          role="heading"
          aria-level="1"
          aria-label="Title">
          {title}
        </div>
        <div
          class="text-[color:var(--pd-invert-content-header2-text)]"
          role="heading"
          aria-level="2"
          aria-label="Subtitle">
          {#if subtitle}{@render subtitle()}{:else}<br />{/if}
        </div>
      </div>
      {@render actions?.()}
    </div>

    {@render header?.()}
  </div>
  <div class="flex flex-row min-w-full h-full px-5 py-4 overflow-y-auto" role="region" aria-label="Content">
    <div class="flex flex-col grow max-w-[905px] mx-auto">
      {@render children?.()}
    </div>
  </div>
</div>
