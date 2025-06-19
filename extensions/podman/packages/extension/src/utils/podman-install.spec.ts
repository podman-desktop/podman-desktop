/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import * as extensionApi from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import * as extensionObj from '../extension';
import type { Installer } from '../installer/installer';
import { releaseNotes } from '../podman5.json';
import { getBundledPodmanVersion } from './podman-bundled';
import type { InstalledPodman } from './podman-cli';
import type { PodmanInfo, UpdateCheck } from './podman-install';
import { PodmanInstall } from './podman-install';
import * as utils from './util';

const originalConsoleError = console.error;
const consoleErrorMock = vi.fn();

const extensionContext = {
  subscriptions: [],
} as unknown as extensionApi.ExtensionContext;

const provider: extensionApi.Provider = {
  setContainerProviderConnectionFactory: vi.fn(),
  setKubernetesProviderConnectionFactory: vi.fn(),
  setVmProviderConnectionFactory: vi.fn(),
  registerContainerProviderConnection: vi.fn(),
  registerKubernetesProviderConnection: vi.fn(),
  registerVmProviderConnection: vi.fn(),
  registerLifecycle: vi.fn(),
  registerInstallation: vi.fn(),
  registerUpdate: vi.fn(),
  registerAutostart: vi.fn(),
  registerCleanup: vi.fn(),
  dispose: vi.fn(),
  name: '',
  id: '',
  status: 'started',
  updateStatus: vi.fn(),
  onDidUpdateStatus: vi.fn(),
  version: '',
  updateVersion: vi.fn(),
  onDidUpdateVersion: vi.fn(),
  images: {},
  links: [],
  detectionChecks: [],
  updateDetectionChecks: vi.fn(),
  warnings: [],
  updateWarnings: vi.fn(),
  onDidUpdateDetectionChecks: vi.fn(),
};

// mock filesystem
vi.mock('node:fs');

// mock ps-list
vi.mock('ps-list', async () => {
  return {
    default: vi.fn(),
  };
});

// mock release
vi.mock('node:os', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('node:os')>('node:os');
  return {
    ...actual,
    release: vi.fn(),
    totalmem: vi.fn(),
  };
});

vi.mock('@podman-desktop/api', async () => {
  return {
    commands: {
      registerCommand: vi.fn(),
    },
    env: {
      isMac: true,
      openExternal: vi.fn(),
    },
    window: {
      withProgress: vi.fn(),
      showNotification: vi.fn(),
      showErrorMessage: vi.fn(),
      showInformationMessage: vi.fn(),
      showWarningMessage: vi.fn(),
    },
    ProgressLocation: {},
    process: {
      exec: vi.fn(),
    },
    configuration: {
      getConfiguration: vi.fn(),
    },
    Uri: {
      parse: vi.fn(),
    },
    context: {
      setValue: vi.fn(),
    },
  };
});

vi.mock(import('./util'), async () => {
  return {
    getAssetsFolder: vi.fn().mockReturnValue(''),
    runCliCommand: vi.fn(),
    appHomeDir: vi.fn().mockReturnValue(''),
    normalizeWSLOutput: vi.fn().mockImplementation((s: string) => s),
    isLinux: vi.fn(),
    isWindows: vi.fn(),
    isMac: vi.fn(),
    execPodman: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  // reset array of subscriptions
  extensionContext.subscriptions.length = 0;
  console.error = consoleErrorMock;
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => false,
    has: vi.fn(),
    update: vi.fn(),
  });
});

afterEach(() => {
  console.error = originalConsoleError;
});

class TestPodmanInstall extends PodmanInstall {
  async stopPodmanMachinesIfAnyBeforeUpdating(): Promise<boolean> {
    return super.stopPodmanMachinesIfAnyBeforeUpdating();
  }

  async wipeAllDataBeforeUpdatingToV5(installed: InstalledPodman, updateCheck: UpdateCheck): Promise<boolean> {
    return super.wipeAllDataBeforeUpdatingToV5(installed, updateCheck);
  }

  getProviderCleanup(): extensionApi.ProviderCleanup {
    if (!this.providerCleanup) {
      throw new Error('providerCleanup is not defined');
    }
    return this.providerCleanup;
  }

  getInstaller(): Installer | undefined {
    return super.getInstaller();
  }
}

describe('update checks', () => {
  test('stopPodmanMachinesIfAnyBeforeUpdating with an error', async () => {
    const podmanInstall = new TestPodmanInstall(extensionContext);

    // return empty machine list
    vi.mocked(extensionApi.process.exec).mockRejectedValue('invalid');

    await podmanInstall.stopPodmanMachinesIfAnyBeforeUpdating();

    // expect user is not prompted
    expect(extensionApi.window.showInformationMessage).not.toHaveBeenCalled();
  });

  test('stopPodmanMachinesIfAnyBeforeUpdating with no machine running', async () => {
    const podmanInstall = new TestPodmanInstall(extensionContext);

    // return empty machine list
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: '[]',
    } as unknown as extensionApi.RunResult);

    await podmanInstall.stopPodmanMachinesIfAnyBeforeUpdating();

    // expect user is not prompted as it is not running
    expect(extensionApi.window.showInformationMessage).not.toHaveBeenCalled();
  });

  test('stopPodmanMachinesIfAnyBeforeUpdating with one machine running', async () => {
    const podmanInstall = new TestPodmanInstall(extensionContext);

    vi.spyOn(extensionApi.process, 'exec').mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as extensionApi.RunResult);

    // return empty machine list
    vi.spyOn(utils, 'execPodman').mockResolvedValueOnce({
      stdout: JSON.stringify([{ Name: 'test', Running: true, VMType: 'libkrun' }]),
    } as unknown as extensionApi.RunResult);

    // mock user response
    vi.spyOn(extensionApi.window, 'showInformationMessage').mockResolvedValue('Yes');

    await podmanInstall.stopPodmanMachinesIfAnyBeforeUpdating();

    // expect user is not prompted as it is not running
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalled();

    // check we called the stop command
    expect(extensionApi.process.exec).toHaveBeenCalledWith(expect.stringContaining('podman'), [
      'machine',
      'stop',
      'test',
    ]);
  });

  test('wipeAllDataBeforeUpdatingToV5 with podman 4.9 -> 5.0', async () => {
    const podmanInstall = new TestPodmanInstall(extensionContext);

    // mock the getActions
    const providerCleanup = podmanInstall.getProviderCleanup();
    expect(providerCleanup).toBeDefined();

    // fake actions
    const action1Exectute = vi.fn();
    const action1 = {
      name: 'test',
      execute: action1Exectute,
    };

    vi.spyOn(providerCleanup, 'getActions').mockResolvedValue([action1]);

    // mock user response
    vi.spyOn(extensionApi.window, 'showInformationMessage').mockResolvedValue('Yes');

    await podmanInstall.wipeAllDataBeforeUpdatingToV5(
      {
        version: '4.9.3',
      } as unknown as InstalledPodman,
      {
        bundledVersion: '5.0.0',
      } as unknown as UpdateCheck,
    );

    // expect user is prompted
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalled();

    // getActions should have been called
    expect(providerCleanup.getActions).toHaveBeenCalled();

    // action should have been called
    expect(action1Exectute).toHaveBeenCalled();
  });

  test('wipeAllDataBeforeUpdatingToV5 no action with podman 4.9.1 -> 4.9.2', async () => {
    const podmanInstall = new TestPodmanInstall(extensionContext);

    // mock the getActions
    const providerCleanup = podmanInstall.getProviderCleanup();
    expect(providerCleanup).toBeDefined();
    vi.spyOn(providerCleanup, 'getActions');

    await podmanInstall.wipeAllDataBeforeUpdatingToV5(
      {
        version: '4.9.1',
      } as unknown as InstalledPodman,
      {
        bundledVersion: '4.9.2',
      } as unknown as UpdateCheck,
    );

    // expect user is not prompted
    expect(extensionApi.window.showInformationMessage).not.toHaveBeenCalled();

    // getActions should not have been called
    expect(providerCleanup.getActions).not.toHaveBeenCalled();
  });
});

test('checkForUpdate should return no installed version if there is no lastRunInfo', async () => {
  const podmanInstall = new TestPodmanInstall(extensionContext);
  vi.spyOn(podmanInstall, 'getLastRunInfo').mockResolvedValue(undefined);
  const result = await podmanInstall.checkForUpdate(undefined);
  expect(result).toStrictEqual({ installedVersion: undefined, hasUpdate: false, bundledVersion: undefined });
});

test('checkForUpdate should return no installed version if there is lastRunInfo but it has no version', async () => {
  const podmanInstall = new TestPodmanInstall(extensionContext);
  vi.spyOn(podmanInstall, 'getLastRunInfo').mockResolvedValue({
    lastUpdateCheck: 0,
  });
  const result = await podmanInstall.checkForUpdate(undefined);
  expect(result).toStrictEqual({ installedVersion: undefined, hasUpdate: false, bundledVersion: undefined });
});

test('checkForUpdate should return installed version and no update if the installed version is the latest', async () => {
  const podmanInstall = new TestPodmanInstall(extensionContext);
  vi.spyOn(podmanInstall, 'getInstaller').mockReturnValue({
    requireUpdate: vi.fn().mockReturnValue(false),
  } as unknown as Installer);
  vi.spyOn(podmanInstall, 'getLastRunInfo').mockResolvedValue({
    lastUpdateCheck: 0,
  });
  const result = await podmanInstall.checkForUpdate({
    version: '1.1',
  });
  expect(result).toStrictEqual({
    installedVersion: '1.1',
    hasUpdate: false,
    bundledVersion: getBundledPodmanVersion(),
  });
});

test('checkForUpdate should return installed version and update if the installed version is NOT the latest', async () => {
  const podmanInstall = new TestPodmanInstall(extensionContext);
  vi.spyOn(podmanInstall, 'getInstaller').mockReturnValue({
    requireUpdate: vi.fn().mockReturnValue(true),
  } as unknown as Installer);
  vi.spyOn(podmanInstall, 'getLastRunInfo').mockResolvedValue({
    lastUpdateCheck: 0,
  });
  const result = await podmanInstall.checkForUpdate({
    version: '1.1',
  });
  expect(result).toStrictEqual({
    installedVersion: '1.1',
    hasUpdate: true,
    bundledVersion: getBundledPodmanVersion(),
  });
});

const providerMock: extensionApi.Provider = {} as unknown as extensionApi.Provider;

describe('performUpdate', () => {
  test('should raise an error if no podmanInfo provided', async () => {
    const podmanInstall: TestPodmanInstall = new TestPodmanInstall(extensionContext);

    await expect(() => {
      return podmanInstall.performUpdate(providerMock, undefined);
    }).rejects.toThrowError('The podman extension has not been successfully initialized');
  });

  test('should call showWarningMessage if stopPodmanMachinesIfAnyBeforeUpdating resolve false', async () => {
    const podmanInstall: TestPodmanInstall = new TestPodmanInstall(extensionContext);
    // mock initialized
    podmanInstall['podmanInfo'] = {} as unknown as PodmanInfo;
    // mock checkForUpdate
    vi.spyOn(podmanInstall, 'checkForUpdate').mockResolvedValue({
      hasUpdate: true,
      installedVersion: '1.0.0',
      bundledVersion: '0.9.8',
    });
    // E.g. user cancel stop
    vi.spyOn(podmanInstall, 'stopPodmanMachinesIfAnyBeforeUpdating').mockResolvedValue(false);

    await podmanInstall.performUpdate(providerMock, undefined);

    expect(extensionApi.window.showWarningMessage).toHaveBeenCalledWith('Podman update has been canceled.', 'OK');
  });

  test('should call showInformationMessage ', async () => {
    vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue(undefined);

    const podmanInstall: TestPodmanInstall = new TestPodmanInstall(extensionContext);
    // mock initialized
    podmanInstall['podmanInfo'] = {} as unknown as PodmanInfo;

    // all podman machine are stopped
    vi.spyOn(podmanInstall, 'stopPodmanMachinesIfAnyBeforeUpdating').mockResolvedValue(true);
    // return true if data have been cleaned or if user skip it
    vi.spyOn(podmanInstall, 'wipeAllDataBeforeUpdatingToV5').mockResolvedValue(true);

    // mock checkForUpdate
    vi.spyOn(podmanInstall, 'checkForUpdate').mockResolvedValue({
      hasUpdate: true,
      installedVersion: '1.0.0',
      bundledVersion: '0.9.8',
    });

    await podmanInstall.performUpdate(providerMock, undefined);

    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      'You have Podman 1.0.0.\nDo you want to update to 0.9.8?',
      'Yes',
      'No',
      'Ignore',
      'Open release notes',
    );
  });

  test('user clicking on Open release note should open external link', async () => {
    vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Open release notes');

    const podmanInstall: TestPodmanInstall = new TestPodmanInstall(extensionContext);
    // mock initialized
    podmanInstall['podmanInfo'] = {} as unknown as PodmanInfo;

    // all podman machine are stopped
    vi.spyOn(podmanInstall, 'stopPodmanMachinesIfAnyBeforeUpdating').mockResolvedValue(true);
    // return true if data have been cleaned or if user skip it
    vi.spyOn(podmanInstall, 'wipeAllDataBeforeUpdatingToV5').mockResolvedValue(true);

    // mock checkForUpdate
    vi.spyOn(podmanInstall, 'checkForUpdate').mockResolvedValue({
      hasUpdate: true,
      installedVersion: '1.0.0',
      bundledVersion: '0.9.8',
    });

    await podmanInstall.performUpdate(providerMock, undefined);

    expect(extensionApi.Uri.parse).toHaveBeenCalledWith(releaseNotes.href);
    expect(extensionApi.env.openExternal).toHaveBeenCalled();
  });

  test('should not start instalation when updating from Podman 5.3.1 to 5.4.X', async () => {
    vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Yes');
    const podmanInstall: TestPodmanInstall = new TestPodmanInstall(extensionContext);
    (extensionApi.env.isWindows as boolean) = true;
    // all podman machine are stopped
    vi.spyOn(podmanInstall, 'stopPodmanMachinesIfAnyBeforeUpdating').mockResolvedValue(true);
    // return true if data have been cleaned or if user skip it
    vi.spyOn(podmanInstall, 'wipeAllDataBeforeUpdatingToV5').mockResolvedValue(true);

    // mock initialized
    podmanInstall['podmanInfo'] = {} as unknown as PodmanInfo;
    // mock checkForUpdate
    vi.spyOn(podmanInstall, 'checkForUpdate').mockResolvedValue({
      hasUpdate: true,
      installedVersion: '5.3.1',
      bundledVersion: '5.4.1',
    });

    await podmanInstall.performUpdate(providerMock, undefined);

    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      'Updating the podman from 5.3.1 to 5.4.1 requires manual installation.\nDo you want to show instructions for this?',
      'Yes',
      'No',
    );

    expect(extensionApi.Uri.parse).toHaveBeenCalledWith(
      'https://github.com/containers/podman/blob/main/docs/tutorials/podman-for-windows.md',
    );
    expect(extensionApi.env.openExternal).toHaveBeenCalled();
  });
});

describe('MacOSInstaller', () => {
  // call the parameter
  const progress = {
    report: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(extensionApi.window.withProgress).mockImplementation((options, task) => {
      return task(progress, {} as unknown as extensionApi.CancellationToken);
    });
  });

  test('call installer if universal installer is found', async () => {
    // say we're using macOS
    vi.spyOn(os, 'platform').mockReturnValue('darwin');
    const podmanInstall = new TestPodmanInstall(extensionContext);

    const installer = podmanInstall.getInstaller();

    // mock existSync being true only for universal
    vi.spyOn(fs, 'existsSync').mockImplementation(path => {
      return path.toString().includes('universal');
    });

    // check we have an installer
    expect(installer).toBeDefined();

    // mock extensionApi.window.withProgress
    const withProgressMock = vi.mocked(extensionApi.window.withProgress);

    // call install
    const promiseResult = installer?.install();

    // wait our mock is called
    await vi.waitFor(() => expect(withProgressMock).toBeCalled());

    // get the call's argument to the method
    const methodArgs = withProgressMock.mock.calls[0];
    const promiseArg = methodArgs[1];
    expect(promiseArg).toBeDefined();

    const token = {
      isCancellationRequested: false,
    } as unknown as extensionApi.CancellationToken;

    await promiseArg(progress, token);

    await promiseResult;

    // check we've called the execution of the universal installer
    expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
      'open',
      expect.arrayContaining([expect.stringContaining('podman-installer-macos-universal')]),
    );
  });

  test('call specific arch installer is found', async () => {
    // say we're using macOS
    vi.spyOn(os, 'platform').mockReturnValue('darwin');
    const podmanInstall = new TestPodmanInstall(extensionContext);

    const installer = podmanInstall.getInstaller();

    // mock existSync being true only if not universal binary
    vi.spyOn(fs, 'existsSync').mockImplementation(path => {
      return !path.toString().includes('universal');
    });

    // check we have an installer
    expect(installer).toBeDefined();

    // mock extensionApi.window.withProgress
    const withProgressMock = vi.mocked(extensionApi.window.withProgress);

    // call install
    const promiseResult = installer?.install();

    // wait our mock is called
    await vi.waitFor(() => expect(withProgressMock).toBeCalled());

    // get the call's argument to the method
    const methodArgs = withProgressMock.mock.calls[0];
    const promiseArg = methodArgs[1];
    expect(promiseArg).toBeDefined();

    // call the parameter
    const progress = {
      report: vi.fn(),
    };

    const token = {
      isCancellationRequested: false,
    } as unknown as extensionApi.CancellationToken;

    await promiseArg(progress, token);

    await promiseResult;

    // check we've called the execution of the universal installer
    const pkgArch = process.arch === 'arm64' ? 'aarch64' : 'amd64';
    expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
      'open',
      expect.arrayContaining([expect.stringContaining(`podman-installer-macos-${pkgArch}`)]),
    );
  });

  test('check error if no installer is found', async () => {
    // say we're using macOS
    vi.spyOn(os, 'platform').mockReturnValue('darwin');
    const podmanInstall = new TestPodmanInstall(extensionContext);

    const installer = podmanInstall.getInstaller();

    // mock existSync being always false (we never find installers)
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    // check we have an installer
    expect(installer).toBeDefined();

    // mock extensionApi.window.withProgress
    const withProgressMock = vi.mocked(extensionApi.window.withProgress);

    // call install
    const promiseResult = installer?.install();

    // wait our mock is called
    await vi.waitFor(() => expect(withProgressMock).toBeCalled());

    // get the call's argument to the method
    const methodArgs = withProgressMock.mock.calls[0];
    const promiseArg = methodArgs[1];
    expect(promiseArg).toBeDefined();

    // call the parameter
    const progress = {
      report: vi.fn(),
    };

    const token = {
      isCancellationRequested: false,
    } as unknown as extensionApi.CancellationToken;

    await expect(promiseArg(progress, token)).rejects.toThrow(`Can't find Podman package`);
    expect(promiseResult).toBeDefined();
  });
});

test('check that podman installation refreshed machine settings', async () => {
  const podmanInstall = new TestPodmanInstall(extensionContext);

  vi.spyOn(podmanInstall, 'getLastRunInfo').mockResolvedValue({
    lastUpdateCheck: 0,
    podmanVersion: '5.0.0',
  });
  vi.spyOn(podmanInstall, 'getInstaller').mockReturnValue(undefined);

  // mock existSync being always false (we never find installers)
  vi.spyOn(fs, 'existsSync').mockReturnValue(false);
  vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Yes');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({ command: '', stderr: '', stdout: '5.0.0' });
  const mock = vi.spyOn(extensionObj, 'calcPodmanMachineSetting');

  await podmanInstall.checkForUpdate(undefined);
  await podmanInstall.doInstallPodman(provider);

  expect(mock).toHaveBeenCalled();
});
