/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { tablePersistence } from '@podman-desktop/ui-svelte';
import { render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { get, writable } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as kubernetesNoCurrentContext from '/@/stores/kubernetes-no-current-context';

import App from './App.svelte';
import { lastPage } from './stores/breadcrumb';
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

test('test /images/run/* route', async () => {
  render(App);
  expect(mocks.RunImage).not.toHaveBeenCalled();
  expect(mocks.DashboardPage).toHaveBeenCalled();
  router.goto('/images/run/basic');
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
    render(App);

    expect(tablePersistence.storage).toBeDefined();
    expect(tablePersistence.storage).toHaveProperty('load');
    expect(tablePersistence.storage).toHaveProperty('save');
    expect(tablePersistence.storage).toHaveProperty('reset');
  });

  test('should provide working load callback through store', async () => {
    vi.mocked(window.loadListConfig).mockResolvedValue([
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 0 },
    ]);
    render(App);

    // Get the callbacks from the store
    expect(tablePersistence.storage).toBeDefined();

    // Test the load callback
    const result = await tablePersistence.storage!.load('test-kind', ['Name', 'Age']);

    expect(vi.mocked(window.loadListConfig)).toHaveBeenCalledWith('test-kind', ['Name', 'Age']);
    expect(result).toEqual([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]);
  });

  test('should provide working save callback through store', async () => {
    vi.mocked(window.saveListConfig).mockResolvedValue(undefined);
    render(App);

    // Test the save callback
    const items = [{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }];
    await tablePersistence.storage!.save('test-kind', items);
    expect(vi.mocked(window.saveListConfig)).toHaveBeenCalledWith('test-kind', items);
  });

  test('should provide working reset callback through store', async () => {
    vi.mocked(window.resetListConfig).mockResolvedValue([
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 0 },
    ]);

    render(App);

    expect(tablePersistence.storage).toBeDefined();

    // Test the reset callback
    const result = await tablePersistence.storage!.reset('test-kind', ['Name', 'Age']);

    expect(vi.mocked(window.resetListConfig)).toHaveBeenCalledWith('test-kind', ['Name', 'Age']);
    expect(result).toEqual([{ id: 'Name', label: 'Name', enabled: true, originalOrder: 0 }]);
  });
});
