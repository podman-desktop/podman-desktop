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

import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import SystemOverviewProviderCardMinimal from './SystemOverviewProviderCardMinimal.svelte';

vi.mock(import('/@/lib/dashboard/StatusDotGlow.svelte'));

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

const kubernetesConnection: ProviderConnectionInfo = {
  connectionType: 'kubernetes',
  name: 'minikube',
  status: 'started',
  endpoint: { apiURL: 'https://localhost:8443' },
};

beforeEach(() => {
  vi.resetAllMocks();
});

test('should render connection name', async () => {
  render(SystemOverviewProviderCardMinimal, {
    connection: kubernetesConnection,
    provider: baseProvider,
  });

  await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Navigate to minikube' })).toBeInTheDocument());
  await vi.waitFor(() => expect(screen.getByText('minikube')).toBeInTheDocument());
});

test('should have accessible label for navigation', async () => {
  render(SystemOverviewProviderCardMinimal, {
    connection: kubernetesConnection,
    provider: baseProvider,
  });

  const button = screen.getByRole('button', { name: 'Navigate to minikube' });
  await vi.waitFor(() => expect(button).toHaveAttribute('aria-label', 'Navigate to minikube'));
});
