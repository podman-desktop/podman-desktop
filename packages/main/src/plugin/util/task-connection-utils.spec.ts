/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { beforeEach, expect, test, vi } from 'vitest';

import { CancellationTokenSource } from '/@/plugin/cancellation-token.js';
import type { CancellationTokenRegistry } from '/@/plugin/cancellation-token-registry.js';
import type { LoggerWithEnd } from '/@/plugin/index.js';
import { TaskImpl } from '/@/plugin/tasks/task-impl.js';
import type { TaskManager } from '/@/plugin/tasks/task-manager.js';
import type { Task } from '/@/plugin/tasks/tasks.js';

import type { TaskOptions } from './task-connection-utils.js';
import { TaskConnectionUtils } from './task-connection-utils.js';

let originalTask: Task;
let taskConnectionUtils: TaskConnectionUtils;

const getLogHandlerResult = {
  onEnd: vi.fn(),
  error: vi.fn(),
} as unknown as LoggerWithEnd;

const cancellationTokenRegistry = {
  getCancellationTokenSource: vi.fn(),
} as unknown as CancellationTokenRegistry;

const taskManager = {
  createTask: vi.fn(),
} as unknown as TaskManager;

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();

  originalTask = {
    status: 'in-progress',
    error: '',
  } as unknown as Task;

  const options = {
    getLogHandler: vi.fn(),
    cancellationTokenRegistry,
    taskManager,
  };

  vi.mocked(options.getLogHandler).mockReturnValue(getLogHandlerResult);
  vi.mocked(taskManager.createTask).mockReturnValue(originalTask);
  vi.mocked(cancellationTokenRegistry.getCancellationTokenSource).mockReturnValue(new CancellationTokenSource());

  taskConnectionUtils = new TaskConnectionUtils(options);
});

test('createTask is called', async () => {
  const options: TaskOptions = {
    loggerId: 'logger1',
    tokenId: 42,
    title: 'a title',
    navigateToTask: vi.fn(),
    execute: vi.fn(),
    executeErrorMsg: vi.fn(),
  };
  vi.mocked(options.execute).mockResolvedValue();
  vi.mocked(options.navigateToTask).mockResolvedValue();

  await taskConnectionUtils.withTask(options);

  expect(taskManager.createTask).toHaveBeenCalledOnce();
  const createTaskParams = vi.mocked(taskManager.createTask).mock.calls[0]?.[0];
  if (!createTaskParams) {
    throw new Error('param should be defined');
  }
  expect(createTaskParams.title).toEqual('a title');
  expect(createTaskParams.action?.name).toEqual(`Open task`);

  // check that action.execute passed to createTask is calling options.navigateToTask
  const execute = createTaskParams.action?.execute;
  expect(execute).toBeDefined();
  if (!execute) {
    throw new Error('execute should be defined');
  }
  execute(new TaskImpl('id', 'name'));
  expect(options.navigateToTask).toHaveBeenCalled();
});

test(`options.execute is called and is resolved`, async () => {
  const options: TaskOptions = {
    loggerId: 'logger1',
    tokenId: 42,
    title: 'a title',
    navigateToTask: vi.fn(),
    execute: vi.fn(),
    executeErrorMsg: vi.fn(),
  };
  vi.mocked(options.execute).mockResolvedValue();
  vi.mocked(options.navigateToTask).mockResolvedValue();

  const result = await taskConnectionUtils.withTask(options);

  expect(result).toBeUndefined();
  expect(getLogHandlerResult.onEnd).toHaveBeenCalled();
  expect(getLogHandlerResult.error).not.toHaveBeenCalled();
  expect(originalTask.status).toEqual('success');
  expect(originalTask.error).toEqual('');
});

test(`options.execute is called and is rejected`, async () => {
  const rejectError = new Error('an error');

  const options: TaskOptions = {
    loggerId: 'logger1',
    tokenId: 42,
    title: 'a title',
    navigateToTask: vi.fn(),
    execute: vi.fn(),
    executeErrorMsg: vi.fn(),
  };
  vi.mocked(options.execute).mockRejectedValue(rejectError);
  vi.mocked(options.navigateToTask).mockResolvedValue();
  vi.mocked(options.executeErrorMsg).mockReturnValue('an error msg');
  await expect(() => taskConnectionUtils.withTask(options)).rejects.toThrow();

  expect(getLogHandlerResult.onEnd).toHaveBeenCalled();
  expect(getLogHandlerResult.error).toHaveBeenCalledWith(rejectError);
  expect(originalTask.status).toEqual('in-progress');
  expect(originalTask.error).toEqual('an error msg');
});
