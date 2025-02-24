/**********************************************************************
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
 ***********************************************************************/

import { writeFile } from 'node:fs/promises';
import * as os from 'node:os';

import type { ExtensionContext } from '@podman-desktop/api';
import { env } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { RegistryConfiguration } from './registry-configuration';
import { RegistryConfigurationImpl } from './registry-configuration';

let registryConfiguration: RegistryConfiguration;

const extensionContext = {
  storagePath: '/fake/path',
} as unknown as ExtensionContext;

vi.mock('node:fs/promises');

vi.mock('@podman-desktop/api', async () => {
  return {
    process: {
      exec: vi.fn(),
    },
    env: {
      isLinux: false,
      isWindows: false,
      isMac: false,
    },
  };
});

beforeEach(() => {
  registryConfiguration = new RegistryConfigurationImpl(extensionContext);
  vi.restoreAllMocks();
  vi.resetAllMocks();
  vi.mocked(env).isWindows = false;
  vi.mocked(env).isMac = false;
  vi.mocked(env).isLinux = false;
});

describe('getRegistryConfFilePath', () => {
  test('expect correct path on Windows', async () => {
    vi.mocked(env).isWindows = true;
    const file = registryConfiguration.getRegistryConfFilePath();
    // file should be inside the home directory
    expect(file).toContain(os.homedir());
    // filename should be registries.conf
    expect(file).toContain('registries.conf');
  });

  test('expect correct path on macOS', async () => {
    vi.mocked(env).isMac = true;
    const file = registryConfiguration.getRegistryConfFilePath();
    // file should be inside the home directory
    expect(file).toContain(os.homedir());
    // filename should be registries.conf
    expect(file).toContain('registries.conf');
  });
});

describe('getPathToRegistriesConfInsideVM', () => {
  test('expect correct path on Windows', async () => {
    vi.mocked(env).isWindows = true;

    // mock the config path being usually computed
    vi.spyOn(registryConfiguration, 'getRegistryConfFilePath').mockReturnValue('C:\\Users\\foo\\registries.conf');
    const file = registryConfiguration.getPathToRegistriesConfInsideVM();
    expect(file).toBe('/mnt/c/Users/foo/registries.conf');
  });

  test('expect correct path on macOS', async () => {
    vi.mocked(env).isMac = true;
    // mock the config path being usually computed
    const pathOnHost = '/Users/foo/.config/containers/registries.conf';
    vi.spyOn(registryConfiguration, 'getRegistryConfFilePath').mockReturnValue(pathOnHost);
    const file = registryConfiguration.getPathToRegistriesConfInsideVM();
    // path on host and in vm should be the same
    expect(file).toBe(pathOnHost);
  });
});

describe('getPlaybookScriptPath', () => {
  test('expect correct script', async () => {
    vi.mocked(env).isMac = true;

    // mock the config path being usually computed
    vi.spyOn(registryConfiguration, 'getPathToRegistriesConfInsideVM').mockReturnValue('/fake/path/inside/vm');

    // call the method
    const playbookPath = await registryConfiguration.getPlaybookScriptPath();
    // expect the path to be inside the extension storage path
    expect(playbookPath).toContain(extensionContext.storagePath);

    // we should have written content
    expect(vi.mocked(writeFile)).toBeCalledWith(
      expect.stringContaining('playbook-setup-registry-conf-file.yml'),
      expect.stringContaining(
        'sudo ln -s /fake/path/inside/vm /etc/containers/registries.conf.d/999-podman-desktop-registries-from-host.conf',
      ),
      'utf-8',
    );
  });
});
