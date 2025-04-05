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
import type { App as ElectronApp, Net as ElectronNet, Protocol as ElectronProtocol } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ProtocolMedia } from '/@/protocol-media.js';

const ELECTRON_APP_MOCK: ElectronApp = {
  whenReady: vi.fn(),
} as unknown as ElectronApp;

const ELECTRON_NET_MOCK: ElectronNet = {
  fetch: vi.fn(),
} as unknown as ElectronNet;

const ELECTRON_PROTOCOL_MOCK: ElectronProtocol = {
  handle: vi.fn(),
} as unknown as ElectronProtocol;

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(ELECTRON_APP_MOCK.whenReady).mockReturnValue(Promise.resolve());
});

function getProtocolMedia(): ProtocolMedia {
  return new ProtocolMedia(ELECTRON_APP_MOCK, ELECTRON_NET_MOCK, ELECTRON_PROTOCOL_MOCK);
}

type PROTOCOL_HANDLER = Parameters<ElectronProtocol['handle']>[1];

async function getHandle(): Promise<PROTOCOL_HANDLER> {
  const media = getProtocolMedia();
  media.init();
  return await vi.waitFor(() => {
    expect(ELECTRON_PROTOCOL_MOCK.handle).toHaveBeenCalled();
    const call = vi.mocked(ELECTRON_PROTOCOL_MOCK.handle).mock.calls[0];
    if (!call) throw new Error('ElectronProtocol#handle has empty call history');
    return call[1];
  });
}

test('ensure init register callback to app#whenReady', async () => {
  const media = getProtocolMedia();
  expect(ELECTRON_APP_MOCK.whenReady).not.toHaveBeenCalled();
  expect(ELECTRON_PROTOCOL_MOCK.handle).not.toHaveBeenCalled();

  media.init();
  expect(ELECTRON_APP_MOCK.whenReady).toHaveBeenCalled();

  // ensure the handle has been registered
  await vi.waitFor(() => {
    expect(ELECTRON_PROTOCOL_MOCK.handle).toHaveBeenCalled();
  });
});

describe('handler should handle provided request', () => {
  test('unknown extension should throw an error', async () => {
    const handler = await getHandle();
    await expect(async () => {
      return handler({
        url: 'media:///hello/world.invalid',
      } as unknown as Request);
    }).rejects.toThrowError(
      'invalid path: trying to read media media:///hello/world.invalid, extension allowed: .woff2',
    );
  });

  test('invalid protocol should throw an error', async () => {
    const handler = await getHandle();
    await expect(async () => {
      return handler({
        url: 'random:///hello/world.invalid',
      } as unknown as Request);
    }).rejects.toThrowError('invalid protocol: expected media: got random:');
  });

  test('.woff2 extension should use ElectronNet#fetch', async () => {
    const handler = await getHandle();
    await handler({
      url: 'media:///hello/world.woff2',
    } as unknown as Request);

    expect(ELECTRON_NET_MOCK.fetch).toHaveBeenCalledWith('file:///hello/world.woff2');
  });
});
