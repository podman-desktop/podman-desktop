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

import { expect, test, vi } from 'vitest';

import { tablePersistence } from './table-persistence-store.svelte';

test('tablePersistence starts as undefined', async () => {
  expect(tablePersistence.storage).toBeUndefined();
});

test('tablePersistence can be called after setup', async () => {
  const mockCallbacks = {
    load: vi.fn().mockResolvedValue([
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 0 },
      { id: 'Age', label: 'Age', enabled: false, originalOrder: 1 },
    ]),
    save: vi.fn().mockResolvedValue(undefined),
    reset: vi.fn().mockResolvedValue([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]),
  };

  tablePersistence.storage = mockCallbacks;

  const storeValue = tablePersistence.storage;
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
