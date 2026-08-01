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
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { createDarkClassStore } from './dark-class';

describe('createDarkClassStore', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  describe('initial value', () => {
    test('is true when the dark class is present', () => {
      document.documentElement.classList.add('dark');
      expect(get(createDarkClassStore())).toBe(true);
    });

    test('is false when the dark class is absent', () => {
      expect(get(createDarkClassStore())).toBe(false);
    });
  });

  describe('when the dark class changes', () => {
    test('notifies subscribers', async () => {
      const store = createDarkClassStore();
      const values: boolean[] = [];
      const unsubscribe = store.subscribe(value => {
        values.push(value);
      });

      expect(values.at(-1)).toBe(false);

      document.documentElement.classList.add('dark');
      await vi.waitFor(() => expect(values.at(-1)).toBe(true));

      document.documentElement.classList.remove('dark');
      await vi.waitFor(() => expect(values.at(-1)).toBe(false));

      unsubscribe();
    });
  });

  describe('MutationObserver lifecycle', () => {
    let mutationObserverObserve: typeof MutationObserver.prototype.observe;
    let mutationObserverDisconnect: typeof MutationObserver.prototype.disconnect;

    beforeEach(() => {
      vi.resetAllMocks();
      mutationObserverObserve = MutationObserver.prototype.observe;
      mutationObserverDisconnect = MutationObserver.prototype.disconnect;
      MutationObserver.prototype.observe = vi.fn();
      MutationObserver.prototype.disconnect = vi.fn();
    });

    afterEach(() => {
      MutationObserver.prototype.observe = mutationObserverObserve;
      MutationObserver.prototype.disconnect = mutationObserverDisconnect;
    });

    test('observes once for multiple subscribers and disconnects when the last unsubscribes', () => {
      const store = createDarkClassStore();
      const first = store.subscribe(vi.fn());
      const second = store.subscribe(vi.fn());

      expect(MutationObserver.prototype.observe).toHaveBeenCalledTimes(1);
      expect(MutationObserver.prototype.disconnect).toHaveBeenCalledTimes(0);

      first();
      expect(MutationObserver.prototype.disconnect).toHaveBeenCalledTimes(0);

      second();
      expect(MutationObserver.prototype.disconnect).toHaveBeenCalledTimes(1);
    });

    test('restarts the observer when a subscriber arrives after disconnect', () => {
      const store = createDarkClassStore();
      const unsubscribe = store.subscribe(vi.fn());
      unsubscribe();

      expect(MutationObserver.prototype.disconnect).toHaveBeenCalledTimes(1);

      store.subscribe(vi.fn());
      expect(MutationObserver.prototype.observe).toHaveBeenCalledTimes(2);
    });
  });
});
