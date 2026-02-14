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

import type { ListOrganizerItem } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';

import { createSystemOverview } from '/@/stores/dashboard/dashboard-page-registry-system-overview';

import { createExploreFeatures } from './dashboard-page-registry-explore-features';
import { createExtensionBanners } from './dashboard-page-registry-extension-banners.svelte';
import { createLearningCenter } from './dashboard-page-registry-learning-center.svelte';
import { createProviders } from './dashboard-page-registry-providers.svelte';
import { createReleaseNotesBox } from './dashboard-page-registry-release-notes.svelte';

export interface DashboardPageRegistryEntry {
  id: string;
  hidden?: boolean;
  originalOrder: number;
  component?: Component;
}

export const dashboardPageRegistry = $state<{ entries: DashboardPageRegistryEntry[] }>({ entries: [] });

const enhancedDashboard = $state<{ enabled: boolean }>({ enabled: false });

function getDashboardPageRegistry(): DashboardPageRegistryEntry[] {
  const providers = !enhancedDashboard.enabled ? [createProviders()] : [];
  const systemOverview = enhancedDashboard.enabled ? [createSystemOverview()] : [];
  return [
    createReleaseNotesBox(),
    ...systemOverview,
    createExtensionBanners(),
    createExploreFeatures(),
    createLearningCenter(),
    ...providers,
  ];
}

setupDashboardPageRegistry().catch((error: unknown) => {
  console.error(`Failed to setup dashboard page registry: ${error}`);
});

window.events?.receive('enhanced-dashboard-enabled', (value: unknown) => {
  if (typeof value === 'boolean') {
    enhancedDashboard.enabled = value;
    setupDashboardPageRegistry().catch((error: unknown) => {
      console.error(`Failed to setup dashboard page registry: ${error}`);
    });
  }
});

export async function setupDashboardPageRegistry(): Promise<void> {
  enhancedDashboard.enabled = await window.isExperimentalConfigurationEnabled('dashboard.enhancedDashboard');
  dashboardPageRegistry.entries = getDashboardPageRegistry();
}

// Get default section names in their registry order
export const defaultSection: { names: string[] } = $state({ names: getDashboardPageRegistry().map(entry => entry.id) });

// Helper function to convert ListOrganizerItems back to dashboard registry entries
export function convertFromListOrganizerItems(
  items: ListOrganizerItem[],
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
