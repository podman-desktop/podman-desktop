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
});
