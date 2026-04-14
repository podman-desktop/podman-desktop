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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import NetworkDetailsSummary from './NetworkDetailsSummary.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

const network: NetworkInfoUI = {
  id: '123456789012345',
  shortId: '123456789012',
  name: 'Network 1',
  driver: 'bridge',
  created: '2025-10-15T10:30:00.000Z',
  engineId: 'podman1',
  engineName: 'Podman 1',
  engineType: 'podman',
  selected: false,
  status: 'UNUSED',
  ipv6_enabled: false,
  containers: [
    { id: 'container1', name: 'Container 1' },
    { id: 'container2', name: 'Container 2' },
  ],
};

vi.mock('tinro');

test('Expect all details to show up', () => {
  render(NetworkDetailsSummary, { network: network });

  expect(screen.getByText('Network 1')).toBeInTheDocument();
  expect(screen.getByText('123456789012345')).toBeInTheDocument();
  expect(screen.getByText('unused')).toBeInTheDocument();
  expect(screen.getByText('bridge')).toBeInTheDocument();
  expect(screen.getByText('false')).toBeInTheDocument();
  expect(screen.getByText('podman1')).toBeInTheDocument();
  expect(screen.getByText('Podman 1')).toBeInTheDocument();

  // network containers
  expect(screen.getByText('Container 1')).toBeInTheDocument();
  expect(screen.getByText('container1')).toBeInTheDocument();
  expect(screen.getByText('Container 2')).toBeInTheDocument();
  expect(screen.getByText('container2')).toBeInTheDocument();
});

test('Expect container name to route to container logs page', async () => {
  render(NetworkDetailsSummary, { network: network });

  const container1link = screen.getByText('Container 1');
  expect(container1link).toBeInTheDocument();

  const container2link = screen.getByText('Container 2');
  expect(container2link).toBeInTheDocument();

  await fireEvent.click(container1link);
  expect(router.goto).toHaveBeenCalledWith('/containers/container1/logs');

  await fireEvent.click(container2link);
  expect(router.goto).toHaveBeenCalledWith('/containers/container2/logs');
});
