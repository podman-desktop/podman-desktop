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
import { router } from 'tinro';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { isKubernetesExperimentalMode } from '/@/lib/kube/resources-listen';
import {
  initListExperimental,
  initListsNonExperimental,
  type initListsReturnType,
} from '/@/lib/kube/tests-helpers/init-lists';
import { lastPage } from '/@/stores/breadcrumb';
import * as states from '/@/stores/kubernetes-contexts-state';

import PodDetails from './PodDetails.svelte';

vi.mock(import('@xterm/xterm'));
vi.mock(import('@xterm/addon-search'));
vi.mock(import('/@/stores/kubernetes-contexts-state'));

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

beforeAll(() => {
  global.ResizeObserver = vi.fn().mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
});

vi.mock(import('/@/lib/kube/resources-listen'), async importOriginal => {
  // we want to keep the original nonVerbose
  const original = await importOriginal();
  return {
    ...original,
    listenResources: vi.fn(),
    isKubernetesExperimentalMode: vi.fn(),
  };
});

beforeEach(() => {
  vi.resetAllMocks();
  router.goto('http://localhost:3000');
  vi.mocked(window.kubernetesListRoutes).mockResolvedValue([]);
  vi.mocked(window.kubernetesGetCurrentNamespace).mockResolvedValue('ns');
  vi.mocked(window.kubernetesReadNamespacedPod).mockResolvedValue({ metadata: { labels: { app: 'foo' } } });
});

describe.each<{
  experimental: boolean;
  initLists: (pods: KubernetesObject[], events: CoreV1Event[]) => initListsReturnType;
}>([
  {
    experimental: false,
    initLists: initListsNonExperimental({
      onResourcesStore: store => (vi.mocked(states).kubernetesCurrentContextPods = store),
      onEventsStore: store => (vi.mocked(states).kubernetesCurrentContextEvents = store),
    }),
  },
  {
    experimental: true,
    initLists: initListExperimental({ resourceName: 'pods' }),
  },
])('is experimental: $experimental', ({ experimental, initLists }) => {
  beforeEach(() => {
    vi.mocked(isKubernetesExperimentalMode).mockResolvedValue(experimental);
  });

  test('Expect redirect to previous page if pod is deleted', async () => {
    vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

    const routerGotoSpy = vi.spyOn(router, 'goto');

    // mock object stores
    const list = initLists([myPod], []);

    // remove pod from the store when we call delete
    vi.mocked(window.kubernetesDeletePod).mockImplementation(async () => {
      list.updateResources([]);
    });

    // defines a fake lastPage so we can check where we will be redirected
    lastPage.set({ name: 'Fake Previous', path: '/last' });

    // render the component
    render(PodDetails, { name: 'my-pod', namespace: 'default' });

    await vi.waitFor(() => {
      expect(screen.getByText('my-pod')).toBeInTheDocument();
    });

    // grab current route
    const currentRoute = window.location;
    expect(currentRoute.href).toBe('http://localhost:3000/');

    // click on delete pod button
    const deleteButton = screen.getByRole('button', { name: 'Delete Pod' });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();

    await fireEvent.click(deleteButton);
    expect(window.showMessageBox).toHaveBeenCalledOnce();

    // Wait for confirmation modal to disappear after clicking on delete
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    // check that delete method has been called
    expect(window.kubernetesDeletePod).toHaveBeenCalled();

    // expect that we have called the router when page has been removed
    // to jump to the previous page
    expect(routerGotoSpy).toBeCalledWith('/last');

    // grab updated route
    const afterRoute = window.location;
    expect(afterRoute.href).toBe('http://localhost:3000/last');
  });
});
