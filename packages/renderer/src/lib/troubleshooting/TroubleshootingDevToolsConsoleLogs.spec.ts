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

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeAll, expect, test, vi } from 'vitest';

import TroubleshootingDevToolsConsoleLogs from './TroubleshootingDevToolsConsoleLogs.svelte';

const getDevtoolsConsoleLogsMock = vi.fn();
const clipboardWriteTextMock = vi.fn();
const getConfigurationValueMock = vi.fn();
const updateConfigurationValueMock = vi.fn();

// fake the window.events object
beforeAll(() => {
  (window as any).getDevtoolsConsoleLogs = getDevtoolsConsoleLogsMock;
  (window as any).clipboardWriteText = clipboardWriteTextMock;
  (window as any).getConfigurationValue = getConfigurationValueMock;
  (window as any).updateConfigurationValue = updateConfigurationValueMock;
  getConfigurationValueMock.mockResolvedValue(false);
  updateConfigurationValueMock.mockResolvedValue(undefined);
});

async function waitRender(customProperties: object): Promise<void> {
  render(TroubleshootingDevToolsConsoleLogs, { ...customProperties });
  await tick();
}

test('Check logs are displayed with clipboard button', async () => {
  const fixedDate = new Date('2026-04-29T14:30:45');
  getDevtoolsConsoleLogsMock.mockReturnValue([
    {
      logType: 'log',
      message: 'test1',
      date: fixedDate,
    },
    {
      logType: 'error',
      message: 'test2',
      date: fixedDate,
    },
  ]);

  await waitRender({});

  // expect to have the logs
  const logsList = screen.getByRole('list', { name: 'logs' });
  expect(logsList).toBeInTheDocument();

  // get number of <li> elements from this <ul>
  const logs = logsList.querySelectorAll('li');
  expect(logs.length).toBe(2);

  // expect to have the clipboard button
  const clipboardButton = screen.getByRole('button', { name: 'Copy To Clipboard' });
  expect(clipboardButton).toBeInTheDocument();
  // click on the clipboard button
  expect(clipboardButton).toBeEnabled();
  await fireEvent.click(clipboardButton);

  // timestamps are hidden by default, so clipboard should not include them
  expect(clipboardWriteTextMock).toHaveBeenCalledWith('log : test1\nerror : test2');
});

test('Timestamps are hidden by default and shown after toggle', async () => {
  const fixedDate = new Date('2026-04-29T14:30:45');
  getDevtoolsConsoleLogsMock.mockReturnValue([{ logType: 'log', message: 'hello', date: fixedDate }]);

  await waitRender({});

  const logsList = screen.getByRole('list', { name: 'logs' });

  // timestamps should be hidden by default
  expect(logsList.textContent).not.toContain('14:30:45');
  expect(logsList.textContent).toContain('hello');

  // click the toggle timestamps button
  const toggleButton = screen.getByRole('button', { name: 'Toggle Timestamps' });
  expect(toggleButton).toBeInTheDocument();
  await fireEvent.click(toggleButton);

  // timestamps should now be visible
  expect(logsList.textContent).toContain('14:30:45');

  // click again to hide
  await fireEvent.click(toggleButton);
  expect(logsList.textContent).not.toContain('14:30:45');
});

test('Toggle persists the setting via updateConfigurationValue', async () => {
  getDevtoolsConsoleLogsMock.mockReturnValue([{ logType: 'log', message: 'hello', date: new Date() }]);

  await waitRender({});

  const toggleButton = screen.getByRole('button', { name: 'Toggle Timestamps' });
  await fireEvent.click(toggleButton);

  expect(updateConfigurationValueMock).toHaveBeenCalledWith('troubleshooting.logsTimestamps', true);

  await fireEvent.click(toggleButton);

  expect(updateConfigurationValueMock).toHaveBeenCalledWith('troubleshooting.logsTimestamps', false);
});

test('Clipboard includes timestamps when toggle is enabled', async () => {
  const fixedDate = new Date('2026-04-29T14:30:45');
  getDevtoolsConsoleLogsMock.mockReturnValue([
    { logType: 'log', message: 'test1', date: fixedDate },
    { logType: 'error', message: 'test2', date: fixedDate },
  ]);

  await waitRender({});

  // enable timestamps
  const toggleButton = screen.getByRole('button', { name: 'Toggle Timestamps' });
  await fireEvent.click(toggleButton);

  // copy to clipboard
  const clipboardButton = screen.getByRole('button', { name: 'Copy To Clipboard' });
  await fireEvent.click(clipboardButton);

  expect(clipboardWriteTextMock).toHaveBeenCalledWith('14:30:45 log : test1\n14:30:45 error : test2');
});
