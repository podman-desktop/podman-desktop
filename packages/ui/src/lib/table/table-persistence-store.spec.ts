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
import { beforeEach, expect, test, vi } from 'vitest';

import { setup, tablePersistenceCallbacks } from './table-persistence-store';

const callbacks = new Map<string, any>();
const eventEmitter = {
  receive: (message: string, callback: any): void => {
    callbacks.set(message, callback);
  },
};

beforeEach(() => {
  (window as any).addEventListener = eventEmitter.receive;
});

test('tablePersistenceCallbacks starts as undefined, then gets set on table-persistence:setup', async () => {
  setup();

  expect(get(tablePersistenceCallbacks)).toBeUndefined();

  // now we call the listener
  const callback = callbacks.get('table-persistence:setup');

  expect(callback).toBeDefined();

  const mockCallbacks = {
    load: vi.fn().mockResolvedValue([]),
    save: vi.fn().mockResolvedValue(undefined),
    reset: vi.fn().mockResolvedValue([]),
  };

  // Create a mock event with detail
  const mockEvent = {
    detail: mockCallbacks,
  };

  callback(mockEvent);

  const storeValue = get(tablePersistenceCallbacks);
  expect(storeValue).toBeDefined();
  expect(storeValue?.load).toBe(mockCallbacks.load);
  expect(storeValue?.save).toBe(mockCallbacks.save);
  expect(storeValue?.reset).toBe(mockCallbacks.reset);
});

test('tablePersistenceCallbacks can be called after setup', async () => {
  setup();

  const mockCallbacks = {
    load: vi.fn().mockResolvedValue([
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 0 },
      { id: 'Age', label: 'Age', enabled: false, originalOrder: 1 },
    ]),
    save: vi.fn().mockResolvedValue(undefined),
    reset: vi.fn().mockResolvedValue([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]),
  };

  const callback = callbacks.get('table-persistence:setup');
  const mockEvent = { detail: mockCallbacks };
  callback(mockEvent);

  const storeValue = get(tablePersistenceCallbacks);
  expect(storeValue).toBeDefined();

  // Test load callback
  const loadResult = await storeValue!.load('test-kind', ['Name', 'Age']);
  expect(mockCallbacks.load).toHaveBeenCalledWith('test-kind', ['Name', 'Age']);
  expect(loadResult).toEqual([
    { id: 'Name', label: 'Name', enabled: true, originalOrder: 0 },
    { id: 'Age', label: 'Age', enabled: false, originalOrder: 1 },
  ]);

  // Test save callback
  const items = [{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }];
  await storeValue!.save('test-kind', items);
  expect(mockCallbacks.save).toHaveBeenCalledWith('test-kind', items);

  // Test reset callback
  const resetResult = await storeValue!.reset('test-kind', ['Name']);
  expect(mockCallbacks.reset).toHaveBeenCalledWith('test-kind', ['Name']);
  expect(resetResult).toEqual([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]);
});
