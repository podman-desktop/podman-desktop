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

import type { BrowserWindow } from 'electron';
import { app } from 'electron';
import { beforeEach, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';

import { LoginMinimizeHandler } from './login-minimize-handler.js';

let loginMinimizeHandler: LoginMinimizeHandler;

const getConfigurationMock = vi.fn();
const configurationRegistryMock = {
  getConfiguration: getConfigurationMock,
} as unknown as ConfigurationRegistry;

const showMock = vi.fn();
const browserWindowMock = {
  show: showMock,
} as unknown as BrowserWindow;

beforeEach(() => {
  vi.resetAllMocks();
  loginMinimizeHandler = new LoginMinimizeHandler();
});

test('should hide the dock when login.minimize is true', async () => {
  getConfigurationMock.mockReturnValue({
    get: () => true,
  });

  loginMinimizeHandler.apply(browserWindowMock, configurationRegistryMock);

  expect(app.dock?.hide).toBeCalled();
  expect(browserWindowMock.show).not.toBeCalled();
});

test('should show the window when login.minimize is false', async () => {
  getConfigurationMock.mockReturnValue({
    get: () => false,
  });

  loginMinimizeHandler.apply(browserWindowMock, configurationRegistryMock);

  expect(browserWindowMock.show).toBeCalled();
  expect(app.dock?.hide).not.toBeCalled();
});
