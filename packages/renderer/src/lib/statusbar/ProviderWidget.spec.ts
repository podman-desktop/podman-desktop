/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import type { ProviderStatus } from '@podman-desktop/api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import type {
  ProviderContainerConnectionInfo,
  ProviderInfo,
  ProviderKubernetesConnectionInfo,
} from '/@api/provider-info';

import ProviderWidget from './ProviderWidget.svelte';

// mock the router
vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

const providerMock = {
  name: 'provider1',
  containerConnections: [],
  kubernetesConnections: [],
  status: 'ready' as ProviderStatus,
  images: {},
} as unknown as ProviderInfo;

beforeEach(() => {
  vi.resetAllMocks();
});

test('Check basic styling', async () => {
  render(ProviderWidget, { entry: providerMock });

  const widget = screen.getByRole('button', { name: 'provider1' });
  expect(widget).toBeInTheDocument();
  expect(widget).toHaveClass('items-center');
  expect(widget).toHaveClass('hover:bg-[var(--pd-statusbar-hover-bg)]');
  expect(widget).toHaveClass('hover:cursor-pointer');
  expect(widget).toHaveClass('relative');
  expect(widget.ariaLabel).toEqual(providerMock.name);
});

test('Provider widget takes user to /preferences/resources on click by default', async () => {
  render(ProviderWidget, { entry: providerMock });

  const widget = screen.getByRole('button', { name: 'provider1' });
  expect(widget).toBeInTheDocument();

  await userEvent.click(widget);
  expect(router.goto).toBeCalledWith('/preferences/resources');
});

test('Expect the prop command to be used when it is passed with the entry', async () => {
  render(ProviderWidget, {
    entry: providerMock,
    command: () => {
      router.goto('/some/page');
    },
  });

  const widget = screen.getByRole('button', { name: 'provider1' });
  expect(widget).toBeInTheDocument();

  await userEvent.click(widget);
  expect(router.goto).toBeCalledWith('/some/page');
});

test('Expect tooltip to include container provider connections', () => {
  providerMock.containerConnections = [
    { name: 'connection 1', status: 'ready' } as unknown as ProviderContainerConnectionInfo,
    { name: 'connection 2', status: 'ready' } as unknown as ProviderContainerConnectionInfo,
    { name: 'connection 3', status: 'stopped' } as unknown as ProviderContainerConnectionInfo,
  ];
  render(ProviderWidget, { entry: providerMock });

  expect(screen.getAllByText('Running').length).toBe(2);
  expect(screen.getAllByText('Off').length).toBe(1);

  expect(screen.getByText(': connection 1')).toBeInTheDocument();
  expect(screen.getByText(': connection 2')).toBeInTheDocument();
  expect(screen.getByText(': connection 3')).toBeInTheDocument();
});

test('Expect tooltip to include Kubernetes provider connections', () => {
  providerMock.kubernetesConnections = [
    { name: 'connection 1', status: 'ready' } as unknown as ProviderKubernetesConnectionInfo,
    { name: 'connection 2', status: 'ready' } as unknown as ProviderKubernetesConnectionInfo,
    { name: 'connection 3', status: 'stopped' } as unknown as ProviderKubernetesConnectionInfo,
  ];
  render(ProviderWidget, { entry: providerMock });

  expect(screen.getAllByText('Running').length).toBe(2);
  expect(screen.getAllByText('Off').length).toBe(1);

  expect(screen.getByText(': connection 1')).toBeInTheDocument();
  expect(screen.getByText(': connection 2')).toBeInTheDocument();
  expect(screen.getByText(': connection 3')).toBeInTheDocument();
});

test('class props should be propagated to button', async () => {
  const { getByRole } = render(ProviderWidget, {
    entry: providerMock,
    class: 'potatoes',
  });

  const widget = getByRole('button', { name: 'provider1' });
  expect(widget).toHaveClass('potatoes');
});
