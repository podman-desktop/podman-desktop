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

import type { PodInfo } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import { assert, beforeEach, expect, test, vi } from 'vitest';

import { podsEventStore, podsInfos } from './pods';

const callbacks = new Map<string, (data?: unknown) => void | Promise<void>>();

beforeEach(() => {
  callbacks.clear();
  vi.resetAllMocks();
  vi.mocked(window.events.receive).mockImplementation((message, callback) => {
    callbacks.set(message, callback);
    return { dispose: vi.fn() };
  });
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
  vi.mocked(window.listPods).mockResolvedValue([]);

  // mark as ready to receive updates
  window.dispatchEvent(new CustomEvent('extensions-already-started'));

  // clear mock calls
  vi.mocked(window.listPods).mockClear();

  // now, setup at least one container
  vi.mocked(window.listPods).mockResolvedValue([
    {
      Id: 'id123',
    } as unknown as PodInfo,
  ]);

  // send event
  const callback = callbacks.get(eventName);
  assert(callback);
  await callback();

  // wait listContainersMock is called
  while (vi.mocked(window.listPods).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  // now get list
  const podListResult = get(podsInfos);
  expect(podListResult.length).toBe(1);
  expect(podListResult[0].id).toEqual('id123');
});
