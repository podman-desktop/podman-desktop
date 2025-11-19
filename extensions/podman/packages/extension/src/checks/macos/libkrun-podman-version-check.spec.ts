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

import type { CheckResult } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { LibkrunPodmanVersionCheck } from '/@/checks/macos/libkrun-podman-version-check';
import type { PodmanBinary } from '/@/utils/podman-binary';

const PODMAN_BINARY_MOCK: PodmanBinary = {
  getBinaryInfo: vi.fn(),
} as unknown as PodmanBinary;

beforeEach(() => {
  vi.resetAllMocks();
});

interface TestCase {
  name: string;
  version: string;
  expected: CheckResult;
}

test.each<TestCase>([
  {
    name: 'version bellow minimum should result in failure',
    expected: {
      successful: false,
      description: 'Libkrun is only supported with podman version >= 5.2.0-rc1.',
    },
    version: '4.1.2',
  },
  {
    name: 'version above minimum should result in a success',
    expected: {
      successful: true,
    },
    version: '5.3.0',
  },
])('$name', async ({ version, expected }) => {
  vi.mocked(PODMAN_BINARY_MOCK.getBinaryInfo).mockResolvedValue({ version });

  const check = new LibkrunPodmanVersionCheck(PODMAN_BINARY_MOCK);
  const result = await check.execute();
  expect(result).toStrictEqual(expected);
});

test('if podman is not installed the test should fail', async () => {
  // mock no version of podman detected
  vi.mocked(PODMAN_BINARY_MOCK.getBinaryInfo).mockResolvedValue(undefined);

  const check = new LibkrunPodmanVersionCheck(PODMAN_BINARY_MOCK);
  const { successful } = await check.execute();
  expect(successful).toBeFalsy();
});
