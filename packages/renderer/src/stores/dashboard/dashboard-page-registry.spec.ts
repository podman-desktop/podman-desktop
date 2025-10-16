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
  convertToListOrganizerItems,
  type DashboardPageRegistryEntry,
  getDefaultSectionNames,
} from './dashboard-page-registry';

// Mock the individual registry creation functions
vi.mock('../../lib/dashboard/ExtensionBanners.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('../../lib/dashboard/LearningCenter.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('../../lib/dashboard/Providers.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('../../lib/ReleaseNotesBox.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('../../lib/explore-features/ExploreFeatures.svelte', () => ({
  default: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getDefaultSectionNames', () => {
  test('should return section names in correct order', () => {
    const result = getDefaultSectionNames();

    expect(result).toEqual(['Release Notes', 'Extension Banners', 'Explore Features', 'Learning Center', 'Providers']);
  });

  test('should return consistent order on multiple calls', () => {
    const result1 = getDefaultSectionNames();
    const result2 = getDefaultSectionNames();

    expect(result1).toEqual(result2);
  });
});

describe('convertToListOrganizerItems', () => {
  test('should convert dashboard registry entries to list organizer items', () => {
    const entries: DashboardPageRegistryEntry[] = [
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
      {
        id: 'Explore Features',
        originalOrder: 2,
        component: 'ExploreFeatures' as unknown as Component,
      },
    ];

    const result = convertToListOrganizerItems(entries);

    expect(result).toEqual([
      {
        id: 'Release Notes',
        label: 'Release Notes',
        enabled: true,
        originalOrder: 0,
      },
      {
        id: 'Extension Banners',
        label: 'Extension Banners',
        enabled: true,
        originalOrder: 1,
      },
      {
        id: 'Explore Features',
        label: 'Explore Features',
        enabled: true,
        originalOrder: 2,
      },
    ]);
  });

  test('should handle hidden entries correctly', () => {
    const entries: DashboardPageRegistryEntry[] = [
      {
        id: 'Release Notes',
        originalOrder: 0,
        component: 'ReleaseNotesBox' as unknown as Component,
      },
      {
        id: 'Extension Banners',
        originalOrder: 1,
        component: 'ExtensionBanners' as unknown as Component,
        hidden: true,
      },
    ];

    const result = convertToListOrganizerItems(entries);

    expect(result).toEqual([
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
    ]);
  });

  test('should handle empty entries array', () => {
    const entries: DashboardPageRegistryEntry[] = [];

    const result = convertToListOrganizerItems(entries);

    expect(result).toEqual([]);
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
