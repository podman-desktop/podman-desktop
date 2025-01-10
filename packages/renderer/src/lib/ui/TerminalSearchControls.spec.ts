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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { SearchAddon } from '@xterm/addon-search';
import type { Terminal } from '@xterm/xterm';
import { beforeEach, expect, test, vi } from 'vitest';

import TerminalSearchControls from './TerminalSearchControls.svelte';

vi.mock('@xterm/addon-search');

const TerminalMock: Terminal = {
  onWriteParsed: vi.fn(),
  onResize: vi.fn(),
  dispose: vi.fn(),
} as unknown as Terminal;

beforeEach(() => {
  vi.resetAllMocks();
});

test('search addon should be loaded to the terminal', () => {
  render(TerminalSearchControls, {
    terminal: TerminalMock,
  });

  expect(SearchAddon.prototype.activate).toHaveBeenCalledOnce();
  expect(SearchAddon.prototype.activate).toHaveBeenCalledWith(TerminalMock);
});

test('search addon should be disposed on component destroy', async () => {
  const { unmount } = render(TerminalSearchControls, {
    terminal: TerminalMock,
  });

  unmount();

  await vi.waitFor(() => {
    expect(SearchAddon.prototype.dispose).toHaveBeenCalledOnce();
  });
});

test('input should call findNext on search addon', async () => {
  const user = userEvent.setup();
  const { getByRole } = render(TerminalSearchControls, {
    terminal: TerminalMock,
  });

  const searchTextbox = getByRole('textbox', {
    name: 'Find',
  });

  expect(searchTextbox).toBeInTheDocument();
  await user.type(searchTextbox, 'hello');

  await vi.waitFor(() => {
    expect(SearchAddon.prototype.findNext).toHaveBeenCalledWith('hello', {
      incremental: false,
    });
  });
});

test('key Enter should call findNext with incremental', async () => {
  const user = userEvent.setup();
  const { getByRole } = render(TerminalSearchControls, {
    terminal: TerminalMock,
  });

  const searchTextbox = getByRole('textbox', {
    name: 'Find',
  });

  expect(searchTextbox).toBeInTheDocument();
  await user.type(searchTextbox, 'hello{Enter}');

  await vi.waitFor(() => {
    expect(SearchAddon.prototype.findNext).toHaveBeenCalledWith('hello', {
      incremental: true,
    });
  });
});

test('arrow down should call findNext', async () => {
  const { getByRole } = render(TerminalSearchControls, {
    terminal: TerminalMock,
  });

  const upBtn = getByRole('button', {
    name: 'Next Match',
  });

  expect(upBtn).toBeInTheDocument();
  await fireEvent.click(upBtn);

  await vi.waitFor(() => {
    expect(SearchAddon.prototype.findNext).toHaveBeenCalledWith('', {
      incremental: true,
    });
  });
});

test('arrow up should call findPrevious', async () => {
  const { getByRole } = render(TerminalSearchControls, {
    terminal: TerminalMock,
  });

  const upBtn = getByRole('button', {
    name: 'Previous Match',
  });

  expect(upBtn).toBeInTheDocument();
  await fireEvent.click(upBtn);

  await vi.waitFor(() => {
    expect(SearchAddon.prototype.findPrevious).toHaveBeenCalledWith('', {
      incremental: true,
    });
  });
});

test('ctrl+F should focus input', async () => {
  const { getByRole, container } = render(TerminalSearchControls, {
    terminal: TerminalMock,
  });

  const searchTextbox: HTMLInputElement = getByRole('textbox', {
    name: 'Find',
  }) as HTMLInputElement;

  const focusSpy = vi.spyOn(searchTextbox, 'focus');

  await fireEvent.keyUp(container, {
    ctrlKey: true,
    key: 'f',
  });

  await vi.waitFor(() => {
    expect(focusSpy).toHaveBeenCalled();
  });
});
