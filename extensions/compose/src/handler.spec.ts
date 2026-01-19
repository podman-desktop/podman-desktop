/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as detect from './detect';
import * as handler from './handler';

vi.mock('./detect');

const extensionContextMock: extensionApi.ExtensionContext = {
  storagePath: '/storage-path',
} as unknown as extensionApi.ExtensionContext;

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: vi.fn(),
    has: vi.fn(),
    update: vi.fn(),
  });
});

test('updateConfigAndContextComposeBinary: make sure configuration gets updated if checkSystemWideDockerCompose had returned true', async () => {
  // Spy on setValue and configuration updates
  const contextUpdateSpy = vi.spyOn(extensionApi.context, 'setValue');
  const configUpdateSpy = vi.spyOn(extensionApi.configuration.getConfiguration('compose'), 'update');

  vi.mocked(detect.Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);

  // Run updateConfigAndContextComposeBinarys
  await handler.updateConfigAndContextComposeBinary(extensionContextMock);

  expect(configUpdateSpy).toHaveBeenCalledWith('binary.installComposeSystemWide', true);

  describe('podman-compose', async () => {
    test('updateConfigAndContextComposeBinary: should set isPodmanComposeInstalledSystemWide context to true when podman-compose is installed', async () => {
      vi.mocked(detect.Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
      vi.mocked(detect.Detect.prototype.checkSystemWidePodmanCompose).mockResolvedValue(true);

      // Run updateConfigAndContextComposeBinary
      await handler.updateConfigAndContextComposeBinary(extensionContextMock);

      expect(vi.mocked(extensionApi.context.setValue)).toHaveBeenCalledWith(
        'compose.isPodmanComposeInstalledSystemWide',
        true,
      );
    });

    test('updateConfigAndContextComposeBinary: should set isPodmanComposeInstalledSystemWide context to false when podman-compose is not installed', async () => {
      vi.mocked(detect.Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(false);
      vi.mocked(detect.Detect.prototype.checkSystemWidePodmanCompose).mockResolvedValue(false);

      // Run updateConfigAndContextComposeBinary
      await handler.updateConfigAndContextComposeBinary(extensionContextMock);

      expect(vi.mocked(extensionApi.context.setValue)).toHaveBeenCalledWith(
        'compose.isPodmanComposeInstalledSystemWide',
        false,
      );
    });
  });
  expect(contextUpdateSpy).toHaveBeenCalledWith('compose.isComposeInstalledSystemWide', true);
});
