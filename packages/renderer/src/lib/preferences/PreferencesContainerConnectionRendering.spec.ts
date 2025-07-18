/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import { lastPage } from '/@/stores/breadcrumb';
import type { ProviderInfo } from '/@api/provider-info';

import { providerInfos } from '../../stores/providers';
import PreferencesContainerConnectionRendering from './PreferencesContainerConnectionRendering.svelte';

const EMPTY_PROVIDER_MOCK: ProviderInfo = {
  id: 'podman',
  name: 'podman',
  images: {
    icon: 'img',
  },
  status: 'started',
  warnings: [],
  containerProviderConnectionCreation: true,
  detectionChecks: [],
  installationSupport: false,
  internalId: '0',
  containerConnections: [],
  kubernetesConnections: [],
  kubernetesProviderConnectionCreation: true,
  vmConnections: [],
  vmProviderConnectionCreation: false,
  vmProviderConnectionInitialization: false,
  links: [],
  containerProviderConnectionInitialization: false,
  containerProviderConnectionCreationDisplayName: 'Podman machine',
  kubernetesProviderConnectionInitialization: false,
  extensionId: '',
  cleanupSupport: false,
};

test('Expect that the right machine is displayed', async () => {
  const socketPath = '/my/common-socket-path';
  const podmanMachineName1 = 'podman machine 1';
  const podmanMachineName2 = 'podman machine 2';
  const podmanMachineName3 = 'podman machine 3';

  const providerInfo: ProviderInfo = {
    ...EMPTY_PROVIDER_MOCK,
    containerConnections: [
      {
        name: podmanMachineName1,
        displayName: podmanMachineName1,
        status: 'started',
        endpoint: {
          socketPath,
        },
        type: 'podman',
      },
      {
        name: podmanMachineName2,
        displayName: podmanMachineName2,
        status: 'started',
        endpoint: {
          socketPath,
        },
        type: 'podman',
      },
      {
        name: podmanMachineName3,
        displayName: podmanMachineName3,
        status: 'started',
        endpoint: {
          socketPath,
        },
        type: 'podman',
      },
    ],
  };

  // 3 connections with the same socket path
  providerInfos.set([providerInfo]);

  // encode name with base64 of the second machine
  const name = Buffer.from(podmanMachineName2).toString('base64');

  const connection = Buffer.from(socketPath).toString('base64');

  render(PreferencesContainerConnectionRendering, {
    name,
    connection,
    providerInternalId: '0',
  });

  // expect to have the second machine being displayed (and not the first one that also match socket path)
  const title = screen.getByRole('heading', { name: 'podman machine 2', level: 1 });
  expect(title).toBeInTheDocument();
});

test('Expect that removing the connection is going back to the previous page', async () => {
  const socketPath = '/my/common-socket-path';
  const podmanMachineName1 = 'podman machine 1';
  const podmanMachineName2 = 'podman machine 2';
  const podmanMachineName3 = 'podman machine 3';

  const routerGotoSpy = vi.spyOn(router, 'goto');

  const deleteMock = vi.fn();
  (window as any).deleteProviderConnectionLifecycle = deleteMock;

  const providerInfo: ProviderInfo = {
    ...EMPTY_PROVIDER_MOCK,
    containerConnections: [
      {
        name: podmanMachineName1,
        displayName: podmanMachineName1,
        status: 'started',
        endpoint: {
          socketPath,
        },
        type: 'podman',
      },
      {
        name: podmanMachineName2,
        displayName: podmanMachineName2,
        status: 'stopped',
        endpoint: {
          socketPath,
        },
        type: 'podman',
        lifecycleMethods: ['delete'],
      },
      {
        name: podmanMachineName3,
        displayName: podmanMachineName3,
        status: 'started',
        endpoint: {
          socketPath,
        },
        type: 'podman',
      },
    ],
  };

  // 3 connections with the same socket path
  providerInfos.set([providerInfo]);

  // encode name with base64 of the second machine
  const name = Buffer.from(podmanMachineName2).toString('base64');

  const connection = Buffer.from(socketPath).toString('base64');

  // defines a fake lastPage so we can check where we will be redirected
  lastPage.set({ name: 'Fake Previous', path: '/last' });

  // delete current machine 2 from the provider info
  deleteMock.mockImplementation(() => {
    providerInfos.update(providerInfos =>
      providerInfos.map(provider => {
        provider.containerConnections = provider.containerConnections.filter(
          connection => connection.name !== podmanMachineName2,
        );
        return provider;
      }),
    );
  });

  render(PreferencesContainerConnectionRendering, {
    name,
    connection,
    providerInternalId: '0',
  });

  // expect to have the second machine being displayed (and not the first one that also match socket path)
  const title = screen.getByRole('heading', { name: 'podman machine 2', level: 1 });
  expect(title).toBeInTheDocument();

  // ok now we delete the connection
  const deleteButton = screen.getByRole('button', { name: 'Delete' });

  // grab current route
  const currentRoute = window.location;
  expect(currentRoute.href).toBe('http://localhost:3000/');

  // click on it
  await userEvent.click(deleteButton);

  // expect that we have called the router when page has been removed
  // to jump to the resources page
  expect(routerGotoSpy).toBeCalledWith('/preferences/resources');

  // grab updated route
  const afterRoute = window.location;
  expect(afterRoute.href).toBe('http://localhost:3000/preferences/resources');
});

test('Expect to see error message if action fails', async () => {
  const socketPath = '/my/common-socket-path';
  const podmanMachineName = 'podman machine';

  const deleteMock = vi.fn();
  (window as any).deleteProviderConnectionLifecycle = deleteMock;

  const providerInfo: ProviderInfo = {
    ...EMPTY_PROVIDER_MOCK,
    containerConnections: [
      {
        name: podmanMachineName,
        displayName: podmanMachineName,
        status: 'stopped',
        endpoint: {
          socketPath,
        },
        type: 'podman',
        lifecycleMethods: ['delete'],
      },
    ],
  };

  providerInfos.set([providerInfo]);

  // encode name with base64 of the second machine
  const name = Buffer.from(podmanMachineName).toString('base64');

  const connection = Buffer.from(socketPath).toString('base64');

  // simulate that the delete action fails
  deleteMock.mockRejectedValue('failed to delete machine');

  render(PreferencesContainerConnectionRendering, {
    name,
    connection,
    providerInternalId: '0',
  });

  // expect to have the machine title being displayed
  const title = screen.getByRole('heading', { name: 'podman machine', level: 1 });
  expect(title).toBeInTheDocument();

  let deleteFailedButton = screen.queryByRole('button', { name: 'delete failed' });

  // expect that the delete failed button is not in the page
  expect(deleteFailedButton).not.toBeInTheDocument();

  // ok now we delete the connection
  const deleteButton = screen.getByRole('button', { name: 'Delete' });

  // click on it
  await userEvent.click(deleteButton);

  deleteFailedButton = screen.getByRole('button', { name: 'delete failed' });

  // expect to see the delete failed button
  expect(deleteFailedButton).toBeInTheDocument();
});

test('Expect startContainerProvider to only be called once when restarting', async () => {
  const socketPath = '/my/common-socket-path';
  const podmanMachineName = 'podman machine';

  const stopConnectionMock = vi.fn();
  const startConnectionMock = vi.fn();
  (window as any).stopProviderConnectionLifecycle = stopConnectionMock;
  (window as any).startProviderConnectionLifecycle = startConnectionMock;

  const providerInfo: ProviderInfo = {
    ...EMPTY_PROVIDER_MOCK,
    containerConnections: [
      {
        name: podmanMachineName,
        displayName: podmanMachineName,
        status: 'started',
        endpoint: {
          socketPath,
        },
        type: 'podman',
        lifecycleMethods: ['start', 'stop'],
      },
    ],
  };

  providerInfos.set([providerInfo]);

  // encode name with base64 of the second machine
  const name = Buffer.from(podmanMachineName).toString('base64');

  const connection = Buffer.from(socketPath).toString('base64');

  render(PreferencesContainerConnectionRendering, {
    name,
    connection,
    providerInternalId: '0',
  });

  // restart the connection
  const restartButton = screen.getByRole('button', { name: 'Restart' });

  // click on it
  await userEvent.click(restartButton);

  // update provider connection status, simulate it was stopped
  providerInfo.containerConnections[0].status = 'stopped';
  providerInfos.set([providerInfo]);

  // update provider connection status - simulate it is started again
  providerInfo.containerConnections[0].status = 'started';
  providerInfos.set([providerInfo]);

  expect(startConnectionMock).toBeCalledTimes(1);
});

test('Expect display name to be used in favor of name for page title', async () => {
  const socketPath = '/my/common-socket-path';
  const podmanMachineName = 'podman-machine-default';
  const podmanMachineDisplayName = 'Dummy Podman Display Name';

  const stopConnectionMock = vi.fn();
  const startConnectionMock = vi.fn();
  (window as any).stopProviderConnectionLifecycle = stopConnectionMock;
  (window as any).startProviderConnectionLifecycle = startConnectionMock;

  const providerInfo: ProviderInfo = {
    ...EMPTY_PROVIDER_MOCK,
    containerConnections: [
      {
        name: podmanMachineName,
        displayName: podmanMachineDisplayName,
        status: 'started',
        endpoint: {
          socketPath,
        },
        type: 'podman',
        lifecycleMethods: ['start', 'stop'],
      },
    ],
  };

  providerInfos.set([providerInfo]);

  // encode name with base64 of the second machine
  const name = Buffer.from(podmanMachineName).toString('base64');

  const connection = Buffer.from(socketPath).toString('base64');

  const { getByLabelText } = render(PreferencesContainerConnectionRendering, {
    name,
    connection,
    providerInternalId: '0',
  });

  const header = getByLabelText(podmanMachineDisplayName);
  expect(header).toBeDefined();
  expect(header instanceof HTMLHeadingElement).toBeTruthy();
  expect(header.textContent).toBe(podmanMachineDisplayName);
});

test('expect terminal tab to be visible if shellAccess is truthy', async () => {
  const socketPath = '/my/common-socket-path';
  const podmanMachineName = 'podman-machine-default';
  const podmanMachineDisplayName = 'Dummy Podman Display Name';

  const providerInfo: ProviderInfo = {
    ...EMPTY_PROVIDER_MOCK,
    containerConnections: [
      {
        name: podmanMachineName,
        displayName: podmanMachineDisplayName,
        status: 'started',
        endpoint: {
          socketPath,
        },
        shellAccess: true,
        type: 'podman',
      },
    ],
  };

  providerInfos.set([providerInfo]);

  // encode name with base64 of the second machine
  const name = Buffer.from(podmanMachineName).toString('base64');

  const connection = Buffer.from(socketPath).toString('base64');

  const { getByText } = render(PreferencesContainerConnectionRendering, {
    name,
    connection,
    providerInternalId: '0',
  });

  const tab = getByText('Terminal');
  expect(tab.id).toBe('open-tabs-list-terminal-link');
});
