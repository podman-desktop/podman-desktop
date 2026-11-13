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

import type { ProviderInfo } from '@desktop-framework/api';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { type OperationConnectionInfo, operationConnectionsInfo } from '/@/stores/operation-connections';

import {
  clearCompletedOperations,
  clearTaskLogs,
  type ConnectionCallback,
  getNextTaskId,
  registerConnectionCallback,
  registerConnectionTask,
  removeConnectionTask,
  removeOperation,
  removeTaskOperation,
} from './preferences-connection-rendering-task';
import { disconnectUI, eventCollect, reconnectUI } from './preferences-connection-rendering-task';

const dummyCallback: ConnectionCallback = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  onEnd: vi.fn(),
};

const newCallback: ConnectionCallback = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  onEnd: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('check reconnect', async () => {
  const firstKey = registerConnectionCallback(dummyCallback);

  // stream some stuff
  eventCollect(firstKey, 'log', ['hello']);
  eventCollect(firstKey, 'log', ['world']);

  disconnectUI(firstKey);

  // send event while there is no UI connected
  eventCollect(firstKey, 'log', ['during disconnect']);
  eventCollect(firstKey, 'finish', []);

  reconnectUI(firstKey, newCallback);

  // check that we've replayed everything (including events that happened while there was no UI connected)
  expect(newCallback.log).toHaveBeenCalledWith([['hello'], ['world'], ['during disconnect']]);
  expect(newCallback.onEnd).toHaveBeenCalledTimes(1);
});

test('check events', async () => {
  const firstKey = registerConnectionCallback(dummyCallback);

  // stream some stuff
  eventCollect(firstKey, 'log', ['hello']);
  eventCollect(firstKey, 'warn', ['world']);
  eventCollect(firstKey, 'error', ['foo']);
  eventCollect(firstKey, 'finish', []);

  expect(dummyCallback.log).toHaveBeenCalledWith(['hello']);
  expect(dummyCallback.warn).toHaveBeenCalledWith(['world']);
  expect(dummyCallback.error).toHaveBeenCalledWith(['foo']);
  expect(dummyCallback.onEnd).toHaveBeenCalled();
});

const providerInfo: ProviderInfo = {
  id: 'test',
  name: 'test',
  internalId: '0',
  extensionId: '',
  status: 'started',
  warnings: [],
  links: [],
  images: {},
  detectionChecks: [],
  installationSupport: false,
  cleanupSupport: false,
  canStart: false,
  canStop: false,
  containerConnections: [],
  kubernetesConnections: [],
  vmConnections: [],
  containerProviderConnectionCreation: false,
  containerProviderConnectionInitialization: false,
  kubernetesProviderConnectionCreation: false,
  kubernetesProviderConnectionInitialization: false,
  vmProviderConnectionCreation: false,
  vmProviderConnectionInitialization: false,
};

function buildOperation(key: symbol, inProgress = false): OperationConnectionInfo {
  return {
    operationKey: key,
    providerInfo,
    connectionInfo: undefined,
    properties: [],
    propertyScope: 'ContainerProviderConnectionFactory',
    operationInProgress: inProgress,
    operationSuccessful: false,
    operationStarted: true,
    errorMessage: '',
  };
}

function setOperations(...operations: OperationConnectionInfo[]): void {
  operationConnectionsInfo.set(new Map(operations.map((operation, index) => [index + 1, operation])));
}

function expectLogsCleared(key: symbol, cleared: boolean): void {
  vi.mocked(newCallback.log).mockClear();
  eventCollect(key, 'log', ['hello']);
  reconnectUI(key, newCallback);
  if (cleared) {
    expect(newCallback.log).not.toHaveBeenCalled();
  } else {
    expect(newCallback.log).toHaveBeenCalled();
  }
}

test('clearTaskLogs clears the logs and keeps the operation', () => {
  const key = registerConnectionCallback(dummyCallback);
  setOperations(buildOperation(key));

  clearTaskLogs(key);

  expect(get(operationConnectionsInfo).size).toBe(1);
  expectLogsCleared(key, true);
});

test.each([
  { name: 'removeOperation', remove: (key: symbol): void => removeOperation(key) },
  { name: 'removeTaskOperation', remove: (): void => removeTaskOperation(1) },
  { name: 'clearCompletedOperations', remove: (): void => clearCompletedOperations() },
])('$name clears the logs and removes only the matching operation', ({ remove }) => {
  const removedKey = registerConnectionCallback(dummyCallback);
  const keptKey = registerConnectionCallback(dummyCallback);
  setOperations(buildOperation(removedKey), buildOperation(keptKey, true));

  remove(removedKey);

  expect([...get(operationConnectionsInfo).values()].map(operation => operation.operationKey)).toEqual([keptKey]);
  expectLogsCleared(removedKey, true);
  expectLogsCleared(keptKey, false);
});

test('removeConnectionTask removes the operation once no task references it', () => {
  setOperations(buildOperation(registerConnectionCallback(dummyCallback)));
  registerConnectionTask('task-1', 1);
  registerConnectionTask('task-2', 1);

  removeConnectionTask('task-unknown');
  removeConnectionTask('task-1');
  expect(get(operationConnectionsInfo).size).toBe(1);

  removeConnectionTask('task-2');
  expect(get(operationConnectionsInfo).size).toBe(0);
});

test('getNextTaskId returns increasing ids not already used by an operation', () => {
  operationConnectionsInfo.set(new Map());
  const first = getNextTaskId();
  expect(getNextTaskId()).toBe(first + 1);

  const suppliedId = first + 3;
  operationConnectionsInfo.set(new Map([[suppliedId, buildOperation(Symbol())]]));
  expect(getNextTaskId()).toBe(suppliedId + 1);
});
