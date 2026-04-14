<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';
import type { Snippet } from 'svelte';

import IconImage from '/@/lib/appearance/IconImage.svelte';

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

let classes = $derived(`max-h-[15px] grayscale ${providerStatus === 'stopped' ? 'brightness-50' : ''}`);
</script>

<button
  onclick={onclick}
  class="px-1 py-px flex flex-row h-full items-center gap-1 min-w-fit hover:bg-[var(--pd-statusbar-hover-bg)] hover:cursor-pointer relative {className}"
  aria-label={provider.name}>
  {@render left?.()}
  {#if provider.images.icon}
    <div class="relative flex h-full items-center">
    {#if typeof provider.images.icon !== 'string' && provider.images.icon.fontId}
      <IconImage class={classes} alt={provider.name}>
        <span role="img" class="podman-desktop-icon-{provider.images.icon.fontId}"></span>
      </IconImage>
    {:else if provider.images.icon}
      <IconImage image={provider.images.icon} class={classes} alt={provider.name}></IconImage>
    {/if}
    <ProviderButtonStatus status={providerStatus} />
    </div>
  {/if}
  {#if provider.name}
    <span class="whitespace-nowrap h-fit">{provider.name}</span>
  {/if}
</button>
