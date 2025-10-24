<script lang="ts">
import { ListOrganizer, type ListOrganizerItem, NavPage, tablePersistence } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import {
  convertFromListOrganizerItems,
  dashboardPageRegistry,
  type DashboardPageRegistryEntry,
  defaultSectionNames,
  setupDashboardPageRegistry,
} from '../../stores/dashboard/dashboard-page-registry.svelte';
import NotificationsBox from './NotificationsBox.svelte';

// Dashboard section configuration managed by dashboard page registry
let dashboardSections = $state<ListOrganizerItem[]>([]);
// eslint-disable-next-line svelte/no-unnecessary-state-wrap
let dashboardOrdering = $state(new SvelteMap<string, number>());
let isInitialized = false;
let isLoading = false;

let orderedSections = $derived(getOrderedDashboardSections());
let updatedEntries = $derived(convertFromListOrganizerItems(orderedSections, dashboardPageRegistry.entries));

// Initialize default dashboard configuration
function getDefaultDashboardItems(): ListOrganizerItem[] {
  return dashboardPageRegistry.entries.map(entry => ({
    id: entry.id,
    label: entry.id,
    enabled: true,
    originalOrder: entry.originalOrder,
  }));
}

// Initialize dashboard configuration
async function initializeDashboard(): Promise<void> {
  if (isInitialized || isLoading) return;

  isLoading = true;
  try {
    if (dashboardPageRegistry.entries.length > 0) {
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
async function loadDashboardConfiguration(): Promise<ListOrganizerItem[]> {
  if (tablePersistence.storage) {
    const loadedItems = await tablePersistence.storage.load('dashboard', defaultSectionNames);

    if (loadedItems.length > 0) {
      // Ensure loaded items have proper originalOrder from defaults if missing
      const defaultItems = getDefaultDashboardItems();
      const items = loadedItems.map((item: ListOrganizerItem) => ({
        ...item,
        originalOrder: item.originalOrder ?? defaultItems.find(d => d.id === item.id)?.originalOrder ?? 0,
      }));

      // Build ordering map from loaded items
      // Check if items are in a different order than their original order
      const isReordered = items.some((item: ListOrganizerItem, index: number) => item.originalOrder !== index);
      if (isReordered) {
        const ordering = new SvelteMap<string, number>();
        items.forEach((item: ListOrganizerItem, index: number) => {
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
function getOrderedDashboardSections(): ListOrganizerItem[] {
  if (dashboardOrdering.size === 0) {
    return dashboardSections;
  }
  return [...dashboardSections].toSorted((a, b) => {
    const aOrder = dashboardOrdering.get(a.id) ?? a.originalOrder;
    const bOrder = dashboardOrdering.get(b.id) ?? b.originalOrder;
    return aOrder - bOrder;
  });
}

// Save configuration (like Table.svelte does)
async function saveDashboardConfiguration(): Promise<void> {
  if (tablePersistence.storage) {
    const orderedItems = getOrderedDashboardSections();
    const serializableItems = orderedItems.map(item => ({
      id: item.id,
      label: item.label,
      enabled: item.enabled,
      originalOrder: item.originalOrder,
    }));

    await tablePersistence.storage.save('dashboard', serializableItems);
  }
}

// Initialize dashboard on mount
onMount(async () => {
  await initializeDashboard();
});

// Save configuration whenever dashboardSections or ordering changes
$effect(() => {
  if (isInitialized && dashboardSections.length > 0) {
    dashboardPageRegistry.entries = updatedEntries;
  }
});

// Reset function for dashboard layout
async function resetDashboardLayout(): Promise<void> {
  if (tablePersistence.storage) {
    try {
      // Reset using the persistence callbacks (clears saved config)
      dashboardSections = await tablePersistence.storage.reset('dashboard', defaultSectionNames);
      dashboardOrdering.clear();

      // Reset the registry to default state
      setupDashboardPageRegistry();

      // Ensure the registry reflects the reset state
      if (dashboardPageRegistry.entries.length > 0) {
        const updatedEntries = convertFromListOrganizerItems(dashboardSections, dashboardPageRegistry.entries);
        dashboardPageRegistry.entries = updatedEntries;
      }
    } catch (error: unknown) {
      console.error('Failed to reset dashboard layout:', error);
    }
  }
}

// Handle dashboard order changes from ListOrganizer
function handleDashboardOrderChange(newOrdering: SvelteMap<string, number>): void {
  dashboardOrdering = new SvelteMap(newOrdering);

  // Save configuration immediately when order changes
  saveDashboardConfiguration().catch((error: unknown) => {
    console.error('Failed to save dashboard configuration after order change:', error);
  });
}

// Handle dashboard section toggle changes from LayoutEditor
function handleDashboardToggle(itemId: string, enabled: boolean): void {
  dashboardSections = dashboardSections.map(item => (item.id === itemId ? { ...item, enabled } : item));

  // Save configuration immediately when toggle changes
  saveDashboardConfiguration().catch((error: unknown) => {
    console.error('Failed to save dashboard configuration after toggle change:', error);
  });
}

// Filter and sort dashboard registry items based on LayoutEditor configuration
let sortedDashboardRegistry = $derived.by(() => {
  // Get ordered sections inline to ensure reactivity
  const orderedSections =
    dashboardOrdering.size === 0
      ? [...dashboardSections]
      : [...dashboardSections].toSorted((a, b) => {
          const aOrder = dashboardOrdering.get(a.id) ?? a.originalOrder;
          const bOrder = dashboardOrdering.get(b.id) ?? b.originalOrder;
          return aOrder - bOrder;
        });

  const result = orderedSections
    .filter(section => section.enabled)
    .map(section => dashboardPageRegistry.entries.find(item => item.id === section.id))
    .filter((item): item is DashboardPageRegistryEntry => item?.component !== undefined);

  return result;
});
</script>

<NavPage searchEnabled={false} title="Dashboard">
  {#snippet additionalActions()}
    <ListOrganizer
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
        {#each sortedDashboardRegistry as dashboardRegistryItem (dashboardRegistryItem.id)}
          <dashboardRegistryItem.component />
        {/each}
      </div>
    </div>
  </div>
  {/snippet}
</NavPage>
