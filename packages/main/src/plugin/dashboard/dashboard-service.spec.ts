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

import type { ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { ENHANCED_DASHBOARD_CONFIGURATION_KEY, SYSTEM_OVERVIEW_CONFIGURATION_KEY } from '@podman-desktop/core-api';
import type { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { DashboardService } from '/@/plugin/dashboard/dashboard-service.js';
import type { ExperimentalConfigurationManager } from '/@/plugin/experimental-configuration-manager.js';
import type { ProviderRegistry } from '/@/plugin/provider-registry.js';

import type { ConfigurationRegistry } from '../configuration-registry.js';

const registerConfigurationsMock = vi.fn();
const onDidChangeConfigurationMock = vi.fn();

const configurationRegistryMock = {
  registerConfigurations: registerConfigurationsMock,
  onDidChangeConfiguration: onDidChangeConfigurationMock,
} as unknown as ConfigurationRegistry;

const apiSenderMock = {
  send: vi.fn(),
  receive: vi.fn(),
} as unknown as ApiSenderType;

const experimentalConfigurationManagerMock = {
  isExperimentalConfigurationEnabled: vi.fn(),
} as unknown as ExperimentalConfigurationManager;

const getProviderInfosMock = vi.fn();
const providerRegistryMock = {
  addProviderListener: vi.fn(),
  getProviderInfos: getProviderInfosMock,
} as unknown as ProviderRegistry;

let dashboardService: DashboardService;
beforeEach(() => {
  vi.resetAllMocks();
  dashboardService = new DashboardService(
    configurationRegistryMock,
    providerRegistryMock,
    experimentalConfigurationManagerMock,
    apiSenderMock,
  );
  dashboardService.init();

  getProviderInfosMock.mockReturnValue([]);
});

test('should register a configuration', async () => {
  expect(configurationRegistryMock.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls[0]?.[0][0];
  expect(configurationNode?.id).toBe('preferences.experimental.enhancedDashboard');
  expect(configurationNode?.title).toBe('Experimental (Enhanced Dashboard)');
  expect(configurationNode?.properties).toBeDefined();
  expect(Object.keys(configurationNode?.properties ?? {}).length).toBe(2);
  expect(configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]).toBeDefined();
  expect(configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]?.type).toBe('object');
  expect(configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]?.description).toBe(
    'Enhanced dashboard with more features and improved user experience',
  );
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_CONFIGURATION_KEY]).toBeDefined();
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_CONFIGURATION_KEY]?.type).toBe('boolean');
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_CONFIGURATION_KEY]?.hidden).toBe(true);
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_CONFIGURATION_KEY]?.default).toBe(false);
  expect(
    configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]?.experimental?.githubDiscussionLink,
  ).toBe('https://github.com/podman-desktop/podman-desktop/discussions/16055');
});

describe('system overview status', () => {
  test('should send healthy status when container connection is started', () => {
    const connection: ProviderContainerConnectionInfo = {
      connectionType: 'container',
      name: 'podman-machine',
      displayName: 'Podman Machine',
      status: 'started',
      endpoint: { socketPath: '/run/podman/podman.sock' },
      type: 'podman',
    };
    const provider: ProviderInfo = {
      internalId: 'id',
      id: 'podman',
      extensionId: 'podman',
      name: 'Podman',
      containerConnections: [connection],
      kubernetesConnections: [],
      vmConnections: [],
      status: 'configured',
    } as unknown as ProviderInfo;
    getProviderInfosMock.mockReturnValue([provider]);

    const providerListener = vi.mocked(providerRegistryMock.addProviderListener).mock.calls[0]?.[0];
    expect(providerListener).toBeDefined();
    providerListener?.('provider:update-status', provider);

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'healthy',
      text: 'All systems operational',
    });
  });

  test('should send status when configuration changes', async () => {
    const configCallback = vi.mocked(configurationRegistryMock.onDidChangeConfiguration).mock.calls[0]?.[0];
    await configCallback?.({ key: ENHANCED_DASHBOARD_CONFIGURATION_KEY, value: true, scope: 'DEFAULT' });

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'critical',
      text: 'Error detected',
    });
  });

  test('should send status when provider-change is received', () => {
    const receiveCallback = vi
      .mocked(apiSenderMock.receive)
      .mock.calls.find(call => call[0] === 'provider-change')?.[1];
    expect(receiveCallback).toBeDefined();
    receiveCallback?.();

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'critical',
      text: 'Error detected',
    });
  });
});
