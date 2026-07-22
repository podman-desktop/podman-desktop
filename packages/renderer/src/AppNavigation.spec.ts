/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

import type { KubernetesObject } from '@kubernetes/client-node';
import type { ContextGeneralState, ContributionInfo, ForwardConfig } from '@podman-desktop/core-api';
import { AppearanceSettings } from '@podman-desktop/core-api/appearance';
import { render, screen } from '@testing-library/svelte';
import { get, readable } from 'svelte/store';
import type { TinroRouteMeta } from 'tinro';
import { beforeAll, expect, test, vi } from 'vitest';

import * as kubeContextStore from '/@/stores/kubernetes-contexts-state';

import AppNavigation from './AppNavigation.svelte';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { contributions } from './stores/contribs';
import type { NavigationRegistryEntry } from './stores/navigation/navigation-registry';
import { fetchNavigationRegistries, navigationRegistry } from './stores/navigation/navigation-registry';

const eventsMock = vi.fn();

const callbacks = new Map<string, (arg: unknown) => void>();

function makeEntry(overrides: Partial<NavigationRegistryEntry> & { name: string }): NavigationRegistryEntry {
  return {
    icon: {},
    tooltip: overrides.name,
    link: `/${overrides.name.toLowerCase()}`,
    counter: 0,
    destinations: [],
    type: 'entry',
    ...overrides,
  };
}

vi.mock(import('/@/stores/kubernetes-contexts-state'), async () => {
  return {};
});

// fake the window object
beforeAll(() => {
  Object.defineProperty(window, 'events', { value: eventsMock });
  Object.defineProperty(window, 'getConfigurationValue', { value: vi.fn() });
  Object.defineProperty(window, 'getConfigurationProperties', { value: vi.fn().mockResolvedValue({}) });
  onDidChangeConfiguration.addEventListener = vi.fn().mockImplementation((message: string, callback: () => void) => {
    callbacks.set(message, callback);
  });
});

test('Test rendering of the navigation bar with empty items', async (_arg: unknown) => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  // mock no kubernetes resources
  vi.mocked(kubeContextStore).kubernetesCurrentContextDeployments = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextPods = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextServices = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextIngresses = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextRoutes = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextNodes = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextConfigMaps = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextSecrets = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextPersistentVolumeClaims = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextPortForwards = readable<ForwardConfig[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextState = readable<ContextGeneralState>({} as ContextGeneralState);
  vi.mocked(kubeContextStore).kubernetesCurrentContextCronJobs = readable<KubernetesObject[]>([]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextJobs = readable<KubernetesObject[]>([]);

  // init navigation registry
  await fetchNavigationRegistries();

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  const navigationBar = screen.getByRole('navigation', { name: 'AppNavigation' });
  expect(navigationBar).toBeInTheDocument();

  const dasboard = screen.getByRole('link', { name: 'Dashboard' });
  expect(dasboard).toBeInTheDocument();
  const containers = screen.getByRole('link', { name: 'Containers' });
  expect(containers).toBeInTheDocument();
  const pods = screen.getByRole('link', { name: 'Pods' });
  expect(pods).toBeInTheDocument();
  const images = screen.getByRole('link', { name: 'Images' });
  expect(images).toBeInTheDocument();
  const volumes = screen.getByRole('link', { name: 'Volumes' });
  expect(volumes).toBeInTheDocument();
  const settings = screen.getByRole('link', { name: 'Settings' });
  expect(settings).toBeInTheDocument();
});

test('Test contributions', () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  contributions.set([
    {
      id: 'dashboard-tab',
      name: 'foo1',
      extensionId: 'my.extension1',
    } as unknown as ContributionInfo,
    {
      id: 'dashboard-tab',
      name: 'foo2',
      extensionId: 'my.extension2',
    } as unknown as ContributionInfo,
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  const navigationBar = screen.getByRole('navigation', { name: 'AppNavigation' });
  expect(navigationBar).toBeInTheDocument();
});

test('Navigation bar shows title when expanded', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  await fetchNavigationRegistries();

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  // Default width is 160px (expanded) — title should be in the DOM
  const dashboardTitle = screen.getByLabelText('Dashboard title');
  await vi.waitFor(() => expect(dashboardTitle).toHaveTextContent('Dashboard'));
});

test('Navigation bar width updates on configuration change', async () => {
  const NAV_BAR_WIDTH_KEY = `${AppearanceSettings.SectionName}.${AppearanceSettings.NavigationBarWidth}`;
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  await fetchNavigationRegistries();

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  // Default width is 160px (expanded) — titles visible
  await vi.waitFor(() => screen.getByLabelText('Dashboard title'));

  // Simulate width change to expanded (200px) — title still visible
  callbacks.get(NAV_BAR_WIDTH_KEY)?.({ detail: { key: NAV_BAR_WIDTH_KEY, value: 200 } });
  await vi.waitFor(() => screen.getByLabelText('Dashboard title'));

  // Simulate width change to collapsed (below threshold of 70)
  callbacks.get(NAV_BAR_WIDTH_KEY)?.({ detail: { key: NAV_BAR_WIDTH_KEY, value: 60 } });
  await vi.waitFor(() => expect(screen.queryByLabelText('Dashboard title')).not.toBeInTheDocument());
});

test('Expanded threshold controls text visibility', async () => {
  const NAV_BAR_WIDTH_KEY = `${AppearanceSettings.SectionName}.${AppearanceSettings.NavigationBarWidth}`;
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  await fetchNavigationRegistries();

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  // Default is 160px (expanded)
  await vi.waitFor(() => screen.getByLabelText('Dashboard title'));

  // Shrink to 80px — still above threshold (70), should stay expanded
  callbacks.get(NAV_BAR_WIDTH_KEY)?.({ detail: { key: NAV_BAR_WIDTH_KEY, value: 80 } });
  await vi.waitFor(() => screen.getByLabelText('Dashboard title'));

  // Shrink below 70px — should collapse (text removed from DOM)
  callbacks.get(NAV_BAR_WIDTH_KEY)?.({ detail: { key: NAV_BAR_WIDTH_KEY, value: 60 } });
  await vi.waitFor(() => expect(screen.queryByLabelText('Dashboard title')).not.toBeInTheDocument());

  // Grow above threshold — should expand again
  callbacks.get(NAV_BAR_WIDTH_KEY)?.({ detail: { key: NAV_BAR_WIDTH_KEY, value: 135 } });
  await vi.waitFor(() => screen.getByLabelText('Dashboard title'));
});

test('Pinned items render before regular items in registry order', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  navigationRegistry.set([
    makeEntry({ name: 'Containers' }),
    makeEntry({ name: 'Images' }),
    makeEntry({ name: 'Pods', pinned: true }),
    makeEntry({ name: 'Volumes' }),
    makeEntry({ name: 'Secrets', pinned: true }),
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  await vi.waitFor(() => expect(screen.getByRole('link', { name: 'Secrets' })).toBeInTheDocument());

  const relevantNames = ['Containers', 'Images', 'Secrets', 'Pods', 'Volumes'];
  const renderedOrder = screen
    .getAllByRole('link')
    .map(link => link.getAttribute('aria-label'))
    .filter((name): name is string => !!name && relevantNames.includes(name));

  expect(renderedOrder).toStrictEqual(['Pods', 'Secrets', 'Containers', 'Images', 'Volumes']);
});

test('Pinned items show a pin icon, unpinned items do not', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  navigationRegistry.set([
    makeEntry({ name: 'Containers' }),
    makeEntry({ name: 'Images' }),
    makeEntry({ name: 'Pods', pinned: true }),
    makeEntry({ name: 'Volumes' }),
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  // Default width is 160px (expanded) — pin icon should render next to the pinned item's title
  await vi.waitFor(() => expect(screen.getByLabelText('Pods is pinned to top')).toBeInTheDocument());

  // unpinned items should not have a pin icon
  expect(screen.queryByLabelText('Volumes is pinned to top')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Containers is pinned to top')).not.toBeInTheDocument();
});

test('Hiding a pinned item removes it from the DOM even though navigation-registry.ts mutates entries in place', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  // mutates the same entry objects afterwards, like applyItemState() does, instead of
  // constructing new ones
  const pinnedEntry = makeEntry({ name: 'Volumes', pinned: true });
  const unpinnedEntry = makeEntry({ name: 'Networks' });

  navigationRegistry.set([
    makeEntry({ name: 'Containers' }),
    makeEntry({ name: 'Images' }),
    pinnedEntry,
    unpinnedEntry,
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  await vi.waitFor(() => expect(screen.getByRole('link', { name: 'Volumes' })).toBeInTheDocument());
  expect(screen.getByRole('link', { name: 'Networks' })).toBeInTheDocument();

  pinnedEntry.hidden = true;
  unpinnedEntry.hidden = true;
  navigationRegistry.set([...get(navigationRegistry)]);

  await vi.waitFor(() => expect(screen.queryByRole('link', { name: 'Networks' })).not.toBeInTheDocument());
  expect(screen.queryByRole('link', { name: 'Volumes' })).not.toBeInTheDocument();
});

// Uses a synthetic, non-Kubernetes submenu to prove the promotion logic is generic.
test('Pinned children of any submenu entry are promoted into the Pinned section, unpinned siblings are not', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  const pinnedChild = makeEntry({ name: 'Widget A', link: '/my-submenu/widget-a', pinned: true });
  const unpinnedChild = makeEntry({ name: 'Widget B', link: '/my-submenu/widget-b' });

  navigationRegistry.set([
    makeEntry({ name: 'Containers' }),
    makeEntry({ name: 'Images' }),
    makeEntry({ name: 'My Submenu', type: 'submenu', items: [pinnedChild, unpinnedChild] }),
    makeEntry({ name: 'Volumes' }),
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  await vi.waitFor(() => expect(screen.getByRole('link', { name: 'My Submenu > Widget A' })).toBeInTheDocument());
  expect(screen.queryByRole('link', { name: 'Widget B' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'My Submenu > Widget B' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'My Submenu' })).toBeInTheDocument();

  const relevantNames = ['Containers', 'Images', 'My Submenu > Widget A', 'My Submenu', 'Volumes'];
  const renderedOrder = screen
    .getAllByRole('link')
    .map(link => link.getAttribute('aria-label'))
    .filter((name): name is string => !!name && relevantNames.includes(name));

  expect(renderedOrder).toStrictEqual(['My Submenu > Widget A', 'Containers', 'Images', 'My Submenu', 'Volumes']);
});

// Two different submenus each have a child named "Pods"; both must render distinctly once pinned.
test('Pinned children with the same name from different submenus coexist, disambiguated by their submenu name', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  const podsFromSubmenuA = makeEntry({ name: 'Pods', link: '/submenu-a/pods', pinned: true });
  const podsFromSubmenuB = makeEntry({ name: 'Pods', link: '/submenu-b/pods', pinned: true });

  navigationRegistry.set([
    makeEntry({ name: 'Containers' }),
    makeEntry({ name: 'Images' }),
    makeEntry({ name: 'Submenu A', type: 'submenu', items: [podsFromSubmenuA] }),
    makeEntry({ name: 'Submenu B', type: 'submenu', items: [podsFromSubmenuB] }),
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  await vi.waitFor(() => expect(screen.getByRole('link', { name: 'Submenu A > Pods' })).toBeInTheDocument());
  expect(screen.getByRole('link', { name: 'Submenu B > Pods' })).toBeInTheDocument();

  expect(screen.getByRole('link', { name: 'Submenu A > Pods' })).toHaveAttribute('href', '/submenu-a/pods');
  expect(screen.getByRole('link', { name: 'Submenu B > Pods' })).toHaveAttribute('href', '/submenu-b/pods');
});
