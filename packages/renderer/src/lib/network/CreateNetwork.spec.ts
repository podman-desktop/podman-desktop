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
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import CreateNetwork from '/@/lib/network/CreateNetwork.svelte';
import { providerInfos } from '/@/stores/providers';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

beforeEach(() => {
  vi.clearAllMocks();
});

// the create network page expects to have a valid provider connection, so let's mock one
function setup(): void {
  const pStatus: ProviderStatus = 'started';
  const pInfo: ProviderContainerConnectionInfo = {
    name: 'test',
    displayName: 'test',
    status: 'started',
    endpoint: {
      socketPath: '',
    },
    type: 'podman',
  };
  const providerInfo = {
    id: 'test',
    internalId: 'id',
    name: '',
    containerConnections: [pInfo],
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
}

test('Expect Create button is disabled when name is empty', async () => {
  setup();
  render(CreateNetwork, {});

  const createButton = screen.getByRole('button', { name: 'Create' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeDisabled();
});

test('Expect all form fields to be present', async () => {
  setup();
  render(CreateNetwork, {});

  // Required field
  expect(screen.getByRole('textbox', { name: 'Name *' })).toBeInTheDocument();

  // Optional fields
  expect(screen.getByRole('textbox', { name: 'Label' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Subnet' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'IP range' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Gateway' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Advanced Options' })).toBeInTheDocument();

  // Driver dropdown
  expect(screen.getByLabelText('Driver')).toBeInTheDocument();
});

test('Expect createNetwork to be called with correct parameters', async () => {
  setup();
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123' });

  render(CreateNetwork, {});

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'my-test-network');

  const subnet = screen.getByRole('textbox', { name: 'Subnet' });
  await userEvent.type(subnet, '10.89.0.0/24');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalledWith(
    expect.anything(), // provider
    expect.objectContaining({
      Name: 'my-test-network',
      IPAM: expect.objectContaining({
        Config: expect.arrayContaining([
          expect.objectContaining({
            Subnet: '10.89.0.0/24',
          }),
        ]),
      }),
    }),
  );
});

test('Expect error message to be displayed when network creation fails', async () => {
  setup();
  const errorMessage = 'Failed to create network: network already exists';
  vi.mocked(window.createNetwork).mockRejectedValue(new Error(errorMessage));

  render(CreateNetwork, {});

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'existing-network');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  // Wait for error to appear
  const error = await screen.findByText(`Error: Error: ${errorMessage}`);
  expect(error).toBeInTheDocument();
});

test('Expect error when network creation returns no ID', async () => {
  setup();
  // Mock a response without an ID
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: '' });

  render(CreateNetwork, {});

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'test-network');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  // Wait for error to appear
  const error = await screen.findByText(/Network creation failed: No network ID returned/);
  expect(error).toBeInTheDocument();
});

test('Expect container engine dropdown to appear when multiple providers', async () => {
  const pStatus: ProviderStatus = 'started';
  const pInfo1: ProviderContainerConnectionInfo = {
    name: 'podman',
    displayName: 'Podman',
    status: 'started',
    endpoint: { socketPath: '/run/podman/podman.sock' },
    type: 'podman',
  };
  const pInfo2: ProviderContainerConnectionInfo = {
    name: 'docker',
    displayName: 'Docker',
    status: 'started',
    endpoint: { socketPath: '/var/run/docker.sock' },
    type: 'docker',
  };
  const providerInfo = {
    id: 'test',
    internalId: 'id',
    name: '',
    containerConnections: [pInfo1, pInfo2],
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

  render(CreateNetwork, {});

  const engineDropdown = screen.getByLabelText('Container engine');
  expect(engineDropdown).toBeInTheDocument();
});

test('Expect no container engine dropdown when single provider', async () => {
  setup(); // sets up single provider

  render(CreateNetwork, {});

  const engineDropdown = screen.queryByLabelText('Container engine');
  expect(engineDropdown).not.toBeInTheDocument();
});

test('Expect empty screen when no providers available', async () => {
  providerInfos.set([]);

  render(CreateNetwork, {});

  // Form fields should not be visible
  const networkName = screen.queryByRole('textbox', { name: 'Name *' });
  expect(networkName).not.toBeInTheDocument();
});

test('Expect all optional fields to be included in network creation', async () => {
  setup();
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123' });

  render(CreateNetwork, {});

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'full-network');

  const label = screen.getByRole('textbox', { name: 'Label' });
  await userEvent.type(label, 'test-label');

  const subnet = screen.getByRole('textbox', { name: 'Subnet' });
  await userEvent.type(subnet, '10.89.0.0/24');

  const ipRange = screen.getByRole('textbox', { name: 'IP range' });
  await userEvent.type(ipRange, '10.89.0.0/25');

  const gateway = screen.getByRole('textbox', { name: 'Gateway' });
  await userEvent.type(gateway, '10.89.0.1');

  const ipv6Toggle = screen.getByLabelText('IPv6');
  await userEvent.click(ipv6Toggle);

  const internalToggle = screen.getByLabelText('Internal');
  await userEvent.click(internalToggle);

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      Name: 'full-network',
      Labels: { label: 'test-label' },
      EnableIPv6: true,
      Internal: true,
      IPAM: expect.objectContaining({
        Config: expect.arrayContaining([
          expect.objectContaining({
            Subnet: '10.89.0.0/24',
            IPRange: '10.89.0.0/25',
            Gateway: '10.89.0.1',
          }),
        ]),
      }),
    }),
  );
});
