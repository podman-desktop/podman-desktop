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

import { beforeEach, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from './configuration-registry.js';
import { RegistryInit } from './registry-init.js';

const configurationRegistryMock: ConfigurationRegistry = {
  registerConfigurations: vi.fn(),
  deregisterConfigurations: vi.fn(),
} as unknown as ConfigurationRegistry;

beforeEach(() => {
  vi.resetAllMocks();
});

test('should register a configuration', () => {
  const registryInit = new RegistryInit(configurationRegistryMock);
  registryInit.init();

  expect(configurationRegistryMock.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls[0]?.[0][0];
  expect(configurationNode?.id).toBe('preferences.registries');
  expect(configurationNode?.title).toBe('Registries');
  expect(configurationNode?.type).toBe('object');
  expect(configurationNode?.properties).toBeDefined();
  expect(Object.keys(configurationNode?.properties ?? {})).toHaveLength(1);
});
