<script lang="ts">
import { Button } from '@podman-desktop/ui-svelte';

import IconImage from '/@/lib/appearance/IconImage.svelte';
import ProviderWidgetStatus from '/@/lib/statusbar/ProviderWidgetStatus.svelte';
import type { ProviderInfo } from '/@api/provider-info';

interface Props {
  provider: ProviderInfo;
  onclick: () => void;
  class?: string;
}

let { provider, onclick, class: className }: Props = $props();
</script>

<Button
  on:click={onclick}
  class="rounded-none gap-1 flex h-full min-w-fit items-center hover:bg-[var(--pd-statusbar-hover-bg)] hover:cursor-pointer relative text-base text-[var(--pd-button-text)] bg-transparent {className}"
  aria-label={provider.name}
  padding="px-2 py-1">
  {#if provider.containerConnections.length > 0 || provider.kubernetesConnections.length > 0 || provider.status }
    <ProviderWidgetStatus entry={provider} />
  {/if}
  {#if provider.images.icon}
    <IconImage image={provider.images.icon} class="max-h-3 grayscale" alt={provider.name}></IconImage>
  {/if}
  {#if provider.name}
    <span class="whitespace-nowrap h-fit">{provider.name}</span>
  {/if}
</Button>
