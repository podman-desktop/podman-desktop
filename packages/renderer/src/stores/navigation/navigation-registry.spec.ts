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
  pinToNavbar,
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
        expect.objectContaining({ name: 'Settings > Resources', visible: false, index: undefined }),
      ]),
    ),
  );
  vi.mocked(window.updateConfigurationValue).mockClear();
});

test('keeps eight default registry entries and publishes unpinned destinations separately', () => {
  expect(get(navigationRegistry).filter(item => item.parentName === undefined)).toHaveLength(8);
  expect(new NavigationUtils().getVisibleOrderedEntries(get(navigationRegistry))).toHaveLength(8);
  expect(getNavigationEntry('/tools/nodes')).toMatchObject({ parentName: 'Tools', index: undefined });
  expect(getNavigationEntry('/preferences/resources')).toMatchObject({ parentName: 'Settings', index: undefined });
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

test('hides only configured main entries', async () => {
  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce(['Containers', 'Pods'])
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(false);
  configurationProperties.set([]);
  await vi.waitFor(() => {
    expect(getNavigationEntry('/containers')?.hidden).toBe(true);
    expect(getNavigationEntry('/pods')?.hidden).toBe(true);
    expect(getNavigationEntry('/images')?.hidden).toBe(false);
  });
});

test('applies saved qualified-name order and keeps missing defaults', async () => {
  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(['Settings > Resources'])
    .mockResolvedValueOnce(false);
  configurationProperties.set([]);
  await vi.waitFor(() => {
    expect(get(navigationRegistry).find(item => item.link === '/preferences/resources')).toMatchObject({
      index: 0,
      hidden: false,
    });
    expect(getNavigationEntry('/containers')).toMatchObject({ index: 1, hidden: false });
  });
  expect(window.updateConfigurationValue).not.toHaveBeenCalledWith('navbar.itemOrder', expect.anything());
});

test('pins a new submenu child by its registered route and resets it without recreating entries', async () => {
  const tools = getNavigationEntry('/tools');
  expect(pinToNavbar({ name: 'Wrong label', parentName: 'Wrong parent', link: '/tools/nodes' })).toBe(1);
  expect(window.updateConfigurationValue).toHaveBeenLastCalledWith('navbar.itemOrder', [
    'Tools > Nodes',
    'Containers',
    'Pods',
    'Images',
    'Volumes',
    'Networks',
    'Tools',
    'Extensions',
    'Plugin',
  ]);
  await vi.waitFor(() =>
    expect(new NavigationUtils().getVisibleOrderedEntries(get(navigationRegistry))[0]).toMatchObject({
      name: 'Nodes',
      parentName: 'Tools',
      link: '/tools/nodes',
      icon: { iconImage: 'tools.svg' },
    }),
  );
  vi.mocked(window.updateConfigurationValue).mockClear();
  expect(pinToNavbar({ name: 'Nodes', link: '/tools/nodes' })).toBe(1);
  expect(window.updateConfigurationValue).not.toHaveBeenCalled();

  setNavigationItemOrder([]);
  await vi.waitFor(() => expect(getNavigationEntry('/tools/nodes')).toMatchObject({ index: undefined, hidden: true }));
  expect(getNavigationEntry('/tools')).toBe(tools);
});

test('preserves hidden and unavailable names when pinning and reordering visible entries', async () => {
  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce(['Pods'])
    .mockResolvedValueOnce(['Containers', 'Pods', 'Unavailable', 'Tools'])
    .mockResolvedValueOnce(false);
  configurationProperties.set([]);
  await vi.waitFor(() => expect(getNavigationEntry('/pods')?.hidden).toBe(true));

  pinToNavbar({ name: 'Nodes', link: '/tools/nodes' });
  expect(window.updateConfigurationValue).toHaveBeenLastCalledWith('navbar.itemOrder', [
    'Tools > Nodes',
    'Pods',
    'Unavailable',
    'Containers',
    'Tools',
    'Images',
    'Volumes',
    'Networks',
    'Extensions',
    'Plugin',
  ]);
  setNavigationItemOrder([
    'Containers',
    'Tools > Nodes',
    'Tools',
    'Images',
    'Volumes',
    'Networks',
    'Extensions',
    'Plugin',
  ]);
  expect(window.updateConfigurationValue).toHaveBeenLastCalledWith('navbar.itemOrder', [
    'Containers',
    'Pods',
    'Unavailable',
    'Tools > Nodes',
    'Tools',
    'Images',
    'Volumes',
    'Networks',
    'Extensions',
    'Plugin',
  ]);
});

test('does not register destinations from unknown pin payloads', () => {
  const payload = { name: 'Generated setting', parentName: 'Settings', link: '/preferences/default/generated' };
  expect(pinToNavbar(payload)).toBeUndefined();
  setNavigationItemOrder(['Settings > Generated setting'], payload);
  expect(getNavigationEntry(payload.link)).toBeUndefined();
  expect(window.updateConfigurationValue).not.toHaveBeenCalled();
});

test('applies saved qualified-name order when Kubernetes becomes available alongside the Settings contexts destination', async () => {
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
  expect(getNavigationEntry('/preferences/kubernetes-contexts')?.parentName).toBe('Settings');

  vi.mocked(window.getConfigurationValue)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(['Kubernetes > Nodes'])
    .mockResolvedValueOnce(false);
  configurationProperties.set([]);
  await vi.waitFor(() => {
    expect(getNavigationEntry('/kubernetes')).toBeUndefined();
    expect(getNavigationEntry('/preferences/kubernetes-contexts')?.parentName).toBe('Settings');
  });
});
