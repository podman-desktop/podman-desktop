/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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
import { expect, test, vi } from 'vitest';

import { listenResourcePermitted } from '/@/lib/kube/resource-permission';

import ConfigMapSecretEmptyScreen from './ConfigMapSecretEmptyScreen.svelte';

vi.mock('../kube/resource-permission');

test('Expect configmap empty screen', async () => {
  vi.mocked(listenResourcePermitted).mockImplementation(vi.fn((_, callback) => callback(true)));
  render(ConfigMapSecretEmptyScreen);
  const noNodes = await vi.waitFor(() => screen.getByRole('heading', { name: 'No configmaps or secrets' }));
  expect(noNodes).toBeInTheDocument();
});

test('Expect configmap empty screen not accessible', async () => {
  vi.mocked(listenResourcePermitted).mockImplementation(vi.fn((_, callback) => callback(false)));
  render(ConfigMapSecretEmptyScreen);
  const noNodes = await vi.waitFor(() =>
    screen.getByRole('heading', { name: 'Configmaps and secrets not accessible' }),
  );
  expect(noNodes).toBeInTheDocument();
});
