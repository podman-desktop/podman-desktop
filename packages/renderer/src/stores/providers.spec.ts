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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { get } from 'svelte/store';
import type { Mock } from 'vitest';
import { beforeAll, expect, test, vi } from 'vitest';

import type { ProviderInfo } from '/@api/provider-info';

import { eventStore, providerInfos } from './providers';

// first, path window object
const callbacks = new Map<string, any>();
const eventEmitter = {
  receive: (message: string, callback: any): void => {
    callbacks.set(message, callback);
  },
};

const getProviderInfosMock: Mock<() => Promise<ProviderInfo[]>> = vi.fn();

Object.defineProperty(global, 'window', {
  value: {
    getProviderInfos: getProviderInfosMock,
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
  ['extension-started'],
  ['extension-stopped'],
  ['provider-lifecycle-change'],
  ['provider-change'],
  ['provider-create'],
  ['provider-delete'],
  ['provider:update-status'],
  ['provider:update-warnings'],
  ['provider:update-version'],
  ['provider-register-kubernetes-connection'],
  ['provider-unregister-kubernetes-connection'],
  ['provider-register-vm-connection'],
  ['provider-unregister-vm-connection'],
  ['extensions-started'],
])('fetch providers when receiving event %s', async eventName => {
  // fast delays (10 & 10ms)
  eventStore.setupWithDebounce(10, 10);

  // empty list
  getProviderInfosMock.mockResolvedValue([]);

  // mark as ready to receive updates
  callbacks.get('system-ready')();

  // clear mock calls
  getProviderInfosMock.mockClear();

  // now, setup at least one container
  getProviderInfosMock.mockResolvedValue([
    {
      id: 'id123',
    } as unknown as ProviderInfo,
  ]);

  // send event
  const callback = callbacks.get(eventName);
  expect(callback).toBeDefined();
  await callback();

  // wait listContainersMock is called
  await vi.waitFor(() => expect(getProviderInfosMock).toHaveBeenCalled());

  // now get list
  const providerListResult = get(providerInfos);
  expect(providerListResult.length).toBe(1);
  expect(providerListResult[0].id).toEqual('id123');
});
