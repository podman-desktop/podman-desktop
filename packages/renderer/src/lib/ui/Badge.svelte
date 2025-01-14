<script lang="ts">
import { onMount, type Snippet } from 'svelte';

import { AppearanceUtil } from '/@/lib/appearance/appearance-util';

interface Props {
  color?: string | { light: string; dark: string };
  label: string;
  children?: Snippet;
  class?: string;
}

let { color = 'bg-[var(--pd-badge-gray)]', label = '', class: className, children }: Props = $props();

let customStyle: string = $state('');
let customClass: string = $state('');

onMount(async () => {
  const appearanceUtil = new AppearanceUtil();

  // get the color
  let singleColor = await appearanceUtil.getImage(color);
  if (!singleColor) {
    singleColor = '';
  }

  if (singleColor?.startsWith('#')) {
    customStyle = `background-color: ${singleColor};`;
  } else {
    customClass = singleColor ?? '';
  }
});
</script>

<div class="text-[var(--pd-badge-text)] text-xs me-2 px-1 py-0.5 rounded select-none {customClass} {className}" style={customStyle}>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</div>
