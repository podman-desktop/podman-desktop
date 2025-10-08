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

import { describe, expect, test } from 'vitest';

import type { ContainerInfo } from '/@api/container-info';
import type { GoToInfo } from '/@api/documentation-info';
import type { ImageInfo } from '/@api/image-info';
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
