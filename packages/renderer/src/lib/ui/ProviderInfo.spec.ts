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

import type { ProviderInfo as ProviderInfoType } from '@podman-desktop/core-api';
import { render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import * as providers from '/@/stores/providers';

import ProviderInfo from './ProviderInfo.svelte';

vi.mock(import('/@/stores/providers'));

const PODMAN_PROVIDER = {
  id: 'podman',
  name: 'Podman',
  containerConnections: [
    {
      name: 'podman-machine-default',
      displayName: 'Podman Machine Default',
      status: 'started',
      type: 'podman',
      endpoint: { socketPath: '/var/run/podman-machine.sock' },
    },
  ],
} as unknown as ProviderInfoType;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(providers).providerInfos = writable([PODMAN_PROVIDER]);
});

test('Expect provider label and status icon for started connection', async () => {
  // `context` is a reserved testing-library option — nest component props under `props`
  render(ProviderInfo, {
    props: {
      provider: 'podman',
      context: 'podman.podman-machine-default',
    },
  });
  expect(screen.getByText('podman')).toBeInTheDocument();
  const icon = screen.getByTestId('status-dot-icon');
  expect(icon).toHaveAttribute('aria-label', 'Running');
  expect(icon.querySelector('path')).toHaveAttribute('fill', 'var(--pd-status-running)');
});

test('Expect capitalize label for Podman', async () => {
  render(ProviderInfo, {
    props: {
      provider: 'Podman',
      context: 'podman.podman-machine-default',
    },
  });
  expect(screen.getByText('Podman')).toBeInTheDocument();
  expect(screen.getByTestId('status-dot-icon')).toHaveAttribute('aria-label', 'Running');
});

test('Expect unknown status when connection cannot be resolved', async () => {
  render(ProviderInfo, {
    props: {
      provider: 'docker',
    },
  });
  expect(screen.getByText('docker')).toBeInTheDocument();
  const icon = screen.getByTestId('status-dot-icon');
  expect(icon).toHaveAttribute('aria-label', 'Unknown');
  expect(icon.querySelector('path')).toHaveAttribute('fill', 'var(--pd-status-unknown)');
});

test('Expect kubernetes label still renders', async () => {
  render(ProviderInfo, {
    props: {
      provider: 'Kubernetes',
      context: 'some-context',
    },
  });
  expect(screen.getByText('Kubernetes')).toBeInTheDocument();
  expect(screen.getByTestId('status-dot-icon')).toHaveAttribute('aria-label', 'Unknown');
});
