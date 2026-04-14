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

import type { KubernetesObject } from '@kubernetes/client-node';
import { expect, test, vi } from 'vitest';

import { createNavigationKubernetesPodsEntry } from './navigation-registry-k8s-pods.svelte';

test('createNavigationKubernetesDeploymentsEntry', async () => {
  const pods: KubernetesObject[] = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'pod1',
      },
    },
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'pod2',
      },
    },
  ];
  vi.mocked(window.kubernetesRegisterGetCurrentContextResources).mockResolvedValue(pods);

  const entry = createNavigationKubernetesPodsEntry();

  expect(entry).toBeDefined();
  expect(entry.name).toBe('Pods');
  expect(entry.link).toBe('/kubernetes/pods');
  expect(entry.tooltip).toBe('Pods');
  await vi.waitFor(() => {
    expect(entry.counter).toBe(2);
  });
});
