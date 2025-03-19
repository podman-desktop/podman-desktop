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
import { beforeEach, expect, test, vi } from 'vitest';

import Providers from '/@/lib/statusbar/Providers.svelte';
import ProviderWidget from '/@/lib/statusbar/ProviderWidget.svelte';
import { providerInfos } from '/@/stores/providers';
import type {
  ProviderContainerConnectionInfo,
  ProviderInfo,
  ProviderKubernetesConnectionInfo,
} from '/@api/provider-info';

// mock provider widget
vi.mock(import('./ProviderWidget.svelte'));

const EMPTY_PROVIDER_MOCK: ProviderInfo = {
  name: 'empty-provider',
  containerConnections: [],
  kubernetesConnections: [],
} as unknown as ProviderInfo;

const CONTAINER_CONNECTION_MOCK: ProviderContainerConnectionInfo = {
  name: 'container-connection',
} as unknown as ProviderContainerConnectionInfo;

const KUBERNETES_CONNECTION_MOCK: ProviderKubernetesConnectionInfo = {
  name: 'kubernetes-connection',
} as unknown as ProviderKubernetesConnectionInfo;

const CONTAINER_PROVIDER_MOCK: ProviderInfo = {
  ...EMPTY_PROVIDER_MOCK,
  containerConnections: [CONTAINER_CONNECTION_MOCK],
};

const KUBERNETES_PROVIDER_MOCK: ProviderInfo = {
  ...EMPTY_PROVIDER_MOCK,
  kubernetesConnections: [KUBERNETES_CONNECTION_MOCK],
};

beforeEach(() => {
  vi.resetAllMocks();
  // reset the store
  providerInfos.set([]);
});

test('no provider should not render any provider widget', () => {
  render(Providers);

  expect(ProviderWidget).not.toHaveBeenCalled();
});

test('provider without any connections should not be displayed', () => {
  providerInfos.set([EMPTY_PROVIDER_MOCK]);

  render(Providers);

  expect(ProviderWidget).not.toHaveBeenCalled();
});

test('provider with container connection should be displayed', () => {
  // mock two provider: one empty, and one with container connection
  providerInfos.set([CONTAINER_PROVIDER_MOCK, EMPTY_PROVIDER_MOCK]);

  render(Providers);

  // should only render one
  expect(ProviderWidget).toHaveBeenCalledOnce();
  expect(ProviderWidget).toHaveBeenCalledWith(expect.anything(), {
    entry: CONTAINER_PROVIDER_MOCK,
  });
});

test('provider with kubernetes connection should be displayed', () => {
  // mock two provider: one empty, and one with kubernetes connection
  providerInfos.set([KUBERNETES_PROVIDER_MOCK, EMPTY_PROVIDER_MOCK]);

  render(Providers);

  // should only render one
  expect(ProviderWidget).toHaveBeenCalledOnce();
  expect(ProviderWidget).toHaveBeenCalledWith(expect.anything(), {
    entry: KUBERNETES_PROVIDER_MOCK,
  });
});
