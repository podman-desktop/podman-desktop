/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

import type { ColorInfo } from '@desktop-framework/api';
import { render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import Loader from './Loader.svelte';
import { lastPage } from './stores/breadcrumb';
import { colorsInfos } from './stores/colors';

type EventCallback = (data?: unknown) => void | Promise<void>;

const callbacks = new Map<string, EventCallback>();

// mock the router
vi.mock(import('tinro'));

// no need to render the whole application
vi.mock(import('./App.svelte'));

const color: ColorInfo = {
  id: 'color',
  cssVar: '--pd-color',
  value: '#ffffff',
};

function getCallback(message: string): EventCallback {
  const callback = callbacks.get(message);
  if (!callback) {
    throw new Error(`no callback registered for the '${message}' event`);
  }
  return callback;
}

beforeEach(() => {
  vi.resetAllMocks();

  callbacks.clear();

  // intercept the events sent by the main process
  vi.mocked(window.events.receive).mockImplementation((message, callback) => {
    callbacks.set(message, callback);
    return { dispose: vi.fn() };
  });
  // keep the initial system ready check pending, so that the events simulated by a test are not
  // overwritten by its result. Tests relying on it override this mock.
  vi.mocked(window.extensionSystemIsReady).mockReturnValue(new Promise<boolean>(() => undefined));
  // the colors are listed by the colors store, once the system is ready
  vi.mocked(window.listColors).mockResolvedValue([]);
  // do not let the events dispatched by the component reach the other stores
  vi.spyOn(window, 'dispatchEvent').mockReturnValue(true);

  colorsInfos.set([]);
});

afterEach(() => {
  vi.useRealTimers();
});

test('Loader should redirect to the installation page when receiving the event', async () => {
  const dummyExtensionId = 'my.customExtensionId';

  // rendering the component
  render(Loader, { props: {} });
  // let the component register the events sent by the main process
  await vi.waitFor(() => expect(callbacks.get('install-extension:from-id')).toBeDefined());

  // send the install-extension:from-id event
  await getCallback('install-extension:from-id')(dummyExtensionId);

  // check that we didn't redirect to the installation page as system is not yet ready
  expect(router.goto).not.toHaveBeenCalled();

  // flag the system as ready, colors are still loading: the redirect must still be deferred
  await getCallback('starting-extensions')('true');
  expect(router.goto).not.toHaveBeenCalled();

  // now colors are loaded: the deferred redirect happens
  colorsInfos.set([color]);
  await vi.waitFor(() => expect(router.goto).toHaveBeenCalledWith(`/extensions/details/${dummyExtensionId}`));

  // check that breadcrumb is correct
  expect(get(lastPage)).toStrictEqual({
    name: 'Extensions',
    path: '/extensions',
  });
});

test('Loader should only open the last extension requested before the UI is ready', async () => {
  render(Loader, { props: {} });
  await vi.waitFor(() => expect(callbacks.get('install-extension:from-id')).toBeDefined());

  // two install requests are received before the UI state is loaded
  await getCallback('install-extension:from-id')('first.customExtensionId');
  await getCallback('install-extension:from-id')('second.customExtensionId');
  await getCallback('starting-extensions')('true');

  // now colors are loaded: only the last request is opened
  colorsInfos.set([color]);
  await vi.waitFor(() => expect(router.goto).toHaveBeenCalledWith('/extensions/details/second.customExtensionId'));
  expect(router.goto).toHaveBeenCalledTimes(1);
});

test('Loader should show the splash screen until the system is ready and colors are loaded', async () => {
  // rendering the component
  render(Loader, { props: {} });

  // system is not ready yet
  expect(screen.getByText('Initializing...')).toBeInTheDocument();

  // system is ready but colors are still loading: keep the splash screen
  await getCallback('starting-extensions')('true');
  expect(await screen.findByText('Initializing...')).toBeInTheDocument();

  // colors are loaded: the application can be displayed
  colorsInfos.set([color]);
  await vi.waitFor(() => expect(screen.queryByText('Initializing...')).not.toBeInTheDocument());
});

test('Loader should display the application if the colors never load', async () => {
  vi.useFakeTimers();
  const warnSpy = vi.spyOn(console, 'warn').mockReturnValue(undefined);

  // rendering the component
  render(Loader, { props: {} });
  await getCallback('starting-extensions')('true');

  // the system is ready but no color is ever received: keep the splash screen
  expect(screen.getByText('Initializing...')).toBeInTheDocument();

  // after the fallback delay, the application is displayed anyway
  await vi.advanceTimersByTimeAsync(60_000);
  expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Colors were not loaded'));
  expect(screen.queryByText('Initializing...')).not.toBeInTheDocument();
});

test('Loader should send the event if extensions take time to start', async () => {
  // the extension starter checker is set up once the initial system ready check is over
  vi.mocked(window.extensionSystemIsReady).mockResolvedValue(false);
  vi.mocked(window.extensionSystemIsExtensionsStarted).mockResolvedValue(false);

  // rendering the component
  render(Loader, { props: {} });

  // check we don't have yet received the 'extensions-already-started' event
  await vi.waitFor(() => expect(window.extensionSystemIsExtensionsStarted).toHaveBeenCalled());
  expect(window.dispatchEvent).not.toHaveBeenCalledWith(
    expect.objectContaining({ type: 'extensions-already-started' }),
  );

  // now, flag remote extensions being ready
  vi.mocked(window.extensionSystemIsExtensionsStarted).mockResolvedValue(true);

  // check that we have received the 'extensions-already-started' event
  await vi.waitFor(() =>
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'extensions-already-started' })),
  );
});

test('Loader should send extensions-already-started event as soon as possible if already done remotely', async () => {
  // flag extension system being alreay initialized (for example user hit the reload button)
  vi.mocked(window.extensionSystemIsReady).mockResolvedValue(false);
  vi.mocked(window.extensionSystemIsExtensionsStarted).mockResolvedValue(true);

  // rendering the component
  render(Loader, { props: {} });

  // check that we have received the 'extensions-already-started' event
  await vi.waitFor(() =>
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'extensions-already-started' })),
  );
});
