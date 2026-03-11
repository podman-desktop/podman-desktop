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

import type { IConfigurationRegistry } from '@podman-desktop/core-api/configuration';
import { beforeEach, expect, test, vi } from 'vitest';

import { TrayToggleMacOS } from './tray-toggle-macos.js';

let trayToggleMacOS: TrayToggleMacOS;
let configurationRegistryMock: IConfigurationRegistry;

beforeEach(() => {
  vi.clearAllMocks();

  // Mock the IConfigurationRegistry
  configurationRegistryMock = {
    registerConfigurations: vi.fn(),
  } as unknown as IConfigurationRegistry;

  // Create instance with mocked dependency
  trayToggleMacOS = new TrayToggleMacOS(configurationRegistryMock);
});

test('Should register tray toggle configuration on init', async () => {
  await trayToggleMacOS.init();

  // Verify registerConfigurations was called
  expect(configurationRegistryMock.registerConfigurations).toHaveBeenCalled();
});

test('Should register configuration with correct properties', async () => {
  await trayToggleMacOS.init();

  const calls = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls;
  expect(calls).toHaveLength(1);

  const configArray = calls[0]![0];
  expect(configArray).toHaveLength(1);

  const configNode = configArray[0]!;
  expect(configNode.id).toBe('preferences.traytoggle');
  expect(configNode.title).toBe('Menu Bar Icon');
  expect(configNode.type).toBe('object');

  const properties = configNode.properties!;
  expect(properties['preferences.trayToggle']).toBeDefined();
  const trayToggleProp = properties['preferences.trayToggle']!;
  expect(trayToggleProp).toBeDefined();
  expect(trayToggleProp.description).toContain('Hide the menubar icon on MacOS');
  expect(trayToggleProp.type).toBe('boolean');
  expect(trayToggleProp.default).toBe(false);
});
