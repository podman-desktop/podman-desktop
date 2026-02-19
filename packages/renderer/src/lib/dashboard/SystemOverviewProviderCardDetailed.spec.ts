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

import type { ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import SystemOverviewProviderCardDetailed from './SystemOverviewProviderCardDetailed.svelte';

vi.mock(import('/@/lib/dashboard/SystemOverviewResourceUsage.svelte'));
vi.mock(import('/@/lib/dashboard/StatusDotGlow.svelte'));
vi.mock(import('/@/lib/dashboard/SystemOverviewProviderCardMinimal.svelte'));

const baseProvider: ProviderInfo = {
  internalId: 'podman-internal',
  id: 'podman',
  extensionId: 'podman',
  name: 'Podman',
  containerConnections: [],
  kubernetesConnections: [],
  vmConnections: [],
  status: 'configured',
  containerProviderConnectionCreation: false,
  containerProviderConnectionInitialization: false,
  kubernetesProviderConnectionCreation: false,
  kubernetesProviderConnectionInitialization: false,
  vmProviderConnectionCreation: false,
  vmProviderConnectionInitialization: false,
  links: [],
  detectionChecks: [],
  warnings: [],
  images: {},
  installationSupport: false,
  cleanupSupport: false,
};

const containerConnection: ProviderContainerConnectionInfo = {
  connectionType: 'container',
  name: 'podman-machine',
  displayName: 'Podman Machine',
  status: 'started',
  endpoint: { socketPath: '/run/podman/podman.sock' },
  type: 'podman',
};

beforeEach(() => {
  vi.resetAllMocks();
});

test('should render connection display name', async () => {
  const provider = { ...baseProvider, containerConnections: [containerConnection] };
  render(SystemOverviewProviderCardDetailed, {
    connection: containerConnection,
    provider,
    childConnections: [],
  });

  await vi.waitFor(() => expect(screen.getByText('Podman Machine')).toBeInTheDocument());
});

test('should render View button when connection is started', async () => {
  const provider = { ...baseProvider, containerConnections: [containerConnection] };
  render(SystemOverviewProviderCardDetailed, {
    connection: containerConnection,
    provider,
    childConnections: [],
  });

  await vi.waitFor(() => expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument());
});

test('should render Start button when connection is stopped', async () => {
  const stoppedConnection = { ...containerConnection, status: 'stopped' as const };
  const provider = { ...baseProvider, containerConnections: [stoppedConnection] };
  render(SystemOverviewProviderCardDetailed, {
    connection: stoppedConnection,
    provider,
    childConnections: [],
  });

  await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Start Podman' })).toBeInTheDocument());
});
