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

import type { NotificationCard, ProviderContainerConnectionInfo, ProviderInfo } from '@desktop-framework/api';
import type { ProviderStatus } from '@desktop-framework/extension-api';
import { render, screen } from '@testing-library/svelte';
import { flushSync, tick } from 'svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import { notificationQueue } from '/@/stores/notifications';
import { providerInfos } from '/@/stores/providers';

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

const notification2: NotificationCard = {
  ...notification1,
  id: 2,
  title: '2',
};

// same notification posted again, it gets a new id
const notification1Reposted: NotificationCard = {
  ...notification1,
  id: 3,
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
  extensionId: 'extension',
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
const providerInfo2: ProviderInfo = { ...providerInfo, id: 'test2', internalId: 'id2' };
const providerInfo3: ProviderInfo = { ...providerInfo, id: 'test3', internalId: 'id3' };

test('Expect to do not display any dot if active page is Dashboard', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
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
  router.goto('/pods');

  await waitRender();

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to display the dot if active page is not Dashboard and there is a new notification', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
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
  router.goto('/pods');
  await waitRender();

  providerInfos.set([providerInfo]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.getByLabelText('New content available');
  expect(dot).toBeInTheDocument();
});

test('Expect to do not display the dot when leaving Dashboard if content existed at startup', async () => {
  router.goto('/');
  notificationQueue.set([notification1]);
  providerInfos.set([providerInfo]);
  await waitRender();

  router.goto('/pods');

  // wait for the navigation, so the dot absence is checked after the route change is rendered
  await vi.waitFor(() => expect(get(router).path).toBe('/pods'));
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});

test('Expect to do not display the dot when leaving Dashboard if content arrived while on Dashboard', async () => {
  router.goto('/');
  notificationQueue.set([]);
  providerInfos.set([]);
  await waitRender();

  notificationQueue.set([notification1]);
  providerInfos.set([providerInfo]);
  router.goto('/pods');

  // wait for the navigation, so the dot absence is checked after the route change is rendered
  await vi.waitFor(() => expect(get(router).path).toBe('/pods'));
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});

test('Expect to display the dot if a new notification arrives after leaving Dashboard', async () => {
  router.goto('/');
  notificationQueue.set([]);
  providerInfos.set([providerInfo]);
  await waitRender();

  router.goto('/pods');
  notificationQueue.set([notification1]);

  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());
});

test('Expect to hide the dot if the new provider is removed before visiting the Dashboard', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  router.goto('/pods');
  await waitRender();

  providerInfos.set([providerInfo]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());

  providerInfos.set([]);
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});

test('Expect to hide the dot if the new notification is removed before visiting the Dashboard', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  router.goto('/pods');
  await waitRender();

  notificationQueue.set([notification1]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());

  notificationQueue.set([]);
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});

test('Expect to keep the dot if only part of the new content is removed', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  router.goto('/pods');
  await waitRender();

  notificationQueue.set([notification1]);
  providerInfos.set([providerInfo]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());

  // only the provider is removed: the notification is still new, so the dot stays
  // (flush the pending updates, so the check is done after the removal has been applied)
  providerInfos.set([]);
  flushSync();
  expect(screen.getByLabelText('New content available')).toBeInTheDocument();

  // once the notification is removed too, nothing is new anymore
  notificationQueue.set([]);
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});

test('Expect to hide the dot after visiting the Dashboard, even if the content is still there', async () => {
  notificationQueue.set([]);
  providerInfos.set([]);
  router.goto('/pods');
  await waitRender();

  notificationQueue.set([notification1]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());

  router.goto('/');
  await vi.waitFor(() => expect(get(router).path).toBe('/'));
  router.goto('/pods');
  await vi.waitFor(() => expect(get(router).path).toBe('/pods'));

  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());

  // the component still reacts to really new content
  notificationQueue.set([notification1, notification2]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());
});

test('Expect to display the dot if a seen notification is replaced by a new one', async () => {
  router.goto('/');
  notificationQueue.set([notification1]);
  providerInfos.set([]);
  await waitRender();

  router.goto('/pods');
  await vi.waitFor(() => expect(get(router).path).toBe('/pods'));

  notificationQueue.set([notification2]);

  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());
});

test('Expect to do not display the dot if a seen notification is posted again', async () => {
  router.goto('/');
  notificationQueue.set([notification1]);
  providerInfos.set([]);
  await waitRender();

  router.goto('/pods');
  await vi.waitFor(() => expect(get(router).path).toBe('/pods'));

  notificationQueue.set([notification1Reposted]);

  // the dot only displays and hides for the really new notification, not for the one posted again
  notificationQueue.set([notification1Reposted, notification2]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());
  notificationQueue.set([notification1Reposted]);
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});

test('Expect to do not display the dot if a seen provider is removed while another seen provider remains', async () => {
  router.goto('/');
  notificationQueue.set([]);
  providerInfos.set([providerInfo, providerInfo2]);
  await waitRender();

  router.goto('/pods');
  await vi.waitFor(() => expect(get(router).path).toBe('/pods'));

  providerInfos.set([providerInfo2]);

  // the dot only displays and hides for the really new provider, not for the removal of a seen one
  providerInfos.set([providerInfo2, providerInfo3]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());
  providerInfos.set([providerInfo2]);
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});

test('Expect to do not display the dot if a seen provider is registered again', async () => {
  router.goto('/');
  notificationQueue.set([]);
  providerInfos.set([providerInfo]);
  await waitRender();

  router.goto('/pods');
  await vi.waitFor(() => expect(get(router).path).toBe('/pods'));

  // the provider is disabled then enabled again: it gets a new internal id
  providerInfos.set([]);
  providerInfos.set([{ ...providerInfo, internalId: 'id-registered-again' }]);

  // the dot only displays and hides for the really new provider, not for the one registered again
  providerInfos.set([{ ...providerInfo, internalId: 'id-registered-again' }, providerInfo3]);
  await vi.waitFor(() => expect(screen.getByLabelText('New content available')).toBeInTheDocument());
  providerInfos.set([{ ...providerInfo, internalId: 'id-registered-again' }]);
  await vi.waitFor(() => expect(screen.queryByLabelText('New content available')).not.toBeInTheDocument());
});
