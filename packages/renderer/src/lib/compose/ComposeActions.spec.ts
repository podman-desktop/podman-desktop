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

import { within } from '@testing-library/dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeAll, beforeEach, expect, type Mock, test, vi } from 'vitest';

import type { ContainerInfoUI } from '/@/lib/container/ContainerInfoUI';

import ComposeActions from './ComposeActions.svelte';
import type { ComposeInfoUI } from './ComposeInfoUI';

class ComposeInfoUIImpl implements ComposeInfoUI {
  #status: string = 'STOPPED';
  constructor(
    public engineId: string,
    public engineType: 'docker' | 'podman',
    public name: string,
    initialStatus: string,
    public actionInProgress: boolean,
    public actionError: string | undefined,
    public containers: ContainerInfoUI[],
  ) {}
  set status(status: string) {
    this.#status = status;
  }
  get status(): string {
    return this.#status;
  }
}

const compose: ComposeInfoUI = new ComposeInfoUIImpl(
  'podman',
  'podman',
  'my-compose-group',
  'STOPPED',
  false,
  undefined,
  [
    {
      actionInProgress: false,
      actionError: undefined,
      state: 'STOPPED',
    } as ContainerInfoUI,
  ],
);

const getContributedMenusMock = vi.fn();
const updateMock = vi.fn();

type Deferred<T = void> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};
const createDeferred = <T = void>(): Deferred<T> => {
  let resolve!: (v: T | PromiseLike<T>) => void;
  let reject!: (e?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

beforeAll(() => {
  Object.defineProperty(window, 'startContainersByLabel', { value: vi.fn() });
  Object.defineProperty(window, 'stopContainersByLabel', { value: vi.fn() });
  Object.defineProperty(window, 'restartContainersByLabel', { value: vi.fn() });
  Object.defineProperty(window, 'deleteContainersByLabel', { value: vi.fn() });

  Object.defineProperty(window, 'getContributedMenus', { value: getContributedMenusMock });
});

beforeEach(() => {
  getContributedMenusMock.mockImplementation(() => Promise.resolve([]));
});

afterEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
});

test('Expect no error and status starting compose', async () => {
  render(ComposeActions, { compose, onUpdate: updateMock });

  // click on start button
  const startButton = screen.getByRole('button', { name: 'Start Compose' });
  await fireEvent.click(startButton);

  expect(compose.status).toEqual('STARTING');
  expect(compose.actionError).toEqual('');
  expect(compose.containers[0].state).toEqual('STARTING');
  expect(compose.containers[0].actionError).toEqual('');
  expect(updateMock).toHaveBeenCalled();
});

test('Expect no error and status stopping compose', async () => {
  render(ComposeActions, { compose, onUpdate: updateMock });

  // click on stop button
  const stopButton = screen.getByRole('button', { name: 'Stop Compose' });
  await fireEvent.click(stopButton);

  expect(compose.status).toEqual('STOPPING');
  expect(compose.actionError).toEqual('');
  expect(compose.containers[0].state).toEqual('STOPPING');
  expect(compose.containers[0].actionError).toEqual('');
  expect(updateMock).toHaveBeenCalled();
});

test('Expect no error and status restarting compose', async () => {
  render(ComposeActions, { compose, onUpdate: updateMock });

  // click on restart button
  const restartButton = screen.getByRole('button', { name: 'Restart Compose' });
  await fireEvent.click(restartButton);

  expect(compose.status).toEqual('RESTARTING');
  expect(compose.actionError).toEqual('');
  expect(compose.containers[0].state).toEqual('RESTARTING');
  expect(compose.containers[0].actionError).toEqual('');
  expect(updateMock).toHaveBeenCalled();
});

test('Expect no error and status deleting compose', async () => {
  // Mock the showMessageBox to return 0 (yes)
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

  render(ComposeActions, { compose, onUpdate: updateMock });

  // click on delete button
  const deleteButton = screen.getByRole('button', { name: 'Delete Compose' });
  await fireEvent.click(deleteButton);

  // Wait for confirmation modal to disappear after clicking on delete
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

  expect(compose.status).toEqual('DELETING');
  expect(compose.actionError).toEqual('');
  expect(compose.containers[0].state).toEqual('DELETING');
  expect(compose.containers[0].actionError).toEqual('');
  expect(updateMock).toHaveBeenCalled();
});

test('Stop keeps Start hidden during STOPPING (all containers are running)', async () => {
  const composeAllRunning: ComposeInfoUI = new ComposeInfoUIImpl(
    'podman',
    'podman',
    'compose-all-running',
    'RUNNING',
    false,
    undefined,
    [
      { state: 'RUNNING', actionInProgress: false } as ContainerInfoUI,
      { state: 'RUNNING', actionInProgress: false } as ContainerInfoUI,
    ],
  );

  const { container } = render(ComposeActions, { compose: composeAllRunning, onUpdate: updateMock });
  const ui = within(container);

  expect(ui.getByRole('button', { name: 'Start Compose', hidden: true })).toHaveClass('hidden');
  expect(ui.getByRole('button', { name: 'Stop Compose' })).not.toHaveClass('hidden');

  const dStop = createDeferred<void>();
  (window.stopContainersByLabel as unknown as Mock).mockReturnValueOnce(dStop.promise);

  await fireEvent.click(ui.getByRole('button', { name: 'Stop Compose' }));

  await waitFor(() => {
    expect(composeAllRunning.actionInProgress).toBe(true);
    expect(composeAllRunning.status).toBe('STOPPING');
  });

  dStop.resolve();

  expect(ui.getByRole('button', { name: 'Start Compose', hidden: true })).toHaveClass('hidden');
  expect(ui.getByRole('button', { name: 'Stop Compose' })).not.toHaveClass('hidden');
});

test('Start keeps Stop hidden during STARTING (all containers are stopped)', async () => {
  const composeAllStopped: ComposeInfoUI = new ComposeInfoUIImpl(
    'podman',
    'podman',
    'compose-all-stopped',
    'STOPPED',
    false,
    undefined,
    [
      { state: 'STOPPED', actionInProgress: false } as ContainerInfoUI,
      { state: 'STOPPED', actionInProgress: false } as ContainerInfoUI,
    ],
  );

  const { container } = render(ComposeActions, { compose: composeAllStopped, onUpdate: updateMock });
  const ui = within(container);

  expect(ui.getByRole('button', { name: 'Start Compose' })).not.toHaveClass('hidden');
  expect(ui.getByRole('button', { name: 'Stop Compose', hidden: true })).toHaveClass('hidden');

  const dStart = createDeferred<void>();
  (window.startContainersByLabel as unknown as Mock).mockReturnValueOnce(dStart.promise);

  await fireEvent.click(ui.getByRole('button', { name: 'Start Compose' }));

  await waitFor(() => {
    expect(composeAllStopped.actionInProgress).toBe(true);
    expect(composeAllStopped.status).toBe('STARTING');
  });

  dStart.resolve();

  expect(ui.getByRole('button', { name: 'Stop Compose', hidden: true })).toHaveClass('hidden');
  expect(ui.getByRole('button', { name: 'Start Compose' })).not.toHaveClass('hidden');
});

test('Stop keeps both visible during STOPPING (some containers are running)', async () => {
  const composePartial: ComposeInfoUI = new ComposeInfoUIImpl(
    'podman',
    'podman',
    'compose-partial',
    'RUNNING',
    false,
    undefined,
    [
      { state: 'RUNNING', actionInProgress: false } as ContainerInfoUI,
      { state: 'STOPPED', actionInProgress: false } as ContainerInfoUI,
      { state: 'RUNNING', actionInProgress: false } as ContainerInfoUI,
    ],
  );

  const { container } = render(ComposeActions, { compose: composePartial, onUpdate: updateMock });
  const ui = within(container);

  expect(ui.getByRole('button', { name: 'Start Compose' })).not.toHaveClass('hidden');
  expect(ui.getByRole('button', { name: 'Stop Compose' })).not.toHaveClass('hidden');

  const dStop = createDeferred<void>();
  (window.stopContainersByLabel as unknown as Mock).mockReturnValueOnce(dStop.promise);

  await fireEvent.click(ui.getByRole('button', { name: 'Stop Compose' }));

  await waitFor(() => {
    expect(composePartial.actionInProgress).toBe(true);
    expect(composePartial.status).toBe('STOPPING');
  });

  dStop.resolve();

  expect(ui.getByRole('button', { name: 'Start Compose' })).not.toHaveClass('hidden');
  expect(ui.getByRole('button', { name: 'Stop Compose' })).not.toHaveClass('hidden');
});
