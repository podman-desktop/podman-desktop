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

import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import MessageBox from './MessageBox.svelte';
import type { MessageBoxOptions } from './messagebox-input';

const receiveFunctionMock = vi.fn();

// mock some methods of the window object
beforeAll(() => {
  (window.events as unknown) = {
    receive: receiveFunctionMock,
  };
});

describe('MessageBox', () => {
  test('Expect that title, message, and buttons are displayed', async () => {
    const idRequest = 123;

    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'My custom title',
      message: 'My message',
      detail: 'A more detailed message',
      footerMarkdownDescription: 'Footer message in markdown',
      buttons: ['OK', 'Not OK'],
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    const title = await screen.findByText(messageBoxOptions.title);
    expect(title).toBeInTheDocument();
    const message = await screen.findAllByText(messageBoxOptions.message ?? '');
    expect(message[1]).toBeInTheDocument();
    const detail = await screen.findByText(messageBoxOptions.detail ?? '');
    expect(detail).toBeInTheDocument();
    const footerMarkdownDescription = await screen.findAllByText(messageBoxOptions.footerMarkdownDescription ?? '');
    expect(footerMarkdownDescription[1]).toBeInTheDocument();
    const button1 = await screen.findByText((messageBoxOptions.buttons?.[0] as string) ?? '');
    expect(button1).toBeInTheDocument();
    const button2 = await screen.findByText((messageBoxOptions.buttons?.[1] as string) ?? '');
    expect(button2).toBeInTheDocument();
  });

  test('Expect that default OK button is displayed and works', async () => {
    const idRequest = 234;

    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'My custom title',
      message: 'My message',
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    const ok = await screen.findByText('OK');
    expect(ok).toBeInTheDocument();
    await fireEvent.click(ok);
    expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest, 0, undefined);
  });

  test('Expect that Esc closes', async () => {
    const idRequest = 456;

    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'My custom title',
      message: 'My message',
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    await userEvent.keyboard('{Escape}');
    expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest, undefined);
  });

  test('Expect that tabbing works', async () => {
    const idRequest = 567;

    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'My custom title',
      message: 'My message',
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    // there are only two user controls in the messagebox, close and ok.
    // tabbing twice should get you to ok
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Tab}');

    const ok = await screen.findByText('OK');
    expect(ok).toEqual(document.activeElement);

    // tabbing twice again should bring you away and back
    await userEvent.keyboard('{Tab}');
    expect(ok).not.toEqual(document.activeElement);

    await userEvent.keyboard('{Tab}');
    expect(ok).toEqual(document.activeElement);
  });

  test('Expect to see two messagebox in a row', async () => {
    const idRequest1 = 686;
    const idRequest2 = 687;

    const messageBoxOptions1: MessageBoxOptions = {
      id: idRequest1,
      title: 'My custom title',
      message: 'My message',
    };

    const messageBoxOptions2: MessageBoxOptions = {
      id: idRequest2,
      title: 'My custom second title',
      message: 'My second message',
    };

    let eventCallback: ((options: MessageBoxOptions) => void) | undefined;
    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        eventCallback = callback;
      }
    });

    render(MessageBox, {});

    // wait that the event callback is set
    await vi.waitFor(() => eventCallback !== undefined);

    // ok ask to display a first quickpick
    expect(eventCallback).toBeDefined();
    eventCallback?.(messageBoxOptions1);

    const ok1 = await screen.findByText('OK');
    expect(ok1).toBeInTheDocument();

    const title1 = await screen.findByText(messageBoxOptions1.title);
    expect(title1).toBeInTheDocument();
    await fireEvent.click(ok1);
    await vi.waitFor(() => expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest1, 0, undefined));
    eventCallback?.(messageBoxOptions2);

    const ok2 = await screen.findByText('OK');
    expect(ok2).toBeInTheDocument();

    const title2 = await screen.findByText(messageBoxOptions2.title);
    expect(title2).toBeInTheDocument();
    await fireEvent.click(ok2);
  });

  test('Expect danger type to keep default button first in layout', async () => {
    const idRequest = 700;
    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'Danger',
      message: 'Danger Message',
      type: 'danger',
      buttons: ['Delete', 'Cancel'],
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    const allButtons = screen.getAllByRole('button');
    expect(allButtons[1]).toHaveTextContent('Cancel');
    expect(allButtons[2]).toHaveTextContent('Delete');
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest, 1, undefined);
  });

  test('Expect explicit default and cancel ids to be honored', async () => {
    const idRequest = 701;
    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'Explicit ids',
      message: 'Message',
      type: 'warning',
      buttons: ['Ignore', 'Abort'],
      cancelId: 1,
      defaultId: 1,
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    const allButtons = screen.getAllByRole('button');
    expect(allButtons[1]).toHaveTextContent('Cancel');
    expect(allButtons[2]).toHaveTextContent('Ignore');
    await userEvent.keyboard('{Escape}');
    expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest, 1);
  });

  test('Expect cancel at index 0 to move default to index 1', async () => {
    const idRequest = 702;
    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'Cancel first',
      message: 'Message',
      buttons: ['Cancel', 'Proceed'],
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    const allButtons = screen.getAllByRole('button');
    expect(allButtons[1]).toHaveTextContent('Cancel');
    expect(allButtons[2]).toHaveTextContent('Proceed');
    await fireEvent.click(screen.getByRole('button', { name: 'Proceed' }));
    expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest, 1, undefined);
  });

  test('Expect danger default button to use danger styling', async () => {
    const messageBoxOptions: MessageBoxOptions = {
      id: 703,
      title: 'Danger default',
      message: 'Message',
      type: 'danger',
      buttons: ['Cancel', 'Delete'],
      defaultId: 1,
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton.className).toContain('pd-button-danger-bg');
  });

  test.each([
    { id: 704, title: 'Warn', message: 'Message', type: 'warning' as const },
    { id: 705, title: 'Info', message: 'Message', type: 'info' as const },
    { id: 706, title: 'Question', message: 'Message', type: 'question' as const },
  ])('Expect $type icon to render', async messageBoxOptions => {
    let eventCallback: ((options: MessageBoxOptions) => void) | undefined;
    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        eventCallback = callback;
      }
    });
    render(MessageBox, {});

    await vi.waitFor(() => eventCallback !== undefined);

    eventCallback?.(messageBoxOptions);
    expect(await screen.findByText(messageBoxOptions.title)).toBeInTheDocument();

    if (messageBoxOptions.type === 'info') {
      expect(document.querySelectorAll('.place-content-center').length).toBeGreaterThanOrEqual(2);
    }
  });

  test('Expect dropdown button to call selection with dropdown index', async () => {
    const idRequest = 707;
    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'Actions',
      message: 'Message',
      buttons: [{ type: 'dropdownButton', heading: 'More', buttons: ['A', 'B'] }],
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    await fireEvent.click(screen.getByRole('button', { name: 'More' }));
    await fireEvent.click(await screen.findByText('B'));
    expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest, 0, 1);
  });

  test('Expect icon button to call selection', async () => {
    const idRequest = 708;
    const messageBoxOptions: MessageBoxOptions = {
      id: idRequest,
      title: 'Actions',
      message: 'Message',
      buttons: [{ type: 'iconButton', label: 'Run', icon: 'fas fa-play' }],
    };

    receiveFunctionMock.mockImplementation((message: string, callback: (options: MessageBoxOptions) => void) => {
      if (message === 'showMessageBox:open') {
        callback(messageBoxOptions);
      }
    });

    render(MessageBox, {});

    await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument());
    await fireEvent.click(screen.getByRole('button', { name: 'Run' }));
    expect(window.sendShowMessageBoxOnSelect).toBeCalledWith(idRequest, 0, undefined);
  });
});
