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

import { beforeEach, expect, test } from 'vitest';

import { ContextResourceRegistry } from './context-resource-registry.js';

let registry: ContextResourceRegistry<string>;

beforeEach(() => {
  registry = new ContextResourceRegistry<string>();
});

test('ContextResourceRegistry', () => {
  registry.set('context1', 'resource1', 'value1');
  expect(registry.get('context1', 'resource1')).toEqual('value1');

  registry.set('context1', 'resource2', 'value2');
  expect(registry.getAll()).toEqual([
    {
      contextName: 'context1',
      resourceName: 'resource1',
      value: 'value1',
    },
    {
      contextName: 'context1',
      resourceName: 'resource2',
      value: 'value2',
    },
  ]);
});

test('getForResource', () => {
  registry.set('context1', 'resource1', 'value1');
  registry.set('context1', 'resource2', 'value2');
  registry.set('context2', 'resource1', 'value3');

  const result = registry.getForResource('resource1');
  expect(result).toEqual([
    {
      context: 'context1',
      item: 'value1',
    },
    {
      context: 'context2',
      item: 'value3',
    },
  ]);
});
