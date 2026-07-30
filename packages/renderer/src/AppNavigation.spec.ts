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
import { fireEvent, render, screen } from '@testing-library/svelte';
import { get, readable } from 'svelte/store';
import type { TinroRouteMeta } from 'tinro';
import { beforeAll, expect, test, vi } from 'vitest';

import * as kubeContextStore from '/@/stores/kubernetes-contexts-state';

import AppNavigation from './AppNavigation.svelte';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { contributions } from './stores/contribs';
import type { NavigationRegistryEntry } from './stores/navigation/navigation-registry';
import { fetchNavigationRegistries, navigationRegistry } from './stores/navigation/navigation-registry';

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
  Object.defineProperty(window, 'getConfigurationValue', { value: vi.fn() });
  Object.defineProperty(window, 'getConfigurationProperties', { value: vi.fn().mockResolvedValue({}) });
  Object.defineProperty(window, 'getOsPlatform', { value: vi.fn().mockResolvedValue('linux') });
  onDidChangeConfiguration.addEventListener = vi.fn().mockImplementation((message: string, callback: () => void) => {
    callbacks.set(message, callback);
  });
});

test('Test rendering of the navigation bar with empty items', async (_arg: unknown) => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  // mock no kube resources
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

  const dashboardTitle = screen.getByLabelText('Dashboard title');
  // Default width is 160px (expanded) — title should be in the DOM
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

test('Items render sorted by index', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  navigationRegistry.set([
    makeEntry({ name: 'Containers', index: 2 }),
    makeEntry({ name: 'Images', index: 3 }),
    makeEntry({ name: 'Pods', index: 1 }),
    makeEntry({ name: 'Volumes', index: 4 }),
    makeEntry({ name: 'Secrets', index: 0 }),
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

  expect(renderedOrder).toStrictEqual(['Secrets', 'Pods', 'Containers', 'Images', 'Volumes']);
});

test('Hiding an indexed item removes it from the DOM', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  const indexedEntry = makeEntry({ name: 'Volumes', index: 0 });
  const otherEntry = makeEntry({ name: 'Networks', index: 1 });

  navigationRegistry.set([
    makeEntry({ name: 'Containers', index: 2 }),
    makeEntry({ name: 'Images', index: 3 }),
    indexedEntry,
    otherEntry,
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  await vi.waitFor(() => expect(screen.getByRole('link', { name: 'Volumes' })).toBeInTheDocument());
  expect(screen.getByRole('link', { name: 'Networks' })).toBeInTheDocument();

  indexedEntry.hidden = true;
  otherEntry.hidden = true;
  navigationRegistry.set([...get(navigationRegistry)]);

  await vi.waitFor(() => expect(screen.queryByRole('link', { name: 'Networks' })).not.toBeInTheDocument());
  expect(screen.queryByRole('link', { name: 'Volumes' })).not.toBeInTheDocument();
});

test('Indexed children of any submenu entry are promoted into the main nav, unindexed siblings are not', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  const indexedChild = makeEntry({ name: 'Widget A', link: '/my-submenu/widget-a', index: 0 });
  const unindexedChild = makeEntry({ name: 'Widget B', link: '/my-submenu/widget-b' });

  navigationRegistry.set([
    makeEntry({ name: 'Containers', index: 1 }),
    makeEntry({ name: 'Images', index: 2 }),
    makeEntry({ name: 'My Submenu', type: 'submenu', items: [indexedChild, unindexedChild], index: 3 }),
    makeEntry({ name: 'Volumes', index: 4 }),
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

test('Indexed children with the same name from different submenus coexist, disambiguated by their submenu name', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  const podsFromSubmenuA = makeEntry({ name: 'Pods', link: '/submenu-a/pods', index: 0 });
  const podsFromSubmenuB = makeEntry({ name: 'Pods', link: '/submenu-b/pods', index: 1 });

  navigationRegistry.set([
    makeEntry({ name: 'Containers', index: 2 }),
    makeEntry({ name: 'Images', index: 3 }),
    makeEntry({ name: 'Submenu A', type: 'submenu', items: [podsFromSubmenuA], index: 4 }),
    makeEntry({ name: 'Submenu B', type: 'submenu', items: [podsFromSubmenuB], index: 5 }),
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

test('renders an aria-live region for navigation announcements', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  navigationRegistry.set([makeEntry({ name: 'Containers', index: 0 })]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  const liveRegion = await vi.waitFor(() => screen.getByTestId('nav-live-region'));
  expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  expect(liveRegion).toHaveAttribute('role', 'status');
});

test('keyboard reorder announces the new position via the live region', async () => {
  const meta = {
    url: '/',
  } as unknown as TinroRouteMeta;

  navigationRegistry.set([
    makeEntry({ name: 'Secrets', index: 0 }),
    makeEntry({ name: 'Pods', index: 1 }),
    makeEntry({ name: 'Containers', index: 2 }),
  ]);

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  const secrets = await vi.waitFor(() => screen.getByRole('link', { name: 'Secrets' }));
  secrets.focus();

  await fireEvent.keyDown(window, { key: 'ArrowDown', ctrlKey: true });

  await vi.waitFor(() => {
    expect(screen.getByTestId('nav-live-region')).toHaveTextContent('Moved Secrets to position 2 of 3');
  });
});
