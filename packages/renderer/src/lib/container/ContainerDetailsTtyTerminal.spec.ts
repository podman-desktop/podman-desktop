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

import { render, waitFor } from '@testing-library/svelte';
import { Terminal } from '@xterm/xterm';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import ContainerDetailsTtyTerminal from './ContainerDetailsTtyTerminal.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

const attachContainerMock = vi.mocked(window.attachContainer);

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
  vi.mocked(window.getConfigurationValue).mockImplementation(async (key: string) => {
    if (key === 'terminal.integrated.scrollback') {
      return 1000;
    }
    return undefined;
  });
  vi.mocked(window.attachContainerSend).mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
});

test('expect being able to attach terminal ', async () => {
  const container: ContainerInfoUI = {
    id: 'myContainer',
    state: 'RUNNING',
    engineId: 'podman',
  } as unknown as ContainerInfoUI;

  let onDataCallback: (data: Buffer) => void = () => {};

  const sendCallbackId = 12345;
  attachContainerMock.mockImplementation(
    async (
      _engineId: string,
      _containerId: string,
      onData: (data: Buffer) => void,
      _onError: (error: string) => void,
      _onEnd: () => void,
    ) => {
      onDataCallback = onData;
      // return a callback id
      return sendCallbackId;
    },
  );

  // render the component with a terminal
  const renderObject = render(ContainerDetailsTtyTerminal, { container, screenReaderMode: true });

  // wait attachContainerMock is called
  await waitFor(() => expect(attachContainerMock).toHaveBeenCalled());

  await new Promise(resolve => setTimeout(resolve, 1000));

  // write some data on the terminal
  onDataCallback(Buffer.from('hello\nworld'));

  // search a div having aria-live="assertive" attribute
  await waitFor(() => expect(renderObject.container.querySelector('div[aria-live="assertive"]')));
  const terminalLinesLiveRegion = renderObject.container.querySelector('div[aria-live="assertive"]');

  // check the content
  await vi.waitFor(() => expect(terminalLinesLiveRegion).toHaveTextContent('hello world'), { timeout: 2500 });

  // check we have called attachContainer
  expect(attachContainerMock).toHaveBeenCalledTimes(1);
});

test.each([
  ['restart', ['RESTARTING']],
  ['stop/start', ['STOPPING', 'EXITED', 'STARTING']],
])('reattaches TTY input and output after %s', async (_operation, states) => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const container = {
    id: 'myContainer',
    state: 'RUNNING',
    engineId: 'podman',
  } as ContainerInfoUI;
  const open = vi.spyOn(Terminal.prototype, 'open');
  attachContainerMock.mockResolvedValueOnce(101).mockResolvedValueOnce(202).mockResolvedValue(303);
  const { rerender, container: element } = render(ContainerDetailsTtyTerminal, { container, screenReaderMode: true });

  await waitFor(() => expect(open).toHaveBeenCalledOnce());
  await waitFor(() => expect(attachContainerMock).toHaveBeenCalledOnce());
  const terminal = open.mock.instances[0];
  if (!(terminal instanceof Terminal)) throw new Error('Terminal did not initialize');
  terminal.input('before', true);
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(101, 'before'));

  attachContainerMock.mock.calls[0][4]();
  for (const state of states) {
    await rerender({ container: { ...container, state } });
  }
  vi.mocked(window.attachContainerSend).mockClear();

  await rerender({ container: { ...container, state: 'RUNNING' } });
  await waitFor(() => expect(attachContainerMock).toHaveBeenCalledTimes(2));
  attachContainerMock.mock.calls[0][4]();
  terminal.input('after', true);
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(202, 'after'));
  attachContainerMock.mock.calls[1][2](Buffer.from('reconnected output\n'));
  await waitFor(() =>
    expect(element.querySelector('div[aria-live="assertive"]')).toHaveTextContent('reconnected output'),
  );

  // The engine can report RUNNING before the old process and its stream finish exiting.
  attachContainerMock.mock.calls[1][4]();
  await vi.advanceTimersByTimeAsync(2000);
  await waitFor(() => expect(attachContainerMock).toHaveBeenCalledTimes(3));
  vi.mocked(window.attachContainerSend).mockClear();
  terminal.input('after old stream closes', true);
  await waitFor(() =>
    expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(303, 'after old stream closes'),
  );

  await rerender({ container: { ...container, uptime: '1 minute' } });
  expect(attachContainerMock).toHaveBeenCalledTimes(3);
});

test('retries a rejected TTY attachment and forwards input through the recovered stream', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const container = { id: 'myContainer', state: 'RUNNING', engineId: 'podman' } as ContainerInfoUI;
  const open = vi.spyOn(Terminal.prototype, 'open');
  const error = new Error('container is restarting');
  vi.spyOn(console, 'error').mockImplementation(() => {});
  attachContainerMock.mockRejectedValueOnce(error).mockResolvedValue(202);
  render(ContainerDetailsTtyTerminal, { container });
  await waitFor(() => expect(attachContainerMock).toHaveBeenCalledOnce());
  await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error attaching to container myContainer', error));

  await vi.advanceTimersByTimeAsync(2000);
  await waitFor(() => expect(attachContainerMock).toHaveBeenCalledTimes(2));
  const terminal = open.mock.instances[0];
  if (!(terminal instanceof Terminal)) throw new Error('Terminal did not initialize');
  terminal.input('recovered', true);
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(202, 'recovered'));
});
