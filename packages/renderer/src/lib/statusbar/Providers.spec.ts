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

import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import Providers from '/@/lib/statusbar/Providers.svelte';
import ProviderWidget from '/@/lib/statusbar/ProviderWidget.svelte';
import { providerInfos } from '/@/stores/providers';
import { statusBarPinned } from '/@/stores/statusbar-pinned';
import type { ProviderInfo } from '/@api/provider-info';

vi.mock('/@/lib/statusbar/ProviderWidget.svelte');

const CONTAINER_CONNECTION_PROVIDER = {
  name: 'provider1',
  containerConnections: [{}],
  kubernetesConnections: [],
  status: 'ready',
  images: {},
} as unknown as ProviderInfo;

const KUBERNETES_CONNECTION_PROVIDER = {
  name: 'provider2',
  containerConnections: [],
  kubernetesConnections: [{}],
  status: 'ready',
  images: {},
} as unknown as ProviderInfo;

beforeEach(() => {
  vi.resetAllMocks();
  providerInfos.set([CONTAINER_CONNECTION_PROVIDER, KUBERNETES_CONNECTION_PROVIDER]);
});

test('no pinned options should hide the pin icon', async () => {
  statusBarPinned.set([]);

  const { queryByRole } = render(Providers);

  const button = queryByRole('button', { name: 'Pin' });
  expect(button).toBeNull();
});

test('no pinned options should not render any provider widget', async () => {
  statusBarPinned.set([]);

  render(Providers);

  await tick();

  expect(ProviderWidget).not.toHaveBeenCalled();
});

test('pinned option should render corresponding provider widget', async () => {
  statusBarPinned.set([
    {
      label: CONTAINER_CONNECTION_PROVIDER.name,
      value: CONTAINER_CONNECTION_PROVIDER.id,
      pinned: true,
    },
  ]);

  render(Providers);

  await vi.waitFor(() => {
    expect(ProviderWidget).toHaveBeenCalledWith(expect.anything(), {
      entry: CONTAINER_CONNECTION_PROVIDER,
    });
  });
});
