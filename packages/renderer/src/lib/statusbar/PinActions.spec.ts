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

import '@testing-library/jest-dom/vitest';

import { render, type RenderResult } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { Component, ComponentProps } from 'svelte';
import { get } from 'svelte/store';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import PinActions from '/@/lib/statusbar/PinActions.svelte';
import ProviderWidget from '/@/lib/statusbar/ProviderWidget.svelte';
import { providerInfos } from '/@/stores/providers';
import { statusBarPinned } from '/@/stores/statusbar-pinned';
import type { ProviderInfo } from '/@api/provider-info';
import { STATUS_BAR_PIN_CONSTANTS } from '/@api/status-bar/pin-constants';

vi.mock('/@/lib/statusbar/ProviderWidget.svelte');

const CONTAINER_CONNECTION_PROVIDER = {
  name: 'podman',
  id: 'podman',
  containerConnections: [{}],
  kubernetesConnections: [],
  status: 'ready',
  images: {},
} as unknown as ProviderInfo;

const KUBERNETES_CONNECTION_PROVIDER = {
  name: 'kind',
  id: 'kind',
  containerConnections: [],
  kubernetesConnections: [{}],
  status: 'ready',
  images: {},
} as unknown as ProviderInfo;

const RESIZE_OBSERVER_MOCK: ResizeObserver = {
  observe: vi.fn(),
  unobserve: vi.fn(),
} as unknown as ResizeObserver;

beforeAll(() => {
  Object.defineProperty(window, 'events', { value: { receive: vi.fn() } });
  Object.defineProperty(window, 'ResizeObserver', { value: vi.fn() });
});

beforeEach(() => {
  vi.resetAllMocks();

  // define two providers
  providerInfos.set([CONTAINER_CONNECTION_PROVIDER, KUBERNETES_CONNECTION_PROVIDER]);

  // pin podman
  statusBarPinned.set([
    {
      label: CONTAINER_CONNECTION_PROVIDER.name,
      value: CONTAINER_CONNECTION_PROVIDER.id,
      pinned: true,
    },
  ]);

  vi.mocked(window.ResizeObserver).mockReturnValue(RESIZE_OBSERVER_MOCK);

  vi.mocked(window.unpinStatusBar).mockResolvedValue(undefined);
  vi.mocked(window.pinStatusBar).mockResolvedValue(undefined);
});

function getListener(): () => void {
  expect(window.events.receive).toHaveBeenCalledOnce();
  const [channel, listener] = vi.mocked(window.events.receive).mock.calls[0];

  expect(channel).toStrictEqual(STATUS_BAR_PIN_CONSTANTS.TOGGLE_MENU);
  expect(listener).toBeInstanceOf(Function);

  return listener;
}

test('should register windows#events#receive', async () => {
  render(PinActions);

  const listener = getListener();
  expect(listener).toBeDefined();
});

/**
 * utility function to directly get the render result with the menu opened (default is hidden/closed)
 */
async function getOpenedPinActions(): Promise<RenderResult<Component<ComponentProps<typeof PinActions>>>> {
  const { getByTitle, ...result } = render(PinActions);

  // call toggle listener (will open the menu)
  const listener = getListener();
  listener();

  // wait for the menu to be open
  await vi.waitFor(() => {
    const element = getByTitle('Help Menu Items');
    expect(element).toBeInTheDocument();
  });

  return {
    getByTitle,
    ...result,
  };
}

test('opened menu should render provider based on pin options', async () => {
  // ensure we only have one item in the store
  expect(get(statusBarPinned)).toHaveLength(1);

  // render
  await getOpenedPinActions();

  // ensure we only rendered one item
  expect(ProviderWidget).toHaveBeenCalledOnce();
  expect(ProviderWidget).toHaveBeenCalledWith(expect.anything(), {
    class: expect.any(String),
    pinIcon: 'pin',
    entry: CONTAINER_CONNECTION_PROVIDER,
    command: expect.any(Function),
  });
});

test('escape should hide the menu', async () => {
  // render
  const { queryByTitle } = await getOpenedPinActions();

  await userEvent.keyboard('{Escape}');

  await vi.waitFor(() => {
    expect(queryByTitle('Help Menu Items')).toBeNull();
  });
});

describe('pin / unpin', () => {
  /**
   * Utility method to get the function provided as props#command to the {@link ProviderWidget}
   * @param providerId
   */
  function getProviderWidget(providerId: string): () => void {
    const call: [unknown, ComponentProps<typeof ProviderWidget>] | undefined = vi
      .mocked(ProviderWidget)
      .mock.calls.find(([_, { entry }]) => entry.id === providerId);
    // throw if we cannot found the specific call we are looking for
    if (!call) throw new Error(`cannot find ProviderWidget call for providerId ${providerId}`);
    // deconstruct the props
    const [, { command }] = call;

    // throw if command is undefined
    if (!command) throw new Error(`missing command props on ProviderWidget render for providerId ${providerId}`);
    return command;
  }

  beforeEach(() => {
    // pin podman
    statusBarPinned.set([
      {
        label: CONTAINER_CONNECTION_PROVIDER.name,
        value: CONTAINER_CONNECTION_PROVIDER.id,
        pinned: true, // podman pinned
      },
      {
        label: KUBERNETES_CONNECTION_PROVIDER.name,
        value: KUBERNETES_CONNECTION_PROVIDER.id,
        pinned: false, // kubernetes not pinned
      },
    ]);
  });

  test('expect pinned provider to have unpin command', async () => {
    // render
    await getOpenedPinActions();

    // get the command
    const command = getProviderWidget(CONTAINER_CONNECTION_PROVIDER.id);
    // call the command
    command();

    expect(window.unpinStatusBar).toHaveBeenCalledWith(CONTAINER_CONNECTION_PROVIDER.id);
  });

  test('expect unpinned provider to have pin command', async () => {
    // render
    await getOpenedPinActions();

    // get the command
    const command = getProviderWidget(KUBERNETES_CONNECTION_PROVIDER.id);
    // call the command
    command();

    expect(window.pinStatusBar).toHaveBeenCalledWith(KUBERNETES_CONNECTION_PROVIDER.id);
  });
});
