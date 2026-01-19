/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import type * as extensionApi from '@podman-desktop/api';
import * as podmanDesktopApi from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { createCluster } from './create-cluster';
import * as extension from './extension';
import type { KindGithubReleaseArtifactMetadata } from './kind-installer';
import { KindInstaller } from './kind-installer';
import * as util from './util';

vi.mock('node:fs');
vi.mock(import('./util'));
vi.mock(import('./image-handler'));
vi.mock(import('./create-cluster'));
vi.mock(import('./kind-installer'));

const CLI_TOOL_MOCK: extensionApi.CliTool = {
  displayName: 'test',
  dispose: vi.fn(),
  registerUpdate: vi.fn(),
  registerInstaller: vi.fn(),
  updateVersion: vi.fn(),
  version: '0.0.1',
} as unknown as extensionApi.CliTool;

const disposeMock = vi.fn();

const PROVIDER_MOCK: podmanDesktopApi.Provider = {
  setKubernetesProviderConnectionFactory: vi.fn(),
  onDidUpdateVersion: vi.fn(),
  updateVersion: vi.fn(),
  registerUpdate: vi.fn(),
} as unknown as podmanDesktopApi.Provider;

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(KindInstaller.prototype.getKindCliStoragePath).mockReturnValue('storage-path');

  vi.mocked(podmanDesktopApi.env.createTelemetryLogger).mockReturnValue({
    logUsage: vi.fn(),
  } as unknown as extensionApi.TelemetryLogger);

  vi.spyOn(console, 'log').mockImplementation(vi.fn());
  vi.spyOn(console, 'error').mockImplementation(vi.fn());

  // mock create cli tool
  vi.mocked(podmanDesktopApi.cli.createCliTool).mockReturnValue(CLI_TOOL_MOCK);

  vi.mocked(podmanDesktopApi.provider.createProvider).mockReturnValue(PROVIDER_MOCK);

  vi.mocked(podmanDesktopApi.containerEngine.listContainers).mockResolvedValue([]);
  vi.mocked(util.removeVersionPrefix).mockReturnValue('1.0.0');
  vi.mocked(util.getSystemBinaryPath).mockReturnValue('test-storage-path/kind');
});

afterEach(() => {
  extension.deactivate();
});

function activate(options?: Partial<extensionApi.ExtensionContext>): Promise<void> {
  return extension.activate(
    vi.mocked<extensionApi.ExtensionContext>({
      storagePath: 'test-storage-path',
      subscriptions: {
        push: vi.fn(),
      },
      ...options,
    } as unknown as extensionApi.ExtensionContext),
  );
}

test('check we received notifications ', async () => {
  const onDidUpdateContainerConnectionMock = vi.fn();
  vi.mocked(podmanDesktopApi.provider.onDidUpdateContainerConnection).mockImplementation(
    onDidUpdateContainerConnectionMock,
  );

  const listContainersMock = vi.fn();
  podmanDesktopApi.containerEngine.listContainers = listContainersMock;
  listContainersMock.mockResolvedValue([]);

  let callbackCalled = false;
  onDidUpdateContainerConnectionMock.mockImplementation((callback: () => void) => {
    callback();
    callbackCalled = true;
  });

  const fakeProvider = {} as unknown as podmanDesktopApi.Provider;
  extension.refreshKindClustersOnProviderConnectionUpdate(fakeProvider);
  expect(callbackCalled).toBeTruthy();
  expect(listContainersMock).toBeCalledTimes(1);
});

describe('cli tool', () => {
  beforeEach(() => {
    vi.mocked(util.getKindBinaryInfo).mockResolvedValue({
      path: 'kind',
      version: '0.0.1',
    });
    vi.mocked(util.getSystemBinaryPath).mockReturnValue('kind');
  });

  test('activation should register cli tool when available, installed by desktop', async () => {
    await activate();

    expect(podmanDesktopApi.cli.createCliTool).toHaveBeenCalledWith({
      displayName: 'Kind',
      path: 'kind',
      version: '0.0.1',
      name: 'kind',
      images: expect.anything(),
      markdownDescription: expect.any(String),
      installationSource: 'extension',
    });
  });

  test('activation should register cli tool when available, installed by user', async () => {
    vi.mocked(util.getSystemBinaryPath).mockReturnValue('user-kind');

    await activate();

    expect(podmanDesktopApi.cli.createCliTool).toHaveBeenCalledWith({
      displayName: 'Kind',
      path: 'kind',
      version: '0.0.1',
      name: 'kind',
      images: expect.anything(),
      markdownDescription: expect.any(String),
      installationSource: 'external',
    });
  });

  test('activation should register cli tool when does not exist', async () => {
    vi.mocked(util.getKindBinaryInfo).mockRejectedValue(new Error('does not exist'));
    vi.mocked(podmanDesktopApi.window.createStatusBarItem).mockReturnValue({
      show: vi.fn(),
    } as unknown as extensionApi.StatusBarItem);

    await activate();

    expect(podmanDesktopApi.cli.createCliTool).toHaveBeenCalledWith({
      name: 'kind',
      images: {
        icon: './icon.png',
      },
      displayName: 'Kind',
      markdownDescription: expect.any(String),
    });
  });

  test('activation should register cli tool when available in storage path', async () => {
    // mock twice
    vi.mocked(util.getKindBinaryInfo).mockRejectedValueOnce(new Error('does not exist')).mockResolvedValue({
      version: '0.0.1',
      path: 'test-storage-path/kind',
    });

    vi.mocked(util.getSystemBinaryPath).mockReturnValue('test-storage-path/kind');
    await activate();

    expect(util.getKindBinaryInfo).toHaveBeenCalledTimes(2);
    expect(podmanDesktopApi.cli.createCliTool).toHaveBeenCalledWith({
      displayName: 'Kind',
      path: 'test-storage-path/kind',
      version: '0.0.1',
      name: 'kind',
      images: expect.anything(),
      markdownDescription: expect.any(String),
      installationSource: 'extension',
    });
  });
});

test('Ensuring a progress task is created when calling kind.image.move command', async () => {
  const commandRegistry: { [id: string]: (image: { id: string; image: string; engineId: string }) => Promise<void> } =
    {};

  const registerCommandMock = vi.fn();
  podmanDesktopApi.commands.registerCommand = registerCommandMock;

  registerCommandMock.mockImplementation((command: string, callback: (image: { image: string }) => Promise<void>) => {
    commandRegistry[command] = callback;
  });

  const createProviderMock = vi.fn();
  podmanDesktopApi.provider.createProvider = createProviderMock;
  createProviderMock.mockImplementation(() => ({
    setKubernetesProviderConnectionFactory: vi.fn(),
    onDidUpdateVersion: vi.fn(),
    updateVersion: vi.fn(),
  }));

  const listContainersMock = vi.fn();
  podmanDesktopApi.containerEngine.listContainers = listContainersMock;
  listContainersMock.mockResolvedValue([]);

  const withProgressMock = vi
    .fn()
    .mockImplementation(() =>
      extension.moveImage({ report: vi.fn() }, { id: 'id', image: 'hello:world', engineId: '1' }),
    );
  podmanDesktopApi.window.withProgress = withProgressMock;

  const contextSetValueMock = vi.fn();
  podmanDesktopApi.context.setValue = contextSetValueMock;

  vi.mocked(util.getKindBinaryInfo).mockResolvedValue({
    path: 'kind',
    version: '0.0.1',
  });

  await activate();

  // ensure the command has been registered
  expect(commandRegistry['kind.image.move']).toBeDefined();

  // simulate a call to the command
  await commandRegistry['kind.image.move']({ id: 'id', image: 'hello:world', engineId: '1' });

  expect(withProgressMock).toHaveBeenCalled();
  expect(contextSetValueMock).toBeCalledTimes(2);
  expect(contextSetValueMock).toHaveBeenNthCalledWith(1, 'imagesPushInProgressToKind', ['id']);
  expect(contextSetValueMock).toHaveBeenNthCalledWith(2, 'imagesPushInProgressToKind', []);
});

const mockV1Release = {
  tag: 'v1.0.0',
} as unknown as KindGithubReleaseArtifactMetadata;

describe('cli#update', () => {
  /**
   * Utility method to get the {@link extensionApi.CliToolSelectUpdate} object registered by kind
   */
  async function getCliToolUpdate(): Promise<extensionApi.CliToolSelectUpdate> {
    await activate();

    return await vi.waitFor<extensionApi.CliToolSelectUpdate>(() => {
      expect(CLI_TOOL_MOCK.registerUpdate).toHaveBeenCalled();
      const listener = vi.mocked(CLI_TOOL_MOCK.registerUpdate).mock.calls[0][0];
      if (!('selectVersion' in listener)) throw new Error('kind should register update of type CliToolSelectUpdate');
      return listener;
    });
  }

  beforeEach(() => {
    // mock existing cli object (otherwise we can't update)
    vi.mocked(util.getKindBinaryInfo).mockResolvedValue({
      path: 'test-storage-path/kind',
      version: '0.0.1',
    });
    vi.mocked(PROVIDER_MOCK.registerUpdate).mockReturnValue({
      dispose: disposeMock,
    });
  });

  test('try to update before selecting cli tool version should throw an error', async () => {
    const update: extensionApi.CliToolSelectUpdate = await getCliToolUpdate();
    await expect(() => update?.doUpdate({} as unknown as extensionApi.Logger)).rejects.toThrowError(
      'Cannot update test-storage-path/kind version 0.0.1. No release selected.',
    );
  });

  test('update updatable version should update version', async () => {
    vi.mocked(util.installBinaryToSystem).mockResolvedValue('path');

    vi.mocked(KindInstaller.prototype.getKindCliStoragePath).mockReturnValue('storage-path');
    vi.mocked(KindInstaller.prototype.promptUserForVersion).mockResolvedValue(mockV1Release);
    vi.mocked(KindInstaller.prototype.getLatestVersionAsset).mockResolvedValue(mockV1Release);
    const update: extensionApi.CliToolSelectUpdate = await getCliToolUpdate();
    await update?.selectVersion();
    await update.doUpdate({} as unknown as extensionApi.Logger);

    expect(KindInstaller.prototype.download).toHaveBeenCalledWith(mockV1Release);
    expect(KindInstaller.prototype.getKindCliStoragePath).toHaveBeenCalled();

    expect(util.installBinaryToSystem).toHaveBeenCalledWith('storage-path', 'kind');
    expect(CLI_TOOL_MOCK.updateVersion).toHaveBeenCalledWith({
      installationSource: 'extension',
      path: 'path',
      version: '1.0.0',
    });

    expect(disposeMock).toHaveBeenCalled();
  });

  test('uninstall updatable version should dispose update', async () => {
    vi.mocked(KindInstaller.prototype.getLatestVersionAsset).mockResolvedValue(mockV1Release);

    await (await getCliToolInstaller()).doUninstall({} as unknown as extensionApi.Logger);

    expect(disposeMock).toHaveBeenCalled();
  });
});

/**
 * Utility method to get the {@link extensionApi.CliToolInstaller} object registered by kind
 */
async function getCliToolInstaller(): Promise<extensionApi.CliToolInstaller> {
  await activate();

  return await vi.waitFor<extensionApi.CliToolInstaller>(() => {
    expect(CLI_TOOL_MOCK.registerInstaller).toHaveBeenCalled();
    const listener = vi.mocked(CLI_TOOL_MOCK.registerInstaller).mock.calls[0][0];
    expect(listener).toBeDefined();
    return listener;
  });
}

describe('cli#install', () => {
  beforeEach(() => {
    // mock create cli tool
    vi.mocked(podmanDesktopApi.cli.createCliTool).mockReturnValue({
      ...CLI_TOOL_MOCK,
      version: undefined,
      dispose: vi.fn(),
    });

    // mock no kind detected
    vi.mocked(util.getKindBinaryInfo).mockRejectedValue('no kind');
  });

  test('try to install when there is already an existing version should throw an error', async () => {
    // mock create cli tool (existing version)
    vi.mocked(podmanDesktopApi.cli.createCliTool).mockReturnValue(CLI_TOOL_MOCK);

    // mock existing cli tool
    vi.mocked(util.getKindBinaryInfo).mockResolvedValue({
      version: '0.0.1',
      path: 'test-storage-path/kind',
    });

    const cliToolInstaller: extensionApi.CliToolInstaller = await getCliToolInstaller();

    await expect(() => cliToolInstaller?.doInstall({} as unknown as extensionApi.Logger)).rejects.toThrowError(
      `Cannot install kind. Version 0.0.1 in test-storage-path/kind is already installed.`,
    );
  });

  test('try to install before selecting cli tool version should throw an error', async () => {
    const cliToolInstaller: extensionApi.CliToolInstaller = await getCliToolInstaller();

    await expect(() => cliToolInstaller?.doInstall({} as unknown as extensionApi.Logger)).rejects.toThrowError(
      `Cannot install kind. No release selected.`,
    );
  });

  test('should install latest version', async () => {
    const latest = {
      label: 'kind v1.0.2',
      tag: 'v1.0.2',
      id: 1,
    };
    vi.mocked(util.installBinaryToSystem).mockResolvedValue('path');
    // mock prompt result

    const cliToolInstaller: extensionApi.CliToolInstaller = await getCliToolInstaller();

    vi.mocked(KindInstaller.prototype.getLatestVersionAsset).mockResolvedValue(latest);
    // mock workflow (user select version then we install it)
    vi.mocked(util.removeVersionPrefix).mockReturnValue('1.0.2');
    expect(await cliToolInstaller?.selectVersion(true)).equals('1.0.2');
    await cliToolInstaller?.doInstall({} as unknown as extensionApi.Logger);

    expect(KindInstaller.prototype.download).toHaveBeenCalledWith(latest);
    expect(KindInstaller.prototype.getKindCliStoragePath).toHaveBeenCalled();
    expect(util.installBinaryToSystem).toHaveBeenCalledWith('storage-path', 'kind');
    expect(CLI_TOOL_MOCK.updateVersion).toHaveBeenCalledWith({
      installationSource: 'extension',
      path: 'path',
      version: '1.0.2',
    });
  });

  test('if installing system wide fails, it should not throw', async () => {
    // mock error when trying to install system wide
    vi.mocked(util.installBinaryToSystem).mockRejectedValue('error');
    // mock user select v1.0.0
    vi.mocked(KindInstaller.prototype.promptUserForVersion).mockResolvedValue(mockV1Release);

    const cliToolInstaller: extensionApi.CliToolInstaller = await getCliToolInstaller();

    await cliToolInstaller?.selectVersion();

    await cliToolInstaller?.doInstall({} as unknown as extensionApi.Logger);

    // ensure the download has been called
    expect(KindInstaller.prototype.download).toHaveBeenCalledWith(mockV1Release);
    expect(KindInstaller.prototype.getKindCliStoragePath).toHaveBeenCalled();
    expect(util.installBinaryToSystem).toHaveBeenCalledWith('storage-path', 'kind');
    expect(CLI_TOOL_MOCK.updateVersion).toHaveBeenCalledWith({
      installationSource: 'extension',
      path: 'storage-path',
      version: '1.0.0',
    });
  });
});

describe('cli#uninstall', () => {
  beforeEach(() => {
    // mock binary exists (otherwise we can't uninstall it)
    vi.mocked(util.getKindBinaryInfo).mockResolvedValue({
      version: '0.0.1',
      path: 'test-storage-path/kind',
    });
  });

  test('by uninstalling it should delete all executables', async () => {
    // mock the binary exists
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(podmanDesktopApi.process.exec).mockResolvedValue({
      stdout: 'test-storage-path/kind',
    } as extensionApi.RunResult);

    const cliToolInstaller: extensionApi.CliToolInstaller = await getCliToolInstaller();

    await cliToolInstaller?.doUninstall({} as unknown as extensionApi.Logger);
    expect(fs.promises.unlink).toHaveBeenCalledWith('storage-path');
    expect(podmanDesktopApi.process.exec).toHaveBeenCalledWith('rm', ['test-storage-path/kind'], { isAdmin: true });
  });

  test('if unlink fails because of a permission issue, it should delete all binaries as admin', async () => {
    // mock the binary exists
    vi.mocked(fs.existsSync).mockReturnValue(true);

    // mock issue with unlink
    vi.mocked(fs.promises.unlink).mockRejectedValue({
      code: 'EACCES',
    } as unknown as Error);

    const cliToolInstaller: extensionApi.CliToolInstaller = await getCliToolInstaller();

    await cliToolInstaller?.doUninstall({} as unknown as extensionApi.Logger);

    // check command
    expect(podmanDesktopApi.process.exec).toHaveBeenNthCalledWith(1, 'rm', ['storage-path'], { isAdmin: true });
  });
});

describe('kubernetes create factory', () => {
  beforeEach(async () => {
    // default: no binary
    vi.mocked(util.getKindBinaryInfo).mockRejectedValue(new Error('no binary installed'));

    vi.mocked(podmanDesktopApi.provider.createProvider).mockReturnValue(PROVIDER_MOCK);
    // default to cancel
    vi.mocked(podmanDesktopApi.window.showInformationMessage).mockResolvedValue('Cancel');
    // mock artifact
    vi.mocked(KindInstaller.prototype.getLatestVersionAsset).mockResolvedValue({
      tag: 'v1.5.6',
    } as unknown as KindGithubReleaseArtifactMetadata);

    // activate
    await extension.activate(
      vi.mocked<extensionApi.ExtensionContext>({
        subscriptions: {
          push: vi.fn(),
        },
      } as unknown as extensionApi.ExtensionContext),
    );
  });

  test('activate should register a kubernetes create factory', async () => {
    expect(PROVIDER_MOCK.setKubernetesProviderConnectionFactory).toHaveBeenCalledOnce();
  });

  test('expect info message to be displayed when no binary installed and cluster created called', async () => {
    // get the create method
    const { create } = vi.mocked(PROVIDER_MOCK.setKubernetesProviderConnectionFactory).mock.calls[0][0];
    expect(create).toBeDefined();

    await expect(() => {
      return create?.({}, undefined, undefined);
    }).rejects.toThrowError('Unable to create kind cluster. No kind cli detected');

    expect(podmanDesktopApi.window.showInformationMessage).toHaveBeenCalledWith(
      'Kind is not installed, do you want to install the latest version?',
      'Cancel',
      'Confirm',
    );
  });

  test('user confirm installation should install latest', async () => {
    // get the create method
    const { create } = vi.mocked(PROVIDER_MOCK.setKubernetesProviderConnectionFactory).mock.calls[0][0];
    expect(create).toBeDefined();

    // simulate user confirmed
    vi.mocked(podmanDesktopApi.window.showInformationMessage).mockResolvedValue('Confirm');

    await create?.({}, undefined, undefined);

    // expect getLatestVersionAsset and download
    expect(KindInstaller.prototype.getLatestVersionAsset).toHaveBeenCalled();
    expect(KindInstaller.prototype.download).toHaveBeenCalled();

    expect(createCluster).toHaveBeenCalled();
  });
});

describe('provider#update', () => {
  beforeEach(() => {
    // mock existing cli object (otherwise we can't update)
    vi.mocked(util.getKindBinaryInfo).mockResolvedValue({
      path: 'test-storage-path/kind',
      version: '0.0.1',
    });
    vi.mocked(PROVIDER_MOCK.registerUpdate).mockReturnValue({
      dispose: disposeMock,
    });
  });

  test('available update should register update in provider', async () => {
    vi.mocked(KindInstaller.prototype.getLatestVersionAsset).mockResolvedValue({
      tag: 'v1.5.6',
    } as unknown as KindGithubReleaseArtifactMetadata);
    await activate();
    expect(PROVIDER_MOCK.registerUpdate).toHaveBeenCalled();
  });

  test('Register update in provider is not called if there is no update available', async () => {
    vi.mocked(KindInstaller.prototype.getLatestVersionAsset).mockResolvedValue({
      tag: 'v0.0.1',
    } as unknown as KindGithubReleaseArtifactMetadata);
    await activate();
    expect(PROVIDER_MOCK.registerUpdate).not.toHaveBeenCalled();
  });

  test('call dispose when provider is updated', async () => {
    vi.mocked(KindInstaller.prototype.getLatestVersionAsset).mockResolvedValue({
      tag: 'v1.5.6',
    } as unknown as KindGithubReleaseArtifactMetadata);
    await activate();
    expect(PROVIDER_MOCK.registerUpdate).toHaveBeenCalledTimes(1);

    await vi.mocked(PROVIDER_MOCK.registerUpdate).mock.calls[0][0].update({} as unknown as podmanDesktopApi.Logger);
    expect(disposeMock).toHaveBeenCalledTimes(1);
  });
});
