/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import type { ProviderStatus } from '@podman-desktop/api';
import type { NotificationCard, ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import { notificationQueue } from '/@/stores/notifications';
import { providerInfos, providersLoaded } from '/@/stores/providers';

import NewContentOnDashboardBadge from './NewContentOnDashboardBadge.svelte';

async function waitRender(): Promise<void> {
  render(NewContentOnDashboardBadge);
  await tick();
}

const notification1: NotificationCard = {
  id: 1,
  extensionId: 'extension',
  title: '1',
  body: '1',
  type: 'info',
  highlight: true,
};

const pStatus: ProviderStatus = 'started';
const pInfo: ProviderContainerConnectionInfo = {
  connectionType: 'container',
  name: 'test',
  displayName: 'test',
  status: 'started',
  endpoint: {
    socketPath: '',
  },
  canStart: false,
  canStop: false,
  canEdit: false,
  canDelete: false,
  type: 'podman',
};
const providerInfo = {
  id: 'test',
  internalId: 'id',
  name: '',
  containerConnections: [pInfo],
  kubernetesConnections: undefined,
  status: pStatus,
  containerProviderConnectionCreation: false,
  containerProviderConnectionInitialization: false,
  kubernetesProviderConnectionCreation: false,
  kubernetesProviderConnectionInitialization: false,
  links: undefined,
  detectionChecks: undefined,
  warnings: undefined,
  images: undefined,
  installationSupport: undefined,
} as unknown as ProviderInfo;

test('Expect to do not display any dot if active page is Dashboard', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  providersLoaded.set(true);
  await waitRender();

  notificationQueue.set([notification1]);
  providerInfos.set([providerInfo]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to do not display any dot if active page is not Dashboard but there are no updates', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  providersLoaded.set(true);
  router.goto('/pods');

  await waitRender();

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to display the dot if active page is not Dashboard and there is a new notification', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  providersLoaded.set(true);
  router.goto('/pods');
  await waitRender();

  notificationQueue.set([notification1]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.getByLabelText('New content available');
  expect(dot).toBeInTheDocument();
});

test('Expect to display the dot if active page is not Dashboard and there is a new provider', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  providersLoaded.set(true);
  router.goto('/pods');
  await waitRender();

  providerInfos.set([providerInfo]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.getByLabelText('New content available');
  expect(dot).toBeInTheDocument();
});

test('Expect the extensions-started event to mark providers as loaded and enable new-content detection', async () => {
  const receiveMock = vi.mocked(window.events.receive);
  const extensionsStartedHandler = receiveMock.mock.calls.findLast(([event]) => event === 'extensions-started')?.[1] as
    | (() => void)
    | undefined;
  expect(extensionsStartedHandler).toBeDefined();

  providersLoaded.set(false);
  providerInfos.set([]);
  notificationQueue.set([]);
  router.goto('/pods');
  await waitRender();

  providerInfos.set([providerInfo]);
  await tick();

  extensionsStartedHandler?.();
  await tick();
  expect(get(providersLoaded)).toBe(true);

  providerInfos.set([providerInfo]);
  await tick();
  expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument();

  const providerInfo2 = { ...providerInfo, internalId: 'id2' } as ProviderInfo;
  providerInfos.set([providerInfo, providerInfo2]);
  await new Promise(resolve => setTimeout(resolve, 200));
  expect(screen.getByLabelText('New content available')).toBeInTheDocument();
});

test('Expect to do not display any dot if the provider was already there but the initial fetch resolves after mount', async () => {
  // simulate the real startup race from #18563: the component mounts before the backend
  // has answered, so providerInfos is still the initial empty value at render time
  providersLoaded.set(false);
  providerInfos.set([]);
  notificationQueue.set([]);
  router.goto('/pods');
  await waitRender();

  // the initial fetch resolves shortly after mount and reports a provider that already
  // existed before the app was even opened - this is not new content
  providersLoaded.set(true);
  providerInfos.set([providerInfo]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to do not display any dot when providers register progressively during startup before providersLoaded fires', async () => {
  // simulate the real startup sequence: extensions activate one by one, each registering
  // a provider and triggering a fetch, before providersLoaded is set (which only happens
  // once every extension has finished starting)
  const providerInfo2 = { ...providerInfo, internalId: 'id2' } as ProviderInfo;
  providersLoaded.set(false);
  providerInfos.set([]);
  notificationQueue.set([]);
  router.goto('/pods');
  await waitRender();

  // extension 1 finishes activating and registers its provider
  providerInfos.set([providerInfo]);
  await tick();

  // extension 2 finishes activating and registers its provider - providerInfos grows again
  providerInfos.set([providerInfo, providerInfo2]);
  await tick();

  // all extensions have now finished starting - this is not new content, just startup settling
  providersLoaded.set(true);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to display the dot if a provider is added after the initial fetch has resolved', async () => {
  providersLoaded.set(false);
  providerInfos.set([]);
  notificationQueue.set([]);
  router.goto('/pods');
  await waitRender();

  // initial fetch resolves with no providers
  providersLoaded.set(true);
  providerInfos.set([]);

  await tick();

  // a provider is genuinely added afterwards
  providerInfos.set([providerInfo]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.getByLabelText('New content available');
  expect(dot).toBeInTheDocument();
});
