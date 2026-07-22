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

import { beforeEach, expect, test, vi } from 'vitest';

import type { PodInfoUI } from '/@/lib/pod/PodInfoUI';
import { podsInfos } from '/@/stores/pods';

import { createNavigationPodEntry } from './navigation-registry-pod.svelte';

beforeEach(() => {
  vi.resetAllMocks();
});

test('createNavigationPodEntry', async () => {
  const entry = createNavigationPodEntry();
  const podA: PodInfoUI = {
    id: '1234',
    shortId: '1234',
    name: 'pod-a',
    engineId: 'podman',
    engineName: 'Podman',
    status: 'RUNNING',
    age: '1 minute',
    created: '2026-01-01T00:00:00.000Z',
    selected: false,
    containers: [],
    namespace: '',
  };
  const podB: PodInfoUI = {
    id: '3456',
    shortId: '3456',
    name: 'pod-b',
    engineId: 'podman',
    engineName: 'Podman',
    status: 'RUNNING',
    age: '1 minute',
    created: '2026-01-01T00:00:00.000Z',
    selected: false,
    containers: [],
    namespace: '',
  };
  podsInfos.set([podA, podB]);

  expect(entry).toBeDefined();
  expect(entry.name).toBe('Pods');
  expect(entry.link).toBe('/pods');
  expect(entry.tooltip).toBe('Pods');
  await vi.waitFor(() => {
    expect(entry.counter).toBe(2);
    expect(entry.destinations).toHaveLength(3);
  });

  const [first, second, listEntry] = entry.destinations;

  expect(first.page).toBe('pod-summary');
  expect(first).toHaveProperty('parameters', { name: 'pod-a', engineId: 'podman' });
  expect(first.name).toBe('Pod: pod-a');

  expect(second.page).toBe('pod-summary');
  expect(second).toHaveProperty('parameters', { name: 'pod-b', engineId: 'podman' });
  expect(second.name).toBe('Pod: pod-b');

  expect(listEntry.page).toBe('pods');
  expect(listEntry.name).toBe('Pods (2)');
});
