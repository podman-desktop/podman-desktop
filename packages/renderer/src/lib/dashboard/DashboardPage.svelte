<script lang="ts">
import { NavPage } from '@podman-desktop/ui-svelte';
import { SvelteMap } from 'svelte/reactivity';

import ProviderConfiguring from '/@/lib/dashboard/ProviderConfiguring.svelte';
import ExtensionBanners from '/@/lib/recommendation/ExtensionBanners.svelte';

import { providerInfos } from '../../stores/providers';
import ExploreFeatures from '../explore-features/ExploreFeatures.svelte';
import LearningCenter from '../learning-center/LearningCenter.svelte';
import NotificationsBox from './NotificationsBox.svelte';
import ProviderConfigured from './ProviderConfigured.svelte';
import type { InitializationContext } from './ProviderInitUtils';
import { DoNothingMode } from './ProviderInitUtils';
import ProviderInstalled from './ProviderInstalled.svelte';
import ProviderNotInstalled from './ProviderNotInstalled.svelte';
import ProviderReady from './ProviderReady.svelte';
import ProviderStarting from './ProviderStarting.svelte';
import ProviderStopped from './ProviderStopped.svelte';
import ReleaseNotesBox from './ReleaseNotesBox.svelte';

const providerInitContexts = new SvelteMap<string, InitializationContext>();

$: providersNotInstalled = $providerInfos.filter(provider => provider.status === 'not-installed');
$: providersInstalled = $providerInfos.filter(provider => provider.status === 'installed');
$: providersConfiguring = $providerInfos.filter(provider => provider.status === 'configuring');
$: providersConfigured = $providerInfos.filter(provider => provider.status === 'configured');
$: providersReady = $providerInfos.filter(provider => provider.status === 'ready' || provider.status === 'started');
$: providersStarting = $providerInfos.filter(provider => provider.status === 'starting');
$: providersStopped = $providerInfos.filter(provider => provider.status === 'stopped');

function getInitializationContext(id: string): InitializationContext {
  let context: InitializationContext | undefined = providerInitContexts.get(id);

  if (!context) {
    context = { mode: DoNothingMode };
    providerInitContexts.set(id, context);
  }
  return context;
}
</script>

<NavPage searchEnabled={false} title="Dashboard">
  {#snippet content()}
  <div class="flex flex-col min-w-full h-full bg-[var(--pd-content-bg)] py-5">
    <div class="min-w-full flex-1">
      <NotificationsBox />
      <div class="px-5 space-y-5 h-full">
        <ReleaseNotesBox />
        <ExtensionBanners />
        <ExploreFeatures />
        <LearningCenter />
        <!-- Provider is ready display a box to indicate some information -->
        {#if providersReady.length > 0}
          {#each providersReady as providerReady (providerReady.internalId)}
            <ProviderReady provider={providerReady} />
          {/each}
        {/if}
        
        <!-- Starting Providers -->
        {#if providersStarting.length > 0}
          {#each providersStarting as providerStarting (providerStarting.internalId)}
            <ProviderStarting provider={providerStarting} />
          {/each}
        {/if}
        
        <!-- Configuring Providers -->
        {#if providersConfiguring.length > 0}
          {#each providersConfiguring as providerConfiguring (providerConfiguring.internalId)}
            <ProviderConfiguring
              provider={providerConfiguring}
              initializationContext={getInitializationContext(providerConfiguring.internalId)} />
          {/each}
        {/if}
        
        <!-- Configured Providers -->
        {#if providersConfigured.length > 0}
          {#each providersConfigured as providerConfigured (providerConfigured.internalId)}
            <ProviderConfigured
              provider={providerConfigured}
              initializationContext={getInitializationContext(providerConfigured.internalId)} />
          {/each}
        {/if}
        
        <!-- Installed Providers -->
        {#if providersInstalled.length > 0}
          {#each providersInstalled as providerInstalled (providerInstalled.internalId)}
            <ProviderInstalled
              provider={providerInstalled}
              initializationContext={getInitializationContext(providerInstalled.internalId)} />
          {/each}
        {/if}
        
        <!-- Not Installed Providers -->
        {#if providersNotInstalled.length > 0}
          {#each providersNotInstalled as providerNotInstalled (providerNotInstalled.internalId)}
            <ProviderNotInstalled provider={providerNotInstalled} />
          {/each}
        {/if}
        
        <!-- Stopped Providers -->
        {#if providersStopped.length > 0}
          {#each providersStopped as providerStopped (providerStopped.internalId)}
            <ProviderStopped provider={providerStopped} />
          {/each}
        {/if}
      </div>
    </div>
  </div>
  {/snippet}
</NavPage>
