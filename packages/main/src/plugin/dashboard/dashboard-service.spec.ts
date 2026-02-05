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
import { expect, test, vi } from 'vitest';

import { DashboardService } from '/@/plugin/dashboard/dashboard-service.js';
import type { ApiSenderType } from '/@api/api-sender/api-sender-type.js';
import { ENHANCED_DASHBOARD_CONFIGURATION_KEY } from '/@api/dashboard-info.js';

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

test('should register a configuration', async () => {
  const dashboardService = new DashboardService(configurationRegistryMock, apiSenderMock);
  dashboardService.init();

  expect(configurationRegistryMock.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls[0]?.[0][0];
  expect(configurationNode?.id).toBe('preferences.experimental.enhancedDashboard');
  expect(configurationNode?.title).toBe('Experimental (Enhanced Dashboard)');
  expect(configurationNode?.properties).toBeDefined();
  expect(Object.keys(configurationNode?.properties ?? {}).length).toBe(1);
  expect(configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]).toBeDefined();
  expect(configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]?.type).toBe('object');
  expect(configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]?.description).toBe(
    'Enhanced dashboard with more features and improved user experience',
  );
  expect(
    configurationNode?.properties?.[ENHANCED_DASHBOARD_CONFIGURATION_KEY]?.experimental?.githubDiscussionLink,
  ).toBe('https://github.com/podman-desktop/podman-desktop/discussions/16055');
});
