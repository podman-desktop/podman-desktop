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

import type { DisplayItem } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { configurationProperties } from '/@/stores/configurationProperties';

import {
  collecItem,
  fetchNavigationRegistries,
  navigationRegistry,
  type NavigationRegistryEntry,
  resolveItemOrderIndex,
} from './navigation-registry';

const getConfigurationValueMock = vi.mocked(window.getConfigurationValue);

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
  // expect 8 items in the registry (excluding Settings > pinned entries)
  const otherEntries = registries.filter(item => !item.name.startsWith('Settings > '));
  expect(otherEntries.length).equal(8);

  const names = registries.map(item => item.name);
  expect(names.indexOf('Pods')).toBe(names.indexOf('Containers') + 1);
  expect(names.indexOf('Images')).toBe(names.indexOf('Pods') + 1);
});

test('check update properties', async () => {
  // first, check that all items are visible
  const items = get(navigationRegistry);
  items
    .filter(item => !item.name.startsWith('Settings > '))
    .forEach(item => {
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

  const allItemsExceptContainersAndPods = hidden.filter(
    item => item.name !== 'Containers' && item.name !== 'Pods' && !item.name.startsWith('Settings > '),
  );
  allItemsExceptContainersAndPods.forEach(item => {
    expect(item.hidden).toBeFalsy();
  });

  const containersAndPods = hidden.filter(item => item.name === 'Containers' || item.name === 'Pods');
  containersAndPods.forEach(item => {
    expect(item.hidden).toBeTruthy();
  });
});

test.each([
  {
    desc: 'by name',
    itemOrder: ['Volumes', 'Networks'],
    first: 'Volumes',
    second: 'Networks',
  },
  {
    desc: 'by link',
    itemOrder: ['/volumes', '/networks'],
    first: 'Volumes',
    second: 'Networks',
  },
])('index flags sync $desc', async ({ itemOrder, first, second }) => {
  // subscribe reads disabledItems then itemOrder
  getConfigurationValueMock.mockResolvedValueOnce([]).mockResolvedValueOnce(itemOrder);
  configurationProperties.set([]);
  await new Promise(resolve => setTimeout(resolve, 500));

  const items = get(navigationRegistry);
  expect(items.find(item => item.name === first)?.index).toBe(0);
  expect(items.find(item => item.name === second)?.index).toBe(1);

  const sent = vi.mocked(window.sendNavigationItems).mock.calls.at(-1)?.[0] ?? [];
  expect(sent.find(item => item.name === first)).toMatchObject({ index: 0 });
  expect(sent.find(item => item.name === second)).toMatchObject({ index: 1 });
  // Items not in itemOrder (e.g. Containers) are omitted from DisplayItem
  expect(sent.find(item => item.name === 'Containers')).toBeUndefined();
});

test('resolveItemOrderIndex prefers link and ignores name for submenu children', () => {
  // Legacy name-only order still works for top-level Pods
  expect(resolveItemOrderIndex(['Pods'], '/pods', 'Pods', false)).toBe(0);
  // …but must not also match Kubernetes > Pods
  expect(resolveItemOrderIndex(['Pods'], '/kubernetes/pods', 'Pods', true)).toBeUndefined();

  // Link uniquely selects each
  expect(resolveItemOrderIndex(['/pods'], '/pods', 'Pods', false)).toBe(0);
  expect(resolveItemOrderIndex(['/kubernetes/pods'], '/kubernetes/pods', 'Pods', true)).toBe(0);
  expect(resolveItemOrderIndex(['/kubernetes/pods'], '/pods', 'Pods', false)).toBeUndefined();
});

function makeSubmenuEntry(name: string, link: string, items: NavigationRegistryEntry[]): NavigationRegistryEntry {
  return {
    name,
    icon: {},
    tooltip: name,
    link,
    counter: 0,
    destinations: [],
    type: 'submenu',
    items,
    index: 1,
  };
}

function makeLeafEntry(
  name: string,
  link: string,
  overrides: Partial<NavigationRegistryEntry> = {},
): NavigationRegistryEntry {
  return {
    name,
    icon: {},
    tooltip: name,
    link,
    counter: 0,
    destinations: [],
    type: 'entry',
    ...overrides,
  };
}

test('collecItem prefixes submenu children, keeps group unprefixed, and dedups by name', () => {
  const topLevelPods = makeLeafEntry('Pods', '/pods', { index: 0 });
  const child = makeLeafEntry('Pods', '/widgets/pods', { index: 2 });
  const submenu = makeSubmenuEntry('Widgets', '/widgets', [child]);

  const items: DisplayItem[] = [];
  collecItem(topLevelPods, items);
  collecItem(submenu, items);

  expect(items.find(i => i.name === 'Widgets')).toMatchObject({
    name: 'Widgets',
    index: 1,
  });
  expect(items.find(i => i.name === 'Widgets > Pods')).toMatchObject({
    name: 'Widgets > Pods',
    index: 2,
  });
  expect(items.find(i => i.name === 'Pods')).toMatchObject({
    name: 'Pods',
    index: 0,
  });
});

test('collecItem includes unpinned settings/submenu children without index for context-menu pin', () => {
  const settingsChild = makeLeafEntry('Settings > Resources', '/preferences/resources');

  const items: DisplayItem[] = [];
  collecItem(settingsChild, items);

  expect(items).toHaveLength(1);
  expect(items[0]).toMatchObject({
    name: 'Settings > Resources',
    index: undefined,
  });
});

test('Grouped entry is hidden when in disabledItems, even if indexed', async () => {
  // subscribe reads disabledItems then itemOrder
  getConfigurationValueMock
    .mockResolvedValueOnce(['Settings > Resources'])
    .mockResolvedValueOnce(['/preferences/resources']);

  configurationProperties.set([]);

  await new Promise(resolve => setTimeout(resolve, 500));

  const items = get(navigationRegistry);
  const resources = items.find(item => item.name === 'Settings > Resources');

  expect(resources).toBeDefined();
  expect(resources?.hidden).toBe(true);
});

test('Settings entries (grouped names) are hidden until indexed via navbar.itemOrder, others stay hidden', async () => {
  // subscribe reads disabledItems then itemOrder
  getConfigurationValueMock.mockResolvedValueOnce([]).mockResolvedValueOnce(['/preferences/resources']);

  configurationProperties.set([]);

  await new Promise(resolve => setTimeout(resolve, 500));

  const items = get(navigationRegistry);
  const resources = items.find(item => item.name === 'Settings > Resources');
  const otherSettingsEntry = items.find(
    item => item.name.startsWith('Settings > ') && item.name !== 'Settings > Resources',
  );

  expect(resources).toBeDefined();
  expect(resources?.index).toBe(0);
  expect(resources?.hidden).toBe(false);

  expect(otherSettingsEntry).toBeDefined();
  expect(otherSettingsEntry?.index).toBeUndefined();
  expect(otherSettingsEntry?.hidden).toBe(true);
});

test('empty itemOrder assigns contiguous default indices to top-level entries', async () => {
  getConfigurationValueMock.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
  configurationProperties.set([]);
  await new Promise(resolve => setTimeout(resolve, 500));

  const items = get(navigationRegistry).filter(item => !item.name.startsWith('Settings > '));
  items.forEach((item, i) => {
    expect(item.index).toBe(i);
  });
});
