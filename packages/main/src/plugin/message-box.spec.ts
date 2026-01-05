/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { expect, test, vi } from 'vitest';

import type { ApiSenderType } from '/@api/api-sender/api-sender-type.js';
import type { DropdownType } from '/@api/dialog.js';

import { MessageBox } from './message-box.js';

test('Should return first item if button clicked is the first', async () => {
  const messageBox = new MessageBox({} as ApiSenderType);
  vi.spyOn(messageBox, 'showMessageBox').mockResolvedValue({
    response: 0,
  });
  const result = await messageBox.showDialog('info', 'title', 'message', ['ok', 'cancel']);
  expect(result).toBe('ok');
});

test('Should return second item if button clicked is the second', async () => {
  const messageBox = new MessageBox({} as ApiSenderType);
  vi.spyOn(messageBox, 'showMessageBox').mockResolvedValue({
    response: 1,
  });
  const result = await messageBox.showDialog('info', 'title', 'message', ['ok', 'cancel']);
  expect(result).toBe('cancel');
});

test('Should return option one if dropdown clicked is the first', async () => {
  const messageBox = new MessageBox({} as ApiSenderType);
  vi.spyOn(messageBox, 'showMessageBox').mockResolvedValue({
    response: 0,
    dropdownIndex: 1,
  });

  const dropdown: DropdownType = {
    heading: 'dropdown',
    buttons: ['Monday', 'Tuesday', 'Wednesday'],
    type: 'dropdownButton',
  };

  const result = await messageBox.showDialog('info', 'title', 'message', [dropdown, 'ok']);
  expect(result).toBe('Tuesday');
});

test('Should return option one if dropdown clicked is the second', async () => {
  const messageBox = new MessageBox({} as ApiSenderType);
  vi.spyOn(messageBox, 'showMessageBox').mockResolvedValue({
    response: 1,
    dropdownIndex: 0,
  });

  const dropdown: DropdownType = {
    heading: 'dropdown',
    buttons: ['Monday', 'Tuesday', 'Wednesday'],
    type: 'dropdownButton',
  };

  const result = await messageBox.showDialog('info', 'title', 'message', ['ok', dropdown]);
  expect(result).toBe('Monday');
});
