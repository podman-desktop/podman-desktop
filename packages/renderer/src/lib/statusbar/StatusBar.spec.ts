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

import '@testing-library/jest-dom/vitest';

import type { ProviderStatus } from '@podman-desktop/api';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import StatusBar from '/@/lib/statusbar/StatusBar.svelte';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import { providerInfos } from '/@/stores/providers';
import { statusBarEntries } from '/@/stores/statusbar';
import { tasksInfo } from '/@/stores/tasks';
import type { ProviderInfo } from '/@api/provider-info';
import { ExperimentalTasksSettings } from '/@api/tasks-preferences';

const callbacks = new Map<string, (arg: unknown) => void>();

const providerMock1 = {
  name: 'provider1',
  containerConnections: [{}],
  kubernetesConnections: [],
  status: 'ready' as ProviderStatus,
  images: {},
} as unknown as ProviderInfo;

const providerMock2 = {
  name: 'provider2',
  containerConnections: [],
  kubernetesConnections: [{}],
  status: 'ready' as ProviderStatus,
  images: {},
} as unknown as ProviderInfo;

beforeEach(() => {
  Object.defineProperty(window, 'getConfigurationValue', { value: vi.fn() });
  onDidChangeConfiguration.addEventListener = vi.fn().mockImplementation((message: string, callback: () => void) => {
    callbacks.set(message, callback);
  });

  // reset stores
  statusBarEntries.set([]);
  tasksInfo.set([
    {
      name: 'Dummy Task',
      state: 'running',
      status: 'in-progress',
      started: 0,
      id: 'dummy-task',
      cancellable: false,
    },
  ]);

  providerInfos.set([providerMock1, providerMock2]);
});

test('onMount should call getConfigurationValue', async () => {
  render(StatusBar);

  await vi.waitFor(() => expect(window.getConfigurationValue).toBeCalledTimes(2));

  expect(window.getConfigurationValue).nthCalledWith(
    1,
    `${ExperimentalTasksSettings.SectionName}.${ExperimentalTasksSettings.StatusBar}`,
  );

  expect(window.getConfigurationValue).nthCalledWith(2, `statusbarProviders.showProviders`);
});

test('tasks should be visible when getConfigurationValue is true', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  const { getByRole } = render(StatusBar);

  await vi.waitFor(() => {
    const status = getByRole('status');
    expect(status).toBeDefined();
    expect(status.textContent).toBe('Dummy Task');
  });
});

test('tasks should not be visible when getConfigurationValue is false', () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

  const { queryByRole } = render(StatusBar);
  const status = queryByRole('status');
  expect(status).toBeNull();
});

test('providers should be visible when getConfigurationValue is true', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  const { queryByLabelText } = render(StatusBar);
  await tick();

  await vi.waitFor(() => {
    const provider1 = queryByLabelText('provider1');
    const provider2 = queryByLabelText('provider2');
    expect(provider1).toBeInTheDocument();
    expect(provider2).not.toBeInTheDocument();
  });
});

test('providers should not be visible when getConfigurationValue is false', () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

  const { queryByLabelText } = render(StatusBar);
  const provider1 = queryByLabelText('provider1');
  expect(provider1).toBeNull();
});

test('providers should show up when configuration changes from false to true', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
  const { queryByLabelText } = render(StatusBar);
  await tick();

  const provider1 = queryByLabelText('provider1');
  expect(provider1).toBeNull();

  callbacks.get(`statusbarProviders.showProviders`)?.({
    detail: { key: `statusbarProviders.showProviders`, value: true },
  });

  await tick();

  await vi.waitFor(() => {
    const provider1 = queryByLabelText('provider1');
    const provider2 = queryByLabelText('provider2');
    expect(provider1).toBeInTheDocument();
    expect(provider2).not.toBeInTheDocument();
  });
});

test('providers are hidden when configuration changes from true to false', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValueOnce(false);
  vi.mocked(window.getConfigurationValue).mockResolvedValueOnce(true);
  const { queryByLabelText } = render(StatusBar);

  await vi.waitFor(() => {
    const provider1 = queryByLabelText('provider1');
    const provider2 = queryByLabelText('provider2');
    expect(provider1).toBeInTheDocument();
    expect(provider2).not.toBeInTheDocument();
  });

  callbacks.get(`statusbarProviders.showProviders`)?.({
    detail: { key: `statusbarProviders.showProviders`, value: false },
  });

  await tick();

  const provider1 = queryByLabelText('provider1');
  expect(provider1).toBeNull();
});
