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

import { TerminalSettings } from '@podman-desktop/core-api/terminal';
import { fireEvent, render, within } from '@testing-library/svelte';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { writable } from 'svelte/store';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import TerminalWindow from '/@/lib/ui/TerminalWindow.svelte';

vi.mock(import('@xterm/xterm'));
vi.mock(import('@xterm/addon-fit'));
vi.mock(import('@xterm/addon-search'));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function createTerminalMock(): Terminal {
  return {
    ...writable(),
    dispose: vi.fn(),
  } as unknown as Terminal;
}

test('expect terminal constructor to have been called on mount', async () => {
  render(TerminalWindow, {
    terminal: createTerminalMock(),
  });

  await vi.waitFor(() => {
    expect(Terminal).toHaveBeenCalledOnce();
  });
});

test('expect terminal constructor to reflect props', async () => {
  render(TerminalWindow, {
    terminal: createTerminalMock(),
    disableStdIn: true,
    convertEol: true,
    screenReaderMode: true,
  });

  await vi.waitFor(() => {
    expect(Terminal).toHaveBeenCalledWith(
      expect.objectContaining({
        disableStdin: true,
        convertEol: true,
        screenReaderMode: true,
      }),
    );
  });
});

test('showCursor false or undefined should write specific instruction to terminal', async () => {
  render(TerminalWindow, {
    terminal: createTerminalMock(),
    showCursor: false,
  });

  await vi.waitFor(() => {
    expect(Terminal).toHaveBeenCalledOnce();
  });
  expect(Terminal.prototype.write).toHaveBeenCalledWith('\x1b[?25l');
});

test('terminal constructor should contains fontSize and lineHeight from configuration', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(10);

  render(TerminalWindow, {
    terminal: createTerminalMock(),
  });

  await vi.waitFor(() => {
    expect(Terminal).toHaveBeenCalledWith(
      expect.objectContaining({
        fontSize: 10,
        lineHeight: 10,
      }),
    );
  });

  expect(window.getConfigurationValue).toHaveBeenCalledWith(
    TerminalSettings.SectionName + '.' + TerminalSettings.FontSize,
  );
  expect(window.getConfigurationValue).toHaveBeenCalledWith(
    TerminalSettings.SectionName + '.' + TerminalSettings.LineHeight,
  );
  expect(window.getConfigurationValue).toHaveBeenCalledWith(
    TerminalSettings.SectionName + '.' + TerminalSettings.Scrollback,
  );
});

test('addon fit should be loaded on mount', async () => {
  render(TerminalWindow, {
    terminal: createTerminalMock(),
  });

  await vi.waitFor(() => {
    expect(Terminal).toHaveBeenCalled();
  });

  expect(FitAddon).toHaveBeenCalledOnce();
  const fitAddonMock = vi.mocked(FitAddon).mock.instances[0];

  expect(Terminal.prototype.loadAddon).toHaveBeenCalledWith(fitAddonMock);
});

test('matchMedia resize listener should trigger fit addon', async () => {
  // spy the event listener
  vi.spyOn(window, 'addEventListener');

  render(TerminalWindow, {
    terminal: createTerminalMock(),
  });

  const listener: () => void = await vi.waitFor(() => {
    expect(window.addEventListener).toHaveBeenCalled();
    const call = vi.mocked(window.addEventListener).mock.calls;
    expect(call).toHaveLength(1);
    expect(call[0][0]).toBe('resize');
    expect(call[0][1]).toBeInstanceOf(Function);
    return call[0][1] as unknown as () => void;
  });

  // reset fit calls count
  vi.mocked(FitAddon.prototype.fit).mockReset();
  expect(FitAddon.prototype.fit).not.toHaveBeenCalled();

  listener();

  expect(FitAddon.prototype.fit).toHaveBeenCalled();
});

test('search controls should open without changing the terminal mount point', async () => {
  const { findByRole, getByRole, queryByRole } = render(TerminalWindow, {
    terminal: createTerminalMock(),
    search: true,
  });

  expect(queryByRole('textbox', { name: 'Find' })).not.toBeInTheDocument();

  const terminalWindow = getByRole('term');
  const xtermMountPoint = terminalWindow.firstElementChild;
  expect(xtermMountPoint).toHaveClass('h-full');

  const findEvent = new KeyboardEvent('keydown', {
    key: 'f',
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  });
  terminalWindow.dispatchEvent(findEvent);

  const searchTextbox = await findByRole('textbox', { name: 'Find' });
  expect(findEvent.defaultPrevented).toBeTruthy();
  expect(searchTextbox).toHaveFocus();
  expect(xtermMountPoint).not.toContainElement(searchTextbox);
  expect(getByRole('search')).toHaveClass('absolute');
});

test('search shortcut should be captured before xterm handles it', async () => {
  const xtermKeydown = vi.fn((event: KeyboardEvent): void => event.stopPropagation());
  vi.mocked(Terminal.prototype.open).mockImplementation((element: HTMLElement) => {
    const xterm = document.createElement('div');
    const textarea = document.createElement('textarea');
    textarea.className = 'xterm-helper-textarea';
    xterm.appendChild(textarea);
    textarea.addEventListener('keydown', xtermKeydown, true);
    element.appendChild(xterm);
  });

  const { container, findByRole } = render(TerminalWindow, {
    terminal: createTerminalMock(),
    search: true,
  });

  const textarea = await vi.waitFor(() => {
    const element = container.querySelector<HTMLTextAreaElement>('.xterm-helper-textarea');
    expect(element).toBeInTheDocument();
    return element as HTMLTextAreaElement;
  });

  const findEvent = new KeyboardEvent('keydown', {
    key: 'f',
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  });
  textarea.dispatchEvent(findEvent);

  expect(await findByRole('textbox', { name: 'Find' })).toHaveFocus();
  expect(findEvent.defaultPrevented).toBeTruthy();
  expect(xtermKeydown).not.toHaveBeenCalled();
});

test('search shortcut should work with the macOS modifier', async () => {
  const { findByRole, getByRole } = render(TerminalWindow, {
    terminal: createTerminalMock(),
    search: true,
  });

  await fireEvent.keyDown(getByRole('term'), {
    key: 'F',
    metaKey: true,
  });

  expect(await findByRole('textbox', { name: 'Find' })).toHaveFocus();
});

test('unrelated shortcuts should not be prevented', () => {
  const { getByRole } = render(TerminalWindow, {
    terminal: createTerminalMock(),
    search: true,
  });

  const unrelatedEvent = new KeyboardEvent('keydown', {
    key: 'g',
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  });
  getByRole('term').dispatchEvent(unrelatedEvent);

  expect(unrelatedEvent.defaultPrevented).toBeFalsy();
});

test('search shortcut should only open controls for its terminal', async () => {
  const first = render(TerminalWindow, {
    terminal: createTerminalMock(),
    search: true,
  });
  const second = render(TerminalWindow, {
    terminal: createTerminalMock(),
    search: true,
  });

  const firstTerminal = within(first.container);
  const secondTerminal = within(second.container);

  await fireEvent.keyDown(secondTerminal.getByRole('term'), {
    key: 'f',
    ctrlKey: true,
  });

  expect(firstTerminal.queryByRole('textbox', { name: 'Find' })).not.toBeInTheDocument();
  expect(await secondTerminal.findByRole('textbox', { name: 'Find' })).toHaveFocus();
});

test('Escape should close search and restore terminal focus', async () => {
  const { findByRole, getByRole, queryByRole } = render(TerminalWindow, {
    terminal: createTerminalMock(),
    search: true,
  });

  await fireEvent.keyDown(getByRole('term'), {
    key: 'f',
    ctrlKey: true,
  });
  const searchTextbox = await findByRole('textbox', { name: 'Find' });

  await fireEvent.keyDown(searchTextbox, {
    key: 'Escape',
  });

  await vi.waitFor(() => {
    expect(queryByRole('textbox', { name: 'Find' })).not.toBeInTheDocument();
    expect(Terminal.prototype.focus).toHaveBeenCalledOnce();
  });
});
