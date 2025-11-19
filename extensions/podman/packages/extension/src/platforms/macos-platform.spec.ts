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

import { arch } from 'node:os';

import * as extensionApi from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { LibkrunPodmanVersionCheck } from '/@/checks/macos/libkrun-podman-version-check';
import { MacOSPlatform } from '/@/platforms/macos-platform';

vi.mock(import('node:os'));

const LIBKRUN_PODMAN_VERSION_CHECK_MOCK = {
  execute: vi.fn(),
} as unknown as LibkrunPodmanVersionCheck;

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(LIBKRUN_PODMAN_VERSION_CHECK_MOCK.execute).mockResolvedValue({
    successful: true,
  });
});

test('MacOSPlatform#isLibkrunSupported should return false on non-ios platform', async () => {
  vi.mocked(extensionApi.env).isMac = false;
  const platform = new MacOSPlatform(LIBKRUN_PODMAN_VERSION_CHECK_MOCK);

  const enabled = await platform.isLibkrunSupported();
  expect(enabled).toBeFalsy();
});

test('MacOSPlatform#isLibkrunSupported should return false on non-arm64 platform', async () => {
  vi.mocked(extensionApi.env).isMac = true;
  vi.mocked(arch).mockReturnValue('x64');

  const platform = new MacOSPlatform(LIBKRUN_PODMAN_VERSION_CHECK_MOCK);

  const enabled = await platform.isLibkrunSupported();
  expect(enabled).toBeFalsy();
});

test('MacOSPlatform#isLibkrunSupported should return LibkrunPodmanVersionCheck results on macOS arm64', async () => {
  vi.mocked(extensionApi.env).isMac = true;
  vi.mocked(arch).mockReturnValue('arm64');

  const platform = new MacOSPlatform(LIBKRUN_PODMAN_VERSION_CHECK_MOCK);

  const enabled = await platform.isLibkrunSupported();
  expect(enabled).toBeTruthy();
});
