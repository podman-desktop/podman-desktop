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
import { render, screen, within } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import type { TinroRouteMeta } from 'tinro';
import { beforeAll, expect, test, vi } from 'vitest';

import * as kubeContextStore from '/@/stores/kubernetes-contexts-state';

import AppNavigation from './AppNavigation.svelte';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { contributions } from './stores/contribs';
import { navigationDragState } from './stores/navigation/navigation-drag-state.svelte';
import { fetchNavigationRegistries, setNavigationItemOrder } from './stores/navigation/navigation-registry';
import { createNavigationSecretEntry } from './stores/navigation/navigation-registry-secret.svelte';

const callbacks = new Map<string, (arg: unknown) => void>();

vi.mock(import('/@/stores/kubernetes-contexts-state'), async () => {
  return {};
});
vi.mock(import('./stores/navigation/navigation-registry-secret.svelte'));

// fake the window object
beforeAll(() => {
  vi.mocked(createNavigationSecretEntry).mockReturnValue({
    name: 'Tools',
    link: '/tools',
    tooltip: 'Tools',
    type: 'submenu',
    icon: {},
    counter: 0,
    destinations: [],
    items: [
      {
        name: 'Nodes',
        link: '/tools/nodes',
        tooltip: 'Nodes',
        type: 'entry',
        counter: 0,
        destinations: [],
        icon: { iconImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>' },
      },
    ],
  });
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

test('places reorder shortcut metadata on the focused navigation link', async () => {
  const meta = { url: '/' } as unknown as TinroRouteMeta;
  await fetchNavigationRegistries();

  render(AppNavigation, {
    meta,
    exitSettingsCallback: () => {},
  });

  const containers = screen.getByRole('link', { name: 'Containers' });
  expect(containers).toHaveAttribute('aria-keyshortcuts', 'Control+ArrowUp Control+ArrowDown');
  expect(containers).toHaveAttribute('title', expect.stringContaining('Arrow to move'));
  expect(containers.closest('[role="listitem"]')).not.toHaveAttribute('aria-keyshortcuts');
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

test('resize handle captures pointer and persists width on drag end', async () => {
  const NAV_BAR_WIDTH_KEY = `${AppearanceSettings.SectionName}.${AppearanceSettings.NavigationBarWidth}`;
  const meta = { url: '/' } as unknown as TinroRouteMeta;

  // Use a non-default width so waiting for it proves onMount finished (avoids mid-drag overwrite)
  vi.mocked(window.getConfigurationValue).mockResolvedValue(150);

  await fetchNavigationRegistries();
  render(AppNavigation, {
    meta,
    exitSettingsCallback: (): void => {},
  });

  const handle = screen.getByRole('separator', { name: 'Resize navigation bar' });
  const setPointerCapture = vi.fn();
  handle.setPointerCapture = setPointerCapture;
  await vi.waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '150'));

  handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 150, pointerId: 1 }));
  expect(setPointerCapture).toHaveBeenCalledWith(1);

  window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 180, pointerId: 1 }));
  await vi.waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '180'));

  window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
  await vi.waitFor(() => expect(window.updateConfigurationValue).toHaveBeenCalledWith(NAV_BAR_WIDTH_KEY, 180));
});

test('dragging a registered submenu child uses its canonical label and icon and pins it at the top', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(150);
  await fetchNavigationRegistries();
  const { unmount } = render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });
  await vi.waitFor(() =>
    expect(screen.getByRole('separator', { name: 'Resize navigation bar' })).toHaveAttribute('aria-valuenow', '150'),
  );
  const firstRow = screen.getAllByRole('listitem')[0];
  firstRow.getBoundingClientRect = (): DOMRect => new DOMRect(0, 10, 150, 30);
  navigationDragState.payload = { name: 'Wrong label', parentName: 'Wrong parent', link: '/tools/nodes' };
  const ghost = await screen.findByTestId('nav-drag-ghost');
  expect(ghost).toHaveTextContent('Tools > Nodes');
  expect(ghost.querySelector('img')).toHaveAttribute(
    'src',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
  );

  window.dispatchEvent(new PointerEvent('pointerup', { clientX: 0, clientY: 0 }));
  await vi.waitFor(() => {
    const links = screen.getByRole('region', { name: 'Scrollable navigation list' }).querySelectorAll('a');
    expect(links[0]).toHaveAttribute('href', '/tools/nodes');
    expect(links[0]).toHaveAccessibleName('Tools > Nodes');
  });
  expect(navigationDragState.payload).toBeUndefined();
  unmount();
  setNavigationItemOrder([]);
});

test('an unpinned Settings destination retains its own icon in the drag preview', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(150);
  await fetchNavigationRegistries();
  render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });
  expect(screen.queryByRole('link', { name: 'Settings > Resources' })).not.toBeInTheDocument();
  navigationDragState.payload = { name: 'Resources', parentName: 'Settings', link: '/preferences/resources' };
  const ghost = await screen.findByTestId('nav-drag-ghost');
  within(ghost).getByLabelText('Resources');
  navigationDragState.payload = undefined;
});
