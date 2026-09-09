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

import * as os from 'node:os';

import type { Configuration } from '@podman-desktop/api';
import type { IConfigurationRegistry } from '@podman-desktop/core-api/configuration';
import { beforeEach, expect, test, vi } from 'vitest';

import { StartupInstall } from './startup-install.js';

vi.mock(import('node:os'));

const windowsStartupMock = vi.hoisted(() => ({
  shouldEnable: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  syncStartupPreference: vi.fn(),
}));

vi.mock(import('./windows-startup.js'), async importOriginal => {
  const { WindowsStartup } = await importOriginal();
  return {
    WindowsStartup: class extends WindowsStartup {
      override shouldEnable(): boolean {
        return windowsStartupMock.shouldEnable();
      }

      override enable(): Promise<void> {
        return windowsStartupMock.enable();
      }

      override disable(): Promise<void> {
        return windowsStartupMock.disable();
      }

      override syncStartupPreference(): Promise<void> {
        return windowsStartupMock.syncStartupPreference();
      }
    },
  };
});

let startOnLogin: boolean;
let configurationRegistry: IConfigurationRegistry;

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('PROD', true);
  vi.mocked(os.platform).mockReturnValue('win32');
  windowsStartupMock.shouldEnable.mockReturnValue(true);
  startOnLogin = true;
  configurationRegistry = {
    registerConfigurations: vi.fn(),
    onDidChangeConfiguration: vi.fn(),
    updateConfigurationValue: vi.fn(async (key, value) => {
      if (key === 'preferences.login.start') {
        startOnLogin = value as boolean;
      }
    }),
    getConfiguration: vi.fn().mockReturnValue({
      get: vi.fn().mockImplementation(key => (key === 'start' ? startOnLogin : undefined)),
    } as unknown as Configuration),
  } as unknown as IConfigurationRegistry;
});

test('Windows startup preference is synchronized before applying startup configuration', async () => {
  windowsStartupMock.syncStartupPreference.mockImplementation(async () => {
    await configurationRegistry.updateConfigurationValue('preferences.login.start', false);
  });
  const startupInstall = new StartupInstall(configurationRegistry);

  await startupInstall.configure();

  expect(windowsStartupMock.syncStartupPreference).toHaveBeenCalledOnce();
  expect(windowsStartupMock.enable).not.toHaveBeenCalled();
});

test('Enabling startup from preferences re-enables the Windows startup item', async () => {
  const startupInstall = new StartupInstall(configurationRegistry);
  await startupInstall.configure();
  const configurationListener = vi.mocked(configurationRegistry.onDidChangeConfiguration).mock.calls[0]?.[0];

  await configurationListener?.({ key: 'preferences.login.start', value: true, scope: 'DEFAULT' });

  expect(windowsStartupMock.enable).toHaveBeenCalledTimes(2);
});
