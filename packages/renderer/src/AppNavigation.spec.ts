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

import type { ContextGeneralState, ContributionInfo, ForwardConfig } from '@desktop-framework/api';
import { AppearanceSettings } from '@desktop-framework/api/appearance';
import type { KubernetesObject } from '@kubernetes/client-node';
import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import type { TinroRouteMeta } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import * as kubeContextStore from '/@/stores/kubernetes-contexts-state';

import AppNavigation from './AppNavigation.svelte';
import { onDidChangeConfiguration } from './stores/configurationProperties';
import { contributions } from './stores/contribs';
import { fetchNavigationRegistries, setNavigationItemOrder } from './stores/navigation/navigation-registry';

const callbacks = new Map<string, (arg: unknown) => void>();

vi.mock(import('/@/stores/kubernetes-contexts-state'), async () => {
  return {};
});

// fake the window object
beforeEach(async () => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.mocked(window.getConfigurationProperties).mockResolvedValue({});
  vi.mocked(window.updateConfigurationValue).mockResolvedValue(undefined);
  // Start from the default order so an earlier test cannot leak its order into this one.
  setNavigationItemOrder([]);
  vi.mocked(window.updateConfigurationValue).mockClear();
  onDidChangeConfiguration.addEventListener = vi.fn().mockImplementation((message: string, callback: () => void) => {
    callbacks.set(message, callback);
  });
  await fetchNavigationRegistries();
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

test('native image drag is prevented on reorderable navigation items', async () => {
  const meta = { url: '/' } as unknown as TinroRouteMeta;
  await fetchNavigationRegistries();
  render(AppNavigation, {
    meta,
    exitSettingsCallback: (): void => {},
  });

  const firstRow = screen.getAllByRole('listitem')[0];
  const event = new Event('dragstart', { bubbles: true, cancelable: true });
  firstRow.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
});

test('Ctrl+ArrowDown moves the focused item down repeatedly and keeps focus', async () => {
  render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });

  const names = (): string[] =>
    within(screen.getByRole('region', { name: 'Scrollable navigation list' }))
      .getAllByRole('link')
      .map(link => link.getAttribute('aria-label') ?? '');

  const containers = screen.getByRole('link', { name: 'Containers' });
  containers.focus();
  const startIndex = names().indexOf('Containers');

  await fireEvent.keyDown(window, { key: 'ArrowDown', ctrlKey: true });
  await vi.waitFor(() => expect(names().indexOf('Containers')).toBe(startIndex + 1));
  await vi.waitFor(() => expect(screen.getByRole('link', { name: 'Containers' })).toHaveFocus());

  // A second press without refocusing must move the item again.
  await fireEvent.keyDown(window, { key: 'ArrowDown', ctrlKey: true });
  await vi.waitFor(() => expect(names().indexOf('Containers')).toBe(startIndex + 2));
  expect(screen.getByRole('link', { name: 'Containers' })).toHaveFocus();

  expect(window.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.itemOrder',
    expect.arrayContaining(['Pods', 'Containers']),
  );
  expect(screen.getByTestId('nav-live-region')).toHaveTextContent(/^Moved Containers to position \d+ of \d+$/);
});

test('Escape cancels an in-progress reorder drag', async () => {
  render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });

  const row = screen.getAllByRole('listitem')[0];
  await fireEvent.mouseDown(row, { button: 0, clientX: 10, clientY: 10 });
  vi.advanceTimersByTime(400);

  const ghost = await screen.findByTestId('nav-drag-ghost');
  // Selected-row background/foreground keep the ghost readable in every theme (incl. hc-light).
  expect(ghost).toHaveClass('bg-(--pd-global-nav-icon-selected-bg)');
  expect(ghost).toHaveClass('text-(--pd-global-nav-icon)');

  await fireEvent.keyDown(window, { key: 'Escape' });
  await vi.waitFor(() => expect(screen.queryByTestId('nav-drag-ghost')).not.toBeInTheDocument());

  await fireEvent.pointerUp(row);
  expect(window.updateConfigurationValue).not.toHaveBeenCalledWith('navbar.itemOrder', expect.anything());
});

function navigationListNames(): string[] {
  return within(screen.getByRole('region', { name: 'Scrollable navigation list' }))
    .getAllByRole('link')
    .map(link => link.getAttribute('aria-label') ?? '');
}

test('long-press, move and release commits the reorder at the drop slot', async () => {
  render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });

  const startNames = navigationListNames();
  const rows = screen.getAllByRole('listitem');
  rows.forEach((row, index) => {
    row.getBoundingClientRect = (): DOMRect => new DOMRect(0, index * 40, 100, 40);
  });
  const firstRow = rows[0];
  firstRow.setPointerCapture = vi.fn();

  firstRow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientY: 20, pointerId: 1 }));
  await fireEvent.mouseDown(firstRow, { button: 0, clientY: 20 });
  vi.advanceTimersByTime(400);
  await screen.findByTestId('nav-drag-ghost');
  expect(firstRow.setPointerCapture).toHaveBeenCalledWith(1);

  // Below the middle of the third row: the slot before the fourth row.
  const region = screen.getByRole('region', { name: 'Scrollable navigation list' });
  region.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientY: 100, pointerId: 1 }));
  region.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientY: 100, pointerId: 1 }));

  const expectedNames = [startNames[1], startNames[2], startNames[0], ...startNames.slice(3)];
  await vi.waitFor(() => expect(navigationListNames()).toEqual(expectedNames));
  expect(window.updateConfigurationValue).toHaveBeenCalledWith('navbar.itemOrder', expectedNames);
  expect(screen.queryByTestId('nav-drag-ghost')).not.toBeInTheDocument();
});

test('keeps focus after a pointer drop so keyboard reordering can continue', async () => {
  render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });

  const startNames = navigationListNames();
  const rows = screen.getAllByRole('listitem');
  rows.forEach((row, index) => {
    row.getBoundingClientRect = (): DOMRect => new DOMRect(0, index * 40, 100, 40);
  });
  const firstRow = rows[0];
  firstRow.setPointerCapture = vi.fn();

  firstRow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientY: 20, pointerId: 1 }));
  await fireEvent.mouseDown(firstRow, { button: 0, clientY: 20 });
  vi.advanceTimersByTime(400);

  const region = screen.getByRole('region', { name: 'Scrollable navigation list' });
  region.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientY: 100, pointerId: 1 }));
  region.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientY: 100, pointerId: 1 }));

  const movedName = startNames[0];
  await vi.waitFor(() => expect(screen.getByRole('link', { name: movedName })).toHaveFocus());

  // No manual refocus: the next shortcut must land on the same item.
  await fireEvent.keyDown(window, { key: 'ArrowDown', ctrlKey: true });
  await vi.waitFor(() => expect(navigationListNames().indexOf(movedName)).toBe(3));
});

test('Ctrl+ArrowUp moves the focused item up', async () => {
  render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });

  const startNames = navigationListNames();
  const movedName = startNames[1];
  screen.getByRole('link', { name: movedName }).focus();

  await fireEvent.keyDown(window, { key: 'ArrowUp', ctrlKey: true });

  await vi.waitFor(() => expect(navigationListNames()).toEqual([movedName, startNames[0], ...startNames.slice(2)]));
  expect(screen.getByTestId('nav-live-region')).toHaveTextContent(
    `Moved ${movedName} to position 1 of ${startNames.length}`,
  );
});

test('Ctrl+Arrow does not move the first item up or the last item down', async () => {
  render(AppNavigation, {
    meta: { url: '/' } as TinroRouteMeta,
    exitSettingsCallback: (): void => {},
  });

  const startNames = navigationListNames();

  screen.getByRole('link', { name: startNames[0] }).focus();
  await fireEvent.keyDown(window, { key: 'ArrowUp', ctrlKey: true });

  screen.getByRole('link', { name: startNames.at(-1) }).focus();
  await fireEvent.keyDown(window, { key: 'ArrowDown', ctrlKey: true });

  expect(navigationListNames()).toEqual(startNames);
  expect(window.updateConfigurationValue).not.toHaveBeenCalledWith('navbar.itemOrder', expect.anything());
});
