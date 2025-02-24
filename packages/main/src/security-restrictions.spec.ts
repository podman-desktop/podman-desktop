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

import type {
  Event as ElectronEvent,
  HandlerDetails,
  PermissionRequest,
  WebContents,
  WindowOpenHandlerResponse,
} from 'electron';
import { app, shell } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('electron', () => ({
  app: {
    on: vi.fn(),
  },
  shell: {
    openExternal: vi.fn(),
  },
}));

const ELECTRON_EVENT_MOCK: ElectronEvent = {
  preventDefault: vi.fn(),
} as unknown as ElectronEvent;

const WEB_CONTENTS_MOCK: WebContents = {
  on: vi.fn(),
  getURL: vi.fn(),
  session: {
    setPermissionRequestHandler: vi.fn(),
  },
  setWindowOpenHandler: vi.fn(),
} as unknown as WebContents;

const VITE_DEV_SERVER_URL_MOCK = 'https://foo.bar:8888';

beforeEach(async () => {
  vi.resetAllMocks();
  vi.resetModules();

  vi.mocked(shell.openExternal).mockResolvedValue(undefined);

  // mock env
  (import.meta.env.DEV as unknown) = true;
  (import.meta.env.VITE_DEV_SERVER_URL as unknown) = VITE_DEV_SERVER_URL_MOCK;

  // this combined with `vi.resetModules` allow us to re-import the module
  await import('./security-restrictions.js');
});

// Utility type definition for {@link ElectronApp.on} and {@link WebContents.on}
type Listener = (...args: unknown[]) => void;

/**
 * Utility function to get listener register in {@link ElectronApp.on}
 * @remarks cannot found any way to properly infer type based on event value (see https://github.com/microsoft/TypeScript/issues/53439)
 * @param event
 */
function findElectronAppListener(event: string): Listener | undefined {
  expect(app.on).toHaveBeenCalledWith(event, expect.any(Function));
  return vi.mocked(app.on).mock.calls.find(([mEvent]) => mEvent === event)?.[1];
}

/**
 * Based on {@link findElectronAppListener}, throw an error if the result is undefined
 * @param event
 */
function getElectronAppListener(event: string): Listener {
  const listener = findElectronAppListener(event);
  if (!listener) throw new Error(`cannot found listener for event ${event}`);
  return listener;
}

/**
 * Utility function to get listener register in {@link WebContents.on}
 * @param event
 */
function findWebviewContentsListener(event: string): Listener | undefined {
  expect(WEB_CONTENTS_MOCK.on).toHaveBeenCalledWith(event, expect.any(Function));
  return vi.mocked(WEB_CONTENTS_MOCK.on).mock.calls.find(([mEvent]) => mEvent === event)?.[1] as Listener;
}

/**
 * Based on {@link findWebviewContentsListener}, throw an error if the result is undefined
 * @param event
 */
function getWebviewContentsListener(event: string): Listener {
  const listener = findWebviewContentsListener(event);
  if (!listener) throw new Error(`cannot found listener on WebContents.on for event ${event}`);
  return listener;
}

test('ensuring web-contents-created is registered', () => {
  const listener = findElectronAppListener('web-contents-created');
  expect(listener).toBeDefined();
});

test('ensure web-contents-created listener register will-navigate listener', () => {
  // ensure no listener on WebContents has been registered
  expect(WEB_CONTENTS_MOCK.on).not.toHaveBeenCalled();

  // get the 'web-contents-created' listener and call it
  const webContentsCreatedListener = getElectronAppListener('web-contents-created');
  expect(webContentsCreatedListener).toBeDefined();

  webContentsCreatedListener(ELECTRON_EVENT_MOCK, WEB_CONTENTS_MOCK);

  // check that 'will-navigate' event has been registered
  expect(WEB_CONTENTS_MOCK.on).toHaveBeenCalledWith('will-navigate', expect.any(Function));
});

describe('sorting allowed origin', () => {
  test('allowed url should not prevent event', () => {
    // get the 'web-contents-created' listener and call it
    const webContentsCreatedListener = getElectronAppListener('web-contents-created');
    webContentsCreatedListener(ELECTRON_EVENT_MOCK, WEB_CONTENTS_MOCK);

    const willNavigateListener: (event: ElectronEvent, url: string) => void =
      getWebviewContentsListener('will-navigate');
    willNavigateListener(ELECTRON_EVENT_MOCK, VITE_DEV_SERVER_URL_MOCK);

    // ensure it has not been called
    expect(ELECTRON_EVENT_MOCK.preventDefault).not.toHaveBeenCalled();
  });

  test('invalid url should not be an allowed origin', () => {
    // get the 'web-contents-created' listener and call it
    const webContentsCreatedListener = getElectronAppListener('web-contents-created');
    webContentsCreatedListener(ELECTRON_EVENT_MOCK, WEB_CONTENTS_MOCK);

    // ensure it has not been called
    expect(ELECTRON_EVENT_MOCK.preventDefault).not.toHaveBeenCalled();

    const willNavigateListener: (event: ElectronEvent, url: string) => void =
      getWebviewContentsListener('will-navigate');
    willNavigateListener(ELECTRON_EVENT_MOCK, 'https://dangerous.foo');

    // ensure it has not been called
    expect(ELECTRON_EVENT_MOCK.preventDefault).toHaveBeenCalled();
  });
});

describe('windows open handler', () => {
  let setWindowOpenHandlerHandler: (details: HandlerDetails) => WindowOpenHandlerResponse;
  beforeEach(() => {
    // get the 'web-contents-created' listener and call it
    const webContentsCreatedListener = getElectronAppListener('web-contents-created');
    webContentsCreatedListener(ELECTRON_EVENT_MOCK, WEB_CONTENTS_MOCK);

    expect(WEB_CONTENTS_MOCK.setWindowOpenHandler).toHaveBeenCalledOnce();
    const call = vi.mocked(WEB_CONTENTS_MOCK.setWindowOpenHandler).mock.calls[0];
    if (!call) throw new Error('WebContents#setWindowOpenHandler should have been called once');
    setWindowOpenHandlerHandler = call[0];
  });

  test('WindowOpenHandlerResponse#action should always be deny', () => {
    const result = setWindowOpenHandlerHandler({ url: 'https://github.com' } as HandlerDetails);
    expect(result.action).toStrictEqual('deny');
  });

  test('allowed origin should call shell#openExternal', () => {
    setWindowOpenHandlerHandler({ url: 'https://github.com' } as HandlerDetails);
    expect(shell.openExternal).toHaveBeenCalledOnce();
    expect(shell.openExternal).toHaveBeenCalledWith('https://github.com');
  });

  test('invalid origin should not call shell#openExternal', () => {
    setWindowOpenHandlerHandler({ url: 'https://foo.bar' } as HandlerDetails);
    expect(shell.openExternal).not.toHaveBeenCalled();
  });
});

describe('WebContents#session#setPermissionRequestHandler', () => {
  type PermissionRequestHandler = Parameters<WebContents['session']['setPermissionRequestHandler']>[0];
  let handler: PermissionRequestHandler;

  beforeEach(() => {
    // get the 'web-contents-created' listener and call it
    const webContentsCreatedListener = getElectronAppListener('web-contents-created');
    webContentsCreatedListener(ELECTRON_EVENT_MOCK, WEB_CONTENTS_MOCK);

    expect(WEB_CONTENTS_MOCK.session.setPermissionRequestHandler).toHaveBeenCalledOnce();
    const call = vi.mocked(WEB_CONTENTS_MOCK.session.setPermissionRequestHandler).mock.calls[0];
    if (!call) throw new Error('WebContents#session#setPermissionRequestHandler should have been called once');
    handler = call[0];
  });

  test('unknown origin should be blocked', () => {
    vi.mocked(WEB_CONTENTS_MOCK.getURL).mockReturnValue('https://dangerous.bar');

    const CALLBACK_MOCK = vi.fn();

    handler?.(WEB_CONTENTS_MOCK, 'openExternal', CALLBACK_MOCK, {} as unknown as PermissionRequest);

    expect(CALLBACK_MOCK).toHaveBeenCalledOnce();
    expect(CALLBACK_MOCK).toHaveBeenCalledWith(false); // permission denied
  });

  test('allowed origin should be allowed', () => {
    vi.mocked(WEB_CONTENTS_MOCK.getURL).mockReturnValue(VITE_DEV_SERVER_URL_MOCK);

    const CALLBACK_MOCK = vi.fn();

    handler?.(WEB_CONTENTS_MOCK, 'clipboard-sanitized-write', CALLBACK_MOCK, {} as unknown as PermissionRequest);

    expect(CALLBACK_MOCK).toHaveBeenCalledOnce();
    expect(CALLBACK_MOCK).toHaveBeenCalledWith(true); // permission denied
  });
});
