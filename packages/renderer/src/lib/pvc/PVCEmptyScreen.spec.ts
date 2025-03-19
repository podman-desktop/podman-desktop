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

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { listenResourcePermitted } from '../kube/resource-permission';
import PVCEmptyScreen from './PVCEmptyScreen.svelte';

const mocks = vi.hoisted(() => ({
  subscribeMock: vi.fn(),
  getCurrentKubeContextState: vi.fn(),

  // window mocks
  eventsMocks: vi.fn(),
}));

vi.mock('../kube/resource-permission');
vi.mock('../../stores/kubernetes-contexts-state', () => ({
  kubernetesCurrentContextState: {
    subscribe: mocks.subscribeMock,
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.subscribeMock.mockImplementation(listener => {
    listener(mocks.getCurrentKubeContextState());
    return { unsubscribe: (): void => {} };
  });

  Object.defineProperty(window, 'events', { value: mocks.eventsMocks });
  Object.defineProperty(window, 'kubernetesGetContextsGeneralState', { value: mocks.getCurrentKubeContextState });
});

test('Expect PVC empty screen', async () => {
  vi.mocked(listenResourcePermitted).mockImplementation(vi.fn((_, callback) => callback(true)));
  render(PVCEmptyScreen);
  const noPVCS = screen.getByRole('heading', { name: 'No PVCs' });
  expect(noPVCS).toBeInTheDocument();
});

test('Expect PVC empty screen not accessible', async () => {
  vi.mocked(listenResourcePermitted).mockImplementation(vi.fn((_, callback) => callback(false)));
  render(PVCEmptyScreen);
  const noPVCS = screen.getByRole('heading', { name: 'PVCs not accessible' });
  expect(noPVCS).toBeInTheDocument();
});
