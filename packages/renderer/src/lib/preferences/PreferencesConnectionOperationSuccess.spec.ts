/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import type { ProviderContainerConnectionInfo, ProviderInfo } from '@desktop-framework/api';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { operationConnectionsInfo } from '/@/stores/operation-connections';

import { clearTaskLogs } from './preferences-connection-rendering-task';
import PreferencesConnectionOperationSuccess from './PreferencesConnectionOperationSuccess.svelte';

vi.mock(import('tinro'));
vi.mock(import('./preferences-connection-rendering-task'));

const operationKey = Symbol();

function setOperation(taskId: number, connectionInfo?: ProviderContainerConnectionInfo): void {
  operationConnectionsInfo.set(
    new Map([
      [
        taskId,
        {
          operationKey,
          providerInfo: { id: 'test' } as unknown as ProviderInfo,
          connectionInfo,
          properties: [],
          propertyScope: 'KubernetesProviderConnectionFactory',
          operationInProgress: false,
          operationSuccessful: true,
          operationStarted: true,
          errorMessage: '',
        },
      ],
    ]),
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  operationConnectionsInfo.set(new Map());
});

test.each([
  { label: 'Creation', connectionInfo: undefined },
  { label: 'Update', connectionInfo: { name: 'connection' } as unknown as ProviderContainerConnectionInfo },
])('Expect $label success screen', ({ label, connectionInfo }) => {
  setOperation(1, connectionInfo);
  render(PreferencesConnectionOperationSuccess, { taskId: 1 });

  expect(screen.getByText(label)).toBeInTheDocument();
  expect(screen.getByText('Successful operation')).toBeInTheDocument();
});

test('Expect go back button to clear the task logs, keep the operation and navigate to resources', async () => {
  setOperation(1);
  render(PreferencesConnectionOperationSuccess, { taskId: 1 });

  await fireEvent.click(screen.getByRole('button', { name: 'Go back to resources' }));

  expect(clearTaskLogs).toHaveBeenCalledWith(operationKey);
  expect(get(operationConnectionsInfo).get(1)?.operationSuccessful).toBe(true);
  expect(router.goto).toHaveBeenCalledWith('/preferences/resources');
});

test.each([
  { name: 'no operation in store', taskId: 1 },
  { name: 'no task id', taskId: undefined },
])('Expect go back button to only navigate to resources with $name', async ({ taskId }) => {
  setOperation(2);
  render(PreferencesConnectionOperationSuccess, { taskId });

  await fireEvent.click(screen.getByRole('button', { name: 'Go back to resources' }));

  expect(clearTaskLogs).not.toHaveBeenCalled();
  expect(router.goto).toHaveBeenCalledWith('/preferences/resources');
});
