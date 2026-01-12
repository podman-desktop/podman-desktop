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

import { expect, test, vi } from 'vitest';

import type { IPCHandle } from '/@/plugin/api.js';

import { HelpMenu } from './help-menu.js';

const ipcHandle: IPCHandle = vi.fn();

test('should get the items', async () => {
  const helpMenu = new HelpMenu(ipcHandle);
  helpMenu.init();

  const items = helpMenu.getItems();

  expect(items).not.toHaveLength(0);

  items.forEach(item => {
    expect(item.enabled).toBeDefined();
    expect(item.enabled).toBeTypeOf('boolean');
    if (item.action) {
      expect(item.action.kind).toBeDefined();
      expect(item.action.kind).toBeTypeOf('number');

      expect(item.action.parameter).toBeDefined();
      expect(item.action.parameter).toBeTypeOf('string');
    }
    expect(item.icon).toBeDefined();
    expect(item.icon).toBeTypeOf('string');
    expect(item.title).toBeDefined();
    expect(item.title).toBeTypeOf('string');
  });
});
