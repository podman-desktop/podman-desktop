<script lang="ts">
import type { Snippet } from 'svelte';

import IconImage from '/@/lib/appearance/IconImage.svelte';
import type { ProviderInfo } from '/@api/provider-info';

import ProviderButtonStatus from './ProviderButtonStatus.svelte';

interface Props {
  provider: ProviderInfo;
  onclick: () => void;
  class?: string;
  left?: Snippet<[]>;
}

let { provider, onclick, left, class: className }: Props = $props();

let providerStatus = $derived.by(() => {
  if (provider) {
    if (provider.updateInfo?.version) {
      return 'Update available';
    } else if (provider.containerConnections.length > 0) {
      return provider.containerConnections[0].status;
    } else if (provider.kubernetesConnections.length > 0) {
      return provider.kubernetesConnections[0].status;
    } else if (provider.vmConnections.length > 0) {
      return provider.vmConnections[0].status;
    } else {
      return provider.status;
    }
  } else {
    return 'unknown';
  }
});
</script>

<button
  onclick={onclick}
  class="px-1 py-px flex flex-row h-full items-center gap-1 min-w-fit hover:bg-[var(--pd-statusbar-hover-bg)] hover:cursor-pointer relative {className}"
  aria-label={provider.name}>
  {@render left?.()}
  {#if providerStatus === 'Update available'}
    <div aria-label="Connection Status Icon" class="max-h-3 fa-regular fa-circle-up"></div>    
  {/if}
  {#if provider.images.icon}
    <div class="relative flex h-full items-center">
      <IconImage image={provider.images.icon} class="max-h-3 grayscale {providerStatus === 'stopped' ? 'brightness-50' : ''}" alt={provider.name}></IconImage>
      <ProviderButtonStatus status={providerStatus} />
    </div>
  {/if}
  {#if provider.name}
    <span class="whitespace-nowrap h-fit">{provider.name}</span>
  {/if}
</button>
