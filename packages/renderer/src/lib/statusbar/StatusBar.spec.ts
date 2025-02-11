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
import { beforeEach, describe, expect, test, vi } from 'vitest';

import Providers from '/@/lib/statusbar/Providers.svelte';
import StatusBar from '/@/lib/statusbar/StatusBar.svelte';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import { statusBarEntries } from '/@/stores/statusbar';
import { tasksInfo } from '/@/stores/tasks';
import { ExperimentalTasksSettings } from '/@api/tasks-preferences';

const callbacks = new Map<string, (arg: unknown) => void>();

// mock component
vi.mock('/@/lib/statusbar/Providers.svelte');

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

describe('providers', () => {
  test('onMount should call getConfigurationValue', async () => {
    render(StatusBar);

    await vi.waitFor(() => expect(window.getConfigurationValue).toBeCalledTimes(2));

    expect(window.getConfigurationValue).nthCalledWith(
      1,
      `${ExperimentalTasksSettings.SectionName}.${ExperimentalTasksSettings.StatusBar}`,
    );

    expect(window.getConfigurationValue).nthCalledWith(2, `statusbarProviders.showProviders`);
  });

  test('providers should not be visible when getConfigurationValue is false', () => {
    vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

    render(StatusBar);

    // not called
    expect(Providers).not.toHaveBeenCalled();
  });

  test('providers should be visible when getConfigurationValue is true', async () => {
    vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

    render(StatusBar);

    // should have been called
    await vi.waitFor(() => {
      expect(Providers).toHaveBeenCalled();
    });
  });

  test('providers should visible after configuration changed (to true)', async () => {
    vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

    render(StatusBar);

    // not called
    expect(Providers).not.toHaveBeenCalled();

    // update the configuration value
    vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
    callbacks.get(`statusbarProviders.showProviders`)?.({
      detail: { key: `statusbarProviders.showProviders`, value: true },
    });

    // should have been called
    await vi.waitFor(() => {
      expect(Providers).toHaveBeenCalled();
    });
  });
});
