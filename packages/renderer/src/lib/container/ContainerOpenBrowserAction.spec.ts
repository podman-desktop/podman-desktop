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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { ContainerGroupInfoTypeUI, type ContainerInfoUI } from './ContainerInfoUI';
import ContainerOpenBrowserAction from './ContainerOpenBrowserAction.svelte';

function createContainer(overrides: Partial<ContainerInfoUI> = {}): ContainerInfoUI {
  return {
    id: 'container-id',
    shortId: 'container-id',
    name: 'my-container',
    image: 'my-image',
    shortImage: 'my-image',
    engineId: 'container-engine-id',
    engineName: 'Podman',
    engineType: 'podman',
    state: 'RUNNING',
    uptime: '',
    startedAt: '',
    ports: [],
    portsAsString: '',
    displayPort: '',
    hasPublicPort: true,
    openingUrl: 'http://localhost:8080',
    groupInfo: {
      name: 'my-container',
      type: ContainerGroupInfoTypeUI.STANDALONE,
      id: 'container-id',
      engineId: 'container-engine-id',
      engineName: 'Podman',
      engineType: 'podman',
    },
    selected: false,
    created: 0,
    labels: {},
    imageBase64RepoTag: '',
    imageId: 'image-id',
    names: ['/my-container'],
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
});

test('Expect Open Browser to open openingUrl', async () => {
  render(ContainerOpenBrowserAction, { container: createContainer(), dropdownMenu: false, detailed: false });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
});

test('Expect Open Browser to open openingUrl in the kebab menu', async () => {
  render(ContainerOpenBrowserAction, { container: createContainer(), dropdownMenu: true, detailed: false });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
});

test('Expect Open Browser to be disabled without published port', async () => {
  render(ContainerOpenBrowserAction, {
    container: createContainer({ hasPublicPort: false, openingUrl: undefined }),
    dropdownMenu: false,
    detailed: false,
  });

  const button = screen.getByRole('button', { name: 'Open Browser' });
  expect(button).toBeDisabled();

  await fireEvent.click(button);

  expect(window.openExternal).not.toHaveBeenCalled();
});

test('Expect Open Browser to be disabled when the container is not running', async () => {
  render(ContainerOpenBrowserAction, {
    container: createContainer({ state: 'STOPPED' }),
    dropdownMenu: false,
    detailed: true,
  });

  const button = screen.getByRole('button', { name: 'Open Browser' });
  expect(button).toBeDisabled();

  await fireEvent.click(button);

  expect(window.openExternal).not.toHaveBeenCalled();
});

test('Expect no Open Browser item in the kebab menu when the container is not running', async () => {
  render(ContainerOpenBrowserAction, {
    container: createContainer({ state: 'STOPPED' }),
    dropdownMenu: true,
    detailed: false,
  });

  expect(screen.queryByRole('button', { name: 'Open Browser' })).not.toBeInTheDocument();
});
