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

import type { PodInfo } from '@podman-desktop/api';
import { describe, expect, test } from 'vitest';

import type { ContainerInfo } from '/@api/container-info';
import type { ImageInfo } from '/@api/image-info';
import type { VolumeInfo } from '/@api/volume-info';

import { createGoToItems } from './CommandPaletteUtils';

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
    const imageItem = items.find(item => item.kind === 'Image');
    expect(imageItem).toBeDefined();
    expect(imageItem?.id).toBe(mockImageInfo.Id);
    expect(imageItem?.name).toBe('nginx:latest');
    expect(imageItem?.kind).toBe('Image');

    // Check container item
    const containerItem = items.find(item => item.kind === 'Container');
    expect(containerItem).toBeDefined();
    expect(containerItem?.id).toBe(mockContainerInfo.Id);
    expect(containerItem?.name).toBe('test-container');
    expect(containerItem?.kind).toBe('Container');

    // Check pod item
    const podItem = items.find(item => item.kind === 'Pod');
    expect(podItem).toBeDefined();
    expect(podItem?.id).toBe(mockPodInfo.Id);
    expect(podItem?.name).toBe('test-pod');
    expect(podItem?.kind).toBe('Pod');

    // Check volume item
    const volumeItem = items.find(item => item.kind === 'Volume');
    expect(volumeItem).toBeDefined();
    expect(volumeItem?.id).toBe('my-volume');
    expect(volumeItem?.name).toBe('my-volume');
    expect(volumeItem?.kind).toBe('Volume');
  });

  test('should handle empty arrays', () => {
    const items = createGoToItems([], [], [], []);

    expect(items).toHaveLength(0);
  });

  test('should handle image without RepoTags', () => {
    const imageWithoutTags = { ...mockImageInfo, RepoTags: undefined };
    const items = createGoToItems([imageWithoutTags], [], [], []);

    const imageItem = items.find(item => item.kind === 'Image');
    expect(imageItem?.name).toBe('sha256:abc123def456789012345678901234567890123456789012345678901234567890');
  });

  test('should handle image with empty RepoTags', () => {
    const imageWithEmptyTags = { ...mockImageInfo, RepoTags: [] };
    const items = createGoToItems([imageWithEmptyTags], [], [], []);

    const imageItem = items.find(item => item.kind === 'Image');
    expect(imageItem?.name).toBe('sha256:abc123def456789012345678901234567890123456789012345678901234567890');
  });

  test('should handle container without Names', () => {
    const containerWithoutNames = { ...mockContainerInfo, Names: [] };
    const items = createGoToItems([], [containerWithoutNames], [], []);

    const containerItem = items.find(item => item.kind === 'Container');
    expect(containerItem?.name).toBe('def456789012345678901234567890123456789012345678901234567890123456789');
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

    const volumeItems = items.filter(item => item.kind === 'Volume');
    expect(volumeItems).toHaveLength(2);
    expect(volumeItems[0]?.name).toBe('volume1');
    expect(volumeItems[1]?.name).toBe('volume2');
  });
});

describe('getShortId function behavior through createGoToItems', () => {
  test('should handle sha256: prefix correctly', () => {
    const imageWithSha256 = {
      ...mockImageInfo,
      RepoTags: ['registry.com/image:tag@sha256:abc123def456789012345678901234567890123456789012345678901234567890'],
    };

    const items = createGoToItems([imageWithSha256], [], [], []);
    const imageItem = items.find(item => item.kind === 'Image');

    // The name should be the RepoTag with sha256: prefix and 12 chars after
    expect(imageItem?.name).toBe('registry.com/image:tag@sha256:abc123def456');
  });

  test('should handle image ID without sha256: prefix', () => {
    const imageWithoutSha256 = {
      ...mockImageInfo,
      Id: 'abc123def456789012345678901234567890123456789012345678901234567890',
      RepoTags: undefined,
    };

    const items = createGoToItems([imageWithoutSha256], [], [], []);
    const imageItem = items.find(item => item.kind === 'Image');

    // Should return the full ID since no sha256: prefix
    expect(imageItem?.name).toBe('abc123def456789012345678901234567890123456789012345678901234567890');
  });

  test('should handle sha256: at the beginning', () => {
    const imageWithSha256AtStart = {
      ...mockImageInfo,
      RepoTags: ['sha256:abc123def456789012345678901234567890123456789012345678901234567890'],
    };

    const items = createGoToItems([imageWithSha256AtStart], [], [], []);
    const imageItem = items.find(item => item.kind === 'Image');

    // Should return sha256: + 12 chars
    expect(imageItem?.name).toBe('sha256:abc123def456');
  });

  test('should handle volume names correctly', () => {
    const volumeWithLongName: VolumeInfo = {
      engineId: 'podman',
      engineName: 'Podman',
      Name: 'very-long-volume-name-that-exceeds-twelve-characters',
    } as unknown as VolumeInfo;

    const items = createGoToItems([], [], [], [volumeWithLongName]);
    const volumeItem = items.find(item => item.kind === 'Volume');

    // Volume names should be truncated to 12 characters
    expect(volumeItem?.name).toBe('very-long-vo');
  });
});
