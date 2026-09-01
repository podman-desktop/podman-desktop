/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { render } from '@testing-library/svelte';
/* eslint-disable import/no-duplicates */
import { tick } from 'svelte';
import { get } from 'svelte/store';
/* eslint-enable import/no-duplicates */
import { router } from 'tinro';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import Loader from './Loader.svelte';
import { lastPage } from './stores/breadcrumb';

// first, patch window object
const callbacks = new Map<string, any>();
const eventEmitter = {
  receive: (message: string, callback: any): void => {
    callbacks.set(message, callback);
  },
};

const dispatchEventMock = vi.fn();
const extensionSystemIsExtensionsStartedMock = vi.fn();
const locationReloadMock = vi.fn();
const sessionStore = new Map<string, string>();
const sessionStorageMock = {
  getItem: (key: string): string | null => sessionStore.get(key) ?? null,
  setItem: (key: string, value: string): void => {
    sessionStore.set(key, value);
  },
  removeItem: (key: string): void => {
    sessionStore.delete(key);
  },
};

// mock the router
vi.mock(import('tinro'));

Object.defineProperty(global, 'window', {
  value: {
    events: {
      receive: eventEmitter.receive,
    },
    dispatchEvent: dispatchEventMock,
    extensionSystemIsReady: vi.fn(),
    extensionSystemIsExtensionsStarted: extensionSystemIsExtensionsStartedMock,
    addEventListener: eventEmitter.receive,
    location: { reload: locationReloadMock },
    sessionStorage: sessionStorageMock,
  },
  writable: true,
});

beforeAll(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
});

test('Loader should redirect to the installation page when receiving the event', async () => {
  const dummyExtensionId = 'my.customExtensionId';

  // rendering the component
  render(Loader, { props: {} });

  // send the install-extension:from-id event
  const callbackInstallExtension = callbacks.get('install-extension:from-id');
  // send 'install-extension:from-id' event
  expect(callbackInstallExtension).toBeDefined();
  await callbackInstallExtension(dummyExtensionId);

  // check that we didn't redirect to the installation page as system is not yet ready
  expect(router.goto).not.toHaveBeenCalled();

  // send the system-ready event
  const callback = callbacks.get('system-ready');
  // send 'system-ready' event
  expect(callback).toBeDefined();
  await callback();

  await tick();

  // check that we have been redirected
  expect(router.goto).toHaveBeenCalledWith(`/extensions/details/${dummyExtensionId}`);

  // check that breadcrumb is correct
  expect(get(lastPage)).toStrictEqual({
    name: 'Extensions',
    path: '/extensions',
  });
});

test('Loader should send the event if extensions take time to start', async () => {
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(false);

  // rendering the component
  render(Loader, { props: {} });

  // check we don't have yet received the 'extensions-already-started' event
  expect(dispatchEventMock.mock.calls.length).toBe(0);

  // wait one second (to simulate a long initialization of extensions)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // now, flag remote extensions being ready
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(true);

  // wait dispatchEvent method being called
  while (dispatchEventMock.mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // check that we have received the 'extensions-already-started' event
  expect(dispatchEventMock.mock.calls.length).toBe(1);
  expect(dispatchEventMock.mock.calls[0][0].type).toBe('extensions-already-started');
});

test('Loader should send extensions-already-started event as soon as possible if already done remotely', async () => {
  // flag extension system being alreay initialized (for example user hit the reload button)
  extensionSystemIsExtensionsStartedMock.mockResolvedValue(true);

  // rendering the component
  render(Loader, { props: {} });

  // wait dispatchEvent method being called
  while (dispatchEventMock.mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // check we have received the 'extensions-already-started' event
  expect(dispatchEventMock.mock.calls.length).toBe(1);
  expect(dispatchEventMock.mock.calls[0][0].type).toBe('extensions-already-started');
});

describe('preload bridge watchdog', () => {
  const readySpy = window.extensionSystemIsReady;

  afterEach(() => {
    vi.useRealTimers();
    // restore a working bridge and clear the reload guard for the next test
    (window as any).extensionSystemIsReady = readySpy;
    sessionStore.clear();
    locationReloadMock.mockClear();
  });

  test('reloads the page once when the preload bridge never attaches', async () => {
    vi.useFakeTimers();
    // simulate a missing preload bridge
    (window as any).extensionSystemIsReady = undefined;

    const { unmount } = render(Loader, { props: {} });

    // watchdog has not fired yet
    expect(locationReloadMock).not.toHaveBeenCalled();

    // advance past the watchdog grace period
    await vi.advanceTimersByTimeAsync(5000);

    expect(locationReloadMock).toHaveBeenCalledTimes(1);
    expect(sessionStore.get('pd-bridge-reload-attempted')).toBe('true');

    unmount();
  });

  test('does not reload a second time when the guard is already set (loop guard)', async () => {
    vi.useFakeTimers();
    (window as any).extensionSystemIsReady = undefined;
    // guard already set by a previous (failed) attempt
    sessionStore.set('pd-bridge-reload-attempted', 'true');

    const { unmount } = render(Loader, { props: {} });

    await vi.advanceTimersByTimeAsync(5000);

    expect(locationReloadMock).not.toHaveBeenCalled();

    unmount();
  });

  test('does not reload when the preload bridge is present', async () => {
    vi.useFakeTimers();
    // bridge is present but backend not yet ready: keeps the Loader on screen (no <App/> mount)
    // while still proving the watchdog treats a present bridge as healthy and does not reload.
    (window as any).extensionSystemIsReady = vi.fn().mockResolvedValue(false);

    const { unmount } = render(Loader, { props: {} });

    await vi.advanceTimersByTimeAsync(5000);

    expect(locationReloadMock).not.toHaveBeenCalled();

    unmount();
  });
});
