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

import type { ContainerInfo } from '@podman-desktop/core-api';
import { beforeEach, expect, test, vi } from 'vitest';

import { containersInfos } from '/@/stores/containers';

import { createNavigationContainerEntry } from './navigation-registry-container.svelte';

beforeEach(() => {
  vi.resetAllMocks();
});

test('createNavigationContainerEntry', async () => {
  // set 2 containers

  const entry = createNavigationContainerEntry();
  containersInfos.set([
    {
      Id: '1234',
      Names: ['/web-app'],
      engineId: 'podman',
    } as unknown as ContainerInfo,
    {
      Id: '3456',
      Names: ['database'],
      engineId: 'docker',
    } as unknown as ContainerInfo,
  ]);

  expect(entry).toBeDefined();
  expect(entry.name).toBe('Containers');
  expect(entry.link).toBe('/containers');
  expect(entry.tooltip).toBe('Containers');
  await vi.waitFor(() => {
    expect(entry.counter).toBe(2);
    expect(entry.destinations).toHaveLength(3);
  });

  const [first, second, listEntry] = entry.destinations;

  expect(first.page).toBe('container-summary');
  expect(first).toHaveProperty('parameters', { id: '1234' });
  expect(first.name).toBe('Container: web-app');

  expect(second.page).toBe('container-summary');
  expect(second).toHaveProperty('parameters', { id: '3456' });
  expect(second.name).toBe('Container: database');

  expect(listEntry.page).toBe('containers');
  expect(listEntry.name).toBe('Containers (2)');
});
