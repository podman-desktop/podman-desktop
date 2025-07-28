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

import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import Providers from '/@/lib/statusbar/Providers.svelte';
import StatusBar from '/@/lib/statusbar/StatusBar.svelte';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import { statusBarEntries } from '/@/stores/statusbar';
import { tasksInfo } from '/@/stores/tasks';
import { ExperimentalTasksSettings } from '/@api/tasks-preferences';

// mock providers component
vi.mock(import('./Providers.svelte'));

const callbacks = new Map<string, (arg: unknown) => void>();

beforeEach(() => {
  vi.resetAllMocks();

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

  render(StatusBar);

  await vi.waitFor(() => {
    expect(Providers).toHaveBeenCalled();
  });
});

describe('providers', () => {
  test('providers should not be visible when getConfigurationValue is false', () => {
    vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

    render(StatusBar);

    expect(Providers).not.toHaveBeenCalled();
  });

  test('providers should show up when configuration changes from false to true', async () => {
    vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
    render(StatusBar);

    await vi.waitFor(() => expect(window.getConfigurationValue).toBeCalledTimes(2));

    expect(Providers).not.toHaveBeenCalled();

    callbacks.get(`statusbarProviders.showProviders`)?.({
      detail: { key: `statusbarProviders.showProviders`, value: true },
    });

    await vi.waitFor(() => expect(Providers).toHaveBeenCalled());
  });

  test('providers are hidden when configuration changes from true to false', async () => {
    vi.mocked(window.getConfigurationValue).mockResolvedValueOnce(false);
    vi.mocked(window.getConfigurationValue).mockResolvedValueOnce(true);
    render(StatusBar);

    await vi.waitFor(() => {
      expect(Providers).toHaveBeenCalled();
    });

    vi.mocked(Providers).mockReset();

    callbacks.get(`statusbarProviders.showProviders`)?.({
      detail: { key: `statusbarProviders.showProviders`, value: false },
    });

    await tick();

    expect(Providers).not.toHaveBeenCalled();
  });
});
