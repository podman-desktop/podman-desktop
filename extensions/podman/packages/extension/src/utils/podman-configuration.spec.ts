/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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

import type { ExtensionContext, ProxySettings } from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { PodmanConfiguration } from './podman-configuration';
import { VMTYPE } from './util';

vi.mock(import('node:fs'));

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
  vi.spyOn(fs, 'existsSync').mockImplementation(() => {
    return true;
  });

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
  vi.spyOn(fs, 'existsSync').mockImplementation(() => {
    return true;
  });

  await podmanConfiguration.updateRosettaSetting(false);

  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    podmanConfiguration.getContainersFileLocation(),
    expect.stringContaining('rosetta = false'),
  );
});

test('if rosetta is set to true and the file does NOT exist, do not try and create the file.', async () => {
  vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
  vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue('');
  vi.spyOn(fs, 'existsSync').mockImplementation(() => {
    return false;
  });

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

describe('doUpdateProxySettings sets [containers].http_proxy', () => {
  test('should set http_proxy = true in [containers] when creating new file with proxy', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();

    const proxySettings: ProxySettings = {
      httpProxy: 'http://proxy:8080',
      httpsProxy: 'https://proxy:8443',
      noProxy: '',
    };

    await podmanConfiguration.doUpdateProxySettings(proxySettings);

    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      podmanConfiguration.getContainersFileLocation(),
      expect.stringContaining('http_proxy = true'),
    );
  });

  test('should not set http_proxy in [containers] when creating new file without proxy', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();

    await podmanConfiguration.doUpdateProxySettings(undefined);

    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      podmanConfiguration.getContainersFileLocation(),
      expect.not.stringContaining('http_proxy'),
    );
  });

  test('should set http_proxy = true in [containers] when updating existing file with proxy', async () => {
    const configFileContent = `
[engine]
env = ["http_proxy=http://old-proxy:8080"]
`;
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
    vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue(configFileContent);

    const proxySettings: ProxySettings = {
      httpProxy: 'http://proxy:8080',
      httpsProxy: 'https://proxy:8443',
      noProxy: '',
    };

    await podmanConfiguration.doUpdateProxySettings(proxySettings);

    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      podmanConfiguration.getContainersFileLocation(),
      expect.stringContaining('http_proxy = true'),
    );
  });

  test('should remove http_proxy from [containers] when proxy is cleared on existing file', async () => {
    const configFileContent = `
[containers]
http_proxy = true

[engine]
env = ["http_proxy=http://proxy:8080"]
`;
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
    vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue(configFileContent);

    await podmanConfiguration.doUpdateProxySettings(undefined);

    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      podmanConfiguration.getContainersFileLocation(),
      expect.not.stringContaining('http_proxy'),
    );
  });

  test('should preserve existing [containers] settings when adding http_proxy', async () => {
    const configFileContent = `
[containers]
log_driver = "journald"

[engine]
env = []
`;
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
    vi.spyOn(podmanConfiguration, 'readContainersConfigFile').mockResolvedValue(configFileContent);

    const proxySettings: ProxySettings = {
      httpProxy: 'http://proxy:8080',
      httpsProxy: 'https://proxy:8443',
      noProxy: 'noProxy',
    };

    await podmanConfiguration.doUpdateProxySettings(proxySettings);

    const writtenContent = vi.mocked(fs.promises.writeFile).mock.calls[0][1] as string;
    expect(writtenContent).toContain('http_proxy = true');
    expect(writtenContent).toContain('log_driver = "journald"');
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
