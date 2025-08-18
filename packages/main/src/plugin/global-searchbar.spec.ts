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
import { expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from './configuration-registry.js';
import { GlobalSearchbarInit } from './global-searchbar.js';

const registerConfigurationsMock = vi.fn();
const configurationRegistryMock = {
  registerConfigurations: registerConfigurationsMock,
} as unknown as ConfigurationRegistry;

test('should register a configuration', async () => {
  const globalSearchbarInit = new GlobalSearchbarInit(configurationRegistryMock);
  globalSearchbarInit.init();

  expect(configurationRegistryMock.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls[0]?.[0][0];
  expect(configurationNode?.id).toBe('preferences.experimental.globalSearchbar');
  expect(configurationNode?.title).toBe('Experimental (Global searchbar)');
  expect(configurationNode?.properties).toBeDefined();
  expect(Object.keys(configurationNode?.properties ?? {}).length).toBe(1);
  expect(configurationNode?.properties?.['titlebar.globalSearchbar']).toBeDefined();
  expect(configurationNode?.properties?.['titlebar.globalSearchbar']?.type).toBe('object');
  expect(configurationNode?.properties?.['titlebar.globalSearchbar']?.description).toBe(
    'Show searchbar in the title bar',
  );
  expect(configurationNode?.properties?.['titlebar.globalSearchbar']?.experimental?.githubDiscussionLink).toBe(
    'https://github.com/podman-desktop/podman-desktop/discussions/10802',
  );
});
