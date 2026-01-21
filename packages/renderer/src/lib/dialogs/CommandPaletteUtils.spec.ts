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

import '@testing-library/jest-dom/vitest';

import { faCube, faImage } from '@fortawesome/free-solid-svg-icons';
import type { Component } from 'svelte';
import { describe, expect, test } from 'vitest';

import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';
import type { ContainerInfo } from '/@api/container-info';
import type { GoToInfo } from '/@api/documentation-info';
import type { ImageInfo } from '/@api/image-info';
import type { NavigationRouteInfo } from '/@api/navigation-route-info';
import type { PodInfo } from '/@api/pod-info';
import type { VolumeInfo } from '/@api/volume-info';

import { createGoToItems, getGoToDisplayText } from './CommandPaletteUtils';

// Mock data for testing
const mockImageInfo: ImageInfo = {
  Id: 'sha256:abc123def456789012345678901234567890123456789012345678901234567890',
  RepoTags: ['nginx:latest'],
  RepoDigests: ['nginx@sha256:abc123def456789012345678901234567890123456789012345678901234567890'],
  Digest: 'sha256:abc123def456789012345678901234567890123456789012345678901234567890',
  engineId: 'podman',
  engineName: 'Podman',
} as unknown as ImageInfo;

const mockContainerInfo: ContainerInfo = {
  Id: 'def456789012345678901234567890123456789012345678901234567890123456789',
  Names: ['test-container'],
  Image: 'nginx:latest',
  ImageID: 'sha256:abc123def456789012345678901234567890123456789012345678901234567890',
  engineId: 'podman',
  engineName: 'Podman',
  ImageBase64RepoTag: Buffer.from('nginx:latest').toString('base64'),
} as unknown as ContainerInfo;

const mockPodInfo: PodInfo = {
  Id: 'ghi789012345678901234567890123456789012345678901234567890123456789012',
  Name: 'test-pod',
  Status: 'Running',
  engineId: 'podman',
  engineName: 'Podman',
} as unknown as PodInfo;

const mockVolumeInfo: VolumeInfo = {
  Name: 'my-volume',
  engineId: 'podman',
  engineName: 'Podman',
} as unknown as VolumeInfo;

// Mock navigation entries for testing
const mockNavigationEntries: NavigationRegistryEntry[] = [
  // Entry type - visible with counter
  {
    name: 'Images',
    link: '/images',
    type: 'entry',
    counter: 5,
    tooltip: 'Images',
    icon: {
      iconComponent: 'ImageIcon' as unknown as Component,
      faIcon: { definition: faImage, size: '1x' },
    },
  },
  // Entry type - visible without counter
  {
    name: 'Settings',
    link: '/settings',
    type: 'entry',
    counter: 0,
    tooltip: 'Settings',
    icon: {
      iconComponent: 'SettingsIcon' as unknown as Component,
    },
  },
  // Group type with children
  {
    name: 'Extensions',
    type: 'group',
    counter: 2,
    tooltip: 'Extensions',
    icon: {},
    link: '',
    items: [
      {
        name: 'AI Lab',
        link: '/extensions/ai-lab',
        type: 'entry',
        counter: 4,
        tooltip: 'AI Lab',
        icon: {
          iconComponent: 'AIIcon' as unknown as Component,
        },
      },
      {
        name: 'Kubernetes',
        link: '/extensions/kubernetes',
        type: 'entry',
        counter: 1,
        tooltip: 'Kubernetes',
        icon: {
          iconComponent: 'K8sIcon' as unknown as Component,
        },
      },
      // Hidden child
      {
        name: 'Hidden Child',
        link: '/hidden-child',
        type: 'entry',
        counter: 0,
        tooltip: 'Hidden Child',
        icon: {},
        hidden: true,
      },
    ],
  },
  // Submenu type
  {
    name: 'Kubernetes',
    link: '/kubernetes',
    type: 'submenu',
    counter: 8,
    tooltip: 'Kubernetes',
    icon: {
      iconComponent: 'K8sIcon' as unknown as Component,
      faIcon: { definition: faCube, size: '1x' },
    },
  },
  // Hidden entry
  {
    name: 'Hidden Item',
    type: 'entry',
    hidden: true,
  } as NavigationRegistryEntry,
];

describe('createGoToItems', () => {
  test('should create GoToInfo items for all resource types', () => {
    const items = createGoToItems([mockImageInfo], [mockContainerInfo], [mockPodInfo], [mockVolumeInfo]);

    expect(items).toHaveLength(4);

    // Check image item
    const imageItem = items.find(item => item.type === 'Image');
    expect(imageItem).toBeDefined();
    expect(imageItem?.Id).toBe(mockImageInfo.Id);
    expect(getGoToDisplayText(imageItem!)).toBe('nginx:latest');
    expect(imageItem?.type).toBe('Image');

    // Check container item
    const containerItem = items.find(item => item.type === 'Container');
    expect(containerItem).toBeDefined();
    expect(containerItem?.Id).toBe(mockContainerInfo.Id);
    expect(getGoToDisplayText(containerItem!)).toBe('test-container');
    expect(containerItem?.type).toBe('Container');

    // Check pod item
    const podItem = items.find(item => item.type === 'Pod');
    expect(podItem).toBeDefined();
    expect(podItem?.Id).toBe(mockPodInfo.Id);
    expect(getGoToDisplayText(podItem!)).toBe('test-pod');
    expect(podItem?.type).toBe('Pod');

    // Check volume item
    const volumeItem = items.find(item => item.type === 'Volume');
    expect(volumeItem).toBeDefined();
    expect(volumeItem?.Name).toBe('my-volume');
    expect(getGoToDisplayText(volumeItem!)).toBe('my-volume');
    expect(volumeItem?.type).toBe('Volume');
  });

  test('should handle empty arrays', () => {
    const items = createGoToItems([], [], [], []);

    expect(items).toHaveLength(0);
  });

  test('should handle image without RepoTags', () => {
    const imageWithoutTags = { ...mockImageInfo, RepoTags: undefined };
    const items = createGoToItems([imageWithoutTags], [], [], []);

    const imageItem = items.find(item => item.type === 'Image');
    expect(getGoToDisplayText(imageItem!)).toBe('sha256:abc123def456');
  });

  test('should handle image with empty RepoTags', () => {
    const imageWithEmptyTags = { ...mockImageInfo, RepoTags: [] };
    const items = createGoToItems([imageWithEmptyTags], [], [], []);

    const imageItem = items.find(item => item.type === 'Image');
    expect(getGoToDisplayText(imageItem!)).toBe('sha256:abc123def456');
  });

  test('should handle multiple volumes', () => {
    const multipleVolumes: VolumeInfo[] = [
      {
        Name: 'volume1',
        engineId: 'podman',
        engineName: 'Podman',
      },
      {
        Name: 'volume2',
        engineId: 'podman',
        engineName: 'Podman',
      },
    ] as unknown as VolumeInfo[];

    const items = createGoToItems([], [], [], multipleVolumes);

    const volumeItems = items.filter(item => item.type === 'Volume');
    expect(volumeItems).toHaveLength(2);
    expect(volumeItems[0].Name).toBe('volume1');
    expect(volumeItems[1].Name).toBe('volume2');
  });
});

describe('getShortId function behavior through createGoToItems', () => {
  test('should handle sha256: prefix correctly', () => {
    const imageWithSha256 = {
      ...mockImageInfo,
      RepoTags: ['registry.com/image:tag@sha256:abc123def456789012345678901234567890123456789012345678901234567890'],
    };

    const items = createGoToItems([imageWithSha256], [], [], []);
    const imageItem = items.find(item => item.type === 'Image');

    // The name should be the RepoTag with sha256: prefix and 12 chars after
    expect(getGoToDisplayText(imageItem!)).toBe('registry.com/image:tag@sha256:abc123def456');
  });

  test('should handle image ID without sha256: prefix', () => {
    const imageWithoutSha256 = {
      ...mockImageInfo,
      Id: 'abc123def456789012345678901234567890123456789012345678901234567890',
      RepoTags: undefined,
    };

    const items = createGoToItems([imageWithoutSha256], [], [], []);
    const imageItem = items.find(item => item.type === 'Image');

    // Should return the full ID since no sha256: prefix
    expect(getGoToDisplayText(imageItem!)).toBe('abc123def456789012345678901234567890123456789012345678901234567890');
  });

  test('should handle sha256: at the beginning', () => {
    const imageWithSha256AtStart = {
      ...mockImageInfo,
      RepoTags: ['sha256:abc123def456789012345678901234567890123456789012345678901234567890'],
    };

    const items = createGoToItems([imageWithSha256AtStart], [], [], []);
    const imageItem = items.find(item => item.type === 'Image');

    // Should return sha256: + 12 chars
    expect(getGoToDisplayText(imageItem!)).toBe('sha256:abc123def456');
  });

  test('should handle volume names correctly', () => {
    const volumeWithLongName: VolumeInfo = {
      engineId: 'podman',
      engineName: 'Podman',
      Name: 'very-long-volume-name-that-exceeds-twelve-characters',
    } as unknown as VolumeInfo;

    const items = createGoToItems([], [], [], [volumeWithLongName]);
    const volumeItem = items.find(item => item.type === 'Volume');

    // Volume names should be truncated to 12 characters
    expect(getGoToDisplayText(volumeItem!)).toBe('very-long-vo');
  });
});

describe('getGoToDisplayText function behavior', () => {
  test('should handle image correctly', () => {
    const image = {
      ...mockImageInfo,
      RepoTags: ['registry.com/image:tag@sha256:abc123def456789012345678901234567890123456789012345678901234567890'],
    };
    const items = createGoToItems([image], [], [], []);
    const imageItem = items.find(item => item.type === 'Image');
    expect(getGoToDisplayText(imageItem!)).toBe('registry.com/image:tag@sha256:abc123def456');
  });

  test('should handle container correctly', () => {
    const container = { ...mockContainerInfo, Names: ['test-container'] };
    const items = createGoToItems([], [container], [], []);
    const containerItem = items.find(item => item.type === 'Container');
    expect(getGoToDisplayText(containerItem!)).toBe('test-container');
  });

  test('should handle pod correctly', () => {
    const pod = { ...mockPodInfo, Name: 'test-pod' };
    const items = createGoToItems([], [], [pod], []);
    const podItem = items.find(item => item.type === 'Pod');
    expect(getGoToDisplayText(podItem!)).toBe('test-pod');
  });

  test('should handle volume correctly', () => {
    const volume = { ...mockVolumeInfo, Name: 'my-volume' };
    const items = createGoToItems([], [], [], [volume]);
    const volumeItem = items.find(item => item.type === 'Volume');
    expect(getGoToDisplayText(volumeItem!)).toBe('my-volume');
  });

  test('should handle unknown correctly', () => {
    // Test the function directly with a mock object that has an invalid kind
    const unknownItem = { type: 'Unknown', ...mockImageInfo } as unknown as GoToInfo;
    expect(getGoToDisplayText(unknownItem)).toBe('Unknown');
  });
});

describe('Navigation Items', () => {
  test('should handle all navigation entry types correctly', () => {
    const items = createGoToItems([], [], [], [], mockNavigationEntries);
    const navigationItems = items.filter(item => item.type === 'Navigation');

    // Should have 5 visible items: Images (5), Settings, Extensions children (2), Kubernetes (8)
    expect(navigationItems).toHaveLength(5);

    // Entry type with counter
    const imagesItem = navigationItems.find(item => item.name === 'Images (5)');
    expect(imagesItem).toBeDefined();
    expect(imagesItem?.link).toBe('/images');
    expect(imagesItem?.icon?.iconComponent).toBe('ImageIcon' as unknown as Component);
    expect(imagesItem?.icon?.faIcon).toEqual(faImage);

    // Entry type without counter (counter is 0)
    const settingsItem = navigationItems.find(item => item.name === 'Settings');
    expect(settingsItem).toBeDefined();
    expect(settingsItem?.link).toBe('/settings');

    // Group children with parent prefix
    const aiLabItem = navigationItems.find(item => item.name === 'Extensions: AI Lab (4)');
    expect(aiLabItem).toBeDefined();
    expect(aiLabItem?.link).toBe('/extensions/ai-lab');

    const k8sExtensionItem = navigationItems.find(item => item.name === 'Extensions: Kubernetes (1)');
    expect(k8sExtensionItem).toBeDefined();
    expect(k8sExtensionItem?.link).toBe('/extensions/kubernetes');

    // Submenu type
    const k8sSubmenuItem = navigationItems.find(item => item.name === 'Kubernetes (8)');
    expect(k8sSubmenuItem).toBeDefined();
    expect(k8sSubmenuItem?.link).toBe('/kubernetes');
    expect(k8sSubmenuItem?.icon?.faIcon).toEqual(faCube);

    // Hidden items should not be present
    const hiddenItem = navigationItems.find(item => item.name?.includes('Hidden'));
    expect(hiddenItem).toBeUndefined();

    // Test getGoToDisplayText for Navigation type
    expect(getGoToDisplayText(imagesItem!)).toBe('Images (5)');
    expect(getGoToDisplayText(settingsItem!)).toBe('Settings');
  });
});

describe('Navigation Routes', () => {
  const mockNavigationRoutes: NavigationRouteInfo[] = [
    {
      routeId: 'ailab.downloads',
      commandId: 'ailab.open-downloads',
      title: 'Open Downloads',
      icon: 'data:image/png;base64,abc123',
      extensionId: 'AI Lab',
    },
    {
      routeId: 'ailab.models',
      commandId: 'ailab.open-models',
      title: 'View Models',
      icon: {
        light: 'data:image/png;base64,light',
        dark: 'data:image/png;base64,dark',
      },
      extensionId: 'AI Lab',
    },
    {
      routeId: 'kubernetes.dashboard',
      commandId: 'kubernetes.open-dashboard',
      title: 'Open Dashboard',
      extensionId: 'Kubernetes',
      // No icon
    },
    {
      routeId: 'extension.hidden-route',
      commandId: 'extension.hidden-command',
      // No title - should be skipped
      extensionId: 'Extension',
    },
  ];

  test('should create Navigation items from navigation routes', () => {
    const items = createGoToItems([], [], [], [], [], mockNavigationRoutes);
    const navigationItems = items.filter(item => item.type === 'Navigation');

    // Should have 3 items (route without title is skipped)
    expect(navigationItems).toHaveLength(3);

    // Route with string icon
    const downloadsItem = navigationItems.find(item => item.name === 'AI Lab: Open Downloads');
    expect(downloadsItem).toBeDefined();
    expect(downloadsItem?.link).toBe('ailab.downloads');
    expect(downloadsItem?.icon?.iconImage).toBe('data:image/png;base64,abc123');

    // Route with light/dark icon object
    const modelsItem = navigationItems.find(item => item.name === 'AI Lab: View Models');
    expect(modelsItem).toBeDefined();
    expect(modelsItem?.link).toBe('ailab.models');
    expect(modelsItem?.icon?.iconImage).toEqual({
      light: 'data:image/png;base64,light',
      dark: 'data:image/png;base64,dark',
    });

    // Route without icon
    const dashboardItem = navigationItems.find(item => item.name === 'Kubernetes: Open Dashboard');
    expect(dashboardItem).toBeDefined();
    expect(dashboardItem?.link).toBe('kubernetes.dashboard');
    expect(dashboardItem?.icon?.iconImage).toBeUndefined();

    // Route without title should not be present
    const hiddenRoute = navigationItems.find(item => item.link === 'extension.hidden-route');
    expect(hiddenRoute).toBeUndefined();
  });
});
