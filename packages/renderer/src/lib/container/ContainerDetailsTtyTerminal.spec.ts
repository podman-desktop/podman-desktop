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
import { beforeEach, expect, test, vi } from 'vitest';

import ContainerDetailsTtyTerminal from './ContainerDetailsTtyTerminal.svelte';
import { ContainerGroupInfoTypeUI, type ContainerInfoUI } from './ContainerInfoUI';

vi.mock(import('@xterm/xterm'));
vi.mock(import('@xterm/addon-fit'));
vi.mock(import('@xterm/addon-search'));

let container: ContainerInfoUI;
let disposeInput: () => void;

beforeEach(() => {
  vi.resetAllMocks();
  disposeInput = vi.fn();
  // xterm exposes onData as a getter, which automocking leaves undefined.
  Object.defineProperty(Terminal.prototype, 'onData', {
    value: vi.fn<Terminal['onData']>().mockReturnValue({ dispose: disposeInput }),
    configurable: true,
  });
  vi.mocked(window.attachContainer).mockResolvedValueOnce(101).mockResolvedValue(202);
  vi.mocked(window.attachContainerSend).mockResolvedValue(undefined);
  container = {
    id: 'myContainer',
    shortId: 'myContainer',
    name: 'test',
    image: 'alpine',
    shortImage: 'alpine',
    imageId: 'image',
    names: ['/test'],
    engineId: 'docker',
    engineName: 'Docker',
    engineType: 'docker',
    state: 'RUNNING',
    uptime: '',
    startedAt: '',
    ports: [],
    portsAsString: '',
    displayPort: '',
    hasPublicPort: false,
    selected: false,
    created: 0,
    labels: {},
    imageBase64RepoTag: '',
    groupInfo: {
      id: 'docker',
      name: 'Docker',
      engineId: 'docker',
      engineName: 'Docker',
      engineType: 'docker',
      type: ContainerGroupInfoTypeUI.STANDALONE,
    },
  };
});

test('forwards terminal output and installs one input listener', async () => {
  render(ContainerDetailsTtyTerminal, { container, screenReaderMode: true });
  await waitFor(() => expect(window.attachContainer).toHaveBeenCalledOnce());
  vi.mocked(window.attachContainer).mock.calls[0][2](Buffer.from('output'));
  expect(Terminal.prototype.write).toHaveBeenCalledExactlyOnceWith('output');
  vi.mocked(Terminal.prototype.onData).mock.calls[0][0]('command');
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(101, 'command'));
});

test.each([
  ['restart', ['RESTARTING']],
  ['stop/start', ['STOPPING', 'EXITED', 'STARTING']],
])('reattaches input and output after %s without switching tabs', async (_operation, states) => {
  const { rerender } = render(ContainerDetailsTtyTerminal, { container });
  await waitFor(() => expect(window.attachContainer).toHaveBeenCalledOnce());
  vi.mocked(Terminal.prototype.onData).mock.calls[0][0]('before');
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(101, 'before'));
  for (const state of states) await rerender({ container: { ...container, state } });
  await rerender({ container });
  await waitFor(() => expect(window.attachContainer).toHaveBeenCalledTimes(2));
  vi.mocked(Terminal.prototype.onData).mock.calls[1][0]('after');
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenNthCalledWith(2, 202, 'after'));
  expect(window.attachContainerSend).toHaveBeenCalledTimes(2);
  vi.mocked(window.attachContainer).mock.calls[0][2](Buffer.from('stale output'));
  vi.mocked(window.attachContainer).mock.calls[1][2](Buffer.from('new output'));
  expect(Terminal.prototype.write).toHaveBeenCalledExactlyOnceWith('new output');
  expect(disposeInput).toHaveBeenCalledOnce();
});

test('keeps the attachment across pause and unpause without replaying output', async () => {
  const { rerender } = render(ContainerDetailsTtyTerminal, { container });
  await waitFor(() => expect(window.attachContainer).toHaveBeenCalledOnce());
  vi.mocked(window.attachContainer).mock.calls[0][2](Buffer.from('once'));
  await rerender({ container: { ...container, state: 'PAUSED' } });
  vi.mocked(Terminal.prototype.onData).mock.calls[0][0]('paused');
  expect(window.attachContainerSend).not.toHaveBeenCalled();
  await rerender({ container: { ...container, state: 'STARTING' } });
  await rerender({ container });
  vi.mocked(Terminal.prototype.onData).mock.calls[0][0]('resumed');
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(101, 'resumed'));
  expect(window.attachContainer).toHaveBeenCalledOnce();
  expect(Terminal.prototype.onData).toHaveBeenCalledOnce();
  expect(Terminal.prototype.write).toHaveBeenCalledExactlyOnceWith('once');
});

test('preserves the first command after restart while the replacement attachment is pending', async () => {
  const { rerender } = render(ContainerDetailsTtyTerminal, { container });
  await waitFor(() => expect(window.attachContainer).toHaveBeenCalledOnce());
  const recovered = Promise.withResolvers<number>();
  vi.mocked(window.attachContainer).mockReturnValueOnce(recovered.promise);
  await rerender({ container: { ...container, state: 'RESTARTING' } });
  await rerender({ container });
  await waitFor(() => expect(window.attachContainer).toHaveBeenCalledTimes(2));
  vi.mocked(Terminal.prototype.onData).mock.calls[1][0]('first command\r');
  expect(window.attachContainerSend).not.toHaveBeenCalled();
  recovered.resolve(202);
  await waitFor(() => expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(202, 'first command\r'));
});

test('disposes input and ignores late output when the component is unmounted', async () => {
  const { unmount } = render(ContainerDetailsTtyTerminal, { container });
  await waitFor(() => expect(window.attachContainer).toHaveBeenCalledOnce());
  unmount();
  vi.mocked(window.attachContainer).mock.calls[0][2](Buffer.from('late'));
  expect(Terminal.prototype.write).not.toHaveBeenCalled();
  expect(disposeInput).toHaveBeenCalledOnce();
});
