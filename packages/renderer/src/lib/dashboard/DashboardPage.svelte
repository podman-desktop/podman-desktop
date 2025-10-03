<script lang="ts">
import { LayoutEditor, NavPage, tablePersistenceCallbacks } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import type { LayoutEditItem } from '/@api/layout-registry-info';

import { providerInfos } from '../../stores/providers';
import ExploreFeatures from '../explore-features/ExploreFeatures.svelte';
import LearningCenter from '../learning-center/LearningCenter.svelte';
import NotificationsBox from './NotificationsBox.svelte';

// Dashboard section configuration managed by dashboard page registry
let dashboardSections = $state<LayoutEditItem[]>([]);
let dashboardOrdering = new SvelteMap<string, number>();
let isInitialized = false;
let isLoading = false;
let isResetting = false;

// Initialize default dashboard configuration
function getDefaultDashboardItems(): LayoutEditItem[] {
  return $dashboardPageRegistry.map((entry, index) => ({
    id: entry.id,
    label: entry.id, // Layout-registry will handle formatting
    enabled: true,
    originalOrder: index,
  }));
}

// Initialize dashboard configuration
async function initializeDashboard(): Promise<void> {
  if (isInitialized || isLoading) return;

  isLoading = true;
  try {
    // Initialize dashboard page registry first
    await fetchDashboardPageRegistries();

    if ($dashboardPageRegistry.length > 0) {
      const loadedItems = await loadDashboardConfiguration();
      dashboardSections = loadedItems;
    }
    isInitialized = true;
  } catch (error: unknown) {
    console.error('Failed to load dashboard configuration:', error);
    // Fallback to default configuration
    dashboardSections = getDefaultDashboardItems();
    isInitialized = true;
  } finally {
    isLoading = false;
  }
}

// Load configuration from settings (like Table.svelte does)
async function loadDashboardConfiguration(): Promise<LayoutEditItem[]> {
  if ($tablePersistenceCallbacks) {
    const sectionNames = getDefaultSectionNames();
    const loadedItems = await $tablePersistenceCallbacks.load('dashboard', sectionNames);

    if (loadedItems.length > 0) {
      // Ensure loaded items have proper originalOrder from defaults if missing
      const defaultItems = getDefaultDashboardItems();
      const items = loadedItems.map((item: LayoutEditItem) => ({
        ...item,
        originalOrder: item.originalOrder ?? defaultItems.find(d => d.id === item.id)?.originalOrder ?? 0,
      }));

      // Build ordering map from loaded items
      // Check if items are in a different order than their original order
      const isReordered = items.some((item: LayoutEditItem, index: number) => item.originalOrder !== index);
      if (isReordered) {
        const ordering = new SvelteMap<string, number>();
        items.forEach((item: LayoutEditItem, index: number) => {
          ordering.set(item.id, index);
        });
        dashboardOrdering = ordering;
      } else {
        dashboardOrdering.clear();
      }

      return items;
    }
  }
  return getDefaultDashboardItems();
}

// Get ordered dashboard sections based on current ordering
function getOrderedDashboardSections(): LayoutEditItem[] {
  if (dashboardOrdering.size === 0) {
    return [...dashboardSections].sort((a, b) => a.originalOrder - b.originalOrder);
  }
  return [...dashboardSections].sort((a, b) => {
    const aOrder = dashboardOrdering.get(a.id) ?? a.originalOrder;
    const bOrder = dashboardOrdering.get(b.id) ?? b.originalOrder;
    return aOrder - bOrder;
  });
}

// Save configuration (like Table.svelte does)
async function saveDashboardConfiguration(): Promise<void> {
  if ($tablePersistenceCallbacks) {
    const orderedItems = getOrderedDashboardSections();
    await $tablePersistenceCallbacks.save('dashboard', orderedItems);
  }
}

// Initialize dashboard on mount
onMount(async () => {
  await initializeDashboard();
});

// Save configuration whenever dashboardSections or ordering changes
$effect(() => {
  if (isInitialized && !isResetting && dashboardSections.length > 0) {
    // Convert back to registry entries and update the registry
    const orderedSections = getOrderedDashboardSections();
    const updatedEntries = convertFromLayoutEditItems(orderedSections, $dashboardPageRegistry);
    dashboardPageRegistry.set(updatedEntries);

    // Save using the persistence callbacks (system handles default value filtering)
    saveDashboardConfiguration().catch((error: unknown) => {
      console.error('Failed to save dashboard configuration:', error);
    });
  }
});

// Reset function for dashboard layout
async function resetDashboardLayout(): Promise<void> {
  if ($tablePersistenceCallbacks) {
    try {
      // Set resetting flag to prevent automatic saving during reset
      isResetting = true;

      // Get default section names from the registry (in original order)
      const defaultSections = getDefaultSectionNames();

      // Reset using the persistence callbacks (clears saved config)
      dashboardSections = await $tablePersistenceCallbacks.reset('dashboard', defaultSections);
      dashboardOrdering.clear();

      // Reset the registry to default state
      await resetDashboardPageRegistries();

      // Ensure the registry reflects the reset state
      if ($dashboardPageRegistry.length > 0) {
        const updatedEntries = convertFromLayoutEditItems(dashboardSections, $dashboardPageRegistry);
        dashboardPageRegistry.set(updatedEntries);
      }
    } finally {
      // Always clear the resetting flag
      isResetting = false;
    }
  }
}

// Handle dashboard order changes from LayoutEditor
function handleDashboardOrderChange(newOrdering: Map<string, number>): void {
  dashboardOrdering = new SvelteMap(newOrdering);
}

// Handle dashboard section toggle changes from LayoutEditor
function handleDashboardToggle(itemId: string, enabled: boolean): void {
  dashboardSections = dashboardSections.map(item => (item.id === itemId ? { ...item, enabled } : item));
}

// Filter and sort dashboard registry items based on LayoutEditor configuration
let sortedDashboardRegistry = $derived.by(() => {
  // Get ordered sections inline to ensure reactivity
  const orderedSections =
    dashboardOrdering.size === 0
      ? [...dashboardSections].sort((a, b) => a.originalOrder - b.originalOrder)
      : [...dashboardSections].sort((a, b) => {
          const aOrder = dashboardOrdering.get(a.id) ?? a.originalOrder;
          const bOrder = dashboardOrdering.get(b.id) ?? b.originalOrder;
          return aOrder - bOrder;
        });

  const result = orderedSections
    .filter(section => section.enabled)
    .map(section => $dashboardPageRegistry.find(item => item.id === section.id))
    .filter((item): item is DashboardPageRegistryEntry => item?.component !== undefined);

  return result;
});
</script>

<NavPage searchEnabled={false} title="Dashboard">
  {#snippet additionalActions()}
    <LayoutEditor
      items={dashboardSections}
      ordering={dashboardOrdering}
      title="Configure Dashboard Sections"
      enableReorder={true}
      enableToggle={true}
      onOrderChange={handleDashboardOrderChange}
      onToggle={handleDashboardToggle}
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

        <!-- Render sections dynamically using the dashboard registry (same pattern as navigation) -->
        {#each sortedDashboardRegistry as dashboardRegistryItem (dashboardRegistryItem.id)}
          <!-- svelte-ignore svelte_component_deprecated -->
          <svelte:component this={dashboardRegistryItem.component} />
        {/each}
      </div>
    </div>
  </div>
  {/snippet}
</NavPage>
