<script lang="ts">
import { type LayoutEditItem, LayoutEditor, NavPage, tablePersistenceCallbacks } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import {
  convertFromLayoutEditItems,
  dashboardPageRegistry,
  fetchDashboardPageRegistries,
  getDefaultSectionNames,
  resetDashboardPageRegistries,
  type DashboardPageRegistryEntry,
} from '../../stores/dashboard/dashboard-page-registry';
import NotificationsBox from './NotificationsBox.svelte';

// Dashboard section configuration managed by dashboard page registry
let dashboardSections: LayoutEditItem[] = [];
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
      return loadedItems.map((item: LayoutEditItem) => ({
        ...item,
        originalOrder: item.originalOrder ?? defaultItems.find(d => d.id === item.id)?.originalOrder ?? 0,
      }));
    }
  }
  return getDefaultDashboardItems();
}

// Save configuration (like Table.svelte does)
async function saveDashboardConfiguration(items: LayoutEditItem[]): Promise<void> {
  if ($tablePersistenceCallbacks) {
    await $tablePersistenceCallbacks.save('dashboard', items);
  }
}

// Initialize dashboard on mount
onMount(async () => {
  await initializeDashboard();
});

// Save configuration whenever dashboardSections changes (after initialization, but not during reset)
$: if (isInitialized && !isResetting && dashboardSections.length > 0) {
  // Convert back to registry entries and update the registry
  const updatedEntries = convertFromLayoutEditItems(dashboardSections, $dashboardPageRegistry);
  dashboardPageRegistry.set(updatedEntries);
  
  // Save using the persistence callbacks (system handles default value filtering)
  saveDashboardConfiguration(dashboardSections).catch((error: unknown) => {
    console.error('Failed to save dashboard configuration:', error);
  });
}

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

// Filter and sort dashboard registry items based on LayoutEditor configuration
$: sortedDashboardRegistry = dashboardSections
  .filter(section => section.enabled)
  .map(section => $dashboardPageRegistry.find(item => item.id === section.id))
  .filter((item): item is DashboardPageRegistryEntry => item !== undefined && item.component !== undefined);
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
