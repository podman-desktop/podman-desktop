<script lang="ts">
import { type LayoutEditItem, LayoutEditor, NavPage } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import ProviderConfiguring from '/@/lib/dashboard/ProviderConfiguring.svelte';
import ExtensionBanners from '/@/lib/recommendation/ExtensionBanners.svelte';
import type { LayoutCallbacks } from '/@api/layout-registry-info';

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

// Dashboard default sections
const defaultSections = ['release-notes', 'extension-banners', 'learning-center', 'providers'];

// Dashboard section configuration managed by layout service
let dashboardSections: LayoutEditItem[] = [];
let isInitialized = false;
let layoutCallbacks: LayoutCallbacks;

onMount(async () => {
  // Create layout callbacks and load configuration
  layoutCallbacks = createLayoutCallbacks('dashboard', defaultSections);

  // Load dashboard configuration using layout service
  dashboardSections = await layoutCallbacks.onLoad();
  isInitialized = true;
});

// Save configuration whenever dashboardSections changes (after initialization)
$: if (isInitialized && dashboardSections.length > 0 && layoutCallbacks) {
  layoutCallbacks.onSave(dashboardSections).catch((error: unknown) => {
    console.error('Failed to save dashboard configuration:', error);
  });
}

// Reset function for dashboard layout
async function resetDashboardLayout(): Promise<void> {
  if (layoutCallbacks) {
    dashboardSections = await layoutCallbacks.onReset();
  }
}

// Helper function to check if a section should be visible
function isSectionVisible(sectionId: string): boolean {
  const item = dashboardSections.find(item => item.id === sectionId);
  return item?.enabled ?? true;
}

$: sortedSections = dashboardSections.filter(item => item.enabled);
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
  {#snippet additionalActions()}
    <LayoutEditor
      bind:items={dashboardSections}
      title="Configure Dashboard Sections"
      enableReorder={true}
      enableToggle={true}
      onReset={resetDashboardLayout}
      resetButtonLabel="Reset Layout"
    />
  {/snippet}
  
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

        <!-- Render sections in the order specified by layout configuration -->
        {#each sortedSections as section (section.id)}
          {#if section.id === 'release-notes' && isSectionVisible('release-notes')}
            <ReleaseNotesBox />
          {:else if section.id === 'extension-banners' && isSectionVisible('extension-banners')}
            <ExtensionBanners />
          {:else if section.id === 'learning-center' && isSectionVisible('learning-center')}
            <LearningCenter />
          {:else if section.id === 'providers' && isSectionVisible('providers')}
            <!-- Consolidated Providers Section - showing all provider states grouped together -->
            
            <!-- Ready Providers (highest priority) -->
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
          {/if}
        {/each}
      </div>
    </div>
  </div>
  {/snippet}
</NavPage>
