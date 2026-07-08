/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PodInfo, PodInfoUI } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import type { Mock } from 'vitest';
import { beforeAll, expect, test, vi } from 'vitest';

import { filtered, podsEventStore, podsInfos, searchPattern } from './pods';

// first, path window object
const callbacks = new Map<string, any>();
const eventEmitter = {
  receive: (message: string, callback: any): void => {
    callbacks.set(message, callback);
  },
};

const listPodsMock: Mock<() => Promise<PodInfo[]>> = vi.fn();

Object.defineProperty(global, 'window', {
  value: {
    listPods: listPodsMock,
    events: {
      receive: eventEmitter.receive,
    },
    addEventListener: eventEmitter.receive,
  },
  writable: true,
});

beforeAll(() => {
  vi.clearAllMocks();
});

test.each([
  ['container-created-event'],
  ['container-stopped-event'],
  ['container-kill-event'],
  ['container-die-event'],
  ['container-init-event'],
  ['container-started-event'],
  ['container-created-event'],
  ['container-removed-event'],
])('fetch pods when receiving event %s', async eventName => {
  // fast delays (10 & 10ms)
  podsEventStore.setupWithDebounce(10, 10);

  // empty list
  listPodsMock.mockResolvedValue([]);

  // mark as ready to receive updates
  callbacks.get('extensions-already-started')();

  // clear mock calls
  listPodsMock.mockClear();

  // now, setup at least one container
  listPodsMock.mockResolvedValue([
    {
      Id: 'id123',
    } as unknown as PodInfo,
  ]);

  // send event
  const callback = callbacks.get(eventName);
  expect(callback).toBeDefined();
  await callback();

  // wait listContainersMock is called
  while (listPodsMock.mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  const podUiListResult = get(podsInfos);
  expect(podUiListResult.length).toBe(1);
  expect(podUiListResult[0].id).toEqual('id123');
});

const runningPod: PodInfoUI = {
  id: 'running-pod-id',
  shortId: 'running',
  name: 'running-pod',
  status: 'RUNNING',
  age: '1 day',
  created: '2026-01-01T00:00:00Z',
  engineId: 'engine-id-1',
  engineName: 'engine-1',
  containers: [],
  selected: false,
};

const stoppedPod: PodInfoUI = {
  id: 'stopped-pod-id',
  shortId: 'stopped',
  name: 'stopped-pod',
  status: 'STOPPED',
  age: '1 day',
  created: '2026-01-01T00:00:00Z',
  engineId: 'engine-id-1',
  engineName: 'engine-1',
  containers: [],
  selected: false,
};

test('keep pod ui values in writable pod ui store', () => {
  podsInfos.set([runningPod]);
  searchPattern.set('');

  const podUiListResult = get(podsInfos);
  expect(podUiListResult.length).toBe(1);
  expect(podUiListResult[0].id).toEqual('running-pod-id');
});

test('filter pod ui store keeps both running and stopped pods by default', () => {
  podsInfos.set([runningPod, stoppedPod]);
  searchPattern.set('');

  const filteredPods = get(filtered);
  expect(filteredPods).toHaveLength(2);
  expect(filteredPods).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ status: 'RUNNING' }),
      expect.objectContaining({ status: 'STOPPED' }),
    ]),
  );
});

test('filter pod ui store keeps only running pods with running filter', () => {
  podsInfos.set([runningPod, stoppedPod]);
  searchPattern.set('is:running');

  const filteredPods = get(filtered);
  expect(filteredPods).toHaveLength(1);
  expect(filteredPods[0]).toEqual(expect.objectContaining({ status: 'RUNNING' }));
});

test('filter pod ui store keeps only stopped pods with stopped filter', () => {
  podsInfos.set([runningPod, stoppedPod]);
  searchPattern.set('is:stopped');

  const filteredPods = get(filtered);
  expect(filteredPods).toHaveLength(1);
  expect(filteredPods[0]).toEqual(expect.objectContaining({ status: 'STOPPED' }));
});
