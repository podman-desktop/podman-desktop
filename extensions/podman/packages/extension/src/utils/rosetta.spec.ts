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

import type { RunError, RunResult } from '@podman-desktop/api';
import { env as envAPI, process as processAPI, window as windowAPI } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { PodmanConfiguration } from './podman-configuration';
import { checkRosettaMacArm } from './rosetta';

vi.mock('node:os', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const osActual = await vi.importActual<typeof import('node:os')>('node:os');

  return {
    ...osActual,
    release: vi.fn(),
    platform: vi.fn(),
    arch: vi.fn(),
  };
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('checkRosettaMacArm', async () => {
  const podmanConfiguration = {
    isRosettaEnabled: vi.fn(),
  } as unknown as PodmanConfiguration;

  test('check do nothing on non-macOS', async () => {
    await checkRosettaMacArm(podmanConfiguration);
    // not called as not on macOS
    expect(vi.mocked(podmanConfiguration.isRosettaEnabled)).not.toBeCalled();
  });

  test('check do nothing on macOS with intel', async () => {
    vi.mocked(envAPI).isMac = true;
    vi.mocked(arch).mockReturnValue('x64');
    await checkRosettaMacArm(podmanConfiguration);
    // not called as not on arm64
    expect(vi.mocked(podmanConfiguration.isRosettaEnabled)).not.toBeCalled();
  });

  test('check no dialog on macOS with arm64 if rosetta is working', async () => {
    vi.mocked(envAPI).isMac = true;
    vi.mocked(arch).mockReturnValue('arm64');
    // rosetta is being enabled per configuration
    vi.mocked(podmanConfiguration.isRosettaEnabled).mockResolvedValue(true);

    // mock rosetta is working when executing commands
    vi.mocked(processAPI.exec).mockResolvedValue({} as RunResult);

    await checkRosettaMacArm(podmanConfiguration);
    // check showInformationMessage is not called
    expect(processAPI.exec).toBeCalled();
    expect(podmanConfiguration.isRosettaEnabled).toBeCalled();
    expect(windowAPI.showInformationMessage).not.toBeCalled();
  });

  test('check no dialog on macOS with arm64 if rosetta is not enabled', async () => {
    vi.mocked(envAPI).isMac = true;
    vi.mocked(arch).mockReturnValue('arm64');
    // rosetta is being enabled per configuration
    vi.mocked(podmanConfiguration.isRosettaEnabled).mockResolvedValue(false);

    await checkRosettaMacArm(podmanConfiguration);
    // do not try to execute something as disabled
    expect(processAPI.exec).not.toBeCalled();
    expect(podmanConfiguration.isRosettaEnabled).toBeCalled();
    expect(windowAPI.showInformationMessage).not.toBeCalled();
  });

  test('check dialog on macOS with arm64 if rosetta is not working', async () => {
    vi.mocked(envAPI).isMac = true;
    vi.mocked(arch).mockReturnValue('arm64');
    // rosetta is being enabled per configuration
    vi.mocked(podmanConfiguration.isRosettaEnabled).mockResolvedValue(true);

    // mock rosetta is not working when executing commands
    vi.mocked(processAPI.exec).mockRejectedValue({ stderr: 'Bad CPU' } as RunError);

    await checkRosettaMacArm(podmanConfiguration);
    // check showInformationMessage is not called
    expect(processAPI.exec).toBeCalled();
    expect(podmanConfiguration.isRosettaEnabled).toBeCalled();
    expect(windowAPI.showInformationMessage).toBeCalled();
  });
});
