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

import type { ProviderInfo } from '@podman-desktop/core-api';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import SystemOverviewProviderInstalled from './SystemOverviewProviderInstalled.svelte';

vi.mock(import('/@/lib/images/PodIcon.svelte'));

const baseProvider: ProviderInfo = {
  internalId: 'podman-internal',
  id: 'podman',
  extensionId: 'podman',
  name: 'Podman',
  containerConnections: [],
  kubernetesConnections: [],
  vmConnections: [],
  status: 'installed',
  containerProviderConnectionCreation: true,
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
  containerProviderConnectionCreationDisplayName: 'machine',
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.initializeProvider).mockResolvedValue([]);
});

test('should render provider name and message', async () => {
  render(SystemOverviewProviderInstalled, { provider: baseProvider });

  await vi.waitFor(() => expect(screen.getByText('Podman')).toBeInTheDocument());
  await vi.waitFor(() =>
    expect(
      screen.getByText('No container engine (machine) created yet. Create one to run containers and pods.'),
    ).toBeInTheDocument(),
  );
});

test('should render Create new machine button and call initializeProvider on click', async () => {
  render(SystemOverviewProviderInstalled, { provider: baseProvider });

  const button = screen.getByRole('button', { name: 'Create new machine' });
  await vi.waitFor(() => expect(button).toBeInTheDocument());
  await fireEvent.click(button);
  await vi.waitFor(() => expect(window.initializeProvider).toHaveBeenCalledWith('podman-internal'));
});
