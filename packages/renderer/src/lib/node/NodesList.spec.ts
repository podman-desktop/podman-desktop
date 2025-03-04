/**********************************************************************
 * Copyright (C) 2024 - 2025 Red Hat, Inc.
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

import '@testing-library/jest-dom/vitest';

import type { KubernetesObject, V1Node } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import * as states from '/@/stores/kubernetes-contexts-state';

import NodesList from './NodesList.svelte';

vi.mock('/@/stores/kubernetes-contexts-state');

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  vi.mocked(states).nodeSearchPattern = writable<string>('');
  vi.mocked(states).kubernetesContextsCheckingStateDelayed = writable();
  vi.mocked(states).kubernetesCurrentContextState = writable();
});

test('Expect node empty screen', async () => {
  vi.mocked(states).kubernetesCurrentContextNodesFiltered = writable<KubernetesObject[]>([]);

  render(NodesList);
  await vi.waitFor(() => {
    const noNodes = screen.getByRole('heading', { name: 'No nodes' });
    expect(noNodes).toBeInTheDocument();
  });
});

test('Expect nodes list', async () => {
  const node: V1Node = {
    metadata: {
      name: 'node1',
      labels: {
        'kubernetes.io/role': 'master',
      },
    },
    status: {
      conditions: [
        {
          type: 'Ready',
          status: 'True',
        },
      ],
    },
  } as V1Node;

  vi.mocked(states).kubernetesCurrentContextNodesFiltered = writable<KubernetesObject[]>([node]);

  render(NodesList);

  await vi.waitFor(() => {
    const nodeName = screen.getByRole('cell', { name: 'node1' });
    expect(nodeName).toBeInTheDocument();
  });

  const nodeRole = screen.getByRole('cell', { name: 'Control Plane' });
  expect(nodeRole).toBeInTheDocument();
});
