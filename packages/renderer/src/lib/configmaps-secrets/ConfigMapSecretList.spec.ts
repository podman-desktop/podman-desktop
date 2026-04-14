/**********************************************************************
 * Copyright (C) 2024 - 2025 Red Hat, Inc.
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

import type { KubernetesObject, V1ConfigMap, V1Secret } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import * as states from '/@/stores/kubernetes-contexts-state';

import ConfigMapSecretList from './ConfigMapSecretList.svelte';

vi.mock('/@/stores/kubernetes-contexts-state');

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  vi.mocked(states).configmapSearchPattern = writable<string>('');
  vi.mocked(states).secretSearchPattern = writable<string>('');
  vi.mocked(states).kubernetesContextsCheckingStateDelayed = writable();
  vi.mocked(states).kubernetesCurrentContextState = writable();
});

test('Expect configmap empty screen', async () => {
  vi.mocked(states).kubernetesCurrentContextConfigMapsFiltered = writable<KubernetesObject[]>([]);
  vi.mocked(states).kubernetesCurrentContextSecretsFiltered = writable<KubernetesObject[]>([]);
  render(ConfigMapSecretList);
  await vi.waitFor(() => {
    const noNodes = screen.getByRole('heading', { name: 'No configmaps or secrets' });
    expect(noNodes).toBeInTheDocument();
  });
});

test('Displays correct title', async () => {
  const configMap: V1ConfigMap = {
    metadata: {
      name: 'my-configmap',
      namespace: 'my-namespace',
    },
    data: {
      key1: 'value1',
      key2: 'value2',
    },
  };

  const secret: V1Secret = {
    metadata: {
      name: 'my-secret',
      namespace: 'my-namespace',
    },
    data: {
      secretkey1: 'value1',
      secretkey2: 'value2',
    },
    type: 'Opaque',
  };

  vi.mocked(states).kubernetesCurrentContextConfigMapsFiltered = writable<KubernetesObject[]>([configMap]);
  vi.mocked(states).kubernetesCurrentContextSecretsFiltered = writable<KubernetesObject[]>([secret]);

  render(ConfigMapSecretList);

  await vi.waitFor(() => {
    const title = screen.getByRole('heading', { name: 'ConfigMaps and Secrets' });
    expect(title).toBeInTheDocument();
  });
});

test('Expect configmap and secrets list', async () => {
  const configMap: V1ConfigMap = {
    metadata: {
      name: 'my-configmap',
      namespace: 'my-namespace',
    },
    data: {
      key1: 'value1',
      key2: 'value2',
    },
  };

  const secret: V1Secret = {
    metadata: {
      name: 'my-secret',
      namespace: 'my-namespace',
    },
    data: {
      secretkey1: 'value1',
      secretkey2: 'value2',
    },
    type: 'Opaque',
  };

  vi.mocked(states).kubernetesCurrentContextConfigMapsFiltered = writable<KubernetesObject[]>([configMap]);
  vi.mocked(states).kubernetesCurrentContextSecretsFiltered = writable<KubernetesObject[]>([secret]);

  render(ConfigMapSecretList);

  await vi.waitFor(() => {
    const configMapNames = screen.getAllByRole('cell', { name: 'my-configmap my-namespace' });
    expect(configMapNames.length).toBeGreaterThan(0);
    // Expect ConfigMap type
    const configMapTypes = screen.getAllByRole('cell', { name: 'ConfigMap' });
    expect(configMapTypes.length).toBeGreaterThan(0);
  });

  const secretNames = screen.getAllByRole('cell', { name: 'my-secret my-namespace' });
  expect(secretNames.length).toBeGreaterThan(0);
  // Expect Opaque type
  const secretTypes = screen.getAllByRole('cell', { name: 'Opaque' });
  expect(secretTypes.length).toBeGreaterThan(0);
});

test('list is updated when kubernetesCurrentContextConfigMapsFiltered changes', async () => {
  const configMap1: V1ConfigMap = {
    metadata: {
      name: 'my-configmap-1',
      namespace: 'my-namespace',
    },
    data: {
      key1: 'value1',
      key2: 'value2',
    },
  };
  const configMap2: V1ConfigMap = {
    metadata: {
      name: 'my-configmap-2',
      namespace: 'my-namespace',
    },
    data: {
      key1: 'value1',
      key2: 'value2',
    },
  };

  const secret: V1Secret = {
    metadata: {
      name: 'my-secret',
      namespace: 'my-namespace',
    },
    data: {
      secretkey1: 'value1',
      secretkey2: 'value2',
    },
    type: 'Opaque',
  };

  const filteredConfigmaps = (vi.mocked(states).kubernetesCurrentContextConfigMapsFiltered = writable<
    KubernetesObject[]
  >([configMap1, configMap2]));
  const filteredSecrets = (vi.mocked(states).kubernetesCurrentContextSecretsFiltered = writable<KubernetesObject[]>([
    secret,
  ]));

  const component = render(ConfigMapSecretList);

  await vi.waitFor(() => {
    const configMapName1 = screen.queryByRole('cell', { name: 'my-configmap-1 my-namespace' });
    expect(configMapName1).toBeInTheDocument();
    const configMapName2 = screen.queryByRole('cell', { name: 'my-configmap-2 my-namespace' });
    expect(configMapName2).toBeInTheDocument();
    const secretNames = screen.queryByRole('cell', { name: 'my-secret my-namespace' });
    expect(secretNames).toBeInTheDocument();
  });

  filteredConfigmaps.set([configMap1]);
  await component.rerender({});

  let configMapName1 = screen.queryByRole('cell', { name: 'my-configmap-1 my-namespace' });
  let configMapName2 = screen.queryByRole('cell', { name: 'my-configmap-2 my-namespace' });
  let secretNames = screen.queryByRole('cell', { name: 'my-secret my-namespace' });

  expect(configMapName1).toBeInTheDocument();
  expect(configMapName2).not.toBeInTheDocument();
  expect(secretNames).toBeInTheDocument();

  filteredSecrets.set([]);
  await component.rerender({});

  configMapName1 = screen.queryByRole('cell', { name: 'my-configmap-1 my-namespace' });
  configMapName2 = screen.queryByRole('cell', { name: 'my-configmap-2 my-namespace' });
  secretNames = screen.queryByRole('cell', { name: 'my-secret my-namespace' });

  expect(configMapName1).toBeInTheDocument();
  expect(configMapName2).not.toBeInTheDocument();
  expect(secretNames).not.toBeInTheDocument();
});
