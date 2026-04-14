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

import { get } from 'svelte/store';
import { expect, test } from 'vitest';

import { kubernetesContexts } from './kubernetes-contexts';
import { kubernetesNoCurrentContext } from './kubernetes-no-current-context';

test('is true when there is no context', () => {
  kubernetesContexts.set([]);
  const currentValue = get(kubernetesNoCurrentContext);
  expect(currentValue).toBeTruthy();
});

test('is false when there is a current context', () => {
  kubernetesContexts.set([
    {
      name: 'ctx1',
      cluster: 'cluster1',
      user: 'user1',
    },
    {
      name: 'ctx2',
      cluster: 'cluster2',
      user: 'user2',
      currentContext: true,
    },
  ]);
  const currentValue = get(kubernetesNoCurrentContext);
  expect(currentValue).toBeFalsy();
});

test('is true when there is no current context', () => {
  kubernetesContexts.set([
    {
      name: 'ctx1',
      cluster: 'cluster1',
      user: 'user1',
    },
    {
      name: 'ctx2',
      cluster: 'cluster2',
      user: 'user2',
    },
  ]);
  const currentValue = get(kubernetesNoCurrentContext);
  expect(currentValue).toBeTruthy();
});
