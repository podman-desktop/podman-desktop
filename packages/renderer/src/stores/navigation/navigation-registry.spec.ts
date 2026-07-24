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

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NavigationItemState } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { configurationProperties } from '/@/stores/configurationProperties';

import {
  collecItem,
  fetchNavigationRegistries,
  navigationRegistry,
  type NavigationRegistryEntry,
} from './navigation-registry';

const kubernetesRegisterGetCurrentContextResourcesMock = vi.fn();
const kubernetesGetCurrentContextGeneralStateMock = vi.fn();

const getConfigurationValueMock = vi.fn();

function mockConfigurationValues(disabledItems: string[] = [], pinnedItems: string[] = []): void {
  getConfigurationValueMock.mockImplementation((key: string) =>
    Promise.resolve(
      key === 'navbar.disabledItems' ? disabledItems : key === 'navbar.pinnedItems' ? pinnedItems : undefined,
    ),
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  (window as any).kubernetesRegisterGetCurrentContextResources = kubernetesRegisterGetCurrentContextResourcesMock;
  (window as any).getKubernetesPortForwards = vi.fn();
  (window as any).window.kubernetesGetCurrentContextGeneralState = kubernetesGetCurrentContextGeneralStateMock;
  (window as any).getConfigurationValue = getConfigurationValueMock;
  (window as any).sendNavigationItems = vi.fn();

  vi.mocked(window.getKubernetesPortForwards).mockResolvedValue([]);
  mockConfigurationValues();
});

test('check navigation registry items', async () => {
  kubernetesRegisterGetCurrentContextResourcesMock.mockResolvedValue([]);
  kubernetesGetCurrentContextGeneralStateMock.mockResolvedValue({});
  await fetchNavigationRegistries();
  const registries = get(navigationRegistry);
  // expect 8 items in the registry (plus Settings entries)
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
  mockConfigurationValues(['Containers', 'Pods']);

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
  { desc: 'by name', pinnedItems: ['Volumes'], pinned: 'Volumes', unpinned: 'Networks' },
  { desc: 'by link', pinnedItems: ['/volumes'], pinned: 'Volumes', unpinned: 'Networks' },
])('pinned flags sync $desc', async ({ pinnedItems, pinned, unpinned }) => {
  mockConfigurationValues([], pinnedItems);
  configurationProperties.set([]);
  await new Promise(resolve => setTimeout(resolve, 500));

  const items = get(navigationRegistry);
  expect(items.find(item => item.name === pinned)?.pinned).toBeTruthy();
  expect(items.find(item => item.name === unpinned)?.pinned).toBeFalsy();

  const sent = vi.mocked(window.sendNavigationItems).mock.calls.at(-1)?.[0] ?? [];
  expect(sent.find(item => item.name === pinned)).toMatchObject({ pinned: true });
  expect(sent.find(item => item.name === unpinned)).toMatchObject({ pinned: false });
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

test('collecItem prefixes submenu children, keeps group unprefixed, and dedups by link', () => {
  const topLevelPods = makeLeafEntry('Pods', '/pods');
  const child = makeLeafEntry('Pods', '/widgets/pods', { pinned: true });
  const submenu = makeSubmenuEntry('Widgets', '/widgets', [child]);

  const items: NavigationItemState[] = [];
  collecItem(topLevelPods, items);
  collecItem(submenu, items);

  expect(items.find(i => i.link === '/widgets')).toMatchObject({ name: 'Widgets' });
  expect(items.find(i => i.link === '/widgets/pods')).toMatchObject({ name: 'Widgets > Pods', pinned: true });
  expect(items.find(i => i.link === '/pods')).toMatchObject({ name: 'Pods' });
});

test('Settings entries (grouped names) are hidden until pinned via navbar.pinnedItems, others stay hidden', async () => {
  mockConfigurationValues([], ['/preferences/resources']);

  configurationProperties.set([]);

  await new Promise(resolve => setTimeout(resolve, 500));

  const items = get(navigationRegistry);
  const resources = items.find(item => item.name === 'Settings > Resources');
  const otherSettingsEntry = items.find(
    item => item.name.startsWith('Settings > ') && item.name !== 'Settings > Resources',
  );

  expect(resources).toBeDefined();
  expect(resources?.pinned).toBe(true);
  expect(resources?.hidden).toBe(false);

  expect(otherSettingsEntry).toBeDefined();
  expect(otherSettingsEntry?.pinned).toBe(false);
  expect(otherSettingsEntry?.hidden).toBe(true);
});
