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
import type { BrowserWindow } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isWindows } from '/@/util.js';

import { ProtocolLauncher } from './protocol-launcher.js';

// mock modules
vi.mock(import('/@/util.js'));

const BROWSER_WINDOW_MOCK: BrowserWindow = {
  isDestroyed: vi.fn(),
  webContents: {
    send: vi.fn(),
  },
} as unknown as BrowserWindow;

function getProtocolLauncher(): ProtocolLauncher {
  // create deferred promise
  const deferred = Promise.withResolvers<BrowserWindow>();
  deferred.resolve(BROWSER_WINDOW_MOCK);

  // create protocol launcher
  return new ProtocolLauncher(deferred);
}

beforeEach(() => {
  vi.resetAllMocks();
});

test('should send the URL to open when mainWindow is created', async () => {
  const protocol = getProtocolLauncher();
  protocol.handleOpenUrl('podman-desktop:extension/my.extension');

  // wait sendMock being called
  await vi.waitFor(() => expect(BROWSER_WINDOW_MOCK.webContents.send).toHaveBeenCalled());

  expect(BROWSER_WINDOW_MOCK.webContents.send).toHaveBeenCalledWith(
    'podman-desktop-protocol:install-extension',
    'my.extension',
  );
});

test('should send the URL to open when mainWindow is created with :// format', async () => {
  const protocol = getProtocolLauncher();
  protocol.handleOpenUrl('podman-desktop://extension/my.extension');

  // wait sendMock being called
  await vi.waitFor(() =>
    expect(BROWSER_WINDOW_MOCK.webContents.send).toHaveBeenCalledWith(
      'podman-desktop-protocol:install-extension',
      'my.extension',
    ),
  );
});

test('should not send the URL for invalid URLs', async () => {
  const protocol = getProtocolLauncher();
  protocol.handleOpenUrl('podman-desktop:foobar');

  // expect an error
  expect(vi.mocked(BROWSER_WINDOW_MOCK.webContents.send)).not.toHaveBeenCalled();
});

test.each([
  {
    url: 'podman-desktop:extension/my.extension',
    webContentsSend: ['podman-desktop-protocol:install-extension', 'my.extension'],
  },
  { url: 'podman-desktop:experimental', webContentsSend: ['podman-desktop-protocol:open-experimental-features'] },
])('should handle valid URL on Windows', async ({ url, webContentsSend }) => {
  vi.mocked(isWindows).mockReturnValue(true);

  const protocol = getProtocolLauncher();
  protocol.handleAdditionalProtocolLauncherArgs([url]);

  // expect handleOpenUrl not be called
  await vi.waitFor(() => expect(BROWSER_WINDOW_MOCK.webContents.send).toHaveBeenCalledWith(...webContentsSend));
});

test.each([
  'podman-desktop:extension/my.extension',
  'podman-desktop:experimental',
])('should not do anything with valid URL on OS different than Windows', async url => {
  vi.mocked(isWindows).mockReturnValue(false);

  const protocol = getProtocolLauncher();

  protocol.handleAdditionalProtocolLauncherArgs([url]);

  // no called on it
  expect(BROWSER_WINDOW_MOCK.webContents.send).not.toHaveBeenCalled();
});

describe('sanitizeProtocolForExtension', () => {
  test('handle sanitizeProtocolForExtension', () => {
    const protocol = getProtocolLauncher();

    const fakeLink = 'podman-desktop://extension/my.extension';
    const sanitizedLink = 'podman-desktop:extension/my.extension';
    expect(protocol.sanitizeProtocolForExtension(fakeLink)).toEqual(sanitizedLink);
  });

  test('handle sanitizeProtocolForExtension noop', () => {
    const protocol = getProtocolLauncher();

    const sanitizedLink = 'podman-desktop:extension/my.extension';
    expect(protocol.sanitizeProtocolForExtension(sanitizedLink)).toEqual(sanitizedLink);
  });
});
