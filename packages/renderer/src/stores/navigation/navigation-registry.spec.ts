/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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
  navigationRegistry,
  type NavigationRegistryEntry,
  setNavigationItemOrder,
} from './navigation-registry';
import { createNavigationExtensionEntry, createNavigationExtensionGroup } from './navigation-registry-extension.svelte';
import { createNavigationKubernetesGroup } from './navigation-registry-kubernetes.svelte';
import { createNavigationSecretEntry } from './navigation-registry-secret.svelte';
import { NavigationUtils } from './navigation-utils';

vi.mock(import('./navigation-registry-secret.svelte'));
vi.mock(import('./navigation-registry-kubernetes.svelte'));
vi.mock(import('./navigation-registry-extension.svelte'));

function entry(name: string, link: string, overrides: Partial<NavigationRegistryEntry> = {}): NavigationRegistryEntry {
  return { name, link, tooltip: name, icon: {}, counter: 0, destinations: [], type: 'entry', ...overrides };
}

function getNavigationEntry(link: string): NavigationRegistryEntry | undefined {
  return new NavigationUtils().findNavigationEntryByLink(get(navigationRegistry), link);
}

beforeEach(async () => {
  vi.resetAllMocks();
  vi.mocked(window.getKubernetesPortForwards).mockResolvedValue([]);
  vi.mocked(createNavigationSecretEntry).mockReturnValue(
    entry('Tools', '/tools', {
      type: 'submenu',
      items: [entry('Nodes', '/tools/nodes', { icon: { iconImage: 'tools.svg' } })],
    }),
  );
  vi.mocked(createNavigationExtensionEntry).mockReturnValue(entry('Extensions', '/extensions'));
  vi.mocked(createNavigationExtensionGroup).mockReturnValue(
    entry('Extensions', '/extensions', {
      type: 'group',
      items: [entry('Plugin', '/plugin')],
    }),
  );
  vi.mocked(createNavigationKubernetesGroup).mockReturnValue(
    entry('Kubernetes', '/kubernetes', {
      type: 'submenu',
      items: [entry('Nodes', '/kubernetes/nodes')],
    }),
  );
  await fetchNavigationRegistries();
  vi.mocked(window.sendNavigationItems).mockClear();
  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce([]) // disabled items
    .mockResolvedValueOnce([]) // item order
    .mockResolvedValueOnce(false); // internal Kubernetes
  configurationProperties.set([]);
  await vi.waitFor(() =>
    expect(window.sendNavigationItems).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Containers', visible: true, index: 0 }),
        expect.objectContaining({ name: 'Tools > Nodes', visible: false, index: undefined }),
      ]),
    ),
  );
  vi.mocked(window.updateConfigurationValue).mockClear();
});

test('check navigation registry items', async () => {
  vi.mocked(window.kubernetesRegisterGetCurrentContextResources).mockResolvedValue([]);
  vi.mocked(window.kubernetesGetCurrentContextGeneralState).mockResolvedValue({
    reachable: true,
    resources: { pods: 0, deployments: 0 },
  });
  await fetchNavigationRegistries();
  const registries = get(navigationRegistry).filter(item => item.parentName === undefined);
  // expect 8 items in the registry
  expect(registries.length).equal(8);
  expect(getNavigationEntry('/tools/nodes')).toMatchObject({ parentName: 'Tools', index: undefined });
  expect(new NavigationUtils().getVisibleOrderedEntries(get(navigationRegistry)).map(item => item.name)).toEqual([
    'Containers',
    'Pods',
    'Images',
    'Volumes',
    'Networks',
    'Tools',
    'Extensions',
    'Plugin',
  ]);
});

test('check update properties', async () => {
  // first, check that all items are visible
  const items = get(navigationRegistry).filter(item => item.parentName === undefined);
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
  const hidden = get(navigationRegistry).filter(item => item.parentName === undefined);

  const allItemsExceptContainersAndPods = hidden.filter(item => item.name !== 'Containers' && item.name !== 'Pods');
  allItemsExceptContainersAndPods.forEach(item => {
    expect(item.hidden).toBeFalsy();
  });

  const containersAndPods = hidden.filter(item => item.name === 'Containers' || item.name === 'Pods');
  containersAndPods.forEach(item => {
    expect(item.hidden).toBeTruthy();
  });
});

test('applies saved qualified-name order for a submenu child', async () => {
  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(['Tools > Nodes'])
    .mockResolvedValueOnce(false);
  configurationProperties.set([]);
  await vi.waitFor(() => {
    expect(getNavigationEntry('/tools/nodes')).toMatchObject({ index: 0, hidden: false });
    expect(getNavigationEntry('/containers')).toMatchObject({ index: 1, hidden: false });
  });
  expect(window.updateConfigurationValue).not.toHaveBeenCalledWith('navbar.itemOrder', expect.anything());
});

test('preserves hidden and unavailable names when reordering visible entries', async () => {
  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce(['Pods'])
    .mockResolvedValueOnce(['Containers', 'Pods', 'Unavailable', 'Tools'])
    .mockResolvedValueOnce(false);
  configurationProperties.set([]);
  await vi.waitFor(() => expect(getNavigationEntry('/pods')?.hidden).toBe(true));

  setNavigationItemOrder(['Tools', 'Containers', 'Images', 'Volumes', 'Networks', 'Extensions', 'Plugin']);
  expect(window.updateConfigurationValue).toHaveBeenLastCalledWith('navbar.itemOrder', [
    'Tools',
    'Pods',
    'Unavailable',
    'Containers',
    'Images',
    'Volumes',
    'Networks',
    'Extensions',
    'Plugin',
  ]);
});

test('applies saved qualified-name order when Kubernetes becomes available', async () => {
  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(['Kubernetes > Nodes'])
    .mockResolvedValueOnce(true);
  configurationProperties.set([]);
  await vi.waitFor(() => {
    expect(getNavigationEntry('/kubernetes')).toMatchObject({
      type: 'submenu',
      hidden: false,
      index: expect.any(Number),
    });
    expect(getNavigationEntry('/kubernetes/nodes')).toMatchObject({ index: 0, hidden: false });
  });
  expect(window.updateConfigurationValue).not.toHaveBeenCalledWith('navbar.itemOrder', expect.anything());

  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(['Kubernetes > Nodes'])
    .mockResolvedValueOnce(false);
  configurationProperties.set([]);
  await vi.waitFor(() => {
    expect(getNavigationEntry('/kubernetes')).toBeUndefined();
  });
});
