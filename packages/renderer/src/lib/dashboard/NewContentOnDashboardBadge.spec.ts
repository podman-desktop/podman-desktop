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
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { notificationQueue } from '/@/stores/notifications';
import { providerInfos } from '/@/stores/providers';

import NewContentOnDashboardBadge from './NewContentOnDashboardBadge.svelte';

const extensionSystemIsExtensionsStartedMock = vi.fn<() => Promise<boolean>>();

// render, then let the on-mount `extensionSystemIsExtensionsStarted()` query resolve
// so the component's readiness (and baseline capture) is settled before the test
// mutates the stores. Readiness is driven through this query path rather than the
// `extensions-already-started` event to avoid triggering the stores' own fetch
// machinery (which would overwrite the values under test).
async function waitRender(): Promise<void> {
  render(NewContentOnDashboardBadge);
  await tick();
  // flush the microtasks of the async readiness query
  await new Promise(resolve => setTimeout(resolve, 0));
  await tick();
}

beforeEach(() => {
  vi.resetAllMocks();
  // by default, extensions are not yet started when the component mounts
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(false);
  Object.defineProperty(window, 'extensionSystemIsExtensionsStarted', {
    value: extensionSystemIsExtensionsStartedMock,
    writable: true,
    configurable: true,
  });
  notificationQueue.set([]);
  providerInfos.set([]);
  router.goto('/');
});

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

const providerInfo2 = {
  ...providerInfo,
  id: 'test2',
  internalId: 'id2',
} as unknown as ProviderInfo;

test('Expect to do not display any dot if active page is Dashboard', async () => {
  // extensions started, and content arrives while on the Dashboard
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(true);
  await waitRender();

  notificationQueue.set([notification1]);
  providerInfos.set([providerInfo]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to do not display any dot if active page is not Dashboard but there are no updates', async () => {
  router.goto('/pods');

  await waitRender();

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to display the dot if active page is not Dashboard and there is a new notification', async () => {
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(true);
  router.goto('/pods');
  await waitRender();

  // startup snapshot resolves (empty) after readiness -> becomes the baseline
  notificationQueue.set([]);
  await tick();

  // genuinely new notification arrives afterwards
  notificationQueue.set([notification1]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.getByLabelText('New content available');
  expect(dot).toBeInTheDocument();
});

test('Expect to display the dot if active page is not Dashboard and there is a new provider', async () => {
  // provider already present at startup, extensions already started on mount:
  // its baseline is captured from the current providers at readiness
  providerInfos.set([providerInfo]);
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(true);
  router.goto('/pods');
  await waitRender();

  // genuinely new provider arrives afterwards
  providerInfos.set([providerInfo, providerInfo2]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.getByLabelText('New content available');
  expect(dot).toBeInTheDocument();
});

// regression tests for #18563: content present at startup must not light the dot
test('Expect to do not display any dot if the provider was already there but the initial fetch resolves after mount', async () => {
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(true);
  router.goto('/pods');
  await waitRender();

  // startup fetch resolves after mount -> becomes the baseline, not new content
  providerInfos.set([providerInfo]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});

test('Expect to do not display any dot if a notification was already there but the initial fetch resolves after mount', async () => {
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(true);
  router.goto('/pods');
  await waitRender();

  // startup fetch resolves after mount -> becomes the baseline, not new content
  notificationQueue.set([notification1]);

  await new Promise(resolve => setTimeout(resolve, 200));

  const dot = screen.queryByLabelText('New content available');
  expect(dot).not.toBeInTheDocument();
});
