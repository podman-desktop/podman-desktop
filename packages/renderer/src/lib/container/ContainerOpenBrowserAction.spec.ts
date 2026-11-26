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
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import type { ContainerInfoUI } from './ContainerInfoUI';
import ContainerOpenBrowserAction from './ContainerOpenBrowserAction.svelte';

function containerWithUrls(urls: string[], state = 'RUNNING'): ContainerInfoUI {
  return {
    id: 'container-id',
    engineId: 'container-engine-id',
    name: 'my-container',
    state,
    hasPublicPort: urls.length > 0,
    openingUrl: urls[0] ?? '',
  } as unknown as ContainerInfoUI;
}

beforeAll(() => {
  Object.defineProperty(window, 'openExternal', { value: vi.fn() });
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
});

test('Expect Open Browser to open the only published port directly', async () => {
  render(ContainerOpenBrowserAction, {
    container: containerWithUrls(['http://localhost:8080']),
    dropdownMenu: false,
    detailed: false,
  });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
});

test('Expect Open Browser to open the first published port in the kebab menu', async () => {
  render(ContainerOpenBrowserAction, {
    container: containerWithUrls(['http://localhost:8080', 'http://localhost:9090']),
    dropdownMenu: true,
    detailed: false,
  });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
});

test('Expect Open Browser to be disabled without published port', async () => {
  render(ContainerOpenBrowserAction, { container: containerWithUrls([]), dropdownMenu: false, detailed: false });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).not.toHaveBeenCalled();
});

test('Expect Open Browser to be disabled when the container is not running', async () => {
  render(ContainerOpenBrowserAction, {
    container: containerWithUrls(['http://localhost:8080'], 'STOPPED'),
    dropdownMenu: false,
    detailed: true,
  });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).not.toHaveBeenCalled();
});

test('Expect no Open Browser item in the kebab menu when the container is not running', async () => {
  render(ContainerOpenBrowserAction, {
    container: containerWithUrls(['http://localhost:8080'], 'STOPPED'),
    dropdownMenu: true,
    detailed: false,
  });

  expect(screen.queryByRole('button', { name: 'Open Browser' })).not.toBeInTheDocument();
});
