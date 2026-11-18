/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { Terminal } from '@xterm/xterm';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { ContainerTtySession } from './container-tty-session';

vi.mock(import('@xterm/xterm'));

let session: ContainerTtySession;
let terminal: Terminal;
let disposeInput: () => void;

beforeEach(() => {
  vi.resetAllMocks();
  session = new ContainerTtySession();
  terminal = new Terminal();
  disposeInput = vi.fn();
  // xterm exposes onData as a getter, which automocking leaves undefined.
  Object.defineProperty(Terminal.prototype, 'onData', {
    value: vi.fn<Terminal['onData']>().mockReturnValue({ dispose: disposeInput }),
    configurable: true,
  });
  vi.mocked(window.attachContainer).mockResolvedValue(101);
  vi.mocked(window.attachContainerSend).mockResolvedValue(undefined);
});

test('waits for a running container and a terminal before attaching', () => {
  session.update(undefined, 'docker', 'fixture', 'RUNNING');
  session.update(terminal, 'docker', 'fixture', 'EXITED');
  expect(window.attachContainer).not.toHaveBeenCalled();
  session.dispose();
});

test('reattaches after restart and ignores output and end from the previous attachment', async () => {
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.waitFor(() => expect(get(session.status)).toBe('connected'));
  session.update(terminal, 'docker', 'fixture', 'RESTARTING');
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.waitFor(() => expect(window.attachContainer).toHaveBeenCalledTimes(2));
  vi.mocked(window.attachContainer).mock.calls[0][2](Buffer.from('stale'));
  vi.mocked(window.attachContainer).mock.calls[0][4]();
  vi.mocked(window.attachContainer).mock.calls[1][2](Buffer.from('current'));
  expect(terminal.write).toHaveBeenCalledExactlyOnceWith('current');
  expect(terminal.onData).toHaveBeenCalledTimes(2);
  expect(disposeInput).toHaveBeenCalledOnce();
  session.dispose();
});

test('does not replay history or reattach on pause and unpause', async () => {
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.waitFor(() => expect(get(session.status)).toBe('connected'));
  vi.mocked(window.attachContainer).mock.calls[0][2](Buffer.from('once'));
  session.update(terminal, 'docker', 'fixture', 'PAUSED');
  session.update(terminal, 'docker', 'fixture', 'STARTING');
  session.update(terminal, 'docker', 'fixture', 'STARTING');
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  expect(window.attachContainer).toHaveBeenCalledOnce();
  expect(terminal.write).toHaveBeenCalledExactlyOnceWith('once');
  session.dispose();
});

test('preserves the first command during retry delay and a pending replacement attachment', async () => {
  vi.useFakeTimers();
  const recovered = Promise.withResolvers<number>();
  vi.mocked(window.attachContainer).mockResolvedValueOnce(101).mockReturnValueOnce(recovered.promise);
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  vi.mocked(window.attachContainer).mock.calls[0][4]();
  const input = vi.mocked(Terminal.prototype.onData).mock.calls[0][0];
  input('echo ');
  input('FIRST_OK\r');
  expect(window.attachContainerSend).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(2000);
  input('echo NEXT_OK\r');
  expect(window.attachContainerSend).not.toHaveBeenCalled();
  recovered.resolve(202);
  await vi.advanceTimersByTimeAsync(0);
  expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(202, 'echo FIRST_OK\recho NEXT_OK\r');
  session.dispose();
  vi.useRealTimers();
});

test.each([
  ['the container stops', 'STOPPING', 'fixture'],
  ['the target changes', 'RUNNING', 'other'],
])('discards queued input when %s before reconnecting', async (_reason, state, id) => {
  vi.useFakeTimers();
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  vi.mocked(window.attachContainer).mock.calls[0][4]();
  vi.mocked(Terminal.prototype.onData).mock.calls[0][0]('old command\r');
  session.update(terminal, 'docker', id, state);
  session.update(terminal, 'docker', id, 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  expect(window.attachContainerSend).not.toHaveBeenCalled();
  session.dispose();
  vi.useRealTimers();
});

test('discards unsent commands when the retry budget is exhausted', async () => {
  vi.useFakeTimers();
  vi.mocked(window.attachContainer).mockResolvedValueOnce(101);
  for (let attempt = 0; attempt < 4; attempt++) {
    vi.mocked(window.attachContainer).mockRejectedValueOnce(new Error('connection lost'));
  }
  vi.mocked(window.attachContainer).mockResolvedValue(202);
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  vi.mocked(window.attachContainer).mock.calls[0][4]();
  vi.mocked(Terminal.prototype.onData).mock.calls[0][0]('old command\r');
  for (const delay of [2000, 4000, 8000, 8000]) await vi.advanceTimersByTimeAsync(delay);
  expect(get(session.status)).toBe('disconnected');
  session.update(terminal, 'docker', 'fixture', 'PAUSED');
  session.update(terminal, 'docker', 'fixture', 'STARTING');
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  expect(get(session.status)).toBe('connected');
  expect(window.attachContainerSend).not.toHaveBeenCalled();
  session.dispose();
  vi.useRealTimers();
});

test('bounds failed attachments to five attempts with backoff and no display flicker', async () => {
  vi.useFakeTimers();
  vi.mocked(window.attachContainer).mockRejectedValue(new Error('connection unavailable'));
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  for (const delay of [0, 2000, 4000, 8000]) {
    await vi.advanceTimersByTimeAsync(delay);
    expect(get(session.status)).toBe('connecting');
  }
  await vi.advanceTimersByTimeAsync(8000);
  expect(window.attachContainer).toHaveBeenCalledTimes(5);
  expect(get(session.status)).toBe('disconnected');
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(60000);
  expect(window.attachContainer).toHaveBeenCalledTimes(5);
  expect(vi.getTimerCount()).toBe(0);
  session.dispose();
  vi.useRealTimers();
});

test('deduplicates error and end and restores input after retry', async () => {
  vi.useFakeTimers();
  vi.mocked(window.attachContainer).mockResolvedValueOnce(101).mockResolvedValue(202);
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  vi.mocked(window.attachContainer).mock.calls[0][3]('connection lost');
  vi.mocked(window.attachContainer).mock.calls[0][4]();
  expect(get(session.status)).toBe('connecting');
  expect(vi.getTimerCount()).toBe(1);
  await vi.advanceTimersByTimeAsync(2000);
  expect(window.attachContainer).toHaveBeenCalledTimes(2);
  vi.mocked(Terminal.prototype.onData).mock.calls[0][0]('first command');
  await vi.advanceTimersByTimeAsync(0);
  expect(window.attachContainerSend).toHaveBeenCalledExactlyOnceWith(202, 'first command');
  expect(terminal.onData).toHaveBeenCalledOnce();
  session.dispose();
  vi.useRealTimers();
});

test('cancels retry and ignores late callbacks after disposal', async () => {
  vi.useFakeTimers();
  vi.mocked(window.attachContainer).mockRejectedValue(new Error('connection lost'));
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  session.dispose();
  vi.mocked(window.attachContainer).mock.calls[0][4]();
  await vi.advanceTimersByTimeAsync(60000);
  expect(window.attachContainer).toHaveBeenCalledOnce();
  expect(vi.getTimerCount()).toBe(0);
  expect(disposeInput).toHaveBeenCalledOnce();
  vi.useRealTimers();
});

test('ignores an attachment that resolves after stopping', async () => {
  const pending = Promise.withResolvers<number>();
  vi.mocked(window.attachContainer).mockReturnValue(pending.promise);
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  session.update(terminal, 'docker', 'fixture', 'STOPPING');
  pending.resolve(101);
  await pending.promise;
  vi.mocked(window.attachContainer).mock.calls[0][2](Buffer.from('late'));
  expect(get(session.status)).toBe('connecting');
  expect(terminal.write).not.toHaveBeenCalled();
  session.dispose();
});

test('bounds reconnects when each successful attach immediately ends', async () => {
  vi.useFakeTimers();
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  const delays = [2000, 4000, 8000, 8000];
  for (let index = 0; index < 5; index++) {
    vi.mocked(window.attachContainer).mock.calls[index][4]();
    await vi.advanceTimersByTimeAsync(delays[index] ?? 60000);
  }
  expect(window.attachContainer).toHaveBeenCalledTimes(5);
  expect(get(session.status)).toBe('disconnected');
  expect(vi.getTimerCount()).toBe(0);
  session.dispose();
  vi.useRealTimers();
});

test('allows recovery from a later outage after the connection has remained stable', async () => {
  vi.useFakeTimers();
  session.update(terminal, 'docker', 'fixture', 'RUNNING');
  await vi.advanceTimersByTimeAsync(0);
  for (const [index, delay] of [2000, 4000, 8000, 8000].entries()) {
    vi.mocked(window.attachContainer).mock.calls[index][4]();
    await vi.advanceTimersByTimeAsync(delay);
  }
  await vi.advanceTimersByTimeAsync(10000);
  vi.mocked(window.attachContainer).mock.calls[4][4]();
  await vi.advanceTimersByTimeAsync(2000);
  expect(window.attachContainer).toHaveBeenCalledTimes(6);
  expect(get(session.status)).toBe('connected');
  session.dispose();
  vi.useRealTimers();
});
