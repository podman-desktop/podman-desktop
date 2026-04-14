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

import type { KubernetesObject, V1Service } from '@kubernetes/client-node';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import * as states from '/@/stores/kubernetes-contexts-state';

import ServicesList from './ServicesList.svelte';

vi.mock('/@/stores/kubernetes-contexts-state');

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  vi.mocked(states).serviceSearchPattern = writable<string>('');
  vi.mocked(states).kubernetesContextsCheckingStateDelayed = writable();
  vi.mocked(states).kubernetesCurrentContextState = writable();
});

test('Expect service empty screen', async () => {
  vi.mocked(states).kubernetesCurrentContextServicesFiltered = writable<KubernetesObject[]>([]);
  render(ServicesList);
  await vi.waitFor(() => {
    const noServices = screen.getByRole('heading', { name: 'No services' });
    expect(noServices).toBeInTheDocument();
  });
});

test('Expect services list', async () => {
  const service: V1Service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: 'my-service',
      namespace: 'test-namespace',
    },
    spec: {
      selector: {},
      ports: [],
      externalName: 'serve',
    },
  };
  vi.mocked(states).kubernetesCurrentContextServicesFiltered = writable<KubernetesObject[]>([service]);

  render(ServicesList);

  await vi.waitFor(() => {
    const serviceName = screen.getByRole('cell', { name: 'my-service test-namespace' });
    expect(serviceName).toBeInTheDocument();
  });
});

test('Expect filter empty screen', async () => {
  vi.mocked(states).kubernetesCurrentContextServicesFiltered = writable<KubernetesObject[]>([]);

  render(ServicesList, { searchTerm: 'No match' });

  await vi.waitFor(() => {
    const filterButton = screen.getByRole('button', { name: 'Clear filter' });
    expect(filterButton).toBeInTheDocument();
  });
});

test('Expect user confirmation to pop up when preferences require', async () => {
  const service: V1Service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: 'my-service',
    },
    spec: {
      selector: {},
      ports: [],
      externalName: 'serve',
    },
  };
  vi.mocked(states).kubernetesCurrentContextServicesFiltered = writable<KubernetesObject[]>([service]);

  render(ServicesList);

  await vi.waitFor(async () => {
    const checkboxes = screen.getAllByRole('checkbox', { name: 'Toggle service' });
    await fireEvent.click(checkboxes[0]);
  });

  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 1 });

  const deleteButton = screen.getByRole('button', { name: 'Delete 1 selected items' });
  await fireEvent.click(deleteButton);
  expect(window.showMessageBox).toHaveBeenCalledOnce();

  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  await fireEvent.click(deleteButton);
  expect(window.showMessageBox).toHaveBeenCalledTimes(2);
  await vi.waitFor(() => expect(window.kubernetesDeleteService).toHaveBeenCalled());
});

test('services list is updated when kubernetesCurrentContextServicesFiltered changes', async () => {
  const service1: V1Service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: 'my-service-1',
      namespace: 'test-namespace',
    },
    spec: {
      selector: {},
      ports: [],
      externalName: 'serve',
    },
  };
  const service2: V1Service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: 'my-service-2',
      namespace: 'test-namespace',
    },
    spec: {
      selector: {},
      ports: [],
      externalName: 'serve',
    },
  };

  const filtered = writable<KubernetesObject[]>([service1, service2]);
  vi.mocked(states).kubernetesCurrentContextServicesFiltered = filtered;

  const component = render(ServicesList);

  await vi.waitFor(async () => {
    const serviceName1 = screen.getByRole('cell', { name: 'my-service-1 test-namespace' });
    expect(serviceName1).toBeInTheDocument();
    const serviceName2 = screen.getByRole('cell', { name: 'my-service-2 test-namespace' });
    expect(serviceName2).toBeInTheDocument();
  });

  filtered.set([service2]);
  await component.rerender({});

  const serviceName1after = screen.queryByRole('cell', { name: 'my-service-1 test-namespace' });
  expect(serviceName1after).not.toBeInTheDocument();
  const serviceName2after = screen.getByRole('cell', { name: 'my-service-2 test-namespace' });
  expect(serviceName2after).toBeInTheDocument();
});
