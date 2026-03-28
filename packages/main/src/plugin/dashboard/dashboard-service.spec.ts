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
import { ENHANCED_DASHBOARD_CONFIGURATION_KEY, SYSTEM_OVERVIEW_EXPANDED } from '@podman-desktop/core-api';
import type { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';
import { DashboardService } from '/@/plugin/dashboard/dashboard-service.js';
import type { ExperimentalConfigurationManager } from '/@/plugin/experimental-configuration-manager.js';
import type { ProviderRegistry } from '/@/plugin/provider-registry.js';

const configurationRegistryMock = {
  registerConfigurations: vi.fn(),
  onDidChangeConfiguration: vi.fn(),
} as unknown as ConfigurationRegistry;

const apiSenderMock = {
  send: vi.fn(),
} as unknown as ApiSenderType;

const experimentalConfigurationManagerMock = {
  isExperimentalConfigurationEnabled: vi.fn(),
} as unknown as ExperimentalConfigurationManager;

const getProviderInfosMock = vi.fn();
const providerRegistryMock = {
  addProviderListener: vi.fn(),
  getProviderInfos: getProviderInfosMock,
} as unknown as ProviderRegistry;

function createProvider(connectionStatus: string): ProviderInfo {
  return {
    internalId: 'id',
    id: 'podman',
    extensionId: 'podman',
    name: 'Podman',
    containerConnections: [
      {
        connectionType: 'container',
        name: 'podman-machine',
        displayName: 'Podman Machine',
        status: connectionStatus,
        endpoint: { socketPath: '/run/podman/podman.sock' },
        type: 'podman',
      } as unknown as ProviderContainerConnectionInfo,
    ],
    kubernetesConnections: [],
    vmConnections: [],
    status: 'configured',
  } as unknown as ProviderInfo;
}

function triggerProviderChange(): void {
  vi.mocked(providerRegistryMock.addProviderListener).mock.calls[0]?.[0](
    'provider:update-status',
    createProvider('unknown'),
  );
}

let dashboardService: DashboardService;

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.resetAllMocks();
  getProviderInfosMock.mockReturnValue([]);
  dashboardService = new DashboardService(
    configurationRegistryMock,
    providerRegistryMock,
    experimentalConfigurationManagerMock,
    apiSenderMock,
  );
  dashboardService.init();
});

test('should register a configuration', () => {
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
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_EXPANDED]).toBeDefined();
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_EXPANDED]?.type).toBe('boolean');
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_EXPANDED]?.hidden).toBe(true);
  expect(configurationNode?.properties?.[SYSTEM_OVERVIEW_EXPANDED]?.default).toBe(false);
  expect(
    configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]?.experimental?.githubDiscussionLink,
  ).toBe('https://github.com/podman-desktop/podman-desktop/discussions/16055');
});

describe('system overview status', () => {
  test('should send healthy status when container connection is started', () => {
    getProviderInfosMock.mockReturnValue([createProvider('started')]);
    triggerProviderChange();

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'healthy',
      text: 'All systems operational',
    });
  });

  test('should send status when configuration changes', async () => {
    vi.mocked(experimentalConfigurationManagerMock.isExperimentalConfigurationEnabled).mockReturnValue(true);
    const configCallback = vi.mocked(configurationRegistryMock.onDidChangeConfiguration).mock.calls[0]?.[0];
    await configCallback?.({ key: ENHANCED_DASHBOARD_CONFIGURATION_KEY, value: true, scope: 'DEFAULT' });

    expect(apiSenderMock.send).toHaveBeenCalledWith('enhanced-dashboard-enabled', true);
    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'stable',
      text: 'Some systems are stopped',
    });
  });

  test('should send status when provider-change is received', () => {
    triggerProviderChange();

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'stable',
      text: 'Some systems are stopped',
    });
  });
});

describe('startup grace period', () => {
  test('should send progressing status for unknown connections during grace period', () => {
    getProviderInfosMock.mockReturnValue([createProvider('unknown')]);
    triggerProviderChange();

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'progressing',
      text: 'Initializing...',
    });
  });

  test('should send critical status for unknown connections after grace period expires', () => {
    getProviderInfosMock.mockReturnValue([createProvider('unknown')]);
    vi.advanceTimersByTime(8_000);

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'critical',
      text: 'Error detected',
    });
  });

  test('should send healthy status if connection resolves before grace period ends', () => {
    const provider = createProvider('unknown');
    getProviderInfosMock.mockReturnValue([provider]);
    triggerProviderChange();

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'progressing',
      text: 'Initializing...',
    });

    provider.containerConnections[0]!.status = 'started';
    vi.mocked(apiSenderMock.send).mockClear();
    triggerProviderChange();

    expect(apiSenderMock.send).toHaveBeenCalledWith('dashboard:system-overview-status', {
      status: 'healthy',
      text: 'All systems operational',
    });
  });
});
