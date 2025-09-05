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

import { tablePersistenceCallbacks } from '@podman-desktop/ui-svelte';
import { render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { get, writable } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as kubernetesNoCurrentContext from '/@/stores/kubernetes-no-current-context';

import App from './App.svelte';
import { lastPage, lastSubmenuPages } from './stores/breadcrumb';
import { navigationRegistry, type NavigationRegistryEntry } from './stores/navigation/navigation-registry';

const mocks = vi.hoisted(() => ({
  DashboardPage: vi.fn(),
  RunImage: vi.fn(),
  ImagesList: vi.fn(),
  SubmenuNavigation: vi.fn(),
  DeploymentsList: vi.fn(),
  KubernetesDashboard: vi.fn(),
}));

vi.mock('./lib/dashboard/DashboardPage.svelte', () => ({
  default: mocks.DashboardPage,
}));
vi.mock('./lib/image/RunImage.svelte', () => ({
  default: mocks.RunImage,
}));
vi.mock('./lib/image/ImagesList.svelte', () => ({
  default: mocks.ImagesList,
}));

vi.mock('./lib/ui/TitleBar.svelte', () => ({
  default: vi.fn(),
}));
vi.mock('./lib/welcome/WelcomePage.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('./lib/context/ContextKey.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('./lib/appearance/Appearance.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('./SubmenuNavigation.svelte', () => ({
  default: mocks.SubmenuNavigation,
}));

vi.mock('./lib/kube/KubernetesDashboard.svelte', () => ({
  default: mocks.KubernetesDashboard,
}));

vi.mock('./lib/deployments/DeploymentsList.svelte', () => ({
  default: mocks.DeploymentsList,
}));

vi.mock('/@/stores/kubernetes-contexts-state', async () => {
  return {};
});

vi.mock('/@/stores/kubernetes-no-current-context');

const dispatchEventMock = vi.fn();
const messages = new Map<string, (args: unknown) => void>();

beforeEach(() => {
  vi.resetAllMocks();
  router.goto('/');
  (window.events as unknown) = {
    receive: vi.fn().mockImplementation((channel, func) => {
      messages.set(channel, func);
    }),
  };
  Object.defineProperty(window, 'dispatchEvent', { value: dispatchEventMock });
  (window.getConfigurationValue as unknown) = vi.fn();
  vi.mocked(kubernetesNoCurrentContext).kubernetesNoCurrentContext = writable(false);
});

test('test /image/run/* route', async () => {
  render(App);
  expect(mocks.RunImage).not.toHaveBeenCalled();
  expect(mocks.DashboardPage).toHaveBeenCalled();
  router.goto('/image/run/basic');
  await tick();
  expect(mocks.RunImage).toHaveBeenCalled();
});

test('test /images/:id/:engineId route', async () => {
  render(App);
  expect(mocks.ImagesList).not.toHaveBeenCalled();
  expect(mocks.DashboardPage).toHaveBeenCalled();
  router.goto('/images/an-image/an-engine');
  await tick();
  expect(mocks.ImagesList).toHaveBeenCalled();
});

test('receive context menu visible event from main', async () => {
  render(App);
  // send 'context-menu:visible' event
  messages.get('context-menu:visible')?.(true);

  // wait for dispatch method to be called
  await waitFor(() => expect(dispatchEventMock).toHaveBeenCalledWith(expect.any(Event)));

  const tooltipHideCall = vi.mocked(dispatchEventMock).mock.calls.find(call => call[0].type === 'tooltip-hide');
  expect(tooltipHideCall).toBeDefined();
  expect(tooltipHideCall![0].type).toBe('tooltip-hide');
});

test('receive context menu not visible event from main', async () => {
  render(App);

  messages.get('context-menu:visible')?.(false);

  //  wait for dispatch method to be called
  await waitFor(() => expect(dispatchEventMock).toHaveBeenCalledWith(expect.any(Event)));

  const tooltipShowCall = vi.mocked(dispatchEventMock).mock.calls.find(call => call[0].type === 'tooltip-show');
  expect(tooltipShowCall).toBeDefined();
  expect(tooltipShowCall![0].type).toBe('tooltip-show');
});

test('opens submenu when a `submenu` menu is opened', async () => {
  navigationRegistry.set([
    {
      name: 'An entry with submenu',
      icon: {},
      link: '/tosubmenu',
      tooltip: 'With submenu',
      type: 'submenu',
      get counter(): number {
        return 0;
      },
      items: [{} as NavigationRegistryEntry],
    },
  ]);
  render(App);
  expect(mocks.SubmenuNavigation).not.toHaveBeenCalled();
  router.goto('/tosubmenu');
  await tick();
  expect(mocks.SubmenuNavigation).toHaveBeenCalled();
});

test('do not display kubernetes empty screen if current context', async () => {
  render(App);
  router.goto('/kubernetes/deployments');
  await tick();
  expect(mocks.KubernetesDashboard).not.toHaveBeenCalled();
  expect(mocks.DeploymentsList).toHaveBeenCalled();
});

test('displays kubernetes empty screen if no current context, without Kubernetes menu', async () => {
  vi.mocked(kubernetesNoCurrentContext).kubernetesNoCurrentContext = writable(true);

  render(App);
  router.goto('/kubernetes/deployments');
  await tick();
  expect(mocks.KubernetesDashboard).toHaveBeenCalled();
  expect(mocks.DeploymentsList).not.toHaveBeenCalled();
  expect(mocks.SubmenuNavigation).not.toHaveBeenCalled();
});

test('go to last kubernetes page when available', async () => {
  vi.mocked(kubernetesNoCurrentContext).kubernetesNoCurrentContext = writable(false);
  lastSubmenuPages.set({ Kubernetes: '/kubernetes/deployments' });
  render(App);
  router.goto('/kubernetes');
  await tick();
  expect(mocks.DeploymentsList).toHaveBeenCalled();
});

test('go to dashboard page when last kubernetes page is /kubernetes', async () => {
  lastSubmenuPages.set({ Kubernetes: '/kubernetes' });
  render(App);
  router.goto('/kubernetes');
  await tick();

  expect(mocks.KubernetesDashboard).toHaveBeenCalled();
});

test('go to dashboard page when last kubernetes page not available', async () => {
  lastSubmenuPages.set({});
  render(App);
  router.goto('/kubernetes');
  await tick();
  expect(mocks.KubernetesDashboard).toHaveBeenCalled();
});

test('receive show-release-notes event from main', async () => {
  render(App);

  messages.get('show-release-notes');

  expect(mocks.DashboardPage).toBeCalled();
});

test('leaving Dashboard Page saves it in lastPage storage', async () => {
  navigationRegistry.set([
    {
      name: 'Pods',
      icon: {},
      link: '/pods',
      tooltip: 'Pods',
      type: 'entry',

      get counter(): number {
        return 0;
      },
    },
    {
      name: 'Images',
      icon: {},
      link: '/images',
      tooltip: 'Images',
      type: 'entry',

      get counter(): number {
        return 0;
      },
    },
  ]);

  render(App);

  router.goto('/pods');
  await tick();
  expect(get(lastPage).name).equals('Dashboard Page');

  router.goto('/images');
  await tick();
  expect(get(lastPage).name).equals('Pods');

  router.goto('/');
  await tick();
  expect(get(lastPage).name).equals('Images');

  router.goto('/pods');
  await tick();
  expect(get(lastPage).name).equals('Dashboard Page');
});

describe('Table persistence functionality', () => {
  test('should set tablePersistenceCallbacks store on app initialization', async () => {
    // Mock the window methods
    Object.defineProperty(window, 'loadLayoutConfig', { value: vi.fn() });
    Object.defineProperty(window, 'saveLayoutConfig', { value: vi.fn() });
    Object.defineProperty(window, 'resetLayoutConfig', { value: vi.fn() });

    render(App);

    // Check that the tablePersistenceCallbacks store is set
    const callbacks = get(tablePersistenceCallbacks);
    expect(callbacks).toBeDefined();
    expect(callbacks).toHaveProperty('load');
    expect(callbacks).toHaveProperty('save');
    expect(callbacks).toHaveProperty('reset');
    expect(typeof callbacks!.load).toBe('function');
    expect(typeof callbacks!.save).toBe('function');
    expect(typeof callbacks!.reset).toBe('function');
  });

  test('should provide working load callback through store', async () => {
    const mockLoadLayoutConfig = vi
      .fn()
      .mockResolvedValue([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]);

    // Mock the window method
    Object.defineProperty(window, 'loadLayoutConfig', { value: mockLoadLayoutConfig });
    Object.defineProperty(window, 'saveLayoutConfig', { value: vi.fn() });
    Object.defineProperty(window, 'resetLayoutConfig', { value: vi.fn() });

    render(App);

    // Get the callbacks from the store
    const callbacks = get(tablePersistenceCallbacks);
    expect(callbacks).toBeDefined();

    // Test the load callback
    const result = await callbacks!.load('test-kind', ['Name', 'Age']);

    expect(mockLoadLayoutConfig).toHaveBeenCalledWith('test-kind', ['Name', 'Age']);
    expect(result).toEqual([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]);
  });

  test('should provide working save callback through store', async () => {
    const mockSaveLayoutConfig = vi.fn().mockResolvedValue(undefined);

    // Mock the window methods
    Object.defineProperty(window, 'loadLayoutConfig', { value: vi.fn() });
    Object.defineProperty(window, 'saveLayoutConfig', { value: mockSaveLayoutConfig });
    Object.defineProperty(window, 'resetLayoutConfig', { value: vi.fn() });

    render(App);

    // Get the callbacks from the store
    const callbacks = get(tablePersistenceCallbacks);
    expect(callbacks).toBeDefined();

    // Test the save callback
    const items = [{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }];
    await callbacks!.save('test-kind', items);

    expect(mockSaveLayoutConfig).toHaveBeenCalledWith('test-kind', items);
  });

  test('should provide working reset callback through store', async () => {
    const mockResetLayoutConfig = vi
      .fn()
      .mockResolvedValue([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]);

    // Mock the window methods
    Object.defineProperty(window, 'loadLayoutConfig', { value: vi.fn() });
    Object.defineProperty(window, 'saveLayoutConfig', { value: vi.fn() });
    Object.defineProperty(window, 'resetLayoutConfig', { value: mockResetLayoutConfig });

    render(App);

    // Get the callbacks from the store
    const callbacks = get(tablePersistenceCallbacks);
    expect(callbacks).toBeDefined();

    // Test the reset callback
    const result = await callbacks!.reset('test-kind', ['Name', 'Age']);

    expect(mockResetLayoutConfig).toHaveBeenCalledWith('test-kind', ['Name', 'Age']);
    expect(result).toEqual([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]);
  });
});
