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

import { render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { get, writable } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

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

class ResizeObserverMock {
  private _cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this._cb = cb;
  }
  observe(): void {}
  disconnect(): void {}
}

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
  global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
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

  const eventSent = vi.mocked(dispatchEventMock).mock.calls[0][0];
  expect((eventSent as Event).type).toBe('tooltip-hide');
});

test('receive context menu not visible event from main', async () => {
  render(App);

  messages.get('context-menu:visible')?.(false);

  //  wait for dispatch method to be called
  await waitFor(() => expect(dispatchEventMock).toHaveBeenCalledWith(expect.any(Event)));

  const eventSent = vi.mocked(dispatchEventMock).mock.calls[0][0];
  expect((eventSent as Event).type).toBe('tooltip-show');
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
