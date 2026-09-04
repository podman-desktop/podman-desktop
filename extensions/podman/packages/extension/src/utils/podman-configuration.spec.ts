/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import * as fs from 'node:fs';
import * as os from 'node:os';

import type { ExtensionContext, ProxySettings } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { PodmanConfiguration } from './podman-configuration';
import { VMTYPE } from './util';

vi.mock(import('node:fs'));

vi.mock(import('node:os'), async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const osActual = await vi.importActual<typeof import('node:os')>('node:os');

  return {
    ...osActual,
    arch: vi.fn(),
  };
});

const extensionContext: ExtensionContext = {} as unknown as ExtensionContext;

// allows to call protected methods
class TestPodmanConfiguration extends PodmanConfiguration {
  readContainersConfigFile(): Promise<string> {
    return super.readContainersConfigFile();
  }
}

let podmanConfiguration: TestPodmanConfiguration;

beforeEach(() => {
  podmanConfiguration = new TestPodmanConfiguration(extensionContext);
});

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

test('should return true if regex is satisfied', async () => {
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue(`
[machine]
provider = "hyperv"
memory = 4096
    `);
  const found = await podmanConfiguration.matchRegexpInContainersConfig(/provider\s*=\s*"hyperv"/);
  expect(found).toBeTruthy();
});

test('should return false if regex is not satisfied', async () => {
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue(`
[machine]
provider = "wsl"
memory = 4096
    `);
  const found = await podmanConfiguration.matchRegexpInContainersConfig(/provider\s*=\s*"hyperv"/);
  expect(found).toBeFalsy();
});

test('when enable rosetta is set to true and there is already a file with rosetta = false, remove it.', async () => {
  const configFileContent = `
[machine]
memory = 4096
rosetta = false
    `;
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue(configFileContent);
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);

  await podmanConfiguration.updateRosettaSetting(true);

  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    podmanConfiguration.getContainersFileLocation(),
    // Expect that the write file did not contain any rosetta references
    expect.not.stringContaining('rosetta'),
  );
});

test('should disable Rosetta when useRosetta is false', async () => {
  const configFileContent = `
[machine]
memory = 4096
rosetta = true
    `;
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue(configFileContent);
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);

  await podmanConfiguration.updateRosettaSetting(false);

  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    podmanConfiguration.getContainersFileLocation(),
    expect.stringContaining('rosetta = false'),
  );
});

test('if rosetta is set to true and the file does NOT exist, do not try and create the file.', async () => {
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('');
  vi.spyOn(fs, 'existsSync').mockReturnValue(false);

  await podmanConfiguration.updateRosettaSetting(true);

  expect(fs.promises.writeFile).not.toHaveBeenCalled();
});

describe('isRosettaEnabled', () => {
  test('check rosetta is enabled', async () => {
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
    vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('[machine]\nrosetta=true');
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const isEnabled = await podmanConfiguration.isRosettaEnabled();

    expect(isEnabled).toBeTruthy();
  });

  test('check rosetta is enabled if file is not containing rosetta setting (default value is true)', async () => {
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
    vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('');
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const isEnabled = await podmanConfiguration.isRosettaEnabled();

    expect(isEnabled).toBeTruthy();
  });

  test('check rosetta is disabled', async () => {
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
    vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('[machine]\nrosetta=false');

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const isEnabled = await podmanConfiguration.isRosettaEnabled();

    expect(isEnabled).toBeFalsy();
  });
});

test('when provider is set to applehv provider and there is already a file with provider = libkrun, remove it.', async () => {
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('[machine]\nprovider = "libkrun"');

  vi.spyOn(fs, 'existsSync').mockReturnValue(true);

  await podmanConfiguration.updateMachineProviderSettings(VMTYPE.APPLEHV);

  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    podmanConfiguration.getContainersFileLocation(),
    // should not contain provider
    expect.not.stringContaining('provider'),
  );
});

test('should update provider', async () => {
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('[machine]\nprovider = "applehv"');

  vi.spyOn(fs, 'existsSync').mockReturnValue(true);

  await podmanConfiguration.updateMachineProviderSettings(VMTYPE.LIBKRUN);

  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    podmanConfiguration.getContainersFileLocation(),
    // should contain provider
    expect.stringContaining('provider = "libkrun"'),
  );
});

test('if provider is set default one (on CLI) and the file does NOT exist, do not try and create the file.', async () => {
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('');
  vi.spyOn(fs, 'existsSync').mockReturnValue(false);

  await podmanConfiguration.updateMachineProviderSettings(VMTYPE.APPLEHV);

  expect(fs.promises.writeFile).not.toHaveBeenCalled();
});

test('if provider is applehv and persistence is requested, write provider = "applehv" even though it is the default.', async () => {
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('');
  vi.spyOn(fs, 'existsSync').mockReturnValue(false);

  await podmanConfiguration.updateMachineProviderSettings(VMTYPE.APPLEHV, true);

  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    podmanConfiguration.getContainersFileLocation(),
    // should contain provider even though applehv is the default
    expect.stringContaining('provider = "applehv"'),
  );
});

describe('handleRosettaSetting', () => {
  function mockRosettaConfiguration(useRosetta: boolean | undefined): void {
    vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(useRosetta),
    } as unknown as extensionApi.Configuration);
  }

  test('on Apple Silicon, enabling Rosetta pins the applehv provider and syncs the rosetta setting', async () => {
    vi.mocked(os.arch).mockReturnValue('arm64');
    mockRosettaConfiguration(true);
    const updateProvider = vi.spyOn(podmanConfiguration, 'updateMachineProviderSettings').mockResolvedValue();
    const updateRosetta = vi.spyOn(podmanConfiguration, 'updateRosettaSetting').mockResolvedValue();

    await podmanConfiguration.handleRosettaSetting();

    // applehv must be persisted so it overrides the arm64 libkrun default
    expect(updateProvider).toHaveBeenCalledWith(VMTYPE.APPLEHV, true);
    expect(updateRosetta).toHaveBeenCalledWith(true);
  });

  test('on Apple Silicon, disabling Rosetta falls back to the libkrun provider', async () => {
    vi.mocked(os.arch).mockReturnValue('arm64');
    mockRosettaConfiguration(false);
    const updateProvider = vi.spyOn(podmanConfiguration, 'updateMachineProviderSettings').mockResolvedValue();
    const updateRosetta = vi.spyOn(podmanConfiguration, 'updateRosettaSetting').mockResolvedValue();

    await podmanConfiguration.handleRosettaSetting();

    expect(updateProvider).toHaveBeenCalledWith(VMTYPE.LIBKRUN, false);
    expect(updateRosetta).toHaveBeenCalledWith(false);
  });

  test('when the setting is unset, it defaults to false and falls back to libkrun on Apple Silicon', async () => {
    vi.mocked(os.arch).mockReturnValue('arm64');
    mockRosettaConfiguration(undefined);
    const updateProvider = vi.spyOn(podmanConfiguration, 'updateMachineProviderSettings').mockResolvedValue();
    const updateRosetta = vi.spyOn(podmanConfiguration, 'updateRosettaSetting').mockResolvedValue();

    await podmanConfiguration.handleRosettaSetting();

    expect(updateProvider).toHaveBeenCalledWith(VMTYPE.LIBKRUN, false);
    expect(updateRosetta).toHaveBeenCalledWith(false);
  });

  test('on Intel, the provider is left untouched (applehv is always the default there)', async () => {
    vi.mocked(os.arch).mockReturnValue('x64');
    mockRosettaConfiguration(true);
    const updateProvider = vi.spyOn(podmanConfiguration, 'updateMachineProviderSettings').mockResolvedValue();
    const updateRosetta = vi.spyOn(podmanConfiguration, 'updateRosettaSetting').mockResolvedValue();

    await podmanConfiguration.handleRosettaSetting();

    expect(updateProvider).not.toHaveBeenCalled();
    expect(updateRosetta).toHaveBeenCalledWith(true);
  });
});

test('doUpdateProxySettings should be called one at the time', async () => {
  const proxySettings: ProxySettings = {
    httpProxy: 'httpProxy',
    httpsProxy: 'httpsProxy',
    noProxy: 'noProxy',
  };

  // Mock updateProxySettings
  const doUpdateProxySettingsMock = vi.spyOn(podmanConfiguration, 'doUpdateProxySettings').mockResolvedValue();

  // Simultaneously call the function twice
  const call1 = podmanConfiguration.updateProxySettings(undefined);
  const call2 = podmanConfiguration.updateProxySettings(proxySettings);

  await call1;
  expect(doUpdateProxySettingsMock).toHaveBeenCalledTimes(1);
  expect(doUpdateProxySettingsMock.mock.calls[0][0]).toBe(undefined);

  await call2;
  expect(doUpdateProxySettingsMock).toHaveBeenCalledTimes(2);
  expect(doUpdateProxySettingsMock.mock.calls[1][0]).toBe(proxySettings);
});
