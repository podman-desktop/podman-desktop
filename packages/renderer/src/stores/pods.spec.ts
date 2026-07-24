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

import type { PodInfo } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import type { Mock } from 'vitest';
import { beforeAll, expect, test, vi } from 'vitest';

import { clearPodActionInProgress, podsEventStore, podsInfos, setPodActionError, setPodStatus } from './pods';

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

  // now get list
  const podListResult = get(podsInfos);
  expect(podListResult.length).toBe(1);
  expect(podListResult[0].id).toEqual('id123');
});

test('setPodStatus updates the status and sets actionInProgress', () => {
  podsInfos.set([
    { id: 'pod1', engineId: 'engine1', status: 'RUNNING', actionInProgress: false, actionError: '' },
  ] as any);

  setPodStatus('engine1', 'pod1', 'STARTING');

  const result = get(podsInfos);
  expect(result[0].status).toBe('STARTING');
  expect(result[0].actionInProgress).toBe(true);
  expect(result[0].actionError).toBe('');
});

test('clearPodActionInProgress clears the actionInProgress flag', () => {
  podsInfos.set([
    { id: 'pod1', engineId: 'engine1', status: 'STARTING', actionInProgress: true, actionError: '' },
  ] as any);

  clearPodActionInProgress('engine1', 'pod1');

  const result = get(podsInfos);
  expect(result[0].actionInProgress).toBe(false);
  expect(result[0].status).toBe('STARTING');
});

test('setPodActionError sets the error and status to ERROR', () => {
  podsInfos.set([
    { id: 'pod1', engineId: 'engine1', status: 'STARTING', actionInProgress: true, actionError: '' },
  ] as any);

  setPodActionError('engine1', 'pod1', 'something went wrong');

  const result = get(podsInfos);
  expect(result[0].actionError).toBe('something went wrong');
  expect(result[0].status).toBe('ERROR');
  expect(result[0].actionInProgress).toBe(false);
});

test('setPodStatus does not affect other pods', () => {
  podsInfos.set([
    { id: 'pod1', engineId: 'engine1', status: 'RUNNING', actionInProgress: false, actionError: '' },
    { id: 'pod2', engineId: 'engine1', status: 'RUNNING', actionInProgress: false, actionError: '' },
  ] as any);

  setPodStatus('engine1', 'pod1', 'STOPPING');

  const result = get(podsInfos);
  expect(result[0].status).toBe('STOPPING');
  expect(result[1].status).toBe('RUNNING');
});
