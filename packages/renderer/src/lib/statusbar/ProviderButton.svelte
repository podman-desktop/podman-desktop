<script lang="ts">
import type { Snippet } from 'svelte';

import IconImage from '/@/lib/appearance/IconImage.svelte';
import ProviderWidgetStatus from '/@/lib/statusbar/ProviderWidgetStatus.svelte';
import type { ProviderInfo } from '/@api/provider-info';

interface Props {
  provider: ProviderInfo;
  onclick: () => void;
  class?: string;
  left?: Snippet<[]>;
}

let { provider, onclick, left, class: className }: Props = $props();
</script>

<button
  on:click={onclick}
  class="px-1 py-px flex flex-row h-full items-center gap-1 min-w-fit hover:bg-[var(--pd-statusbar-hover-bg)] hover:cursor-pointer relative {className}"
  aria-label={provider.name}>
  {@render left?.()}
  {#if provider.containerConnections.length > 0 || provider.kubernetesConnections.length > 0 || provider.status }
    <ProviderWidgetStatus entry={provider} />
  {/if}
  {#if provider.images.icon}
    <IconImage image={provider.images.icon} class="max-h-3 grayscale" alt={provider.name}></IconImage>
  {/if}
  {#if provider.name}
    <span class="whitespace-nowrap h-fit">{provider.name}</span>
  {/if}
</button>
