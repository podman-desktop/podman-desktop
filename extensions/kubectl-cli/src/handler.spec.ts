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

import type { Configuration } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { Detect } from './detect';
import * as handler from './handler';

vi.mock(import('./detect'));
const extensionContextMock: extensionApi.ExtensionContext = {
  storagePath: '/storage-path',
} as unknown as extensionApi.ExtensionContext;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: vi.fn(),
    update: vi.fn(),
  } as unknown as Configuration);
});

test('updateConfigAndContextKubectlBinary: make sure configuration gets updated if checkSystemWideKubectl had returned true', async () => {
  vi.mocked(Detect.prototype.checkSystemWideKubectl).mockReturnValue(Promise.resolve(true));
  vi.mocked(Detect.prototype.checkForKubectl).mockReturnValue(Promise.resolve(true));
  vi.mocked(Detect.prototype.getStoragePath).mockReturnValue(Promise.resolve('mockPath'));

  // Spy on setValue and configuration updates
  const contextUpdateSpy = vi.spyOn(extensionApi.context, 'setValue');
  const configUpdateSpy = vi.spyOn(extensionApi.configuration.getConfiguration('kubectl'), 'update');

  // Run updateConfigAndContextKubectlBinary
  await handler.updateConfigAndContextKubectlBinary(extensionContextMock);

  expect(configUpdateSpy).toHaveBeenCalledWith('binary.installKubectlSystemWide', true);
  expect(contextUpdateSpy).toHaveBeenCalledWith('kubectl.isKubectlInstalledSystemWide', true);
});
