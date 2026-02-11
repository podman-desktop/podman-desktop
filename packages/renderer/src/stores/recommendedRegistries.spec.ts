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

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { RecommendedRegistry } from '@podman-desktop/core-api/recommendations';
import { get } from 'svelte/store';
import type { Mock } from 'vitest';
import { beforeAll, expect, test, vi } from 'vitest';

import {
  fetchRecommendedRegistries,
  recommendedRegistries,
  recommendedRegistriesEventStore,
} from './recommendedRegistries';

// first, patch window object
const callbacks = new Map<string, any>();
const eventEmitter = {
  receive: (message: string, callback: any): void => {
    callbacks.set(message, callback);
  },
};

const getRecommendedRegistriesMock: Mock<() => Promise<RecommendedRegistry[]>> = vi.fn();

Object.defineProperty(global, 'window', {
  value: {
    getRecommendedRegistries: getRecommendedRegistriesMock,
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

test('recommendedRegistries should be updated in case of an extension is stopped', async () => {
  getRecommendedRegistriesMock.mockResolvedValue([
    {
      extensionId: 'my.extensionId',
      name: 'Hello',
      id: 'my.registry.com',
      errors: ['foo'],
    } as unknown as RecommendedRegistry,
  ]);
  recommendedRegistriesEventStore.setup();

  const callback = callbacks.get('extensions-already-started');
  // send 'extensions-already-started' event
  expect(callback).toBeDefined();
  await callback();

  // now ready to fetch recommended registries
  await fetchRecommendedRegistries();

  // now get list
  const registries = get(recommendedRegistries);
  expect(registries.length).toBe(1);
  expect(registries[0].extensionId).toEqual('my.extensionId');

  // ok now mock the getRecommendedRegistries function to return an empty list
  getRecommendedRegistriesMock.mockResolvedValue([]);

  // call 'container-removed-event' event
  const extensionStoppedCallback = callbacks.get('extension-stopped');
  expect(extensionStoppedCallback).toBeDefined();
  await extensionStoppedCallback();

  // wait a little
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(getRecommendedRegistriesMock).toHaveBeenCalled();

  // check if the registries are updated
  const registries2 = get(recommendedRegistries);
  expect(registries2.length).toBe(0);
});

test('recommendedRegistries should be updated in case configuration changed is called with expected key', async () => {
  getRecommendedRegistriesMock.mockResolvedValue([
    {
      extensionId: 'my.extensionId',
      name: 'Hello',
      id: 'my.registry.com',
      errors: ['foo'],
    } as unknown as RecommendedRegistry,
  ]);
  recommendedRegistriesEventStore.setup();

  const callback = callbacks.get('extensions-already-started');
  // send 'extensions-already-started' event
  expect(callback).toBeDefined();
  await callback();

  // now ready to fetch recommended registries
  await fetchRecommendedRegistries();

  // now get list
  const registries = get(recommendedRegistries);
  expect(registries.length).toBe(1);
  expect(registries[0].extensionId).toEqual('my.extensionId');

  // ok now mock the getRecommendedRegistries function to return an empty list
  getRecommendedRegistriesMock.mockResolvedValue([]);
  getRecommendedRegistriesMock.mockClear();
  // call 'container-removed-event' event
  const configurationChangedCallback = callbacks.get('configuration-changed');
  expect(configurationChangedCallback).toBeDefined();
  await configurationChangedCallback({ key: 'extensions.ignoreRecommendations' });

  // wait a little
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(getRecommendedRegistriesMock).toHaveBeenCalled();
});

test('recommendedRegistries should not be updated in case configuration changed is called with unexpected key', async () => {
  getRecommendedRegistriesMock.mockResolvedValue([
    {
      extensionId: 'my.extensionId',
      name: 'Hello',
      id: 'my.registry.com',
      errors: ['foo'],
    } as unknown as RecommendedRegistry,
  ]);
  recommendedRegistriesEventStore.setup();

  const callback = callbacks.get('extensions-already-started');
  // send 'extensions-already-started' event
  expect(callback).toBeDefined();
  await callback();

  // now ready to fetch recommended registries
  await fetchRecommendedRegistries();

  // now get list
  const registries = get(recommendedRegistries);
  expect(registries.length).toBe(1);
  expect(registries[0].extensionId).toEqual('my.extensionId');

  // ok now mock the getRecommendedRegistries function to return an empty list
  getRecommendedRegistriesMock.mockResolvedValue([]);
  getRecommendedRegistriesMock.mockClear();
  // call 'container-removed-event' event
  const configurationChangedCallback = callbacks.get('configuration-changed');
  expect(configurationChangedCallback).toBeDefined();
  await configurationChangedCallback({ key: 'extensions.otherKey' });

  // wait a little
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(getRecommendedRegistriesMock).not.toHaveBeenCalled();
});
