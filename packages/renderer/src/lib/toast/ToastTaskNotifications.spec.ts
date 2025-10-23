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

import { render, waitFor } from '@testing-library/svelte';
import { toast } from '@zerodevx/svelte-toast';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { tasksInfo } from '/@/stores/tasks';
import type { TaskInfo } from '/@api/taskInfo';

import ToastTaskNotifications from './ToastTaskNotifications.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'getConfigurationValue', {
    value: vi.fn(),
  });
});

vi.mock('@zerodevx/svelte-toast', async () => {
  return {
    toast: {
      push: vi.fn(),
      pop: vi.fn(),
      set: vi.fn(),
    },
  };
});

const started = new Date().getTime();

const IN_PROGRESS_TASK: TaskInfo = {
  id: '1',
  name: 'Running Task 1',
  state: 'running',
  status: 'in-progress',
  started,
  action: 'Task action',
  cancellable: false,
};

beforeEach(() => {
  vi.resetAllMocks();
});

test('Check a toast is being created when there is a task created', async () => {
  // make it enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  tasksInfo.set([IN_PROGRESS_TASK]);

  render(ToastTaskNotifications, {});

  // check we have called toast library to create a toast
  await waitFor(() => expect(toast.push).toHaveBeenCalled());
  expect(toast.push).toHaveBeenCalledWith(
    IN_PROGRESS_TASK.name,
    expect.objectContaining({
      dismissable: false,
      component: {
        props: expect.objectContaining({
          taskInfo: IN_PROGRESS_TASK,
        }),
        sendIdTo: 'toastId',
        src: expect.anything(),
      },
    }),
  );
});

test('Check no toast is being created if disabled', async () => {
  // make it disabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

  tasksInfo.set([IN_PROGRESS_TASK]);

  render(ToastTaskNotifications, {});

  // check we have not called toast library to create a toast
  await waitFor(() => expect(toast.push).not.toHaveBeenCalled());
});

test('Check a toast is being updated after a task is updated', async () => {
  // make it enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  // return a toast id when we create one
  const dummyToastId = 1256;
  vi.mocked(toast.push).mockReturnValue(dummyToastId);

  tasksInfo.set([IN_PROGRESS_TASK]);

  render(ToastTaskNotifications, {});

  // check we have called toast library to create a toast
  await waitFor(() => expect(toast.push).toHaveBeenCalled());

  // ok, now update the task to go from in-progress to success
  const updatedTask: TaskInfo = {
    ...IN_PROGRESS_TASK,
    status: 'success',
    state: 'completed',
  };
  // reset call to toast.set
  vi.mocked(toast.set).mockClear();
  tasksInfo.set([updatedTask]);

  // check we have called toast library to create a toast
  await waitFor(() => expect(toast.set).toHaveBeenCalled());

  // check we have called toast library to update the toast
  expect(toast.set).toHaveBeenCalledWith(
    dummyToastId,
    expect.objectContaining({
      dismissable: false,
      component: {
        props: expect.objectContaining({
          taskInfo: updatedTask,
        }),
        sendIdTo: 'toastId',
        src: expect.anything(),
      },
    }),
  );
});

describe('Toast disappearing and notifying again', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('Check that toast is being pushed again if the task took longer than 60s', async () => {
    // make it enabled
    vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

    // return a toast id when we create one
    const dummyToastId = 1256;
    vi.mocked(toast.push).mockReturnValue(dummyToastId);

    tasksInfo.set([IN_PROGRESS_TASK]);

    render(ToastTaskNotifications, {});

    // check we have called toast library to create a toast
    await waitFor(() => expect(toast.push).toHaveBeenCalled());

    // Simulate that the task is now doing its stuff for 1 min
    vi.advanceTimersByTime(60000);

    // ok, now update the task to go from in-progress to success
    const updatedTask: TaskInfo = {
      ...IN_PROGRESS_TASK,
      status: 'success',
      state: 'completed',
    };
    // reset call to toast.set
    vi.mocked(toast.set).mockClear();
    tasksInfo.set([updatedTask]);

    // check we have called toast library to update a toast
    await waitFor(() => expect(toast.set).toHaveBeenCalled());

    // check we have called toast library to update the toast
    expect(toast.set).toHaveBeenCalledWith(
      dummyToastId,
      expect.objectContaining({
        dismissable: false,
        component: {
          props: expect.objectContaining({
            taskInfo: updatedTask,
          }),
          sendIdTo: 'toastId',
          src: expect.anything(),
        },
      }),
    );

    // Check that the toast is being pushed again
    await waitFor(() => expect(toast.push).toHaveBeenCalledTimes(2));
  });

  test('Check that toast is not being pushed again if the task took less than 60s', async () => {
    // make it enabled
    vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

    // return a toast id when we create one
    const dummyToastId = 1256;
    vi.mocked(toast.push).mockReturnValue(dummyToastId);

    tasksInfo.set([IN_PROGRESS_TASK]);

    render(ToastTaskNotifications, {});

    // check we have called toast library to create a toast
    await waitFor(() => expect(toast.push).toHaveBeenCalled());

    // Simulate that the task is now doing its stuff for 30sec
    vi.advanceTimersByTime(30000);

    // ok, now update the task to go from in-progress to success
    const updatedTask: TaskInfo = {
      ...IN_PROGRESS_TASK,
      status: 'success',
      state: 'completed',
    };
    // reset call to toast.set
    vi.mocked(toast.set).mockClear();
    tasksInfo.set([updatedTask]);

    // check we have called toast library to update a toast
    await waitFor(() => expect(toast.set).toHaveBeenCalled());

    // check we have called toast library to update the toast
    expect(toast.set).toHaveBeenCalledWith(
      dummyToastId,
      expect.objectContaining({
        dismissable: false,
        component: {
          props: expect.objectContaining({
            taskInfo: updatedTask,
          }),
          sendIdTo: 'toastId',
          src: expect.anything(),
        },
      }),
    );

    // Check that the toast is being pushed again
    await waitFor(() => expect(toast.push).toHaveBeenCalledTimes(1));
  });
});
