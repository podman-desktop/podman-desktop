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
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  convertFromListOrganizerItems,
  dashboardPageRegistry,
  type DashboardPageRegistryEntry,
  defaultSection,
  setupDashboardPageRegistry,
} from './dashboard-page-registry.svelte';

// Mock the individual registry creation functions
vi.mock(import('/@/lib/recommendation/ExtensionBanners.svelte'));
vi.mock(import('/@/lib/learning-center/LearningCenter.svelte'));
vi.mock(import('/@/lib/dashboard/ProvidersSection.svelte'));
vi.mock(import('/@/lib/dashboard/ReleaseNotesBox.svelte'));
vi.mock(import('/@/lib/explore-features/ExploreFeatures.svelte'));

beforeEach(async () => {
  vi.resetAllMocks();
  vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(false);
});

describe('defaultSection', () => {
  test('should return section names in correct order when enhanced dashboard is disabled', async () => {
    await vi.waitFor(() => {
      expect(dashboardPageRegistry.entries).toHaveLength(5);
    });

    expect(defaultSection.names).toEqual([
      'Release Notes',
      'Extension Banners',
      'Explore Features',
      'Learning Center',
      'Providers',
    ]);
  });

  test('should return section names in correct order when enhanced dashboard is enabled', async () => {
    vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(true);
    await setupDashboardPageRegistry();

    // Now should have 4 items (without providers)
    await vi.waitFor(() => {
      expect(dashboardPageRegistry.entries).toHaveLength(4);
    });

    // Check the section names from the registry entries
    const sectionNames = dashboardPageRegistry.entries.map(entry => entry.id);
    expect(sectionNames).toEqual(['Release Notes', 'Extension Banners', 'Explore Features', 'Learning Center']);
  });
});

describe('convertFromListOrganizerItems', () => {
  test('should convert list organizer items back to dashboard registry entries', () => {
    const items: ListOrganizerItem[] = [
      {
        id: 'Release Notes',
        label: 'Release Notes',
        enabled: true,
        originalOrder: 0,
      },
      {
        id: 'Extension Banners',
        label: 'Extension Banners',
        enabled: false,
        originalOrder: 1,
      },
    ];

    const originalEntries: DashboardPageRegistryEntry[] = [
      {
        id: 'Release Notes',
        originalOrder: 0,
        component: 'ReleaseNotesBox' as unknown as Component,
      },
      {
        id: 'Extension Banners',
        originalOrder: 1,
        component: 'ExtensionBanners' as unknown as Component,
      },
    ];

    const result = convertFromListOrganizerItems(items, originalEntries);

    expect(result).toEqual([
      {
        id: 'Release Notes',
        hidden: false,
        originalOrder: 0,
        component: 'ReleaseNotesBox' as unknown as Component,
      },
      {
        id: 'Extension Banners',
        hidden: true,
        originalOrder: 1,
        component: 'ExtensionBanners' as unknown as Component,
      },
    ]);
  });

  test('should handle missing original entries gracefully', () => {
    const items: ListOrganizerItem[] = [
      {
        id: 'Unknown Section',
        label: 'Unknown Section',
        enabled: true,
        originalOrder: 0,
      },
    ];

    const originalEntries: DashboardPageRegistryEntry[] = [];

    const result = convertFromListOrganizerItems(items, originalEntries);

    expect(result).toEqual([
      {
        id: 'Unknown Section',
        hidden: false,
        originalOrder: 0,
        component: undefined,
      },
    ]);
  });

  test('should preserve component references from original entries', () => {
    const items: ListOrganizerItem[] = [
      {
        id: 'Release Notes',
        label: 'Release Notes',
        enabled: true,
        originalOrder: 0,
      },
    ];

    const originalEntries: DashboardPageRegistryEntry[] = [
      {
        id: 'Release Notes',
        originalOrder: 0,
        component: 'CustomComponent' as unknown as Component,
      },
    ];

    const result = convertFromListOrganizerItems(items, originalEntries);

    expect(result[0]?.component).toBe('CustomComponent');
  });

  test('should handle empty items array', () => {
    const items: ListOrganizerItem[] = [];
    const originalEntries: DashboardPageRegistryEntry[] = [
      {
        id: 'Release Notes',
        originalOrder: 0,
        component: 'ReleaseNotesBox' as unknown as Component,
      },
    ];

    const result = convertFromListOrganizerItems(items, originalEntries);

    expect(result).toEqual([]);
  });
});
