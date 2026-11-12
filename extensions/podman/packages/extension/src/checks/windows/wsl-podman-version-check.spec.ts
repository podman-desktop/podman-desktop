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

import { process } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { getBundledPodmanVersion } from '/@/utils/podman-bundled';

import { WSLPodmanVersionCheck } from './wsl-podman-version-check';

vi.mock(import('/@/utils/podman-bundled'));

beforeEach(() => {
  vi.resetAllMocks();
});

// mocks `wsl --version`, an Error makes the command fail
function mockWSLVersion(wslVersion: string | Error): void {
  if (wslVersion instanceof Error) {
    vi.mocked(process.exec).mockRejectedValue(wslVersion);
  } else {
    vi.mocked(process.exec).mockResolvedValue({
      stdout: `WSL version: ${wslVersion}\nKernel version: 6.6.87.2-1`,
      stderr: '',
      command: 'wsl --version',
    });
  }
}

test.each([
  // WSL too old for Podman 6
  { podmanVersion: '6.1.4', wsl: '2.7.4.0', successful: false, wslRead: true },
  { podmanVersion: '6.1.4', wsl: '2.6.1.0', successful: false, wslRead: true },
  { podmanVersion: '6.1.4', wsl: '1.2.5.0', successful: false, wslRead: true },
  { podmanVersion: '6.0.0-rc1', wsl: '2.6.1.0', successful: false, wslRead: true },
  // WSL recent enough for Podman 6
  { podmanVersion: '6.1.4', wsl: '2.7.5.0', successful: true, wslRead: true },
  { podmanVersion: '6.1.4', wsl: '2.7.10.0', successful: true, wslRead: true },
  { podmanVersion: '6.1.4', wsl: '3.0.0.0', successful: true, wslRead: true },
  // WSL version unknown: reported by WSLVersionCheck
  { podmanVersion: '6.1.4', wsl: new Error('wsl not found'), successful: true, wslRead: true },
  { podmanVersion: '6.1.4', wsl: 'not-a-version', successful: true, wslRead: true },
  // no WSL requirement for the Podman version
  { podmanVersion: '5.8.9', wsl: '2.6.1.0', successful: true, wslRead: false },
  { podmanVersion: 'unknown', wsl: '2.6.1.0', successful: true, wslRead: false },
])(
  'Podman $podmanVersion with WSL $wsl: successful=$successful',
  async ({ podmanVersion, wsl, successful, wslRead }) => {
    mockWSLVersion(wsl);

    const result = await new WSLPodmanVersionCheck().executeFor(podmanVersion);

    expect(result.successful).toBe(successful);
    expect(vi.mocked(process.exec).mock.calls.length > 0).toBe(wslRead);
  },
);

test('describes the issue and how to fix it', async () => {
  mockWSLVersion('2.6.1.0');

  const result = await new WSLPodmanVersionCheck().executeFor('6.1.4');

  expect(result.description).toEqual(
    'Podman 6.1.4 requires WSL 2.7.5 or later, but WSL 2.6.1.0 is installed. WSL machines will fail to start or to run containers.',
  );
  expect(result.docLinksDescription).toContain(`'wsl --update'`);
});

test('reads the WSL version on each execution so that a WSL update is detected', async () => {
  const check = new WSLPodmanVersionCheck();
  mockWSLVersion('2.6.1.0');
  await expect(check.executeFor('6.1.4')).resolves.toEqual(expect.objectContaining({ successful: false }));

  mockWSLVersion('2.7.5.0');
  await expect(check.executeFor('6.1.4')).resolves.toEqual({ successful: true });
});

test('execute checks the bundled Podman version', async () => {
  vi.mocked(getBundledPodmanVersion).mockReturnValue('6.1.4');
  mockWSLVersion('2.6.1.0');

  const result = await new WSLPodmanVersionCheck().execute();

  expect(result.description).toContain('Podman 6.1.4 requires WSL 2.7.5 or later');
});
