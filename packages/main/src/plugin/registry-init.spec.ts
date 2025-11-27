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

import { beforeAll, expect, test, vi } from 'vitest';

import type { ApiSenderType } from './api.js';
import { ConfigurationRegistry } from './configuration-registry.js';
import type { DefaultConfiguration } from './default-configuration.js';
import type { Directories } from './directories.js';
import type { LockedConfiguration } from './locked-configuration.js';
import { RegistryInit } from './registry-init.js';

let configurationRegistry: ConfigurationRegistry;

beforeAll(() => {
  configurationRegistry = new ConfigurationRegistry(
    {} as ApiSenderType,
    {} as Directories,
    {} as DefaultConfiguration,
    {} as LockedConfiguration,
  );
  configurationRegistry.registerConfigurations = vi.fn();
  configurationRegistry.deregisterConfigurations = vi.fn();
});

test('should register a configuration', () => {
  const registryInit = new RegistryInit(configurationRegistry);
  registryInit.init();

  expect(configurationRegistry.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistry.registerConfigurations).mock.calls[0]?.[0][0];
  expect(configurationNode?.id).toBe('preferences.registries');
  expect(configurationNode?.title).toBe('Registries');
  expect(configurationNode?.type).toBe('object');
  expect(configurationNode?.properties).toBeDefined();
  expect(Object.keys(configurationNode?.properties ?? {}).length).toBe(1);
});
