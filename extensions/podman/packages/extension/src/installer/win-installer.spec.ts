/*********************************************************************
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
 ********************************************************************/

import { existsSync, readdirSync } from 'node:fs';

import type { ExtensionContext, TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { WinPlatform } from '/@/platforms/win-platform';
import type { PodmanWindowsLegacyInstaller } from '/@/utils/podman-windows-legacy-installer';
import { getAssetsFolder } from '/@/utils/util';

import { WinInstaller } from './win-installer';

vi.mock('node:fs');

const extensionContext = {
  subscriptions: [],
} as unknown as ExtensionContext;

const progress = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  report: (): void => {},
};

const mockTelemetryLogger = {} as TelemetryLogger;
const mockWinPlatform = {} as WinPlatform;
const legacyInstaller = {} as PodmanWindowsLegacyInstaller;

vi.mock(import('/@/utils/util'), () => ({
  getAssetsFolder: vi.fn(),
}));

let installer: WinInstaller;

beforeEach(() => {
  installer = new WinInstaller(extensionContext, mockTelemetryLogger, mockWinPlatform, legacyInstaller);
  vi.resetAllMocks();
  // reset array of subscriptions
  extensionContext.subscriptions.length = 0;

  vi.mocked(getAssetsFolder).mockReturnValue('');

  vi.mocked(extensionApi.window.withProgress).mockImplementation((options, task) => {
    return task(progress, {} as unknown as extensionApi.CancellationToken);
  });
});

test('expect update on windows to show notification in case of 0 exit code', async () => {
  vi.mocked(extensionApi.process.exec).mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));

  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(readdirSync).mockReturnValue([]);

  const result = await installer.update();
  expect(result).toBeTruthy();
  expect(extensionApi.window.showNotification).toHaveBeenCalled();
});

test('expect update on windows not to show notification in case of 1602 exit code', async () => {
  const customError = { exitCode: 1602 } as extensionApi.RunError;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    throw customError;
  });

  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(readdirSync).mockReturnValue([]);

  const result = await installer.update();
  expect(result).toBeTruthy();
  expect(extensionApi.window.showNotification).not.toHaveBeenCalled();
});

test('expect update on windows to throw error if non zero exit code', async () => {
  const customError = { exitCode: -1, stderr: 'CustomError' } as extensionApi.RunError;

  vi.mocked(extensionApi.process.exec).mockImplementation(() => {
    throw customError;
  });

  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(readdirSync).mockReturnValue([]);

  const result = await installer.update();
  expect(result).toBeFalsy();
  expect(extensionApi.window.showErrorMessage).toHaveBeenCalled();
});
