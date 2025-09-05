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

import type { Configuration } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { ContainerInfo } from '/@api/container-info.js';
import type { ExtensionInfo } from '/@api/extension-info.js';
import type { ProviderInfo, ProviderKubernetesConnectionInfo } from '/@api/provider-info.js';

import type { ConfigurationRegistry } from '../configuration-registry.js';
import type { ContainerProviderRegistry } from '../container-registry.js';
import type { ExtensionLoader } from '../extension/extension-loader.js';
import type { KubernetesClient } from '../kubernetes/kubernetes-client.js';
import type { ProviderRegistry } from '../provider-registry.js';
import { ExploreFeatures } from './explore-features.js';

const configurationRegistryMock = {
  getConfiguration: vi.fn().mockReturnValue({
    get: vi.fn(),
  }),
  updateConfigurationValue: vi.fn(),
  registerConfigurations: vi.fn(),
} as unknown as ConfigurationRegistry;

const containerProviderRegistryMock = {
  listContainers: vi.fn(),
} as unknown as ContainerProviderRegistry;

const extensionLoaderMock = {
  listExtensions: vi.fn(),
} as unknown as ExtensionLoader;

const providerRegistryMock = {
  getProviderInfos: vi.fn(),
} as unknown as ProviderRegistry;

const kubernetesClientMock = {
  getContextsGeneralState: vi.fn(),
} as unknown as KubernetesClient;

const containerInfoMock: ContainerInfo = {
  Id: '1234567890',
  Names: ['/container1'],
  Image: 'image1',
  ImageID: 'image1',
  Command: 'command1',
  Created: 1234567890,
  State: 'running',
  Status: 'running',
  engineId: 'engine1',
  engineName: 'engine 1',
  engineType: 'podman',
  Ports: [],
  Labels: {},
  StartedAt: '',
  ImageBase64RepoTag: '',
};

const providerInfoMock: ProviderInfo = {
  internalId: 'provider1',
  id: 'provider1',
  extensionId: 'extension1',
  name: 'provider 1',
  containerConnections: [],
  kubernetesConnections: [{} as unknown as ProviderKubernetesConnectionInfo],
  vmConnections: [],
  status: 'ready',
  containerProviderConnectionCreation: false,
  containerProviderConnectionInitialization: false,
  kubernetesProviderConnectionCreation: false,
  kubernetesProviderConnectionInitialization: false,
  vmProviderConnectionCreation: false,
  vmProviderConnectionInitialization: false,
  links: [],
  detectionChecks: [],
  warnings: [],
  images: {},
  installationSupport: false,
  cleanupSupport: false,
};

const extensionInfoMock: ExtensionInfo = {
  id: 'extensionMock',
  name: 'extension mock',
  description: '',
  displayName: 'Extension Mock',
  publisher: '',
  removable: false,
  devMode: false,
  version: '',
  state: '',
  path: '',
  readme: '',
};

const exploreFeaturesMock = new ExploreFeatures(
  containerProviderRegistryMock,
  extensionLoaderMock,
  configurationRegistryMock,
  providerRegistryMock,
  kubernetesClientMock,
);

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(configurationRegistryMock.getConfiguration).mockReturnValue({
    get: vi.fn().mockReturnValueOnce([]).mockReturnValueOnce(false),
  } as unknown as Configuration);

  vi.mocked(containerProviderRegistryMock.listContainers).mockResolvedValue([]);
  vi.mocked(extensionLoaderMock.listExtensions).mockResolvedValue([]);
  vi.mocked(providerRegistryMock.getProviderInfos).mockReturnValue([]);
  vi.mocked(kubernetesClientMock.getContextsGeneralState).mockReturnValue(new Map());
});

test('init explore features in the configuration registry', () => {
  exploreFeaturesMock.init();

  expect(configurationRegistryMock.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls[0]?.[0][0];
  expect(configurationNode?.id).toBe('exploreFeatures');
  expect(configurationNode?.title).toBe('Show explore features content');
  expect(configurationNode?.properties).toBeDefined();
  expect(Object.keys(configurationNode?.properties ?? {}).length).toBe(2);
  expect(configurationNode?.properties?.['exploreFeatures.expanded']).toBeDefined();
  expect(configurationNode?.properties?.['exploreFeatures.expanded']?.type).toBe('boolean');
  expect(configurationNode?.properties?.['exploreFeatures.expanded']?.default).toBe(true);
  expect(configurationNode?.properties?.['exploreFeatures.expanded']?.hidden).toBe(true);

  expect(configurationNode?.properties?.['exploreFeatures.hiddenFeatures']).toBeDefined();
  expect(configurationNode?.properties?.['exploreFeatures.hiddenFeatures']?.type).toBe('array');
  expect(configurationNode?.properties?.['exploreFeatures.hiddenFeatures']?.default).toStrictEqual([]);
  expect(configurationNode?.properties?.['exploreFeatures.hiddenFeatures']?.hidden).toBe(true);
});

test('Get features list', async () => {
  const features = await exploreFeaturesMock.downloadFeaturesList();

  expect(features.length).toBe(4);

  // all features show by default
  expect(features[0]?.show).toBe(true);
  expect(features[1]?.show).toBe(true);
  expect(features[2]?.show).toBe(true);
  expect(features[3]?.show).toBe(true);

  // all features have an image
  expect(features[0]?.img).toBeTruthy();
  expect(features[1]?.img).toBeTruthy();
  expect(features[2]?.img).toBeTruthy();
  expect(features[3]?.img).toBeTruthy();
});

test('Do not show satrt a container feature if there is at least one container already', async () => {
  vi.mocked(containerProviderRegistryMock.listContainers).mockResolvedValue([containerInfoMock]);

  const features = await exploreFeaturesMock.downloadFeaturesList();

  expect(features[0]?.id).toBe('start-a-container');
  expect(features[0]?.show).toBe(false);

  expect(features[1]?.show).toBe(true);
  expect(features[2]?.show).toBe(true);
  expect(features[3]?.show).toBe(true);
});

test('Do not show explore kubernetes feature if there is at least one reachable cluster or kubernetes provider connection', async () => {
  vi.mocked(providerRegistryMock.getProviderInfos).mockReturnValue([providerInfoMock]);

  const features = await exploreFeaturesMock.downloadFeaturesList();

  expect(features[1]?.id).toBe('explore-kubernetes');
  expect(features[1]?.show).toBe(false);

  expect(features[0]?.show).toBe(true);
  expect(features[2]?.show).toBe(true);
  expect(features[3]?.show).toBe(true);
});

test('Do not show install extension feature if there is at least one installed extension already', async () => {
  vi.mocked(extensionLoaderMock.listExtensions).mockResolvedValue([extensionInfoMock]);

  const features = await exploreFeaturesMock.downloadFeaturesList();

  expect(features[2]?.id).toBe('install-extensions');
  expect(features[2]?.show).toBe(false);

  expect(features[0]?.show).toBe(true);
  expect(features[1]?.show).toBe(true);
  expect(features[3]?.show).toBe(true);
});

test('Do not show manage docker feature if docker compatibility is enabled', async () => {
  vi.mocked(configurationRegistryMock.getConfiguration).mockReturnValue({
    get: vi.fn().mockReturnValueOnce([]).mockReturnValueOnce(true),
  } as unknown as Configuration);

  vi.mocked(containerProviderRegistryMock.listContainers).mockResolvedValue([]);

  vi.mocked(extensionLoaderMock.listExtensions).mockResolvedValue([]);

  vi.mocked(providerRegistryMock.getProviderInfos).mockReturnValue([]);

  vi.mocked(kubernetesClientMock.getContextsGeneralState).mockReturnValue(new Map());

  const features = await exploreFeaturesMock.downloadFeaturesList();

  expect(features[3]?.id).toBe('manage-docker');
  expect(features[3]?.show).toBe(false);

  expect(features[0]?.show).toBe(true);
  expect(features[1]?.show).toBe(true);
  expect(features[2]?.show).toBe(true);
});

test('Do not show hidden features', async () => {
  vi.mocked(configurationRegistryMock.getConfiguration).mockReturnValue({
    get: vi.fn().mockReturnValueOnce(['manage-docker', 'start-a-container']).mockReturnValueOnce(false),
  } as unknown as Configuration);

  const features = await exploreFeaturesMock.downloadFeaturesList();

  expect(configurationRegistryMock.getConfiguration).toHaveBeenCalledWith('exploreFeatures');
  expect(vi.mocked(configurationRegistryMock.getConfiguration).mock.results[0]?.value.get).toHaveBeenCalledWith(
    'hiddenFeatures',
    [],
  );

  expect(features[0]?.show).toBe(false);
  expect(features[3]?.show).toBe(false);
  expect(features[1]?.show).toBe(true);
  expect(features[2]?.show).toBe(true);
});

test('Closed feature card is added to hidden features', async () => {
  vi.mocked(configurationRegistryMock.getConfiguration).mockReturnValue({
    get: vi.fn().mockReturnValue(['explore-kubernetes']),
  } as unknown as Configuration);

  await exploreFeaturesMock.closeFeatureCard('some-feature');

  expect(configurationRegistryMock.getConfiguration).toHaveBeenCalledWith('exploreFeatures');
  expect(vi.mocked(configurationRegistryMock.getConfiguration).mock.results[0]?.value.get).toHaveBeenCalledWith(
    'hiddenFeatures',
    [],
  );

  expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith('exploreFeatures.hiddenFeatures', [
    'explore-kubernetes',
    'some-feature',
  ]);
});
