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

import { beforeEach, expect, test, vi } from 'vitest';

import { getPodmanInstallation } from '../../utils/podman-cli';
import { HyperVPodmanVersionCheck } from './hyperv-podman-version-check';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('../../utils/podman-cli'), () => ({
  getPodmanInstallation: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

interface SuccessfulTestCase {
  name: string;
  version: string;
}

test.each<SuccessfulTestCase>([
  {
    name: 'expect HyperV Podman version check return success result if Podman version equals minimum',
    version: '5.2.0',
  },
  {
    name: 'expect HyperV Podman version check return success result if Podman version is much higher than minimum',
    version: '6.0.0',
  },
  {
    name: 'expect HyperV Podman version check handle pre-release versions correctly',
    version: '5.3.0-dev',
  },
])('$name', async ({ version }) => {
  vi.mocked(getPodmanInstallation).mockResolvedValue({
    version: version,
  });

  const hyperVPodmanVersionCheck = new HyperVPodmanVersionCheck();
  const result = await hyperVPodmanVersionCheck.execute();

  expect(result.successful).toBeTruthy();
});

interface FailureTestCase {
  name: string;
  version: string;
  errorDescription: string;
}

test.each<FailureTestCase>([
  {
    name: 'expect failure if Podman version minor bellow minimum',
    errorDescription: 'Hyper-V is only supported with podman version >= 5.2.0.',
    version: '5.1.0',
  },
  {
    name: 'expect failure if Podman version major bellow minimum',
    errorDescription: 'Hyper-V is only supported with podman version >= 5.2.0.',
    version: '4.4.0',
  },
])('$name', async ({ version, errorDescription }) => {
  vi.mocked(getPodmanInstallation).mockResolvedValue({
    version: version,
  });
  const hyperVPodmanVersionCheck = new HyperVPodmanVersionCheck();
  const result = await hyperVPodmanVersionCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal(errorDescription);
});
