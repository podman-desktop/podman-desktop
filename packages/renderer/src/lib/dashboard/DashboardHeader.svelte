<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  title: string;
  // right-aligned controls, e.g. the dashboard layout menu
  actions?: Snippet;
}

let { title, actions }: Props = $props();
</script>

<div class="flex flex-row items-center justify-between pt-[9px] pb-[12px]" role="region" aria-label="header">
  <h1 class="font-extralight text-[27px] tracking-[0.03em] text-(--pd-content-header) select-none">{title}</h1>
  <div class="flex items-center pr-1 text-(--pd-content-text)" role="group" aria-label="additionalActions">
    {@render actions?.()}
  </div>
</div>
