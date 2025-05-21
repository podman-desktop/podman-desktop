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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { Terminal } from '@xterm/xterm';
import { beforeEach, expect, test, vi } from 'vitest';

import { containerLogsCleared } from '/@/stores/container-logs-cleared';

import ContainerDetailsLogs from './ContainerDetailsLogs.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

vi.mock('@xterm/addon-search');

vi.mock('@xterm/xterm', () => {
  const Terminal = vi.fn();
  Terminal.prototype = {
    loadAddon: vi.fn(),
    open: vi.fn(),
    write: vi.fn(),
    clear: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn(),
  };
  return { Terminal };
});

beforeEach(() => {
  vi.resetAllMocks();
  containerLogsCleared.set(new Map());
  // Mock returned values with fake ones
  const mockComputedStyle = {
    getPropertyValue: vi.fn().mockReturnValue('#ffffff'),
  };
  Object.defineProperty(global, 'window', {
    value: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      logsContainer: vi.fn(),
      getConfigurationValue: vi.fn(),
      getComputedStyle: vi.fn().mockReturnValue(mockComputedStyle),
      dispatchEvent: vi.fn(),
      getCancellableTokenSource: vi.fn(),
    },
    writable: true,
  });
});

const container: ContainerInfoUI = {
  id: 'foo',
} as unknown as ContainerInfoUI;

test('Render container logs ', async () => {
  // Mock compose has no containers, so expect No Log to appear
  render(ContainerDetailsLogs, { container });

  // expect a call to logsContainer
  await vi.waitFor(() => {
    expect(window.logsContainer).toHaveBeenCalled();
  });
  // now, get the callback of the method
  const params = vi.mocked(window.logsContainer).mock.calls[0][0];
  // call the callback with an empty array
  params.callback('data', 'hello world');

  // expect logs to have been called
  await vi.waitFor(() => {
    expect(Terminal.prototype.write).toHaveBeenCalledWith('hello world\r');
  });

  // expect the button to clear
  const clearButton = screen.getByRole('button', { name: 'Clear logs' });
  expect(clearButton).toBeInTheDocument();
});

test('Clear container logs and clear button', async () => {
  // Mock compose has no containers, so expect No Log to appear
  render(ContainerDetailsLogs, { container });

  // expect a call to logsContainer
  await vi.waitFor(() => {
    expect(window.logsContainer).toHaveBeenCalled();
  });
  // now, get the callback of the method
  const params = vi.mocked(window.logsContainer).mock.calls[0][0];
  // call the callback with an empty array
  params.callback('data', 'hello world');

  // expect logs to have been called
  await vi.waitFor(() => {
    expect(Terminal.prototype.write).toHaveBeenCalled();
  });

  // expect the button to clear
  const clearButton = screen.getByRole('button', { name: 'Clear logs' });
  expect(clearButton).toBeInTheDocument();

  await fireEvent.click(clearButton);

  // expect the restore button
  const restoreButton = screen.getByRole('button', { name: 'Restore logs' });
  expect(restoreButton).toBeInTheDocument();

  params.callback('data', 'hello world');

  // expect the clear button again when new logs are displayed
  await vi.waitFor(() => {
    screen.getByRole('button', { name: 'Clear logs' });
  });
});

test('Clear container logs and terminal content', async () => {
  // Mock compose has no containers, so expect No Log to appear
  render(ContainerDetailsLogs, { container });

  // expect a call to logsContainer
  await vi.waitFor(() => {
    expect(window.logsContainer).toHaveBeenCalled();
  });
  // now, get the callback of the method
  const params = vi.mocked(window.logsContainer).mock.calls[0][0];
  // call the callback with an empty array
  params.callback('data', 'hello world');

  // expect logs to have been called
  expect(Terminal.prototype.write).toHaveBeenCalledWith('hello world\r');

  // expect the button to clear
  const clearButton = screen.getByRole('button', { name: 'Clear logs' });
  expect(clearButton).toBeInTheDocument();

  // Clear the logs
  await fireEvent.click(clearButton);

  // Logs should be fetched again
  await vi.waitFor(() => {
    expect(window.logsContainer).toHaveBeenCalled();
  });

  const params2 = vi.mocked(window.logsContainer).mock.calls[0][0];

  vi.mocked(Terminal.prototype.write).mockClear();
  vi.mocked(Terminal.prototype.clear).mockClear();

  params2.callback('first-message', '');
  expect(Terminal.prototype.clear).toHaveBeenCalled();

  params2.callback('data', 'hello world');
  params2.callback('data', 'next...');

  // expect new logs only to have been called
  expect(Terminal.prototype.write).not.toHaveBeenCalledWith('hello world\r');
  expect(Terminal.prototype.write).toHaveBeenCalledWith('next...\r');
});
