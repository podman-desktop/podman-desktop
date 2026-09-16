/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import type { BrowserWindow } from 'electron';
import { beforeEach, expect, test, vi } from 'vitest';

import { OpenDevTools } from './open-dev-tools.js';
import type { ConfigurationRegistry } from './plugin/configuration-registry.js';

let openDevTools: OpenDevTools;

const getConfigurationMock = vi.fn();
const configurationRegistryMock = {
  getConfiguration: getConfigurationMock,
} as unknown as ConfigurationRegistry;

const openDevToolsMock = vi.fn();
const browserWindowMock = {
  webContents: {
    openDevTools: openDevToolsMock,
  },
} as unknown as BrowserWindow;

beforeEach(() => {
  vi.resetAllMocks();
  openDevTools = new OpenDevTools();
});

test('should open devtools with undocked mode if no configuration', async () => {
  openDevTools.open(browserWindowMock, configurationRegistryMock);

  expect(browserWindowMock.webContents.openDevTools).toBeCalledWith({ mode: 'undocked' });
});

test('should not open devtools if none', async () => {
  getConfigurationMock.mockReturnValue({
    get: () => 'none',
  });
  openDevTools.open(browserWindowMock, configurationRegistryMock);

  expect(browserWindowMock.webContents.openDevTools).not.toBeCalled();
});

test.each([
  { configValue: 'left', expectedMode: 'left' },
  { configValue: 'right', expectedMode: 'right' },
  { configValue: 'bottom', expectedMode: 'bottom' },
  { configValue: 'detach', expectedMode: 'detach' },
])('should open devtools with $expectedMode mode', async ({ configValue, expectedMode }) => {
  getConfigurationMock.mockReturnValue({
    get: () => configValue,
  });
  openDevTools.open(browserWindowMock, configurationRegistryMock);

  expect(browserWindowMock.webContents.openDevTools).toBeCalledWith({ mode: expectedMode });
});
