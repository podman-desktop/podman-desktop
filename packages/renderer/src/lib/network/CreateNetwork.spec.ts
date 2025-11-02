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
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

// Helper to create a provider connection
function createProviderConnection(
  overrides?: Partial<ProviderContainerConnectionInfo>,
): ProviderContainerConnectionInfo {
  return {
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
  expect(screen.getByText('Labels (key=value):')).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Subnet' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'IP range' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Gateway' })).toBeInTheDocument();
  expect(screen.getByLabelText('IPv6 (Dual Stack)')).toBeInTheDocument();
  expect(screen.getByLabelText('Internal')).toBeInTheDocument();
  expect(screen.getByLabelText('Driver')).toBeInTheDocument();
  expect(screen.getByText('Advanced Options (driver-specific):')).toBeInTheDocument();
});

test('Expect createNetwork to be called with correct parameters', async () => {
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123' });
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

  const engineDropdown = screen.getByLabelText('Container engine');
  expect(engineDropdown).toBeInTheDocument();
});

test('Expect empty screen when no providers available', async () => {
  providerInfos.set([]);

  render(CreateNetwork, {});

  const networkName = screen.queryByRole('textbox', { name: 'Name *' });
  expect(networkName).not.toBeInTheDocument();
});

test('Expect network creation with labels and options', async () => {
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123' });
  renderCreate();

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'full-network');

  const labelInput = screen.getByPlaceholderText('e.g., env=prod or app=backend');
  await userEvent.type(labelInput, 'env=production');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      Name: 'full-network',
      Labels: { env: 'production' },
    }),
  );
});

// IPv6 toggle tests
test('Expect IPv6 toggle ON to accept both IPv4 and IPv6', async () => {
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123' });
  renderCreate();

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'dual-stack-network');

  const ipv6Toggle = screen.getByLabelText('IPv6 (Dual Stack)');
  await userEvent.click(ipv6Toggle);

  const subnet = screen.getByRole('textbox', { name: 'Subnet' });
  await userEvent.type(subnet, '2001:db8::/32');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalled();
});

// ipvlan auto-population test
test('Expect ipvlan driver to auto-populate default subnet', async () => {
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123' });
  renderCreate();

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'ipvlan-network');

  const driverLabel = screen.getByText('Driver');
  const driverButton = driverLabel.parentElement?.querySelector('button');
  expect(driverButton).toBeInTheDocument();
  await userEvent.click(driverButton!);

  const ipvlanOption = screen.getByText('ipvlan');
  await userEvent.click(ipvlanOption);

  const subnetInput = screen.getByRole('textbox', { name: 'Subnet' });
  const gatewayInput = screen.getByRole('textbox', { name: 'Gateway' });

  expect(subnetInput).toHaveValue('192.168.210.0/24');
  expect(gatewayInput).toHaveValue('192.168.210.1');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      Name: 'ipvlan-network',
      Driver: 'ipvlan',
    }),
  );
});

test('Expect ipvlan custom subnet to override default', async () => {
  vi.mocked(window.createNetwork).mockResolvedValue({ Id: 'network123' });
  renderCreate();

  const networkName = screen.getByRole('textbox', { name: 'Name *' });
  await userEvent.type(networkName, 'ipvlan-custom');

  const driverLabel = screen.getByText('Driver');
  const driverButton = driverLabel.parentElement?.querySelector('button');
  await userEvent.click(driverButton!);

  const ipvlanOption = screen.getByText('ipvlan');
  await userEvent.click(ipvlanOption);

  const subnet = screen.getByRole('textbox', { name: 'Subnet' });
  await userEvent.clear(subnet);
  await userEvent.type(subnet, '192.5.0.0/16');

  const createButton = screen.getByRole('button', { name: 'Create' });
  await userEvent.click(createButton);

  expect(window.createNetwork).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      IPAM: expect.objectContaining({
        Config: expect.arrayContaining([
          expect.objectContaining({
            Subnet: '192.5.0.0/16',
          }),
        ]),
      }),
    }),
  );
});
