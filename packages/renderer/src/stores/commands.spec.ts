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
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { commandsEventStore, commandsEventStoreInfo, commandsInfos } from './commands';

// setup() registers a real window.addEventListener that is never removed, so it must
// only run once for the file rather than per test (which would stack duplicate listeners).
beforeAll(() => {
  commandsEventStore.setup();
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('commands should be updated', async () => {
  // initial command is empty
  vi.mocked(window.getCommandPaletteCommands).mockResolvedValue([]);

  // get list and expect nothing there
  const commands = get(commandsInfos);
  expect(commands.length).toBe(0);

  vi.mocked(window.getCommandPaletteCommands).mockReset();
  vi.mocked(window.getCommandPaletteCommands).mockResolvedValue([
    {
      id: 'first.extension1',
      title: 'test1',
    },
    {
      id: 'second.extension2',
      title: 'test2',
    },
  ]);

  // send 'system-ready' event
  window.dispatchEvent(new CustomEvent('system-ready'));

  // check that getCommandPaletteCommands is called
  await vi.waitFor(() => expect(window.getCommandPaletteCommands).toBeCalled());

  // fetch manually
  await commandsEventStoreInfo.fetch();

  // check if the commands has been updated
  const afterCommands = get(commandsInfos);
  expect(afterCommands.length).toBe(2);
});
