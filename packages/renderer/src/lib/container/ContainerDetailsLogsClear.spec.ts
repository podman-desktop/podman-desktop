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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { Terminal } from '@xterm/xterm';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { containerLogsClearTimestamps } from '/@/stores/container-logs';

import ContainerDetailsLogsClear from './ContainerDetailsLogsClear.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

vi.mock(import('@xterm/xterm'));

beforeEach(() => {
  vi.clearAllMocks();
});

const container: ContainerInfoUI = {
  id: 'foo',
  engineId: 'enginerFoo',
} as unknown as ContainerInfoUI;

test('expect clear button is working', async () => {
  const terminal = new Terminal();

  render(ContainerDetailsLogsClear, { terminal, container });

  // expect the button to clear
  const clearButton = screen.getByRole('button', { name: 'Clear logs' });
  expect(clearButton).toBeInTheDocument();

  // click the button
  await fireEvent.click(clearButton);

  // check we have called the clear function
  await waitFor(() => {
    expect(terminal.clear).toHaveBeenCalled();
    expect(window.logsContainer).toHaveBeenCalledWith({
      engineId: container.engineId,
      containerId: container.id,
      callback: expect.any(Function),
      timestamps: true,
      tail: 1,
    });
  });

  const callback = vi.mocked(window.logsContainer).mock.calls[0][0].callback;

  callback('data', '2025-07-31T18:10:34Z some log message');
  await vi.waitFor(() => expect(get(containerLogsClearTimestamps)[container.id]).toBe('2025-07-31T18:10:35.000Z'));
});

test('expect containerLogsClearTimestamps change only when callback is executed for the first time after clicking the clear button', async () => {
  const terminal = new Terminal();

  render(ContainerDetailsLogsClear, { terminal, container });

  // expect the button to clear
  const clearButton = screen.getByRole('button', { name: 'Clear logs' });
  expect(clearButton).toBeInTheDocument();

  // click the button
  await fireEvent.click(clearButton);

  // check we have called the clear function
  await waitFor(() => {
    expect(terminal.clear).toHaveBeenCalled();
    expect(window.logsContainer).toHaveBeenCalledWith({
      engineId: container.engineId,
      containerId: container.id,
      callback: expect.any(Function),
      timestamps: true,
      tail: 1,
    });
  });

  const callback = vi.mocked(window.logsContainer).mock.calls[0][0].callback;

  // first callback after clear button click should work
  callback('data', '2025-07-31T17:10:35-04:00 some log message');
  await tick();
  expect(get(containerLogsClearTimestamps)[container.id]).toBe('2025-07-31T21:10:36.000Z');

  // if the callback is executed again wihtout the clear button clicked, it shouldn't make any changes to the store
  callback('data', '2025-07-31T19:39:40-04:00 some log message 2');
  await tick();
  expect(get(containerLogsClearTimestamps)[container.id]).toBe('2025-07-31T21:10:36.000Z');

  await fireEvent.click(clearButton);
  callback('data', '2025-07-31T19:45:19-04:00 some log message 3');
  await tick();
  expect(get(containerLogsClearTimestamps)[container.id]).toBe('2025-07-31T23:45:20.000Z');
});
