/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, expect, test, vi } from 'vitest';

import { type InitializationContext, InitializeAndStartMode } from '/@/lib/dashboard/ProviderInitUtils';
import ProviderInstalled from '/@/lib/dashboard/ProviderInstalled.svelte';

import { verifyStatus } from './ProviderStatusTestHelper.spec';

vi.mock(import('@xterm/xterm'));

class InitializationContextImpl {
  #promise: unknown;
  #error: unknown;

  constructor(public mode: string) {}

  set promise(promise: unknown) {
    this.#promise = promise;
  }

  get promise(): unknown {
    return this.#promise;
  }

  set error(error: unknown) {
    this.#error = error;
  }

  get error(): unknown {
    return this.#error;
  }
}

// fake the window.events object
beforeAll(() => {
  vi.mocked(window.initializeProvider).mockResolvedValue([]);
  (window.events as unknown) = {
    receive: (_channel: string, func: unknown): void => {
      (func as () => void)();
    },
  };
});

test('Expect installed provider shows button', async () => {
  const provider: ProviderInfo = {
    containerConnections: [],
    containerProviderConnectionCreation: false,
    containerProviderConnectionInitialization: false,
    detectionChecks: [],
    id: 'myproviderid',
    images: {},
    installationSupport: false,
    internalId: 'myproviderid',
    kubernetesConnections: [],
    kubernetesProviderConnectionCreation: false,
    kubernetesProviderConnectionInitialization: false,
    vmConnections: [],
    vmProviderConnectionCreation: false,
    vmProviderConnectionInitialization: false,
    links: [],
    name: 'MyProvider',
    status: 'installed',
    warnings: [],
    extensionId: '',
    cleanupSupport: false,
  };

  const initializationContext: InitializationContext = new InitializationContextImpl(
    InitializeAndStartMode,
  ) as unknown as InitializationContext;
  const { findByText, findByRole } = render(ProviderInstalled, {
    provider: provider,
    initializationContext: initializationContext,
  });

  const providerText = await findByText(content => content === 'MyProvider');
  expect(providerText).toBeInTheDocument();

  const installedText = await findByText(content => content.toLowerCase().includes('installed but not ready'));
  expect(installedText).toBeInTheDocument();

  const button = await findByRole('button', { name: 'Initialize and start' });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  expect((initializationContext as InitializationContextImpl).promise).toBeDefined();
  expect(window.initializeProvider).toHaveBeenCalled();
});

test('Expect installed provider shows update button', async () => {
  await verifyStatus(ProviderInstalled, 'installed', false);
});

test('Expect installed provider does not show update button if version same', async () => {
  await verifyStatus(ProviderInstalled, 'installed', true);
});

test('Expect to see the initialize context error if provider installation fails', async () => {
  vi.spyOn(window, 'initializeProvider').mockRejectedValue('error');
  const provider: ProviderInfo = {
    containerConnections: [],
    containerProviderConnectionCreation: false,
    containerProviderConnectionInitialization: false,
    detectionChecks: [],
    id: 'myproviderid',
    images: {},
    installationSupport: false,
    internalId: 'myproviderid',
    kubernetesConnections: [],
    kubernetesProviderConnectionCreation: false,
    kubernetesProviderConnectionInitialization: false,
    vmConnections: [],
    vmProviderConnectionCreation: false,
    vmProviderConnectionInitialization: false,
    links: [],
    name: 'MyProvider',
    status: 'installed',
    warnings: [],
    extensionId: '',
    cleanupSupport: false,
  };

  const initializationContext: InitializationContext = new InitializationContextImpl(
    InitializeAndStartMode,
  ) as unknown as InitializationContext;
  const { findByText, findByRole } = render(ProviderInstalled, {
    provider: provider,
    initializationContext: initializationContext,
  });

  const providerText = await findByText('MyProvider');
  expect(providerText).toBeInTheDocument();

  const installedText = await findByText('INSTALLED BUT NOT READY');
  expect(installedText).toBeInTheDocument();

  const button = await findByRole('button', { name: 'Initialize and start' });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  while ((initializationContext as InitializationContextImpl).error !== 'error') {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  expect((initializationContext as InitializationContextImpl).promise).toBeDefined();
  expect((initializationContext as InitializationContextImpl).error).toBeDefined();
});
