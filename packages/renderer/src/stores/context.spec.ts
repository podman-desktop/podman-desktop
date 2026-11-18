/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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

import { ContextUI } from '/@/lib/context/context';

import { setup } from './context';

const callbacks = new Map<string, (data?: unknown) => void>();

beforeEach(() => {
  callbacks.clear();
  vi.resetAllMocks();
  vi.useRealTimers();
  vi.mocked(window.events.receive).mockImplementation((message, callback) => {
    callbacks.set(message, callback);
    return { dispose: vi.fn() };
  });
});

test('context store values updated on context-value-updated/context-key-removed events', async () => {
  vi.mocked(window.events.receive).mockImplementation((msg, f) => {
    if (msg === 'context-value-updated') {
      setTimeout(() => f({ key: 'c', value: 'three' }), 5);
      setTimeout(() => f({ key: 'b', value: 2 }), 15);
    } else if (msg === 'context-key-removed') {
      setTimeout(() => f({ key: 'a', value: 1 }), 10);
    }
    return { dispose: vi.fn() };
  });

  vi.useFakeTimers();
  const context = setup();
  const initial = new ContextUI();
  initial.setValue('a', 1);
  initial.setValue('b', 'two');
  context.set(initial);

  vi.advanceTimersByTime(6);
  initial.setValue('c', 'three');
  // context-value-updated has added the value to the store
  expect(get(context)).toEqual(initial);

  vi.advanceTimersByTime(5);
  initial.removeValue('a');
  // context-key-removed has removed the value from the store
  expect(get(context)).toEqual(initial);

  vi.advanceTimersByTime(5);
  initial.setValue('b', 2);
  // context-key-updated has updated the value in the store
  expect(get(context)).toEqual(initial);
});

test('context store emits a new instance on context-value-updated', () => {
  const store = setup();
  const initial = new ContextUI();
  initial.setValue('a', 1);
  store.set(initial);

  const previous = get(store);
  const listener = callbacks.get('context-value-updated');
  assert(listener, 'the store should listen to context-value-updated events');
  listener({ key: 'b', value: 'two' });

  const updated = get(store);
  // a new instance is emitted so that $derived($context) consumers are notified
  expect(updated).not.toBe(previous);
  expect(updated.getValue('a')).toBe(1);
  expect(updated.getValue('b')).toBe('two');
  // the previous instance is left untouched
  expect(previous.getValue('b')).toBeUndefined();
});

test('context store emits a new instance on context-key-removed', () => {
  const store = setup();
  const initial = new ContextUI();
  initial.setValue('a', 1);
  store.set(initial);

  const previous = get(store);
  const listener = callbacks.get('context-key-removed');
  assert(listener, 'the store should listen to context-key-removed events');
  listener({ key: 'a' });

  const updated = get(store);
  expect(updated).not.toBe(previous);
  expect(updated.getValue('a')).toBeUndefined();
  // the previous instance is left untouched
  expect(previous.getValue('a')).toBe(1);
});

test('context store values set on extensions-already-started', async () => {
  vi.mocked(window.contextCollectAllValues).mockResolvedValue({ a: 1, b: 'two' });

  const context = setup();

  window.dispatchEvent(new CustomEvent('extensions-already-started'));

  const expected = new ContextUI();
  expected.setValue('a', 1);
  expected.setValue('b', 'two');

  await new Promise(resolve => setTimeout(resolve, 0));
  expect(get(context)).toEqual(expected);
});
