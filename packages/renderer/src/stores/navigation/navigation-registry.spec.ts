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

import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { configurationProperties } from '/@/stores/configurationProperties';

import {
  fetchNavigationRegistries,
  navigationItemOrder,
  navigationRegistry,
  saveNavigationItemOrder,
} from './navigation-registry';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getKubernetesPortForwards).mockResolvedValue([]);
});

test('check navigation registry items', async () => {
  vi.mocked(window.kubernetesRegisterGetCurrentContextResources).mockResolvedValue([]);
  vi.mocked(window.kubernetesGetCurrentContextGeneralState).mockResolvedValue({
    reachable: true,
    resources: { pods: 0, deployments: 0 },
  });
  await fetchNavigationRegistries();
  const registries = get(navigationRegistry);
  // expect 8 items in the registry
  expect(registries.length).equal(8);
});

test('check update properties', async () => {
  // first, check that all items are visible
  const items = get(navigationRegistry);
  items.forEach(item => {
    expect(item.hidden).toBeFalsy();
  });

  // Say that Containers and Pods are hidden by the configuration
  vi.mocked(window.getConfigurationValue).mockResolvedValue(['Containers', 'Pods']);

  // do an update to force the update
  configurationProperties.set([]);

  // wait that the update is done asynchronously
  await new Promise(resolve => setTimeout(resolve, 500));

  // and now check the hidden values
  const hidden = get(navigationRegistry);

  const allItemsExceptContainersAndPods = hidden.filter(item => item.name !== 'Containers' && item.name !== 'Pods');
  allItemsExceptContainersAndPods.forEach(item => {
    expect(item.hidden).toBeFalsy();
  });

  const containersAndPods = hidden.filter(item => item.name === 'Containers' || item.name === 'Pods');
  containersAndPods.forEach(item => {
    expect(item.hidden).toBeTruthy();
  });
});

/** Mocks the configuration values read when the configuration properties change. */
function mockConfigurationValues(values: {
  disabledItems?: string[];
  itemOrder?: string[];
  useInternalKubernetes?: boolean;
}): void {
  vi.mocked(window.getConfigurationValue).mockImplementation(async key => {
    if (key === 'navbar.disabledItems') return values.disabledItems;
    if (key === 'navbar.itemOrder') return values.itemOrder;
    return values.useInternalKubernetes;
  });
}

test('applies the saved top-level order', async () => {
  mockConfigurationValues({ itemOrder: ['Tools', 'Containers'] });
  configurationProperties.set([]);

  await vi.waitFor(() => expect(get(navigationItemOrder)).toEqual(['Tools', 'Containers']));
  expect(window.updateConfigurationValue).not.toHaveBeenCalledWith('navbar.itemOrder', expect.anything());
});

test('saving the order of the shown items keeps the slots of the other items', () => {
  vi.mocked(window.updateConfigurationValue).mockResolvedValue(undefined);
  navigationItemOrder.set(['Containers', 'Pods', 'Images', 'Volumes']);

  // Pods is hidden: Images is moved before Containers
  saveNavigationItemOrder(['Images', 'Containers', 'Volumes']);

  const order = ['Images', 'Pods', 'Containers', 'Volumes'];
  expect(get(navigationItemOrder)).toEqual(order);
  expect(window.updateConfigurationValue).toHaveBeenCalledWith('navbar.itemOrder', order);
});

test('saving the order adds the items missing from the saved order', () => {
  vi.mocked(window.updateConfigurationValue).mockResolvedValue(undefined);
  navigationItemOrder.set([]);

  saveNavigationItemOrder(['Pods', 'Containers']);

  expect(get(navigationItemOrder)).toEqual(['Pods', 'Containers']);
});

test('the order is loaded from the configuration', async () => {
  mockConfigurationValues({ itemOrder: ['Pods', 'Containers'] });
  configurationProperties.set([]);

  await vi.waitFor(() => expect(get(navigationItemOrder)).toEqual(['Pods', 'Containers']));
});

test('applies the saved order when Kubernetes becomes available', async () => {
  // The Kubernetes group entries subscribe to the Kubernetes context stores on creation.
  vi.mocked(window.kubernetesRegisterGetCurrentContextResources).mockResolvedValue([]);
  vi.mocked(window.kubernetesGetCurrentContextGeneralState).mockResolvedValue({
    reachable: true,
    resources: { pods: 0, deployments: 0 },
  });
  await fetchNavigationRegistries();
  mockConfigurationValues({ itemOrder: ['Kubernetes', 'Containers'], useInternalKubernetes: true });
  configurationProperties.set([]);

  await vi.waitFor(() => {
    expect(get(navigationRegistry).some(item => item.name === 'Kubernetes')).toBe(true);
    expect(get(navigationItemOrder)).toEqual(['Kubernetes', 'Containers']);
  });
  expect(window.updateConfigurationValue).not.toHaveBeenCalledWith('navbar.itemOrder', expect.anything());

  mockConfigurationValues({ itemOrder: ['Kubernetes', 'Containers'], useInternalKubernetes: false });
  configurationProperties.set([]);

  await vi.waitFor(() => {
    expect(get(navigationRegistry).some(item => item.name === 'Kubernetes')).toBe(false);
  });
});
