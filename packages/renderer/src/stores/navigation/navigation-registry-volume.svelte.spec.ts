/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import type { VolumeListInfo } from '@podman-desktop/core-api';
import { beforeEach, expect, test, vi } from 'vitest';

import { volumeListInfos } from '/@/stores/volumes';

import { createNavigationVolumeEntry } from './navigation-registry-volume.svelte';

beforeEach(() => {
  vi.resetAllMocks();
});

test('createNavigationVolumeEntry', async () => {
  const entry = createNavigationVolumeEntry();
  volumeListInfos.set([
    {
      Volumes: [
        {
          Id: '1234',
          Size: 0,
          Name: 'my-data',
          engineId: 'podman',
        },
        {
          Id: '3456',
          Size: 0,
          Name: 'cache-vol',
          engineId: 'docker',
        },
      ],
    } as unknown as VolumeListInfo,
  ]);

  expect(entry).toBeDefined();
  expect(entry.name).toBe('Volumes');
  expect(entry.link).toBe('/volumes');
  expect(entry.tooltip).toBe('Volumes');
  await vi.waitFor(() => {
    expect(entry.counter).toBe(2);
    expect(entry.destinations).toHaveLength(3);
  });

  const [first, second, listEntry] = entry.destinations;

  expect(first.page).toBe('volume');
  expect(first).toHaveProperty('parameters', { engineId: 'podman', name: 'my-data' });
  expect(first.name).toBe('Volume: my-data');

  expect(second.page).toBe('volume');
  expect(second).toHaveProperty('parameters', { engineId: 'docker', name: 'cache-vol' });
  expect(second.name).toBe('Volume: cache-vol');

  expect(listEntry.page).toBe('volumes');
  expect(listEntry.name).toBe('Volumes (2)');
});
