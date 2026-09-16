/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { get } from 'svelte/store';
import { assert, beforeEach, expect, test, vi } from 'vitest';

import { navigationSearchEntries, navigationSearchEntriesEventStore } from './navigation-search-entries';

const callbacks = new Map<string, (data?: unknown) => void | Promise<void>>();

beforeEach(() => {
  callbacks.clear();
  vi.resetAllMocks();
  vi.mocked(window.events.receive).mockImplementation((message, callback) => {
    callbacks.set(message, callback);
    return { dispose: vi.fn() };
  });
});

test('navigation search entries should be updated on system-ready event', async () => {
  vi.mocked(window.getSearchableNavigationRoutes).mockResolvedValue([
    { routeId: 'ext.route-1', label: 'Dashboard' },
    { routeId: 'ext.route-2', label: 'Models', icon: 'icon.png' },
  ]);

  navigationSearchEntriesEventStore.setup();

  window.dispatchEvent(new CustomEvent('system-ready'));

  await vi.waitFor(() => {
    const entries = get(navigationSearchEntries);
    expect(entries.length).toBe(2);
    expect(entries[0]).toEqual({ routeId: 'ext.route-1', label: 'Dashboard' });
    expect(entries[1]).toEqual({ routeId: 'ext.route-2', label: 'Models', icon: 'icon.png' });
  });
});

test('navigation search entries should be updated on navigation-searchable-route-update event', async () => {
  navigationSearchEntriesEventStore.setupWithDebounce(10, 10);

  vi.mocked(window.getSearchableNavigationRoutes).mockResolvedValue([]);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));

  vi.mocked(window.getSearchableNavigationRoutes).mockClear();

  vi.mocked(window.getSearchableNavigationRoutes).mockResolvedValue([{ routeId: 'ext.new-route', label: 'New Route' }]);

  const callback = callbacks.get('navigation-searchable-route-update');
  assert(callback);
  await callback();

  await vi.waitFor(() => {
    const entries = get(navigationSearchEntries);
    expect(entries.length).toBe(1);
    expect(entries[0]).toEqual({ routeId: 'ext.new-route', label: 'New Route' });
  });
});
