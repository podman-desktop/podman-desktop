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

import type { ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import type { Mock } from 'vitest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { containerConnectionCount, eventStore, providerInfos } from './providers';

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
  vi.resetAllMocks();
});

test('no provider through window.getProviderInfos should make the store empty', () => {
  // fast delays (10 & 10ms)
  eventStore.setupWithDebounce(10, 10);

  // empty list
  getProviderInfosMock.mockResolvedValue([]);

  // mark as ready to receive updates
  callbacks.get('system-ready')();

  // now get list
  const providerListResult = get(providerInfos);
  expect(providerListResult.length).toBe(0);
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

describe('containerConnectionCount', () => {
  const PODMAN_CONNECTION = {
    name: 'podman-machine-default',
    status: 'started',
    type: 'podman',
  } as unknown as ProviderContainerConnectionInfo;

  const PODMAN_PROVIDER: ProviderInfo = {
    id: 'podman',
    name: 'Podman',
    kubernetesConnections: [],
    vmConnections: [],
    containerConnections: [],
  } as unknown as ProviderInfo;

  const DOCKER_CONNECTION = {
    name: 'docker-context',
    status: 'started',
    type: 'docker',
  } as unknown as ProviderContainerConnectionInfo;

  const DOCKER_PROVIDER: ProviderInfo = {
    id: 'docker',
    name: 'Docker',
    kubernetesConnections: [],
    vmConnections: [],
    containerConnections: [],
  } as unknown as ProviderInfo;

  function initProviderInfoStore(providers: ProviderInfo[]): Promise<void> {
    // fast delays (10 & 10ms)
    eventStore.setupWithDebounce(10, 10);

    // empty list
    getProviderInfosMock.mockResolvedValue(providers);

    // mark as ready to receive updates
    callbacks.get('system-ready')();
    callbacks.get('provider-change')();

    return vi.waitFor(() => {
      expect(getProviderInfosMock).toHaveBeenCalled();
      expect(get(providerInfos)).toHaveLength(providers.length);
    });
  }

  test('should be zero if no provider are available', async () => {
    await initProviderInfoStore([]);

    expect(get(containerConnectionCount)).toEqual(
      expect.objectContaining({
        podman: 0,
        docker: 0,
      }),
    );
  });

  test('should be zero if no provider has container connection', async () => {
    await initProviderInfoStore([PODMAN_PROVIDER, DOCKER_PROVIDER]);

    expect(get(containerConnectionCount)).toEqual(
      expect.objectContaining({
        podman: 0,
        docker: 0,
      }),
    );
  });

  test('should be one if one started provider are available', async () => {
    await initProviderInfoStore([
      {
        ...PODMAN_PROVIDER,
        containerConnections: [PODMAN_CONNECTION],
      },
    ]);

    expect(get(containerConnectionCount)).toEqual(
      expect.objectContaining({
        podman: 1,
        docker: 0,
      }),
    );
  });

  test('should count podman container connections from all providers', async () => {
    await initProviderInfoStore([
      {
        ...PODMAN_PROVIDER,
        containerConnections: [PODMAN_CONNECTION],
      },
      {
        ...PODMAN_PROVIDER,
        containerConnections: [PODMAN_CONNECTION],
      },
    ]);

    expect(get(containerConnectionCount)).toEqual(
      expect.objectContaining({
        podman: 2,
        docker: 0,
      }),
    );
  });

  test('should count podman & docker container connections from all providers', async () => {
    await initProviderInfoStore([
      {
        ...PODMAN_PROVIDER,
        containerConnections: [PODMAN_CONNECTION],
      },
      {
        ...PODMAN_PROVIDER,
        containerConnections: [PODMAN_CONNECTION],
      },
      {
        ...DOCKER_PROVIDER,
        containerConnections: [DOCKER_CONNECTION],
      },
    ]);

    expect(get(containerConnectionCount)).toEqual(
      expect.objectContaining({
        podman: 2,
        docker: 1,
      }),
    );
  });
});
