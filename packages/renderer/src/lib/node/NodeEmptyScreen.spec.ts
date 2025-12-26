/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { listenResourcePermitted } from '/@/lib/kube/resource-permission';

import NodeEmptyScreen from './NodeEmptyScreen.svelte';

const mocks = vi.hoisted(() => ({
  subscribeMock: vi.fn(),
  getCurrentKubeContextState: vi.fn(),
}));

vi.mock(import('/@/lib/kube/resource-permission'));
vi.mock(import('/@/stores/kubernetes-contexts-state'), () => ({
  kubernetesCurrentContextState: {
    subscribe: mocks.subscribeMock,
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.subscribeMock.mockImplementation(listener => {
    listener();
    return { unsubscribe: (): void => {} };
  });
});

test('Expect deployment empty screen', async () => {
  vi.mocked(listenResourcePermitted).mockImplementation(vi.fn((_, callback) => callback(true)));
  render(NodeEmptyScreen);
  const noNodes = screen.getByRole('heading', { name: 'No nodes' });
  expect(noNodes).toBeInTheDocument();
});

test('Expect deployment empty screen not accessible', async () => {
  vi.mocked(listenResourcePermitted).mockImplementation(vi.fn((_, callback) => callback(false)));
  render(NodeEmptyScreen);
  const noNodes = screen.getByRole('heading', { name: 'Nodes not accessible' });
  expect(noNodes).toBeInTheDocument();
});

test('If kubernetesCurrentContextState is not empty, expect that the empty screen say you do not have permission to view the nodes', async () => {
  mocks.subscribeMock.mockImplementation(listener => {
    listener({
      error: undefined,
      reachable: true,
      resources: {
        pods: 0,
        deployments: 0,
      },
    });
    return { unsubscribe: (): void => {} };
  });
  render(NodeEmptyScreen);
  const noNodes = screen.getByText('You may not have permission to view the nodes on your cluster');
  expect(noNodes).toBeInTheDocument();
});
