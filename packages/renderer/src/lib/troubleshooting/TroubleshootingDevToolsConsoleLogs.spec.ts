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

// fake the window.events object
beforeAll(() => {
  (window as any).getDevtoolsConsoleLogs = getDevtoolsConsoleLogsMock;
  (window as any).clipboardWriteText = clipboardWriteTextMock;
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

  // check the content of the clipboard button
  expect(clipboardWriteTextMock).toHaveBeenCalledWith('14:30:45 log : test1\n14:30:45 error : test2');
});
