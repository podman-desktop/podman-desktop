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

import '@testing-library/jest-dom/vitest';

import type { ColorInfo } from '@desktop-framework/api';
import { render, screen } from '@testing-library/svelte';
/* eslint-disable import/no-duplicates */
import { tick } from 'svelte';
import { get } from 'svelte/store';
/* eslint-enable import/no-duplicates */
import { router } from 'tinro';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import Loader from './Loader.svelte';
import { lastPage } from './stores/breadcrumb';
import { colorsInfos } from './stores/colors';

// first, patch window object
const callbacks = new Map<string, any>();
const eventEmitter = {
  receive: (message: string, callback: any): void => {
    callbacks.set(message, callback);
  },
};

const dispatchEventMock = vi.fn();
const extensionSystemIsReadyMock = vi.fn();
const extensionSystemIsExtensionsStartedMock = vi.fn();

// mock the router
vi.mock(import('tinro'));

// no need to render the whole application
vi.mock(import('./App.svelte'));

Object.defineProperty(global, 'window', {
  value: {
    events: {
      receive: eventEmitter.receive,
    },
    dispatchEvent: dispatchEventMock,
    extensionSystemIsReady: extensionSystemIsReadyMock,
    extensionSystemIsExtensionsStarted: extensionSystemIsExtensionsStartedMock,
    addEventListener: eventEmitter.receive,
  },
  writable: true,
});

beforeAll(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
});

const color: ColorInfo = {
  id: 'color',
  cssVar: '--pd-color',
  value: '#ffffff',
};

beforeEach(() => {
  vi.clearAllMocks();
  extensionSystemIsReadyMock.mockResolvedValue(false);
  colorsInfos.set([]);
});

test('Loader should redirect to the installation page when receiving the event', async () => {
  const dummyExtensionId = 'my.customExtensionId';

  // rendering the component
  render(Loader, { props: {} });
  // let the initial system ready check settle before simulating the events
  await tick();

  // send the install-extension:from-id event
  const callbackInstallExtension = callbacks.get('install-extension:from-id');
  // send 'install-extension:from-id' event
  expect(callbackInstallExtension).toBeDefined();
  await callbackInstallExtension(dummyExtensionId);

  // check that we didn't redirect to the installation page as system is not yet ready
  expect(router.goto).not.toHaveBeenCalled();

  // flag the system as ready, colors are still loading: the redirect must still be deferred
  callbacks.get('starting-extensions')('true');
  await tick();
  expect(router.goto).not.toHaveBeenCalled();

  // now colors are loaded: the deferred redirect happens
  colorsInfos.set([color]);
  await tick();
  await tick();

  // check that we have been redirected
  expect(router.goto).toHaveBeenCalledWith(`/extensions/details/${dummyExtensionId}`);

  // check that breadcrumb is correct
  expect(get(lastPage)).toStrictEqual({
    name: 'Extensions',
    path: '/extensions',
  });
});

test('Loader should show the splash screen until the system is ready and colors are loaded', async () => {
  // rendering the component
  render(Loader, { props: {} });
  await tick();

  // system is not ready yet
  expect(screen.getByText('Initializing...')).toBeInTheDocument();

  // system is ready but colors are still loading: keep the splash screen
  callbacks.get('starting-extensions')('true');
  await tick();
  expect(screen.getByText('Initializing...')).toBeInTheDocument();

  // colors are loaded: the application can be displayed
  colorsInfos.set([color]);
  await tick();
  expect(screen.queryByText('Initializing...')).not.toBeInTheDocument();
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
