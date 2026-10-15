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

import { writable } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { StoreUtil } from './store-util';

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

test('Expect to resolve when the store already matches', async () => {
  const store = writable(['a']);

  await expect(StoreUtil.waitFor(store, values => values.includes('a'))).resolves.toEqual(['a']);
});

test('Expect to resolve when the store matches later', async () => {
  const store = writable<string[]>([]);

  const promise = StoreUtil.waitFor(store, values => values.includes('a'));
  store.set(['a']);

  await expect(promise).resolves.toEqual(['a']);
});

test('Expect to reject when the store never matches', async () => {
  const store = writable<string[]>([]);

  const rejects = expect(StoreUtil.waitFor(store, values => values.includes('a'), 10)).rejects.toThrow(
    'Timeout waiting for store after 10ms',
  );
  await vi.advanceTimersByTimeAsync(10);

  await rejects;
});

// svelte calls the subscriber synchronously during subscribe(), so a `const unsubscribe = ...`
// declaration would be in the temporal dead zone when the store already matches
test('Expect the subscription to be released when the store already matches', async () => {
  const stop = vi.fn();
  const store = writable(['a'], () => stop);

  await StoreUtil.waitFor(store, values => values.includes('a'));

  // the store notifier is stopped once the last subscriber is gone
  expect(stop).toHaveBeenCalledOnce();
});

test('Expect the subscription to be released when the store matches later', async () => {
  const stop = vi.fn();
  const store = writable<string[]>([], () => stop);

  const promise = StoreUtil.waitFor(store, values => values.includes('a'));
  store.set(['a']);
  await promise;

  expect(stop).toHaveBeenCalledOnce();
});

test('Expect the subscription to be released on timeout', async () => {
  const stop = vi.fn();
  const store = writable<string[]>([], () => stop);

  // the rejection itself is covered by another test, only swallow it here
  const timedOut = StoreUtil.waitFor(store, values => values.includes('a'), 10).catch(() => undefined);
  await vi.advanceTimersByTimeAsync(10);
  await timedOut;

  expect(stop).toHaveBeenCalledOnce();
});

test('Expect a throwing predicate to reject and to clean up', async () => {
  const stop = vi.fn();
  // the images store has been seen holding undefined, which makes an `includes` predicate throw
  const store = writable<string[]>(undefined as unknown as string[], () => stop);

  // must not throw synchronously, as callers rely on always getting a promise back
  const promise = StoreUtil.waitFor(store, values => values.includes('a'));

  await expect(promise).rejects.toThrow(TypeError);
  expect(stop).toHaveBeenCalledOnce();
  // the timeout must not be left running against a promise nobody holds
  expect(vi.getTimerCount()).toBe(0);
});

test('Expect the pending timeout to be cleared once the store matched', async () => {
  const store = writable(['a']);

  await StoreUtil.waitFor(store, values => values.includes('a'));

  // the timeout must not be left pending once the promise settled
  expect(vi.getTimerCount()).toBe(0);
});

test('Expect the default timeout to be used when none is given', async () => {
  const store = writable<string[]>([]);
  const rejected = vi.fn();

  const promise = StoreUtil.waitFor(store, values => values.includes('a')).catch(rejected);

  await vi.advanceTimersByTimeAsync(StoreUtil.DEFAULT_WAIT_FOR_TIMEOUT - 1);
  expect(rejected).not.toHaveBeenCalled();

  await vi.advanceTimersByTimeAsync(1);
  await promise;
  expect(rejected).toHaveBeenCalledWith(
    expect.objectContaining({
      message: `Timeout waiting for store after ${StoreUtil.DEFAULT_WAIT_FOR_TIMEOUT}ms`,
    }),
  );
});
