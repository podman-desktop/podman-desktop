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

import type { ProviderStatus } from '@podman-desktop/api';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import CreateNetwork from '/@/lib/network/CreateNetwork.svelte';
import { networksListInfo } from '/@/stores/networks';
import { providerInfos } from '/@/stores/providers';
import type { NetworkInspectInfo } from '/@api/network-info';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

const mockRouter = await import('tinro');

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();

  // Reset stores
  networksListInfo.set([]);
});

// Helper to create a provider connection
function createProviderConnection(
  overrides?: Partial<ProviderContainerConnectionInfo>,
): ProviderContainerConnectionInfo {
  return {
    connectionType: 'container',
    name: 'test',
    displayName: 'test',
    status: 'started',
    endpoint: {
      socketPath: '',
    },
    type: 'podman',
    ...overrides,
  };
}

// Helper to render the CreateNetwork component with optional provider setup
function renderCreate(connections?: ProviderContainerConnectionInfo[]): ReturnType<typeof render> {
  const defaultConnection = createProviderConnection();
  const pStatus: ProviderStatus = 'started';
  const providerInfo = {
    id: 'test',
    internalId: 'id',
    name: '',
    containerConnections: connections ?? [defaultConnection],
    kubernetesConnections: undefined,
    status: pStatus,
    containerProviderConnectionCreation: false,
    containerProviderConnectionInitialization: false,
    kubernetesProviderConnectionCreation: false,
    kubernetesProviderConnectionInitialization: false,
    links: undefined,
    detectionChecks: undefined,
    warnings: undefined,
    images: undefined,
    installationSupport: undefined,
  } as unknown as ProviderInfo;
  providerInfos.set([providerInfo]);
  return render(CreateNetwork, {});
}

test('Expect Create button is disabled when name is empty', async () => {
  renderCreate();

  const createButton = screen.getByRole('button', { name: 'Create' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeDisabled();
});

test('Expect all form fields to be present', async () => {
  renderCreate();

  expect(screen.getByRole('textbox', { name: 'Name *' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Subnet' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
});

test('Expect createNetwork to be called with correct parameters', async () => {
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123', engineId: 'engine1' });
  renderCreate();

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'my-test-network');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      Name: 'my-test-network',
    }),
  );
});

test('Expect error message to be displayed when network creation fails', async () => {
  const errorMessage = 'Failed to create network: network already exists';
  vi.mocked(window.createNetwork).mockRejectedValue(new Error(errorMessage));
  renderCreate();

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'existing-network');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  const error = await screen.findByText(`Error: ${errorMessage}`);
  expect(error).toBeInTheDocument();
});

test('Expect container engine dropdown to appear when multiple providers', async () => {
  const podman = createProviderConnection({
    name: 'podman',
    displayName: 'Podman',
    endpoint: { socketPath: '/run/podman/podman.sock' },
    type: 'podman',
  });
  const docker = createProviderConnection({
    name: 'docker',
    displayName: 'Docker',
    endpoint: { socketPath: '/var/run/docker.sock' },
    type: 'docker',
  });

  renderCreate([podman, docker]);

  const engineDropdown = screen.getByLabelText(/Container engine/);
  expect(engineDropdown).toBeInTheDocument();
});

test('Expect empty screen when no providers available', async () => {
  providerInfos.set([]);

  render(CreateNetwork, {});

  const networkName = screen.queryByRole('textbox', { name: 'Name *' });
  expect(networkName).not.toBeInTheDocument();
});

test('Expect createNetwork to be called with subnet when provided', async () => {
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123', engineId: 'engine1' });
  renderCreate();

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'my-test-network');

  const subnet = screen.getByRole('textbox', { name: 'Subnet' });
  await userEvent.type(subnet, '10.89.0.0/24');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      Name: 'my-test-network',
      IPAM: expect.objectContaining({
        Driver: 'default',
        Config: expect.arrayContaining([
          expect.objectContaining({
            Subnet: '10.89.0.0/24',
          }),
        ]),
      }),
    }),
  );
});

test('Expect cancel button to navigate to networks page', async () => {
  renderCreate();

  const cancelButton = screen.getByRole('button', { name: 'Cancel' });
  await userEvent.click(cancelButton);

  expect(mockRouter.router.goto).toHaveBeenCalledWith('/networks');
});

test('Expect automatic routing to network details after successful network creation', async () => {
  const networkId = 'network123';
  const engineId = 'engine1';
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: networkId, engineId });

  renderCreate();

  const networkNameInput = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkNameInput, 'my-test-network');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  // Simulate network appearing in store after creation with both matching ID and Name
  setTimeout(() => {
    networksListInfo.set([{ Id: networkId, Name: 'my-test-network', engineId } as NetworkInspectInfo]);
  }, 100);

  await waitFor(
    () => {
      // Should route to the network details page
      expect(mockRouter.router.goto).toHaveBeenCalledWith(`/networks/my-test-network/${engineId}/summary`);
    },
    { timeout: 3000 },
  );
});
