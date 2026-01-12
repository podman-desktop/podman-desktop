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

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import type { NetworkInfoUI } from '/@/lib/network/NetworkInfoUI';

import NetworkColumnDriver from './NetworkColumnDriver.svelte';

const network: NetworkInfoUI = {
  engineId: 'engine1',
  engineName: 'Engine 1',
  engineType: 'podman',
  name: 'Network 1',
  id: '123456789012345',
  created: '',
  shortId: '',
  driver: 'bridge',
  selected: false,
  status: 'UNUSED',
  containers: [],
  ipv6_enabled: false,
};

test('Expect simple column styling', async () => {
  render(NetworkColumnDriver, { object: network });

  const text = screen.getByText(network.driver);
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('text-[var(--pd-table-body-text)]');
});
