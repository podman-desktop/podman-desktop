/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

import { expect, test } from 'vitest';

import { ContextUI } from './context';

test('check that a false value is correctly returned', async () => {
  const context = new ContextUI();
  context.setValue('key', 'false');

  const value = context.getValue('key');
  expect(value).toBe('false');
});

test('check that value is correctly returned', async () => {
  const context = new ContextUI();
  context.setValue('key', 'value');

  const value = context.getValue('key');
  expect(value).toBe('value');
});

test('check that value of a dotted key is correctly returned', async () => {
  const context = new ContextUI();
  context.setValue('key', {
    first: 'value',
  });

  const value = context.getValue('key.first');
  expect(value).toBe('value');
});

test('check that clone returns a new instance holding the same values', async () => {
  const context = new ContextUI();
  context.setValue('key', 'value');

  const cloned = context.clone();
  expect(cloned).not.toBe(context);
  expect(cloned.getValue('key')).toBe('value');

  // updating the clone does not modify the original instance
  cloned.setValue('another', 'value');
  expect(context.getValue('another')).toBeUndefined();
});
