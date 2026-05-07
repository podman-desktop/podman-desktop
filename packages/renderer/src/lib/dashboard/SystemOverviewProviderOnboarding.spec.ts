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
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import SystemOverviewProviderOnboarding from './SystemOverviewProviderOnboarding.svelte';

vi.mock(import('tinro'));
vi.mock(import('/@/lib/dashboard/SystemOverviewProviderCardCompact.svelte'));

const baseProvider: ProviderInfo = {
  internalId: 'podman-internal',
  id: 'podman',
  extensionId: 'podman-desktop.podman',
  name: 'Podman',
  containerConnections: [],
  kubernetesConnections: [],
  vmConnections: [],
  status: 'not-installed',
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

beforeEach(() => {
  vi.resetAllMocks();
});

describe('not-installed provider', () => {
  test('should render provider name and not-installed message', async () => {
    render(SystemOverviewProviderOnboarding, { provider: baseProvider });

    await vi.waitFor(() => expect(screen.getByText('Podman')).toBeInTheDocument());
    await vi.waitFor(() =>
      expect(
        screen.getByText('Podman needs to be set up. Some features might not function optimally.'),
      ).toBeInTheDocument(),
    );
  });

  test('should navigate to onboarding on Set up click', async () => {
    render(SystemOverviewProviderOnboarding, { provider: baseProvider });

    const button = screen.getByRole('button', { name: 'Set up Podman' });
    await fireEvent.click(button);
    await vi.waitFor(() =>
      expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/preferences/onboarding/podman-desktop.podman'),
    );
  });
});

describe('installed provider', () => {
  const installedProvider: ProviderInfo = {
    ...baseProvider,
    status: 'installed',
    extensionId: 'podman',
    containerProviderConnectionCreation: true,
  };

  test('should render provider name and installed message', async () => {
    render(SystemOverviewProviderOnboarding, { provider: installedProvider });

    await vi.waitFor(() => expect(screen.getByText('Podman')).toBeInTheDocument());
    await vi.waitFor(() =>
      expect(
        screen.getByText('No container engine (machine) created yet. Create one to run containers and pods.'),
      ).toBeInTheDocument(),
    );
  });

  test('should navigate to onboarding on Set up click', async () => {
    render(SystemOverviewProviderOnboarding, { provider: installedProvider });

    const button = screen.getByRole('button', { name: 'Set up Podman' });
    await fireEvent.click(button);
    await vi.waitFor(() => expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/preferences/onboarding/podman'));
  });
});
