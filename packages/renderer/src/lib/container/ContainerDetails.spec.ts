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

import type { ContainerInfo, ContainerInspectInfo } from '@podman-desktop/core-api';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { lastPage } from '/@/stores/breadcrumb';
import { containersInfos } from '/@/stores/containers';

import ContainerDetails from './ContainerDetails.svelte';

const myContainer: ContainerInfo = {
  Id: 'myContainer',
  Labels: {},
  Status: 'running',
  engineId: 'engine0',
  engineName: 'podman',
  engineType: 'podman',
  StartedAt: '',
  Names: ['name0'],
  Image: '',
  ImageID: '',
  Command: '',
  Created: 0,
  Ports: [],
  State: '',
  ImageBase64RepoTag: '',
};

vi.mock(import('@xterm/xterm'));
vi.mock(import('@xterm/addon-search'));

const getConfigurationValueMock = vi.fn().mockReturnValue(12);

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
  vi.mocked(window.getContributedMenus).mockResolvedValue([]);
});

test('Expect logs when tty is not enabled', async () => {
  router.goto('/');

  containersInfos.set([myContainer]);

  // spy router.goto
  const routerGotoSpy = vi.spyOn(router, 'goto');

  vi.mocked(window.getContainerInspect).mockResolvedValue({
    Config: {
      Tty: false,
    },
  } as unknown as ContainerInspectInfo);

  // render the component
  render(ContainerDetails, { containerID: 'myContainer' });

  // wait router.goto is called
  while (routerGotoSpy.mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // grab current route and check we have been redirected to tty
  const currentRoute = window.location;
  expect(currentRoute.href).toBe('http://localhost:3000/logs');

  expect(routerGotoSpy).toBeCalledWith('/logs');
});

test('Expect show tty if container has tty enabled', async () => {
  router.goto('/');

  containersInfos.set([myContainer]);

  // spy router.goto
  const routerGotoSpy = vi.spyOn(router, 'goto');

  vi.mocked(window.getContainerInspect).mockResolvedValue({
    Config: {
      Tty: true,
      OpenStdin: true,
    },
  } as unknown as ContainerInspectInfo);

  // render the component
  render(ContainerDetails, { containerID: 'myContainer' });

  await vi.waitFor(() => expect(routerGotoSpy.mock.calls.length > 0));

  // grab current route and check we have been redirected to tty
  const currentRoute = window.location;
  expect(currentRoute.href).toBe('http://localhost:3000/tty');

  expect(routerGotoSpy).toBeCalledWith('/tty');
});

test('Expect redirect to previous page if container is deleted', async () => {
  getConfigurationValueMock.mockResolvedValue(undefined);
  // Mock the showMessageBox to return 0 (yes)
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  router.goto('/');

  vi.mocked(window.getContainerInspect).mockResolvedValue({
    Config: {},
  } as unknown as ContainerInspectInfo);
  const routerGotoSpy = vi.spyOn(router, 'goto');
  vi.mocked(window.listContainers).mockResolvedValue([myContainer]);
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  while (get(containersInfos).length !== 1) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // remove myContainer from the store when we call 'deleteContainer'
  // it will then refresh the store and update ContainerDetails page
  vi.mocked(window.deleteContainer).mockImplementation(async (): Promise<void> => {
    containersInfos.update(containers => containers.filter(container => container.Id !== myContainer.Id));
  });

  // defines a fake lastPage so we can check where we will be redirected
  lastPage.set({ name: 'Fake Previous', path: '/last' });

  // render the component
  render(ContainerDetails, { containerID: 'myContainer' });

  // wait router.goto is called
  while (routerGotoSpy.mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // grab current route
  const currentRoute = window.location;
  expect(currentRoute.href).toBe('http://localhost:3000/logs');

  // click on delete container button
  const deleteButton = screen.getByRole('button', { name: 'Delete Container' });
  await fireEvent.click(deleteButton);

  // Wait for confirmation modal to disappear after clicking on delete
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

  // check that delete method has been called
  expect(vi.mocked(window.deleteContainer)).toHaveBeenCalled();

  // expect that we have called the router when page has been removed
  // to jump to the previous page
  expect(routerGotoSpy).toBeCalledWith('/last');

  // grab updated route
  const afterRoute = window.location;
  expect(afterRoute.href).toBe('http://localhost:3000/last');
});
