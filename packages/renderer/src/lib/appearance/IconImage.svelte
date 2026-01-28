<script lang="ts">
import type { Snippet } from 'svelte';

import { AppearanceUtil } from './appearance-util';

interface Props {
  image?: string | { light: string; dark: string };
  alt?: string;
  class?: string;
  children?: Snippet;
}

let { image, alt, class: className = '', children }: Props = $props();

const appearanceUtil = new AppearanceUtil();
let imgSrc: string | undefined = $derived(await appearanceUtil.getImage(image));
</script>

{#if imgSrc}
  <img src={imgSrc} alt={alt} class={className} />
{:else}
  {@render children?.()}
{/if}
