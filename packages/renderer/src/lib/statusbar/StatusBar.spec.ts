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

import '@testing-library/jest-dom/vitest';

import { ExperimentalTasksSettings } from '@desktop-framework/api';
import { render } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import Providers from '/@/lib/statusbar/Providers.svelte';
import StatusBar from '/@/lib/statusbar/StatusBar.svelte';
import { isHighContrast } from '/@/stores/appearance';
import { statusBarEntries } from '/@/stores/statusbar';
import { tasksInfo } from '/@/stores/tasks';

// mock providers component
vi.mock(import('./Providers.svelte'));

beforeEach(() => {
  vi.resetAllMocks();

  Object.defineProperty(window, 'isExperimentalConfigurationEnabled', { value: vi.fn() });

  // reset stores
  statusBarEntries.set([]);
  isHighContrast.set(false);
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

test('onMount should call isExperimentalConfigurationEnabled', async () => {
  render(StatusBar);

  await vi.waitFor(() => expect(window.isExperimentalConfigurationEnabled).toHaveBeenCalledTimes(1));

  expect(window.isExperimentalConfigurationEnabled).toHaveBeenNthCalledWith(
    1,
    `${ExperimentalTasksSettings.SectionName}.${ExperimentalTasksSettings.StatusBar}`,
  );
});

test('tasks should be visible when isExperimentalConfigurationEnabled is true', async () => {
  vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(true);

  const { getByRole } = render(StatusBar);

  await vi.waitFor(() => {
    const status = getByRole('status');
    expect(status).toBeDefined();
    expect(status.textContent).toBe('Dummy Task');
  });
});

test('tasks should not be visible when isExperimentalConfigurationEnabled is false', () => {
  vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(false);

  const { queryByRole } = render(StatusBar);
  const status = queryByRole('status');
  expect(status).toBeNull();
});

test('providers are always rendered', async () => {
  render(StatusBar);

  await vi.waitFor(() => {
    expect(Providers).toHaveBeenCalled();
  });
});

test('statusbar has data-pd-force-theme set to dark in non-hc mode', async () => {
  isHighContrast.set(false);

  const { getByRole } = render(StatusBar);

  const statusBar = getByRole('contentinfo');
  expect(statusBar).toHaveAttribute('data-pd-force-theme', 'dark');
});

test('statusbar has data-pd-force-theme set to hc-dark in high-contrast mode', async () => {
  isHighContrast.set(true);

  const { getByRole } = render(StatusBar);

  const statusBar = getByRole('contentinfo');
  expect(statusBar).toHaveAttribute('data-pd-force-theme', 'hc-dark');
});
