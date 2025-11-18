/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import type { CliTool, Logger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import * as cliRun from './cli-run';
import type { ComposeGithubReleaseArtifactMetadata } from './compose-github-releases';
import { Detect } from './detect';
import { ComposeDownload } from './download';
import { activate, deactivate } from './extension';

vi.mock('node:fs', () => ({
  promises: {
    unlink: vi.fn(),
  },
  existsSync: vi.fn(),
}));

const cliToolMock = {
  registerUpdate: vi.fn(),
  registerInstaller: vi.fn(),
  updateVersion: vi.fn(),
  dispose: vi.fn(),
  onDidUpdateVersion: vi.fn(),
} as unknown as CliTool;

vi.mock(import('./cli-run'));
vi.mock(import('./detect'));
vi.mock(import('./download'));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(extensionApi.cli.createCliTool).mockReturnValue(cliToolMock);
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    update: vi.fn(),
    get: vi.fn(),
    has: vi.fn(),
  });
});

afterEach(() => {
  return deactivate();
});

const extensionContextMock = {
  storagePath: 'dummy-storage-path',
  subscriptions: [],
} as unknown as extensionApi.ExtensionContext;

test('commands registered', async () => {
  await activate(extensionContextMock);

  [
    'compose.openComposeOnboarding',
    'compose.onboarding.checkDownloadedCommand',
    'compose.onboarding.downloadCommand',
    'compose.onboarding.promptUserForVersion',
    'compose.onboarding.installSystemWideCommand',
  ].forEach(command => {
    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(command, expect.any(Function));
  });
});

test('provider registered', async () => {
  await activate(extensionContextMock);

  expect(extensionApi.provider.createProvider).toHaveBeenCalledWith({
    emptyConnectionMarkdownDescription: expect.any(String),
    name: 'Compose',
    id: 'Compose',
    status: 'unknown',
    images: {
      icon: './icon.png',
    },
  });
});

test('downloadCommand should register cli tool if required', async () => {
  vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(false);
  vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('');
  vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
    version: 'v0.0.0',
    path: 'system-wide-path',
    updatable: false,
  });

  vi.mocked(ComposeDownload.prototype.getLatestVersionAsset).mockResolvedValue({
    tag: 'v1.0.0',
  } as unknown as ComposeGithubReleaseArtifactMetadata);

  vi.mocked(extensionApi.commands.registerCommand).mockImplementation((command, callback) => {
    if (command === 'compose.onboarding.downloadCommand') {
      expect(extensionApi.cli.createCliTool).not.toHaveBeenCalled();
      vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('storage-path');
      vi.mocked(Detect.prototype.getExtensionStorageBin).mockResolvedValue('storage-path');
      callback();
    }

    return {
      dispose: vi.fn(),
    };
  });

  await activate(extensionContextMock);

  await vi.waitFor(() => {
    expect(extensionApi.cli.createCliTool).toHaveBeenCalled();
  });
});

/**
 * (1) The postActivate will call createCliTool
 * (2) if a new version is available, registerUpdate will be called
 *
 * This function return the object provided to the registerUpdate method
 */
async function getCliToolUpdate(updatable: boolean): Promise<extensionApi.CliToolSelectUpdate> {
  vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
  vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
    version: 'v0.0.0',
    path: 'system-wide-path',
    updatable: updatable,
  });
  vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');

  let update: extensionApi.CliToolSelectUpdate | undefined;
  vi.mocked(cliToolMock.registerUpdate).mockImplementation(mUpdate => {
    if ('selectVersion' in mUpdate) {
      update = mUpdate;
    }
    return { dispose: vi.fn() };
  });

  await activate(extensionContextMock);

  await vi.waitFor(() => {
    expect(update).toBeDefined();
  });

  if (!update) throw new Error('undefined update');
  return update;
}

describe('registerCLITool', () => {
  test('createCliTool already installed system wide', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
    vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
      version: 'v0.0.0',
      path: 'system-wide-path',
      updatable: false, // not updatable as unknown location
    });

    vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(extensionApi.cli.createCliTool).toHaveBeenCalledWith({
        name: 'docker-compose',
        displayName: 'Compose',
        markdownDescription: expect.any(String),
        images: expect.anything(),
        version: '0.0.0',
        path: 'system-wide-path',
        installationSource: 'extension',
      });
    });

    expect(cliToolMock.registerInstaller).toHaveBeenCalled();
    expect(cliToolMock.registerUpdate).toHaveBeenCalled();
  });

  test('createCliTool already installed system wide by user', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
    vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
      version: 'v0.0.0',
      path: 'user-system-wide-path',
      updatable: false, // not updatable as unknown location
    });

    vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(extensionApi.cli.createCliTool).toHaveBeenCalledWith({
        name: 'docker-compose',
        displayName: 'Compose',
        markdownDescription: expect.any(String),
        images: expect.anything(),
        version: '0.0.0',
        path: 'user-system-wide-path',
        installationSource: 'external',
      });
    });

    expect(cliToolMock.registerInstaller).toHaveBeenCalled();
    expect(cliToolMock.registerUpdate).not.toHaveBeenCalled();
  });

  test('new version docker-compose available', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
    vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
      version: 'v0.0.0',
      path: 'system-wide-path',
      updatable: false, // not updatable as unknown location
    });
    vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');
    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(extensionApi.cli.createCliTool).toHaveBeenCalled();
      expect(cliToolMock.registerInstaller).toHaveBeenCalledWith({
        selectVersion: expect.any(Function),
        doInstall: expect.any(Function),
        doUninstall: expect.any(Function),
      });
      expect(cliToolMock.registerUpdate).toHaveBeenCalledWith({
        selectVersion: expect.any(Function),
        doUpdate: expect.any(Function),
      });
    });
  });

  test('try to update before selecting cli tool version should throw an error', async () => {
    const update: extensionApi.CliToolSelectUpdate = await getCliToolUpdate(false);
    await expect(() => update?.doUpdate({} as unknown as Logger)).rejects.toThrowError(
      'Cannot update system-wide-path version 0.0.0. No release selected.',
    );
  });

  test('update not updatable version should throw an error', async () => {
    vi.mocked(ComposeDownload.prototype.promptUserForVersion).mockResolvedValue({
      tag: 'v1.0.0',
    } as unknown as ComposeGithubReleaseArtifactMetadata);
    const update: extensionApi.CliToolSelectUpdate = await getCliToolUpdate(false);

    await update?.selectVersion();
    await expect(() => update?.doUpdate({} as unknown as Logger)).rejects.toThrowError(
      'Cannot update system-wide-path version 0.0.0 to 1.0.0 as it was not installed by podman-desktop',
    );
  });

  test('update updatable version should update version', async () => {
    vi.mocked(ComposeDownload.prototype.promptUserForVersion).mockResolvedValue({
      tag: 'v1.0.0',
    } as unknown as ComposeGithubReleaseArtifactMetadata);
    vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('extension-storage-path');
    const update: extensionApi.CliToolUpdate | extensionApi.CliToolSelectUpdate = await getCliToolUpdate(true);
    await update?.selectVersion();
    await update.doUpdate({} as unknown as Logger);

    expect(ComposeDownload.prototype.download).toHaveBeenCalledWith({
      tag: 'v1.0.0',
    });
    expect(Detect.prototype.getStoragePath).toHaveBeenCalled();
    expect(cliRun.installBinaryToSystem).toHaveBeenCalledWith('extension-storage-path', 'docker-compose');
    expect(cliToolMock.updateVersion).toHaveBeenCalledWith({
      installationSource: 'extension',
      version: '1.0.0',
    });
  });

  test('try to install when there is already an existing version should throw an error', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
    vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
      version: 'v0.0.0',
      path: 'system-wide-path',
      updatable: true,
    });
    vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');

    let installer: extensionApi.CliToolInstaller | undefined;
    vi.mocked(cliToolMock.registerInstaller).mockImplementation(mInstaller => {
      installer = mInstaller;
      return { dispose: vi.fn() };
    });

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(installer).toBeDefined();
    });

    await expect(() => installer?.doInstall({} as unknown as Logger)).rejects.toThrowError(
      `Cannot install docker-compose. Version 0.0.0 in system-wide-path is already installed.`,
    );
  });

  test('try to install before selecting cli tool version should throw an error', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(false);
    vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('');

    let installer: extensionApi.CliToolInstaller | undefined;
    vi.mocked(cliToolMock.registerInstaller).mockImplementation(mInstaller => {
      installer = mInstaller;
      return { dispose: vi.fn() };
    });

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(installer).toBeDefined();
    });

    await expect(() => installer?.doInstall({} as unknown as Logger)).rejects.toThrowError(
      `Cannot install docker-compose. No release selected.`,
    );
  });

  test('doInstall should download and install latest version', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(false);
    vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('');

    let installer: extensionApi.CliToolInstaller | undefined;
    vi.mocked(cliToolMock.registerInstaller).mockImplementation(mInstaller => {
      installer = mInstaller;
      return { dispose: vi.fn() };
    });

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(installer).toBeDefined();
    });

    vi.mocked(ComposeDownload.prototype.getLatestVersionAsset).mockResolvedValue({
      tag: 'v1.0.0',
    } as unknown as ComposeGithubReleaseArtifactMetadata);

    await installer?.selectVersion(true);

    await installer?.doInstall({} as unknown as Logger);
    expect(ComposeDownload.prototype.download).toHaveBeenCalledWith({
      tag: 'v1.0.0',
    });
    expect(Detect.prototype.getStoragePath).toHaveBeenCalled();
    expect(cliRun.installBinaryToSystem).toHaveBeenCalledWith('', 'docker-compose');
    expect(cliToolMock.updateVersion).toHaveBeenCalledWith({
      installationSource: 'extension',
      version: '1.0.0',
    });
  });

  test('by uninstalling it should delete all executables', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
    vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
      version: 'v0.0.0',
      path: 'system-wide-path',
      updatable: false, // not updatable as unknown location
    });
    vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');
    vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('storage-path');
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    vi.mocked(extensionApi.process.exec).mockResolvedValue({
      stdout: 'system-wide-path',
    } as extensionApi.RunResult);

    let installer: extensionApi.CliToolInstaller | undefined;
    vi.mocked(cliToolMock.registerInstaller).mockImplementation(mInstaller => {
      installer = mInstaller;
      return { dispose: vi.fn() };
    });
    vi.mocked(extensionApi.env).isMac = true;

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(installer).toBeDefined();
    });

    await installer?.doUninstall({} as unknown as Logger);
    expect(fs.promises.unlink).toHaveBeenNthCalledWith(1, 'storage-path');
    expect(extensionApi.process.exec).toHaveBeenCalledWith('rm', ['system-wide-path'], { isAdmin: true });
  });

  test('if unlink fails because of a permission issue, it should delete all binaries as admin', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
    vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
      version: 'v0.0.0',
      path: 'system-wide-path',
      updatable: false, // not updatable as unknown location
    });
    vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');
    vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('storage-path');
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.mocked(fs.promises.unlink).mockRejectedValue({
      code: 'EACCES',
    } as unknown as Error);
    vi.mocked(extensionApi.env).isMac = true;

    let installer: extensionApi.CliToolInstaller | undefined;
    vi.mocked(cliToolMock.registerInstaller).mockImplementation(mInstaller => {
      installer = mInstaller;
      return { dispose: vi.fn() };
    });

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(installer).toBeDefined();
    });

    await installer?.doUninstall({} as unknown as Logger);
    expect(extensionApi.process.exec).toHaveBeenCalledWith('rm', ['storage-path'], { isAdmin: true });
  });

  test('verify that can install after uninstalling', async () => {
    vi.mocked(Detect.prototype.checkSystemWideDockerCompose).mockResolvedValue(true);
    vi.mocked(Detect.prototype.getDockerComposeBinaryInfo).mockResolvedValue({
      version: 'v0.0.0',
      path: 'system-wide-path',
      updatable: false, // not updatable as unknown location
    });
    vi.spyOn(cliRun, 'getSystemBinaryPath').mockReturnValue('system-wide-path');
    vi.mocked(Detect.prototype.getStoragePath).mockResolvedValue('storage-path');
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.mocked(ComposeDownload.prototype.promptUserForVersion).mockResolvedValue({
      tag: 'v1.0.0',
    } as unknown as ComposeGithubReleaseArtifactMetadata);
    vi.mocked(extensionApi.process.exec).mockResolvedValue({
      stdout: 'system-wide-path',
    } as extensionApi.RunResult);
    vi.mocked(extensionApi.env).isMac = true;

    let installer: extensionApi.CliToolInstaller | undefined;
    vi.mocked(cliToolMock.registerInstaller).mockImplementation(mInstaller => {
      installer = mInstaller;
      return { dispose: vi.fn() };
    });

    await activate(extensionContextMock);

    await vi.waitFor(() => {
      expect(installer).toBeDefined();
    });

    await installer?.doUninstall({} as unknown as Logger);
    expect(fs.promises.unlink).toHaveBeenCalledWith('storage-path');
    expect(extensionApi.process.exec).toHaveBeenCalledWith('rm', ['system-wide-path'], { isAdmin: true });

    await installer?.selectVersion();

    await installer?.doInstall({} as unknown as Logger);
    expect(ComposeDownload.prototype.download).toHaveBeenCalledWith({
      tag: 'v1.0.0',
    });
    expect(Detect.prototype.getStoragePath).toHaveBeenCalled();
    expect(cliRun.installBinaryToSystem).toHaveBeenCalledWith('storage-path', 'docker-compose');
    expect(cliToolMock.updateVersion).toHaveBeenCalledWith({
      installationSource: 'extension',
      version: '1.0.0',
    });
  });

  test('onboarding download command shows error message if version list cannot be obtained', async () => {
    await activate(extensionContextMock);
    const downloadCommandHandler = vi.mocked(extensionApi.commands.registerCommand).mock.calls[2][1];
    vi.mocked(ComposeDownload.prototype.getLatestVersionAsset).mockRejectedValue(new Error('API call error'));
    vi.mocked(extensionApi.window.showErrorMessage).mockResolvedValue(undefined);
    await downloadCommandHandler();
    expect(extensionApi.window.showErrorMessage).toHaveBeenCalledOnce();
  });
});
