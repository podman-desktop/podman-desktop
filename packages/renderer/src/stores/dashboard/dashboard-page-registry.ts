/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import type { LayoutEditItem } from '@podman-desktop/ui-svelte';
import { type Writable, writable } from 'svelte/store';

import { EventStore } from '/@/stores/event-store';

import { createExtensionBanners } from './dashboard-page-registry-extension-banners.svelte';
import { createLearningCenter } from './dashboard-page-registry-learning-center.svelte';
import { createProviders } from './dashboard-page-registry-providers.svelte';
import { createReleaseNotesBox } from './dashboard-page-registry-release-notes.svelte';

export interface DashboardPageRegistryEntry {
  id: string;
  hidden?: boolean;
  originalOrder: number;
  component?: unknown;
}

const windowEvents: string[] = [];
const windowListeners = ['extensions-already-started', 'system-ready'];

export const dashboardPageRegistry: Writable<DashboardPageRegistryEntry[]> = writable([]);

let values: DashboardPageRegistryEntry[] = [];
let initialized = false;

const init = (): void => {
  values.push(createReleaseNotesBox());
  values.push(createExtensionBanners());
  values.push(createLearningCenter());
  values.push(createProviders());
};

// use helper here as window methods are initialized after the store in tests
const grabList = async (): Promise<DashboardPageRegistryEntry[]> => {
  if (!initialized) {
    init();
    initialized = true;
  }

  return values;
};

export const dashboardPageRegistryEventStore = new EventStore<DashboardPageRegistryEntry[]>(
  'dashboard-page-registry',
  dashboardPageRegistry,
  // should initialize when app is initializing
  () => Promise.resolve(true),
  windowEvents,
  windowListeners,
  grabList,
);
const dashboardPageRegistryEventStoreInfo = dashboardPageRegistryEventStore.setup();

export const fetchDashboardPageRegistries = async (): Promise<void> => {
  await dashboardPageRegistryEventStoreInfo.fetch();
};

export const resetDashboardPageRegistries = async (): Promise<void> => {
  // Reset to initial state
  values = [];
  initialized = false;

  // Re-initialize with default values
  init();

  // Update the store
  dashboardPageRegistry.set(values);
};

// Get default section names in their original order from the registry
export const getDefaultSectionNames = (): string[] => {
  // Create a temporary registry to get the default values
  const tempValues: DashboardPageRegistryEntry[] = [];
  tempValues.push(createReleaseNotesBox());
  tempValues.push(createExtensionBanners());
  tempValues.push(createLearningCenter());
  tempValues.push(createProviders());

  // Sort by original order and return the IDs
  return tempValues.toSorted((a, b) => a.originalOrder - b.originalOrder).map(entry => entry.id);
};

// Helper function to convert dashboard registry entries to LayoutEditItems
export function convertToLayoutEditItems(entries: DashboardPageRegistryEntry[]): LayoutEditItem[] {
  return entries.map(entry => ({
    id: entry.id,
    label: entry.id, // Layout-registry will handle formatting
    enabled: !entry.hidden, // enabled is opposite of hidden
    originalOrder: entry.originalOrder,
  }));
}

// Helper function to convert LayoutEditItems back to dashboard registry entries
export function convertFromLayoutEditItems(
  items: LayoutEditItem[],
  originalEntries: DashboardPageRegistryEntry[],
): DashboardPageRegistryEntry[] {
  return items.map(item => {
    const originalEntry = originalEntries.find(entry => entry.id === item.id);
    return {
      id: item.id,
      hidden: !item.enabled, // hidden is opposite of enabled
      originalOrder: originalEntry?.originalOrder ?? 0, // Keep original registration order
      component: originalEntry?.component,
    };
  });
}
