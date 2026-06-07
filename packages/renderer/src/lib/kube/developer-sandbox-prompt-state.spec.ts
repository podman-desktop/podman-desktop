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

import type { ProviderInfo } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { extensionInfos } from '/@/stores/extensions';
import { unregisterPrototype } from '/@/stores/prototype';
import { providerInfos } from '/@/stores/providers';

import { registerDeveloperSandboxPromptPrototype } from './developer-sandbox-prompt-prototype';
import {
  DEVELOPER_SANDBOX_EXTENSION_ID,
  DEVELOPER_SANDBOX_PROVIDER_ID,
  mergeDeveloperSandboxProvidersForResources,
  resourcesProviderInfos,
} from './developer-sandbox-prompt-state';

vi.mock(import('/@/stores/providers'), async importOriginal => {
  const original = await importOriginal();
  return {
    ...original,
    fetchProviders: vi.fn().mockResolvedValue([]),
  };
});

beforeEach(() => {
  unregisterPrototype();
  providerInfos.set([]);
  extensionInfos.set([]);
});

test('expect prototype Developer Sandbox provider to be injected on Resources when extension is installed in prototype', () => {
  registerDeveloperSandboxPromptPrototype('no-cluster-extension-installed');

  const providers = get(resourcesProviderInfos);

  expect(providers).toHaveLength(1);
  expect(providers[0]?.id).toBe(DEVELOPER_SANDBOX_PROVIDER_ID);
  expect(providers[0]?.name).toBe('Developer Sandbox');
  expect(providers[0]?.kubernetesProviderConnectionCreation).toBe(true);
  expect(providers[0]?.kubernetesProviderConnectionCreationButtonTitle).toBe('Create new');
  expect(providers[0]?.emptyConnectionMarkdownDescription).toContain('Sign up at');
  expect(providers[0]?.images?.icon).toBeTruthy();
});

test('expect live Developer Sandbox provider to be injected when extension is installed', () => {
  extensionInfos.set([{ id: DEVELOPER_SANDBOX_EXTENSION_ID, displayName: 'Developer Sandbox' } as never]);

  const providers = get(resourcesProviderInfos);

  expect(providers).toHaveLength(1);
  expect(providers[0]?.id).toBe(DEVELOPER_SANDBOX_PROVIDER_ID);
  expect(providers[0]?.kubernetesProviderConnectionCreation).toBe(true);
});

test('expect live Developer Sandbox provider not to be duplicated on Resources', () => {
  registerDeveloperSandboxPromptPrototype('no-cluster-extension-installed');
  extensionInfos.set([{ id: DEVELOPER_SANDBOX_EXTENSION_ID, displayName: 'Developer Sandbox' } as never]);
  providerInfos.set([
    {
      id: DEVELOPER_SANDBOX_PROVIDER_ID,
      name: 'Developer Sandbox',
      kubernetesProviderConnectionCreation: true,
      kubernetesConnections: [],
    } as unknown as ProviderInfo,
  ]);

  const providers = get(resourcesProviderInfos);

  expect(providers).toHaveLength(1);
  expect(providers[0]?.id).toBe(DEVELOPER_SANDBOX_PROVIDER_ID);
});

test('expect Developer Sandbox provider not to be injected when extension is not installed', () => {
  expect(
    mergeDeveloperSandboxProvidersForResources([], { extensionInstalled: false, showPrompt: true }, true, []),
  ).toEqual([]);
});
