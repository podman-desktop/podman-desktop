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

import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { operationConnectionsInfo } from '/@/stores/operation-connections';

import {
  clearCompletedOperations,
  clearTaskLogs,
  type ConnectionCallback,
  getNextTaskId,
  registerConnectionCallback,
  removeOperation,
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

function setOperations(...operations: { key: symbol; inProgress: boolean }[]): void {
  operationConnectionsInfo.set(
    new Map(
      operations.map(({ key, inProgress }, index) => [
        index + 1,
        { operationKey: key, operationInProgress: inProgress } as never,
      ]),
    ),
  );
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
  setOperations({ key, inProgress: false });

  clearTaskLogs(key);

  expect(get(operationConnectionsInfo).size).toBe(1);
  expectLogsCleared(key, true);
});

test('removeOperation clears the logs and removes only the given operation', () => {
  const key = registerConnectionCallback(dummyCallback);
  const otherKey = registerConnectionCallback(dummyCallback);
  setOperations({ key, inProgress: false }, { key: otherKey, inProgress: false });

  removeOperation(key);

  expect([...get(operationConnectionsInfo).values()].map(operation => operation.operationKey)).toEqual([otherKey]);
  expectLogsCleared(key, true);
  expectLogsCleared(otherKey, false);
});

test('clearCompletedOperations clears the logs and removes only the operations not in progress', () => {
  const completedKey = registerConnectionCallback(dummyCallback);
  const runningKey = registerConnectionCallback(dummyCallback);
  setOperations({ key: completedKey, inProgress: false }, { key: runningKey, inProgress: true });

  clearCompletedOperations();

  expect([...get(operationConnectionsInfo).values()].map(operation => operation.operationKey)).toEqual([runningKey]);
  expectLogsCleared(completedKey, true);
  expectLogsCleared(runningKey, false);
});

test('getNextTaskId returns increasing ids', () => {
  operationConnectionsInfo.set(new Map());
  const first = getNextTaskId();
  expect(getNextTaskId()).toBe(first + 1);
});

test('getNextTaskId does not return an id already used by an operation', () => {
  const suppliedId = getNextTaskId() + 1;
  operationConnectionsInfo.set(new Map([[suppliedId, { operationKey: Symbol() } as never]]));

  expect(getNextTaskId()).toBe(suppliedId + 1);
});
