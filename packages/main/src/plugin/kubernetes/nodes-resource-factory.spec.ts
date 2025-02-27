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

import type { V1Node } from '@kubernetes/client-node';
import { expect, test } from 'vitest';

import { NodesResourceFactory } from './nodes-resource-factory.js';

test('node with no status is not active', () => {
  const factory = new NodesResourceFactory();
  expect(
    factory.isActive({
      spec: {
        replicas: 0,
      },
    } as V1Node),
  ).toBeFalsy();
});

test('node with "Ready" condition set to true is active', () => {
  const factory = new NodesResourceFactory();
  expect(
    factory.isActive({
      status: {
        conditions: [
          {
            type: 'Ready',
            status: 'True',
          },
        ],
      },
    } as V1Node),
  ).toBeTruthy();
});

test('node with "Ready" condition set to false is not active', () => {
  const factory = new NodesResourceFactory();
  expect(
    factory.isActive({
      status: {
        conditions: [
          {
            type: 'Ready',
            status: 'False',
          },
        ],
      },
    } as V1Node),
  ).toBeFalsy();
});
