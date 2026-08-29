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
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import * as providers from '/@/stores/providers';

import ContainerConnectionItem from './ContainerConnectionItem.svelte';

vi.mock(import('/@/stores/providers'));

const RECORD: IConfigurationPropertyRecordedSchema = {
  id: 'kind.cluster.creation.containerConnection',
  title: 'Kind',
  parentId: 'kind',
  type: 'string',
  format: 'containerConnection',
  description: 'Container Connection',
};

function provider(
  id: string,
  type: 'podman' | 'docker' | 'unsupported',
  name: string,
  displayName: string,
  status: 'started' | 'stopped' = 'started',
): ProviderInfo {
  return {
    id,
    name: id,
    containerConnections: [
      {
        name,
        displayName,
        status,
        type,
        endpoint: { socketPath: `${name}.sock` },
      },
    ],
    kubernetesConnections: [],
    vmConnections: [],
  } as unknown as ProviderInfo;
}

function selection(providerId: string, connectionName: string): string {
  return JSON.stringify({ providerId, connectionName });
}

beforeEach(() => {
  vi.resetAllMocks();
});

test('selects the only running connection by default', async () => {
  vi.mocked(providers).providerInfos = writable([
    provider('podman', 'podman', 'podman-machine-default', 'Podman Machine'),
  ]);
  const onChange = vi.fn().mockResolvedValue(undefined);

  render(ContainerConnectionItem, { record: RECORD, onChange });

  const dropdown = screen.getByLabelText('Container Connection');
  expect(dropdown).toHaveTextContent('Podman Machine (Podman)');
  await vi.waitFor(() =>
    expect(onChange).toHaveBeenCalledWith(
      'kind.cluster.creation.containerConnection',
      selection('podman', 'podman-machine-default'),
    ),
  );
});

test('lists running connections and excludes stopped connections', async () => {
  vi.mocked(providers).providerInfos = writable([
    provider('podman', 'podman', 'running-podman', 'Running Podman'),
    provider('docker', 'docker', 'running-docker', 'Running Docker'),
    provider('stopped', 'podman', 'stopped-podman', 'Stopped Podman', 'stopped'),
    provider('unsupported', 'unsupported', 'running-unsupported', 'Running Unsupported'),
  ]);

  render(ContainerConnectionItem, { record: RECORD, onChange: vi.fn().mockResolvedValue(undefined) });
  await fireEvent.click(screen.getByRole('button'));

  expect(screen.getAllByRole('button', { name: 'Running Podman (Podman)' })).toHaveLength(2);
  expect(screen.getByRole('button', { name: 'Running Docker (Docker)' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Stopped Podman (Podman)' })).not.toBeInTheDocument();
  expect(screen.queryByText('Running Unsupported')).not.toBeInTheDocument();
});

test('duplicate display names select the connection from the chosen provider', async () => {
  vi.mocked(providers).providerInfos = writable([
    provider('podman', 'podman', 'shared-name', 'Local'),
    provider('docker', 'docker', 'shared-name', 'Local'),
  ]);
  const onChange = vi.fn().mockResolvedValue(undefined);

  render(ContainerConnectionItem, { record: RECORD, onChange });
  await fireEvent.click(screen.getByRole('button'));
  await fireEvent.click(screen.getByRole('button', { name: 'Local (Docker)' }));

  expect(onChange).toHaveBeenLastCalledWith(
    'kind.cluster.creation.containerConnection',
    selection('docker', 'shared-name'),
  );
});

test('keeps and revalidates a connection that disappears and recovers', async () => {
  const remoteProvider = provider('podman', 'podman', 'remote', 'Remote');
  const providerStore = writable([remoteProvider]);
  vi.mocked(providers).providerInfos = providerStore;
  const onChange = vi.fn().mockResolvedValue(undefined);

  render(ContainerConnectionItem, { record: RECORD, onChange });
  await vi.waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));

  providerStore.set([]);

  await vi.waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));
  expect(onChange).toHaveBeenLastCalledWith('kind.cluster.creation.containerConnection', selection('podman', 'remote'));
  expect(screen.getByLabelText('Container Connection')).toHaveTextContent('Selected connection is unavailable');

  providerStore.set([remoteProvider]);

  await vi.waitFor(() => expect(onChange).toHaveBeenCalledTimes(3));
  expect(onChange).toHaveBeenLastCalledWith('kind.cluster.creation.containerConnection', selection('podman', 'remote'));
  expect(screen.getByLabelText('Container Connection')).toHaveTextContent('Remote (Podman)');
});

test('disables the selector when no running connections are available', () => {
  vi.mocked(providers).providerInfos = writable([provider('podman', 'podman', 'stopped', 'Stopped', 'stopped')]);

  render(ContainerConnectionItem, { record: RECORD, onChange: vi.fn().mockResolvedValue(undefined) });

  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByLabelText('Container Connection')).toHaveTextContent('No running container connections');
});
