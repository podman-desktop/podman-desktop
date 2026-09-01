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

import * as extensionApi from '@podman-desktop/api';
import type { Mock } from 'vitest';
import { beforeEach, expect, test, vi } from 'vitest';

import { PodmanBinaryLocationHelper } from './podman-binary-location-helper';

let podmanBinaryLocationHelper: PodmanBinaryLocationHelper;

beforeEach(() => {
  podmanBinaryLocationHelper = new PodmanBinaryLocationHelper();
  vi.resetAllMocks();
});

test.each([
  { stdout: '/opt/podman/bin/podman', expectedSource: 'installer', name: 'should grab podman from the installer' },
  { stdout: '/opt/homebrew/bin/podman', expectedSource: 'brew', name: 'should grab podman from brew' },
  { stdout: '/foo/bin/podman', expectedSource: 'unknown', name: 'should grab podman from unknown location' },
])('$name', async ({ stdout, expectedSource }) => {
  (extensionApi.process.exec as Mock).mockResolvedValue({
    stdout,
  } as extensionApi.RunResult);

  const podmanBinaryResult = await podmanBinaryLocationHelper.getPodmanLocationMac();

  expect(podmanBinaryResult.source).toBe(expectedSource);

  // expect called with which podman command
  expect(extensionApi.process.exec).toHaveBeenCalledWith('which', ['podman']);
});

test('error grab podman from the installer', async () => {
  (extensionApi.process.exec as Mock).mockImplementation(() => {
    throw new Error('error');
  });

  const podmanBinaryResult = await podmanBinaryLocationHelper.getPodmanLocationMac();

  expect(podmanBinaryResult.source).toBe('unknown');
  expect(podmanBinaryResult.error).toBeDefined();

  // expect called with which podman command
  expect(extensionApi.process.exec).toHaveBeenCalledWith('which', ['podman']);
});
