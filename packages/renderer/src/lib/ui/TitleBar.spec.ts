/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import TitleBar from './TitleBar.svelte';

const getOsPlatformMock = vi.fn();
const isExperimentalConfigurationEnabledMock = vi.fn();
const eventHandlers = new Map<string, (value: unknown) => void>();

beforeAll(() => {
  Object.defineProperty(window, 'getOsPlatform', { value: getOsPlatformMock });
  Object.defineProperty(window, 'isExperimentalConfigurationEnabled', {
    value: isExperimentalConfigurationEnabledMock,
  });
  Object.defineProperty(window, 'events', {
    value: {
      receive: (channel: string, func: (value: unknown) => void): void => {
        eventHandlers.set(channel, func);
      },
    },
  });
});

beforeEach(() => {
  vi.resetAllMocks();
  eventHandlers.clear();
});

function triggerEvent(channel: string, value: unknown): void {
  const handler = eventHandlers.get(channel);
  if (handler) {
    handler(value);
  }
}

async function waitRender(customProperties: object): Promise<void> {
  render(TitleBar, { ...customProperties });
  await tick();
}

describe('macOS', () => {
  beforeEach(() => {
    getOsPlatformMock.mockReturnValue('darwin');
  });

  test('Check no control buttons as it is provided by the system', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    const minimizeButton = screen.queryByRole('button', { name: 'Minimize' });
    expect(minimizeButton).not.toBeInTheDocument();

    const maximizeButton = screen.queryByRole('button', { name: 'Maximize' });
    expect(maximizeButton).not.toBeInTheDocument();

    const closeButton = screen.queryByRole('button', { name: 'Close' });
    expect(closeButton).not.toBeInTheDocument();
  });

  test('Expect no title (never shows on macOS)', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    const title = screen.queryByText('Podman Desktop');
    expect(title).not.toBeInTheDocument();
  });

  test('Expect search when experimental config enabled', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(true);
    await waitRender({});

    await vi.waitFor(() => {
      const searchButton = screen.queryByText('Search');
      expect(searchButton).toBeInTheDocument();
    });
  });

  test('Expect no search when experimental config disabled', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    const searchButton = screen.queryByText('Search');
    expect(searchButton).not.toBeInTheDocument();
  });

  test('Expect search when enabled via event', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    // Wait for event handler registration
    await vi.waitFor(() => {
      expect(eventHandlers.get('search-bar-enabled')).toBeTruthy();
    });

    triggerEvent('search-bar-enabled', true);
    await tick();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).toBeInTheDocument();
  });

  test('Expect no search when disabled via event', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(true);
    await waitRender({});

    // Wait for event handler registration
    await vi.waitFor(() => {
      expect(eventHandlers.get('search-bar-enabled')).toBeTruthy();
    });

    triggerEvent('search-bar-enabled', false);
    await tick();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).not.toBeInTheDocument();
  });
});

describe('linux', () => {
  beforeEach(() => {
    getOsPlatformMock.mockReturnValue('linux');
  });

  test('Check control buttons are defined', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    const minimizeButton = screen.getByRole('button', { name: 'Minimize' });
    expect(minimizeButton).toBeInTheDocument();

    const maximizeButton = screen.queryByRole('button', { name: 'Maximize' });
    expect(maximizeButton).toBeInTheDocument();

    const closeButton = screen.queryByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
  });

  test('Expect title when experimental config disabled', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    const title = screen.queryByText('Podman Desktop');
    expect(title).toBeInTheDocument();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).not.toBeInTheDocument();
  });

  test('Expect search when experimental config enabled', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(true);
    await waitRender({});

    await vi.waitFor(() => {
      const searchButton = screen.queryByText('Search');
      expect(searchButton).toBeInTheDocument();
    });

    const title = screen.queryByText('Podman Desktop');
    expect(title).not.toBeInTheDocument();
  });

  test('Expect title when search disabled via event', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(true);
    await waitRender({});

    await vi.waitFor(() => {
      expect(eventHandlers.get('search-bar-enabled')).toBeTruthy();
    });

    triggerEvent('search-bar-enabled', false);
    await tick();

    const title = screen.queryByText('Podman Desktop');
    expect(title).toBeInTheDocument();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).not.toBeInTheDocument();
  });

  test('Expect search when enabled via event', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    await vi.waitFor(() => {
      expect(eventHandlers.get('search-bar-enabled')).toBeTruthy();
    });

    triggerEvent('search-bar-enabled', true);
    await tick();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).toBeInTheDocument();

    const title = screen.queryByText('Podman Desktop');
    expect(title).not.toBeInTheDocument();
  });
});

describe('Windows', () => {
  beforeEach(() => {
    getOsPlatformMock.mockReturnValue('win32');
  });

  test('Check control buttons are defined', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    const minimizeButton = screen.getByRole('button', { name: 'Minimize' });
    expect(minimizeButton).toBeInTheDocument();

    const maximizeButton = screen.queryByRole('button', { name: 'Maximize' });
    expect(maximizeButton).toBeInTheDocument();

    const closeButton = screen.queryByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
  });

  test('Expect title when experimental config disabled', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    const title = screen.queryByText('Podman Desktop');
    expect(title).toBeInTheDocument();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).not.toBeInTheDocument();
  });

  test('Expect title and search when experimental config enabled', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(true);
    await waitRender({});

    await vi.waitFor(() => {
      const searchButton = screen.queryByText('Search');
      expect(searchButton).toBeInTheDocument();
    });

    // On Windows, title is always shown
    const title = screen.queryByText('Podman Desktop');
    expect(title).toBeInTheDocument();
  });

  test('Expect title when search disabled via event', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(true);
    await waitRender({});

    await vi.waitFor(() => {
      expect(eventHandlers.get('search-bar-enabled')).toBeTruthy();
    });

    triggerEvent('search-bar-enabled', false);
    await tick();

    const title = screen.queryByText('Podman Desktop');
    expect(title).toBeInTheDocument();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).not.toBeInTheDocument();
  });

  test('Expect title and search when enabled via event', async () => {
    isExperimentalConfigurationEnabledMock.mockResolvedValue(false);
    await waitRender({});

    await vi.waitFor(() => {
      expect(eventHandlers.get('search-bar-enabled')).toBeTruthy();
    });

    triggerEvent('search-bar-enabled', true);
    await tick();

    const searchButton = screen.queryByText('Search');
    expect(searchButton).toBeInTheDocument();

    // On Windows, title is always shown
    const title = screen.queryByText('Podman Desktop');
    expect(title).toBeInTheDocument();
  });
});
