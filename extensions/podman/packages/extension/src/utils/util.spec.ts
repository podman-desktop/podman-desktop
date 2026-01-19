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

import * as podmanCli from './podman-cli';
import {
  APPLEHV_LABEL,
  execPodman,
  getMultiplePodmanInstallationsWarnings,
  getProviderByLabel,
  getProviderLabel,
  HYPERV_LABEL,
  LIBKRUN_LABEL,
  normalizeWSLOutput,
  VMTYPE,
  WSL_LABEL,
} from './util';

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
  vi.spyOn(podmanCli, 'findPodmanInstallations').mockResolvedValue([]);
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: vi.fn(),
    has: () => true,
    update: vi.fn(),
  } as unknown as extensionApi.Configuration);
});

test('normalizeWSLOutput returns the same string if there is no need to normalize it', async () => {
  const text = 'blabla';
  const res = normalizeWSLOutput(text);
  expect(res).toEqual(text);
});

test('normalizeWSLOutput returns a normalized output', async () => {
  const text = 'WSL version: 1.2.5.0';
  const textU16 = strEncodeUTF16(text);
  const enc = new TextDecoder('utf-16');
  const res = normalizeWSLOutput(enc.decode(textU16));
  expect(textU16).not.toEqual(text);
  expect(res).toEqual(text);
});

// create a string with invalid chars
function strEncodeUTF16(str: string): Uint16Array {
  const buf = new ArrayBuffer(str.length * 4);
  const bufView = new Uint16Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i * 2] = str.charCodeAt(i);
    // add an extra char to the string to simulate WSL output
    bufView[i * 2 + 1] = 0;
  }
  return bufView;
}

test('expect exec called with CONTAINERS_MACHINE_PROVIDER if a provider is defined', async () => {
  const execMock = vi
    .spyOn(extensionApi.process, 'exec')
    .mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));

  await execPodman(['machine', 'inspect'], 'libkrun', {
    env: {
      label: 'one',
    },
  });

  expect(execMock).toBeCalledWith(podmanCli.getPodmanCli(), ['machine', 'inspect'], {
    env: {
      label: 'one',
      CONTAINERS_MACHINE_PROVIDER: 'libkrun',
    },
  });
});

test('expect exec called without CONTAINERS_MACHINE_PROVIDER if a provider is NOT defined', async () => {
  const execMock = vi
    .spyOn(extensionApi.process, 'exec')
    .mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));

  await execPodman(['machine', 'inspect'], undefined, {
    env: {
      label: 'one',
    },
  });

  expect(execMock).toBeCalledWith(podmanCli.getPodmanCli(), ['machine', 'inspect'], {
    env: {
      label: 'one',
    },
  });
});

test('expect libkrun label with libkrun provider', async () => {
  const label = getProviderLabel(VMTYPE.LIBKRUN);
  expect(label).equals(LIBKRUN_LABEL);
});

test('expect applehv label with applehv provider', async () => {
  const label = getProviderLabel(VMTYPE.APPLEHV);
  expect(label).equals(APPLEHV_LABEL);
});

test('expect wsl label with wsl provider', async () => {
  const label = getProviderLabel(VMTYPE.WSL);
  expect(label).equals(WSL_LABEL);
});

test('expect hyperv label with hyperv provider', async () => {
  const label = getProviderLabel(VMTYPE.HYPERV);
  expect(label).equals(HYPERV_LABEL);
});

test('expect provider name with provider different from libkrun and applehv', async () => {
  const label = getProviderLabel('unknown');
  expect(label).equals('unknown');
});

test('expect libkrun provider with libkrun label', async () => {
  const provider = getProviderByLabel(LIBKRUN_LABEL);
  expect(provider).equals(VMTYPE.LIBKRUN);
});

test('expect applehv provider with applehv label', async () => {
  const provider = getProviderByLabel(APPLEHV_LABEL);
  expect(provider).equals(VMTYPE.APPLEHV);
});

test('expect wsl label with wsl provider wsl label', async () => {
  const provider = getProviderByLabel(WSL_LABEL);
  expect(provider).equals(VMTYPE.WSL);
});

test('expect hyperv label with hyperv provider wsl label', async () => {
  const provider = getProviderByLabel(HYPERV_LABEL);
  expect(provider).equals(VMTYPE.HYPERV);
});

describe('Check multiple Podman installations', () => {
  test('should return empty warnings when no Podman installation provided', async () => {
    const warnings = await getMultiplePodmanInstallationsWarnings(undefined);

    expect(warnings).toEqual([]);
    expect(podmanCli.findPodmanInstallations).not.toHaveBeenCalled();
  });

  test('should return empty warnings when custom binary path is set', async () => {
    vi.spyOn(podmanCli, 'getCustomBinaryPath').mockReturnValue('/custom/path/podman');

    const warnings = await getMultiplePodmanInstallationsWarnings({ version: '5.0.0' });

    expect(warnings).toEqual([]);
    expect(podmanCli.findPodmanInstallations).not.toHaveBeenCalled();
  });

  test('should return empty warnings when only one installation detected', async () => {
    vi.mocked(podmanCli.findPodmanInstallations).mockResolvedValue(['/usr/bin/podman']);

    const warnings = await getMultiplePodmanInstallationsWarnings({ version: '5.0.0' });

    expect(warnings).toEqual([]);
    expect(podmanCli.findPodmanInstallations).toHaveBeenCalledOnce();
  });

  test('should return warning when multiple installations detected', async () => {
    vi.mocked(podmanCli.findPodmanInstallations).mockResolvedValue(['/usr/bin/podman', '/usr/local/bin/podman']);

    const warnings = await getMultiplePodmanInstallationsWarnings({ version: '5.0.0' });

    expect(warnings).toEqual([
      {
        name: 'Multiple Podman installations detected',
        details:
          'You have multiple Podman instances in your PATH: /usr/bin/podman, /usr/local/bin/podman. This may cause conflicts. Consider leaving one installation or configure custom binary path in the Podman extension settings to avoid issues.',
      },
    ]);
    expect(podmanCli.findPodmanInstallations).toHaveBeenCalledOnce();
  });
});
