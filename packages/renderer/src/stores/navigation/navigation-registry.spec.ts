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

import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { configurationProperties } from '/@/stores/configurationProperties';

import { fetchNavigationRegistries, navigationRegistry, setNavigationItemOrder } from './navigation-registry';

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
  await Promise.all([fetchNavigationRegistries(), fetchNavigationRegistries()]);
  const registries = get(navigationRegistry);
  expect(registries.filter(item => item.link === '/containers')).toHaveLength(1);
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
])('index flags sync $desc', async ({ desc, itemOrder, first, second }) => {
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
  if (desc === 'by link') {
    expect(window.updateConfigurationValue).toHaveBeenCalledWith('navbar.itemOrder', ['Volumes', 'Networks']);
  }
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
  expect(vi.mocked(window.sendNavigationItems).mock.calls.at(-1)?.[0]).toContainEqual(
    expect.objectContaining({ name: 'Settings > Resources', index: 0 }),
  );

  expect(otherSettingsEntry).toBeDefined();
  expect(otherSettingsEntry?.index).toBeUndefined();
  expect(otherSettingsEntry?.hidden).toBe(true);
});

test('registers dynamic Preferences children with qualified names and stable links', async () => {
  getConfigurationValueMock.mockResolvedValue([]);
  const appearance: IConfigurationPropertyRecordedSchema = {
    title: 'Appearance',
    parentId: 'preferences.appearance',
    scope: 'DEFAULT',
  };
  configurationProperties.set([appearance]);

  await vi.waitFor(() => {
    expect(
      get(navigationRegistry).find(item => item.link === '/preferences/default/preferences.appearance'),
    ).toMatchObject({
      name: 'Settings > Appearance',
      tooltip: 'Settings > Appearance',
      hidden: true,
    });
  });

  const sentItems = vi.mocked(window.sendNavigationItems).mock.calls.at(-1)?.[0] ?? [];
  expect(sentItems).toContainEqual(
    expect.objectContaining({
      name: 'Settings > Appearance',
      visible: false,
    }),
  );
  expect(get(navigationRegistry).some(item => item.name === 'Settings > Preferences')).toBe(false);

  setNavigationItemOrder(['Settings > Appearance']);
  await vi.waitFor(() => {
    expect(
      get(navigationRegistry).find(item => item.link === '/preferences/default/preferences.appearance'),
    ).toMatchObject({ index: 0, hidden: false });
  });
  expect(window.updateConfigurationValue).toHaveBeenCalledWith('navbar.itemOrder', ['Settings > Appearance']);
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
