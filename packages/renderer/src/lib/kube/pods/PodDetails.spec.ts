/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import type { CoreV1Event, KubernetesObject, V1Pod } from '@kubernetes/client-node';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { router } from 'tinro';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { lastPage } from '/@/stores/breadcrumb';
import * as kubeContextStore from '/@/stores/kubernetes-contexts-state';

import PodDetails from './PodDetails.svelte';

const mocks = vi.hoisted(() => ({
  TerminalMock: vi.fn(),
}));
vi.mock('@xterm/xterm', () => ({
  Terminal: mocks.TerminalMock,
}));
vi.mock('@xterm/addon-search');

vi.mock('/@/stores/kubernetes-contexts-state', async () => {
  return {
    kubernetesCurrentContextPods: vi.fn(),
    kubernetesCurrentContextEvents: vi.fn(),
  };
});

const myPod: V1Pod = {
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: { name: 'my-pod', namespace: 'default' },
  spec: {
    containers: [
      {
        name: 'test-container',
        ports: [{ name: 'http', containerPort: 8080 }],
      },
    ],
  },
};

const showMessageBoxMock = vi.fn();
const kubernetesDeletePodMock = vi.fn();

beforeAll(() => {
  mocks.TerminalMock.mockReturnValue({
    loadAddon: vi.fn(),
    open: vi.fn(),
    write: vi.fn(),
    dispose: vi.fn(),
  });
  global.ResizeObserver = vi.fn().mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  Object.defineProperty(window, 'showMessageBox', { value: showMessageBoxMock });
});

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.kubernetesListRoutes).mockResolvedValue([]);
  //vi.mocked(window.showMessageBox).mockImplementation(showMessageBoxMock);
  vi.mocked(window.kubernetesGetCurrentNamespace).mockResolvedValue('ns');
  vi.mocked(window.kubernetesReadNamespacedPod).mockResolvedValue({ metadata: { labels: { app: 'foo' } } });
  vi.mocked(window.kubernetesDeletePod).mockImplementation(kubernetesDeletePodMock);
});

test('Expect redirect to previous page if pod is deleted', async () => {
  showMessageBoxMock.mockResolvedValue({ response: 0 });

  const routerGotoSpy = vi.spyOn(router, 'goto');

  // mock object stores
  const pods = writable<KubernetesObject[]>([myPod]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextPods = pods;
  const events = writable<CoreV1Event[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextEvents = events;

  // remove deployment from the store when we call delete
  kubernetesDeletePodMock.mockImplementation(() => {
    pods.set([]);
  });

  // defines a fake lastPage so we can check where we will be redirected
  lastPage.set({ name: 'Fake Previous', path: '/last' });

  // render the component
  render(PodDetails, { name: 'my-pod', namespace: 'default' });
  expect(screen.getByText('my-pod')).toBeInTheDocument();

  // grab current route
  const currentRoute = window.location;
  expect(currentRoute.href).toBe('http://localhost:3000/');

  // click on delete pod button
  const deleteButton = screen.getByRole('button', { name: 'Delete Pod' });
  expect(deleteButton).toBeInTheDocument();
  expect(deleteButton).toBeEnabled();

  await fireEvent.click(deleteButton);
  expect(showMessageBoxMock).toHaveBeenCalledOnce();

  // Wait for confirmation modal to disappear after clicking on delete
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

  // check that delete method has been called
  expect(kubernetesDeletePodMock).toHaveBeenCalled();

  // expect that we have called the router when page has been removed
  // to jump to the previous page
  expect(routerGotoSpy).toBeCalledWith('/last');

  // grab updated route
  const afterRoute = window.location;
  expect(afterRoute.href).toBe('http://localhost:3000/last');
});
