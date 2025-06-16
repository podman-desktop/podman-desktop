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

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type * as containerDesktopAPI from '@podman-desktop/api';
import { app } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { Certificates } from '/@/plugin/certificates.js';
import type { ContributionManager } from '/@/plugin/contribution-manager.js';
import type { KubeGeneratorRegistry } from '/@/plugin/kubernetes/kube-generator-registry.js';
import { NavigationManager } from '/@/plugin/navigation/navigation-manager.js';
import type { WebviewRegistry } from '/@/plugin/webview/webview-registry.js';
import type { ContributionInfo } from '/@api/contribution-info.js';
import { ExtensionLoaderSettings } from '/@api/extension-loader-settings.js';
import type { BuildImageOptions as InternalBuildImageOptions } from '/@api/image-info.js';
import { NavigationPage } from '/@api/navigation-page.js';
import type { OnboardingInfo } from '/@api/onboarding.js';
import type { WebviewInfo } from '/@api/webview-info.js';

import { getBase64Image } from '../../util.js';
import type { ApiSenderType } from '../api.js';
import type { AuthenticationImpl } from '../authentication.js';
import type { CliToolRegistry } from '../cli-tool-registry.js';
import type { ColorRegistry } from '../color-registry.js';
import type { CommandRegistry } from '../command-registry.js';
import type { ConfigurationRegistry } from '../configuration-registry.js';
import type { ContainerProviderRegistry } from '../container-registry.js';
import { Context } from '../context/context.js';
import type { CustomPickRegistry } from '../custompick/custompick-registry.js';
import type { DialogRegistry } from '../dialog-registry.js';
import type { Directories } from '../directories.js';
import type { FilesystemMonitoring } from '../filesystem-monitoring.js';
import type { IconRegistry } from '../icon-registry.js';
import type { ImageCheckerImpl } from '../image-checker.js';
import type { ImageFilesRegistry } from '../image-files-registry.js';
import type { ImageRegistry } from '../image-registry.js';
import type { InputQuickPickRegistry } from '../input-quickpick/input-quickpick-registry.js';
import type { KubernetesClient } from '../kubernetes/kubernetes-client.js';
import type { MenuRegistry } from '../menu-registry.js';
import type { MessageBox } from '../message-box.js';
import type { OnboardingRegistry } from '../onboarding-registry.js';
import type { ProviderRegistry } from '../provider-registry.js';
import type { Proxy } from '../proxy.js';
import type { ExtensionSecretStorage, SafeStorageRegistry } from '../safe-storage/safe-storage-registry.js';
import type { StatusBarRegistry } from '../statusbar/statusbar-registry.js';
import type { NotificationRegistry } from '../tasks/notification-registry.js';
import { type ProgressImpl, ProgressLocation } from '../tasks/progress-impl.js';
import type { Telemetry } from '../telemetry/telemetry.js';
import type { TrayMenuRegistry } from '../tray-menu-registry.js';
import type { IDisposable } from '../types/disposable.js';
import { Disposable } from '../types/disposable.js';
import { Uri } from '../types/uri.js';
import { Exec } from '../util/exec.js';
import type { ViewRegistry } from '../view-registry.js';
import type { AnalyzedExtension, ExtensionAnalyzer } from './extension-analyzer.js';
import type { ExtensionDevelopmentFolders } from './extension-development-folders.js';
import type { ActivatedExtension, AnalyzedExtensionWithApi, RequireCacheDict } from './extension-loader.js';
import { ExtensionLoader } from './extension-loader.js';
import type { ExtensionWatcher } from './extension-watcher.js';

class TestExtensionLoader extends ExtensionLoader {
  public override async setupScanningDirectory(): Promise<void> {
    return super.setupScanningDirectory();
  }

  setPluginsScanDirectory(path: string): void {
    this.pluginsScanDirectory = path;
  }

  setWatchTimeout(timeout: number): void {
    this.watchTimeout = timeout;
  }

  getExtensionState(): Map<string, string> {
    return this.extensionState;
  }
  getActivatedExtensions(): Map<string, ActivatedExtension> {
    return this.activatedExtensions;
  }

  getExtensionStateErrors(): Map<string, unknown> {
    return this.extensionStateErrors;
  }

  override doRequire(module: string): NodeRequire {
    return super.doRequire(module);
  }

  getRequireCache(): RequireCacheDict {
    return super.requireCache;
  }

  setActivatedExtension(extensionId: string, activatedExtension: ActivatedExtension): void {
    this.activatedExtensions.set(extensionId, activatedExtension);
  }

  setAnalyzedExtension(extensionId: string, analyzedExtension: AnalyzedExtensionWithApi): void {
    this.analyzedExtensions.set(extensionId, analyzedExtension);
  }

  override reloadExtension(extension: AnalyzedExtension, removable: boolean): Promise<void> {
    return super.reloadExtension(extension, removable);
  }

  override loadDevelopmentFolderExtensions(analyzedExtensions: AnalyzedExtension[]): Promise<void> {
    return super.loadDevelopmentFolderExtensions(analyzedExtensions);
  }
}

let extensionLoader: TestExtensionLoader;

const commandRegistry: CommandRegistry = {} as unknown as CommandRegistry;

const menuRegistry: MenuRegistry = {} as unknown as MenuRegistry;

const kubernetesGeneratorRegistry: KubeGeneratorRegistry = {} as unknown as KubeGeneratorRegistry;

const providerRegistry: ProviderRegistry = {} as unknown as ProviderRegistry;

const configurationRegistryGetConfigurationMock = vi.fn();
const configurationRegistryUpdateConfigurationMock = vi.fn();
const configurationRegistry: ConfigurationRegistry = {
  getConfiguration: configurationRegistryGetConfigurationMock,
  registerConfigurations: vi.fn(),
  updateConfigurationValue: configurationRegistryUpdateConfigurationMock,
} as unknown as ConfigurationRegistry;

const imageRegistry: ImageRegistry = {
  registerRegistry: vi.fn(),
} as unknown as ImageRegistry;

const apiSender: ApiSenderType = { send: vi.fn() } as unknown as ApiSenderType;

const trayMenuRegistry: TrayMenuRegistry = {} as unknown as TrayMenuRegistry;

const messageBox: MessageBox = {} as MessageBox;

const progress: ProgressImpl = {
  withProgress: vi.fn(),
} as unknown as ProgressImpl;

const statusBarRegistry: StatusBarRegistry = {} as unknown as StatusBarRegistry;

const kubernetesClient: KubernetesClient = {} as unknown as KubernetesClient;

const fileSystemMonitoring: FilesystemMonitoring = {} as unknown as FilesystemMonitoring;

const proxy: Proxy = {} as unknown as Proxy;

const containerProviderRegistry: ContainerProviderRegistry = {
  buildImage: vi.fn(),
  containerExist: vi.fn(),
  imageExist: vi.fn(),
  volumeExist: vi.fn(),
  podExist: vi.fn(),
  listPods: vi.fn(),
  stopPod: vi.fn(),
  removePod: vi.fn(),
  getContainerStats: vi.fn(),
  stopContainerStats: vi.fn(),
  listImages: vi.fn(),
  podmanListImages: vi.fn(),
  listInfos: vi.fn(),
  pullImage: vi.fn(),
} as unknown as ContainerProviderRegistry;

const inputQuickPickRegistry: InputQuickPickRegistry = {} as unknown as InputQuickPickRegistry;

const customPickRegistry: CustomPickRegistry = {} as unknown as CustomPickRegistry;

const authenticationProviderRegistry: AuthenticationImpl = {
  registerAuthenticationProvider: vi.fn(),
} as unknown as AuthenticationImpl;

const iconRegistry: IconRegistry = {} as unknown as IconRegistry;

const onboardingRegistry: OnboardingRegistry = {
  getOnboarding: vi.fn(),
} as unknown as OnboardingRegistry;

const telemetryTrackMock = vi.fn();
const telemetry: Telemetry = { track: telemetryTrackMock } as unknown as Telemetry;

const viewRegistry: ViewRegistry = {} as unknown as ViewRegistry;

const context: Context = new Context(apiSender);

const cliToolRegistry: CliToolRegistry = {
  createCliTool: vi.fn(),
} as unknown as CliToolRegistry;

const safeStorageRegistry: SafeStorageRegistry = {
  getExtensionStorage: vi.fn(),
} as unknown as SafeStorageRegistry;

const directories = {
  getPluginsDirectory: () => '/fake-plugins-directory',
  getPluginsScanDirectory: () => '/fake-plugins-scanning-directory',
  getExtensionsStorageDirectory: () => '/fake-extensions-storage-directory',
  getSafeStorageDirectory: () => '/fake-safe-storage-directory',
} as unknown as Directories;

const exec = new Exec(proxy);

const notificationRegistry: NotificationRegistry = {
  registerExtension: vi.fn(),
  addNotification: vi.fn(),
} as unknown as NotificationRegistry;

const imageCheckerImpl: ImageCheckerImpl = {
  registerImageCheckerProvider: vi.fn(),
} as unknown as ImageCheckerImpl;

const imageFilesImpl: ImageFilesRegistry = {
  registerImageFilesProvider: vi.fn(),
} as unknown as ImageFilesRegistry;

const contributionManager: ContributionManager = {
  listContributions: vi.fn(),
} as unknown as ContributionManager;

const webviewRegistry: WebviewRegistry = {
  listSimpleWebviews: vi.fn(),
  listWebviews: vi.fn(),
} as unknown as WebviewRegistry;

const navigationManager: NavigationManager = new NavigationManager(
  apiSender,
  containerProviderRegistry,
  contributionManager,
  providerRegistry,
  webviewRegistry,
  commandRegistry,
  onboardingRegistry,
);

const colorRegistry = {
  registerExtensionThemes: vi.fn(),
} as unknown as ColorRegistry;
const openDialogMock = vi.fn();
const saveDialogMock = vi.fn();

const dialogRegistry: DialogRegistry = {
  openDialog: openDialogMock,
  saveDialog: saveDialogMock,
} as unknown as DialogRegistry;

const certificates: Certificates = {} as unknown as Certificates;

const extensionWatcher = {
  monitor: vi.fn(),
  untrack: vi.fn(),
  stop: vi.fn(),
  reloadExtension: vi.fn(),
} as unknown as ExtensionWatcher;

const extensionDevelopmentFolder = {
  getDevelopmentFolders: vi.fn(),
  onNeedToLoadExension: vi.fn(),
} as unknown as ExtensionDevelopmentFolders;

const extensionAnalyzer = {
  analyzeExtension: vi.fn(),
} as unknown as ExtensionAnalyzer;

const createApi = (disposables?: { dispose(): unknown }[]): typeof containerDesktopAPI => {
  const analyzedExtension = {
    path: '/path',
    manifest: {
      name: 'extension-name',
      publisher: 'publisher',
      version: '1',
      displayName: 'dname',
    },
    subscriptions: disposables ?? [],
  } as AnalyzedExtension;
  return extensionLoader.createApi(analyzedExtension);
};

vi.mock('electron', () => {
  return {
    app: {
      getVersion: vi.fn(),
    },
  };
});

vi.mock('../../util.js', async () => {
  return {
    getBase64Image: vi.fn(),
  };
});

/* eslint-disable @typescript-eslint/no-empty-function */
beforeEach(() => {
  extensionLoader = new TestExtensionLoader(
    commandRegistry,
    menuRegistry,
    providerRegistry,
    configurationRegistry,
    imageRegistry,
    apiSender,
    trayMenuRegistry,
    messageBox,
    progress,
    statusBarRegistry,
    kubernetesClient,
    fileSystemMonitoring,
    proxy,
    containerProviderRegistry,
    inputQuickPickRegistry,
    customPickRegistry,
    authenticationProviderRegistry,
    iconRegistry,
    onboardingRegistry,
    telemetry,
    viewRegistry,
    context,
    directories,
    exec,
    kubernetesGeneratorRegistry,
    cliToolRegistry,
    notificationRegistry,
    imageCheckerImpl,
    imageFilesImpl,
    navigationManager,
    webviewRegistry,
    colorRegistry,
    dialogRegistry,
    safeStorageRegistry,
    certificates,
    extensionWatcher,
    extensionDevelopmentFolder,
    extensionAnalyzer,
  );
});

vi.mock('node:fs');

beforeEach(() => {
  telemetryTrackMock.mockImplementation(() => Promise.resolve());
  vi.clearAllMocks();
});

test('Should watch for files and load them at startup', async () => {
  const fakeDirectory = '/fake/path/scanning';

  // fake scanning property
  extensionLoader.setPluginsScanDirectory(fakeDirectory);

  // mock fs.watch
  const fsWatchMock = vi.spyOn(fs, 'watch');
  fsWatchMock.mockReturnValue({} as fs.FSWatcher);

  // mock fs.existsSync
  const fsExistsSyncMock = vi.spyOn(fs, 'existsSync');
  fsExistsSyncMock.mockReturnValue(true);

  // mock fs.promises.readdir
  const readdirMock = vi.spyOn(fs.promises, 'readdir');

  const ent1 = {
    isFile: () => true,
    isDirectory: () => false,
    name: 'foo.cdix',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;

  const ent2 = {
    isFile: () => true,
    isDirectory: () => false,
    name: 'bar.foo',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;

  const ent3 = {
    isFile: () => false,
    isDirectory: () => true,
    name: 'baz',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
  readdirMock.mockResolvedValue([ent1, ent2, ent3]);

  // mock loadPackagedFile
  const loadPackagedFileMock = vi.spyOn(extensionLoader, 'loadPackagedFile');
  loadPackagedFileMock.mockResolvedValue();

  await extensionLoader.setupScanningDirectory();

  // expect to load only one file (other are invalid files/folder)
  expect(loadPackagedFileMock).toBeCalledWith(path.join(fakeDirectory, 'foo.cdix'));

  // expect watcher is setup
  expect(fsWatchMock).toBeCalledWith(fakeDirectory, expect.anything());
});

test('Should load file from watching scanning folder', async () => {
  const fakeDirectory = '/fake/path/scanning';
  const rootedFakeDirectory = path.resolve(fakeDirectory);

  // fake scanning property
  extensionLoader.setPluginsScanDirectory(fakeDirectory);

  let watchFilename: fs.PathLike | undefined = undefined;
  let watchListener: fs.WatchListener<string> = {} as unknown as fs.WatchListener<string>;

  // reduce timeout delay for tests
  extensionLoader.setWatchTimeout(50);

  vi.mock('node:fs');
  // mock fs.watch
  const fsWatchMock = vi.spyOn(fs, 'watch');
  fsWatchMock.mockImplementation((filename: fs.PathLike, listener?: fs.WatchListener<string>): fs.FSWatcher => {
    watchFilename = filename;
    if (listener) {
      watchListener = listener;
    }
    return {} as fs.FSWatcher;
  });

  // mock fs.existsSync
  const fsExistsSyncMock = vi.spyOn(fs, 'existsSync');
  fsExistsSyncMock.mockReturnValue(true);

  // mock fs.promises.readdir
  const readdirMock = vi.spyOn(fs.promises, 'readdir');
  readdirMock.mockResolvedValue([]);

  // mock loadPackagedFile
  const loadPackagedFileMock = vi.spyOn(extensionLoader, 'loadPackagedFile');
  loadPackagedFileMock.mockResolvedValue();

  await extensionLoader.setupScanningDirectory();

  // no loading for now as no files in the folder
  expect(loadPackagedFileMock).not.toBeCalled();

  // expect watcher is setup
  expect(fsWatchMock).toBeCalledWith(fakeDirectory, expect.anything());
  expect(watchFilename).toBeDefined();
  expect(watchListener).toBeDefined();

  expect(watchFilename).toBe(fakeDirectory);

  // call the watcher callback
  if (watchListener) {
    watchListener('rename', 'watch.cdix');
  }

  // wait more than the watchListener timeout
  await new Promise(resolve => setTimeout(resolve, 100));

  // expect to load only one file (other are invalid files/folder)
  expect(loadPackagedFileMock).toBeCalledWith(path.resolve(rootedFakeDirectory, 'watch.cdix'));
});

test('Verify extension error leads to failed state', async () => {
  const id = 'extension.id';
  await extensionLoader.activateExtension(
    {
      id: id,
      name: 'id',
      path: 'dummy',
      api: {} as typeof containerDesktopAPI,
      mainPath: '',
      removable: false,
      manifest: {},
      subscriptions: [],
      readme: '',
      dispose: vi.fn(),
    },
    {
      activate: () => {
        throw Error('Failed');
      },
    },
  );
  expect(extensionLoader.getExtensionState().get(id)).toBe('failed');
});

test('Verify extension subscriptions are disposed when failed state reached', async () => {
  const id = 'extension.id';
  const disposableMock: containerDesktopAPI.Disposable = {
    dispose: vi.fn(),
  };
  configurationRegistryGetConfigurationMock.mockReturnValue({
    get: vi.fn().mockReturnValue(5000),
  });
  await extensionLoader.activateExtension(
    {
      id: id,
      name: 'id',
      path: 'dummy',
      api: {} as typeof containerDesktopAPI,
      mainPath: '',
      removable: false,
      manifest: {},
      subscriptions: [],
      readme: '',
      dispose: vi.fn(),
    },
    {
      activate: (extensionContext: containerDesktopAPI.ExtensionContext) => {
        extensionContext.subscriptions.push(disposableMock);
        throw Error('Failed');
      },
    },
  );
  expect(extensionLoader.getExtensionState().get(id)).toBe('failed');
  expect(disposableMock.dispose).toHaveBeenCalledOnce();
});

test('Verify extension activate with a long timeout is flagged as error', async () => {
  const id = 'extension.id';

  // mock getConfiguration
  const getMock = vi.fn();
  configurationRegistryGetConfigurationMock.mockReturnValue({
    get: getMock,
  });
  getMock.mockReturnValue(1);

  await extensionLoader.activateExtension(
    {
      id: id,
      name: 'id',
      path: 'dummy',
      api: {} as typeof containerDesktopAPI,
      mainPath: '',
      removable: false,
      manifest: {},
      subscriptions: [],
      readme: '',
      dispose: vi.fn(),
    },
    {
      activate: () => {
        // wait for 20 seconds
        return new Promise(resolve => setTimeout(resolve, 20000));
      },
    },
  );

  expect(extensionLoader.getExtensionStateErrors().get(id)).toBeDefined();
  expect(extensionLoader.getExtensionStateErrors().get(id)?.toString()).toContain(
    'Extension extension.id activation timed out after 1 seconds',
  );
  expect(extensionLoader.getExtensionState().get(id)).toBe('failed');
});

test('Verify extension load', async () => {
  const id = 'extension.foo';

  await extensionLoader.loadExtension({
    id: id,
    name: 'id',
    path: 'dummy',
    api: {} as typeof containerDesktopAPI,
    mainPath: '',
    removable: false,
    manifest: {
      version: '1.1',
    },
    subscriptions: [],
    readme: '',
    dispose: vi.fn(),
  });

  expect(telemetry.track).toBeCalledWith(
    'loadExtension.error',
    expect.objectContaining({ extensionId: id, extensionVersion: '1.1' }),
  );
});

test('Verify extension do not add configuration to subscriptions', async () => {
  const id = 'extension.foo';

  const disposable = {
    dispose: vi.fn(),
  } as unknown as Disposable;
  vi.mocked(configurationRegistry.registerConfigurations).mockReturnValue(disposable);

  const subscriptions: Disposable[] = [];

  await extensionLoader.loadExtension({
    id: id,
    name: 'id',
    path: 'dummy',
    api: {} as typeof containerDesktopAPI,
    mainPath: '',
    removable: false,
    manifest: {
      version: '1.1',
      contributes: {
        configuration: {
          title: 'dummy-configuration-title',
        },
      },
    },
    subscriptions: subscriptions,
    readme: '',
    dispose: vi.fn(),
  });

  expect(configurationRegistry.registerConfigurations).toHaveBeenCalled();
  expect(subscriptions).not.toContain(disposable);

  await extensionLoader.deactivateExtension(id);
  expect(disposable.dispose).not.toHaveBeenCalled();
});

test('Verify disable extension updates configuration', async () => {
  const ids = ['extension.foo'];

  configurationRegistryUpdateConfigurationMock.mockResolvedValue(Promise.resolve);
  extensionLoader.setDisabledExtensionIds(ids);

  expect(configurationRegistryUpdateConfigurationMock).toHaveBeenCalledWith('extensions.disabled', ids);
});

test('Verify enable extension updates configuration', async () => {
  const id = 'extension.no.foo';
  const before = ['a', id, 'b'];
  const after = ['a', 'b'];

  configurationRegistryGetConfigurationMock.mockReturnValue({
    get: () => before,
  });
  configurationRegistryUpdateConfigurationMock.mockResolvedValue(Promise.resolve);
  extensionLoader.ensureExtensionIsEnabled(id);

  expect(configurationRegistryUpdateConfigurationMock).toHaveBeenCalledWith('extensions.disabled', after);
});

test('Verify stopping extension disables it', async () => {
  const id = 'extension.no.foo';
  configurationRegistryGetConfigurationMock.mockReturnValue({
    get: () => [],
  });
  await extensionLoader.stopExtension(id);

  expect(configurationRegistryUpdateConfigurationMock).toHaveBeenCalledWith('extensions.disabled', [id]);
});

test('Verify starting extension enables it', async () => {
  const id = 'extension.no.foo';

  configurationRegistryGetConfigurationMock.mockReturnValue({
    get: () => ['extension.no.foo'],
  });
  await extensionLoader.startExtension(id);

  expect(configurationRegistryUpdateConfigurationMock).toHaveBeenCalledWith('extensions.disabled', []);
});

test('Verify setExtensionsUpdates', async () => {
  const extensionId = 'my.foo.extension';

  const analyzedExtension: AnalyzedExtensionWithApi = {
    id: extensionId,
    manifest: {
      name: 'hello',
    },
  } as AnalyzedExtensionWithApi;
  extensionLoader.setAnalyzedExtension(extensionId, analyzedExtension);

  // get list of extensions
  const extensions = await extensionLoader.listExtensions();

  console.log('ext ', extensions);

  // check we have our extension
  expect(extensions.length).toBe(1);
  expect(extensions[0]?.id).toBe(extensionId);

  // check that update field is empty
  expect(extensions[0]?.update).toBeUndefined();

  // now call the update

  const ociUri = 'quay.io/extension';
  const newVersion = '2.0.0';
  extensionLoader.setExtensionsUpdates([
    {
      id: extensionId,
      version: newVersion,
      ociUri,
    },
  ]);

  // get list of extensions
  const extensionsAfterUpdate = await extensionLoader.listExtensions();
  // check we have our extension
  expect(extensionsAfterUpdate.length).toBe(1);
  expect(extensionsAfterUpdate[0]?.id).toBe(extensionId);

  // check that update field is set
  expect(extensionsAfterUpdate[0]?.update).toStrictEqual({
    ociUri: 'quay.io/extension',
    version: newVersion,
  });

  expect(apiSender.send).toBeCalledWith('extensions-updated');
});

test('Verify searchForCircularDependencies(analyzedExtensions);', async () => {
  // Check if missing dependencies are found
  const extensionId1 = 'foo.extension1';
  const extensionId2 = 'foo.extension2';
  const extensionId3 = 'foo.extension3';

  // extension1 has no dependencies
  const analyzedExtension1: AnalyzedExtension = {
    id: extensionId1,
    manifest: {
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension2 depends on extension 1 and extension 3
  const analyzedExtension2: AnalyzedExtension = {
    id: extensionId2,
    manifest: {
      extensionDependencies: [extensionId1, extensionId3],
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension3 depends on extension 2 (circular dependency)
  const analyzedExtension3: AnalyzedExtension = {
    id: extensionId3,
    manifest: {
      extensionDependencies: [extensionId2],
      name: 'hello',
    },
  } as AnalyzedExtension;

  expect(analyzedExtension1.circularDependencies).toBeUndefined();
  expect(analyzedExtension2.circularDependencies).toBeUndefined();
  expect(analyzedExtension3.circularDependencies).toBeUndefined();

  const analyzedExtensions = [analyzedExtension1, analyzedExtension2, analyzedExtension3];
  extensionLoader.searchForCircularDependencies(analyzedExtensions);

  // do we have missingDependencies field for extension 3 as it's missing
  expect(analyzedExtension1.circularDependencies).toStrictEqual([]);
  expect(analyzedExtension2.circularDependencies).toStrictEqual([extensionId3]);
  expect(analyzedExtension3.circularDependencies).toStrictEqual([extensionId2]);
});

test('Verify searchForMissingDependencies(analyzedExtensions);', async () => {
  // Check if missing dependencies are found
  const extensionId1 = 'foo.extension1';
  const extensionId2 = 'foo.extension2';
  const extensionId3 = 'foo.extension3';
  const unknownExtensionId = 'foo.unknown';

  // extension1 has no dependencies
  const analyzedExtension1: AnalyzedExtension = {
    id: extensionId1,
    manifest: {
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension2 depends on extension 1
  const analyzedExtension2: AnalyzedExtension = {
    id: extensionId2,
    manifest: {
      extensionDependencies: [extensionId1],
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension3 depends on unknown extension unknown
  const analyzedExtension3: AnalyzedExtension = {
    id: extensionId3,
    manifest: {
      extensionDependencies: [unknownExtensionId],
      name: 'hello',
    },
  } as AnalyzedExtension;

  expect(analyzedExtension1.missingDependencies).toBeUndefined();
  expect(analyzedExtension2.missingDependencies).toBeUndefined();
  expect(analyzedExtension3.missingDependencies).toBeUndefined();

  const analyzedExtensions = [analyzedExtension1, analyzedExtension2, analyzedExtension3];
  extensionLoader.searchForMissingDependencies(analyzedExtensions);

  // do we have missingDependencies field for extension 3 as it's missing
  expect(analyzedExtension1.missingDependencies).toStrictEqual([]);
  expect(analyzedExtension2.missingDependencies).toStrictEqual([]);
  expect(analyzedExtension3.missingDependencies).toStrictEqual([unknownExtensionId]);
});

test('Verify searchForMissingDependencies(analyzedExtensions); with already loaded extensions', async () => {
  // Check if missing dependencies are found
  const extensionId1 = 'foo.extension1';
  const extensionId2 = 'foo.extension2';
  const extensionId3 = 'foo.extension3';
  const extensionId4 = 'foo.extension4';
  const unknownExtensionId = 'foo.unknown';

  // extension1 has no dependencies and has already been loaded
  const analyzedExtension1: AnalyzedExtensionWithApi = {
    id: extensionId1,
    manifest: {
      name: 'hello',
    },
  } as AnalyzedExtensionWithApi;

  // extension2 has no dependencies and has already been loaded
  const analyzedExtension2: AnalyzedExtensionWithApi = {
    id: extensionId2,
    manifest: {
      name: 'hello',
    },
  } as AnalyzedExtensionWithApi;

  // extension3 depends on unknown extension unknown
  const analyzedExtension3: AnalyzedExtensionWithApi = {
    id: extensionId3,
    manifest: {
      extensionDependencies: [unknownExtensionId],
      name: 'hello',
    },
  } as AnalyzedExtensionWithApi;

  // extension4 depends on extension1
  const analyzedExtension4: AnalyzedExtensionWithApi = {
    id: extensionId4,
    manifest: {
      extensionDependencies: [extensionId1],
      name: 'hello',
    },
  } as AnalyzedExtensionWithApi;

  extensionLoader.setAnalyzedExtension(extensionId1, analyzedExtension1);
  extensionLoader.setAnalyzedExtension(extensionId2, analyzedExtension1);

  expect(analyzedExtension1.missingDependencies).toBeUndefined();
  expect(analyzedExtension2.missingDependencies).toBeUndefined();
  expect(analyzedExtension3.missingDependencies).toBeUndefined();
  expect(analyzedExtension4.missingDependencies).toBeUndefined();

  extensionLoader.searchForMissingDependencies([analyzedExtension3, analyzedExtension4]);

  // do we have missingDependencies field for extension 3 as it's missing
  expect(analyzedExtension4.missingDependencies).toStrictEqual([]);
  expect(analyzedExtension3.missingDependencies).toStrictEqual([unknownExtensionId]);
});

test('Verify sortExtensionsByDependencies(analyzedExtensions);', async () => {
  const extensionId1 = 'foo.extension1';
  const extensionId2 = 'foo.extension2';
  const extensionId3 = 'foo.extension3';
  const extensionId4 = 'foo.extension4';
  const extensionId5 = 'foo.extension5';

  // extension1 has no dependency
  const analyzedExtension1: AnalyzedExtension = {
    id: extensionId1,
    manifest: {
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension2 depends on extension 1
  const analyzedExtension2: AnalyzedExtension = {
    id: extensionId2,
    manifest: {
      extensionDependencies: [extensionId1],
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension3 depends on extension1 and extension2
  const analyzedExtension3: AnalyzedExtension = {
    id: extensionId3,
    manifest: {
      extensionDependencies: [extensionId1, extensionId2],
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension4 depends on extension3
  const analyzedExtension4: AnalyzedExtension = {
    id: extensionId4,
    manifest: {
      extensionDependencies: [extensionId3],
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension5 depends on extension2
  const analyzedExtension5: AnalyzedExtension = {
    id: extensionId5,
    manifest: {
      extensionDependencies: [extensionId2, extensionId3, extensionId4],
      name: 'hello',
    },
  } as AnalyzedExtension;

  expect(analyzedExtension1.missingDependencies).toBeUndefined();
  expect(analyzedExtension2.missingDependencies).toBeUndefined();
  expect(analyzedExtension3.missingDependencies).toBeUndefined();

  // 1 -> nothing
  // 2 -> 1
  // 3 -> 1, 2
  // 4 -> 3
  // 5 -> 2 & 3 & 4

  // order of loading is
  // 1 then 2 as it depends on it
  // then 3
  // then 5 as it depends on 2
  // and then 4

  // no matter of the initial order, they should always be in the same order
  const analyzedExtensions1 = [
    analyzedExtension5,
    analyzedExtension2,
    analyzedExtension1,
    analyzedExtension4,
    analyzedExtension3,
  ];
  const sortedElements1 = extensionLoader.sortExtensionsByDependencies(analyzedExtensions1);

  const analyzedExtensions2 = [
    analyzedExtension5,
    analyzedExtension4,
    analyzedExtension3,
    analyzedExtension2,
    analyzedExtension1,
  ];
  const sortedElements2 = extensionLoader.sortExtensionsByDependencies(analyzedExtensions2);

  const analyzedExtensions3 = [
    analyzedExtension1,
    analyzedExtension2,
    analyzedExtension3,
    analyzedExtension4,
    analyzedExtension5,
  ];
  const sortedElements3 = extensionLoader.sortExtensionsByDependencies(analyzedExtensions3);

  expect(sortedElements1.map(analyzedExtension => analyzedExtension.id)).toStrictEqual([
    extensionId1,
    extensionId2,
    extensionId3,
    extensionId4,
    extensionId5,
  ]);
  expect(sortedElements2.map(analyzedExtension => analyzedExtension.id)).toStrictEqual([
    extensionId1,
    extensionId2,
    extensionId3,
    extensionId4,
    extensionId5,
  ]);
  expect(sortedElements3.map(analyzedExtension => analyzedExtension.id)).toStrictEqual([
    extensionId1,
    extensionId2,
    extensionId3,
    extensionId4,
    extensionId5,
  ]);
});

describe('check loadRuntime', async () => {
  test('check for extension with main entry', async () => {
    // override doRequire method
    const doRequireMock = vi.spyOn(extensionLoader, 'doRequire');
    doRequireMock.mockResolvedValue({} as NodeRequire);

    const fakeExtension = {
      mainPath: '/fake/path',
    } as unknown as AnalyzedExtension;

    extensionLoader.loadRuntime(fakeExtension);

    // expect require to be called with the mainPath
    expect(doRequireMock).toHaveBeenCalledWith(fakeExtension.mainPath);
  });

  test('check for extension without main entry', async () => {
    // override doRequire method
    const doRequireMock = vi.spyOn(extensionLoader, 'doRequire');
    doRequireMock.mockResolvedValue({} as NodeRequire);

    const fakeExtension = {
      mainPath: undefined,
    } as unknown as AnalyzedExtension;

    extensionLoader.loadRuntime(fakeExtension);

    // expect require to be called with the mainPath
    expect(doRequireMock).not.toBeCalled();
  });

  test('check cache entry without id and children', async () => {
    // override doRequire method
    const doRequireMock = vi.spyOn(extensionLoader, 'doRequire');
    doRequireMock.mockResolvedValue({} as NodeRequire);

    const getRequireCacheMock = vi.spyOn(extensionLoader, 'getRequireCache');
    getRequireCacheMock.mockReturnValue({
      foo: {
        // no id and no children
      } as unknown as NodeModule,
    });

    const fakeExtension = {
      mainPath: '/fake/path',
    } as unknown as AnalyzedExtension;

    extensionLoader.loadRuntime(fakeExtension);

    // expect require to be called with the mainPath and no exception
    expect(doRequireMock).toHaveBeenCalledWith(fakeExtension.mainPath);
  });
});

describe('setContextValue', async () => {
  test('without scope the setValue is called with original value', async () => {
    const api = createApi();

    const setValueSpy = vi.spyOn(context, 'setValue');

    api.context.setValue('key', 'value');
    expect(setValueSpy).toBeCalledWith('key', 'value');
  });
  test('with onboarding scope the key is prefixed before calling setValue', async () => {
    const api = createApi();
    const setValueSpy = vi.spyOn(context, 'setValue');

    api.context.setValue('key', 'value', 'onboarding');
    expect(setValueSpy).toBeCalledWith('publisher.extension-name.onboarding.key', 'value');
  });

  test('with DockerCompatibility scope the key is prefixed before calling setValue', async () => {
    const api = createApi();
    const setValueSpy = vi.spyOn(context, 'setValue');

    api.context.setValue('key', 'value', 'DockerCompatibility');
    expect(setValueSpy).toBeCalledWith('publisher.extension-name.DockerCompatibility.key', 'value');
  });
});

describe('Removing extension by user', async () => {
  const ExtID = 'company.ext-id';
  test('sends telemetry w/o error when whens succeeds', async () => {
    configurationRegistryGetConfigurationMock.mockReturnValue({
      get: () => [],
    });
    extensionLoader.removeExtension = vi.fn();
    await extensionLoader.removeExtensionPerUserRequest(ExtID);
    expect(extensionLoader.removeExtension).toBeCalledWith(ExtID);
    expect(telemetry.track).toBeCalledWith('removeExtension', { extensionId: ExtID });
  });

  test('sends telemetry w/ error when fails', async () => {
    const RemoveError = 'Error';
    extensionLoader.removeExtension = vi.fn().mockRejectedValue(RemoveError);
    await extensionLoader.removeExtensionPerUserRequest(ExtID).catch(() => undefined);
    expect(extensionLoader.removeExtension).toBeCalledWith(ExtID);
    expect(telemetry.track).toBeCalledWith('removeExtension', { extensionId: ExtID, error: RemoveError });
  });
});

test('check dispose when deactivating', async () => {
  vi.mock('node:fs');

  const extensionId = 'fooPublisher.fooName';
  extensionLoader.setActivatedExtension(extensionId, {
    id: extensionId,
  } as ActivatedExtension);

  const analyzedExtension: AnalyzedExtensionWithApi = {
    id: extensionId,
    dispose: vi.fn(),
  } as unknown as AnalyzedExtensionWithApi;
  extensionLoader.setAnalyzedExtension(extensionId, analyzedExtension);

  // should have call the dispose method
  await extensionLoader.deactivateExtension(extensionId);
  expect(analyzedExtension.dispose).toBeCalled();

  expect(extensionWatcher.untrack).toBeCalled();

  expect(telemetry.track).toBeCalledWith('deactivateExtension', { extensionId });
});

test('Verify extension uri', async () => {
  const id = 'extension.id';
  const activateMethod = vi.fn();

  configurationRegistryGetConfigurationMock.mockReturnValue({ get: vi.fn().mockReturnValue(1) });

  await extensionLoader.activateExtension(
    {
      id: id,
      name: 'id',
      path: 'dummy',
      api: {} as typeof containerDesktopAPI,
      mainPath: '',
      removable: false,
      manifest: {},
      subscriptions: [],
      readme: '',
      dispose: vi.fn(),
    },
    { activate: activateMethod },
  );

  expect(activateMethod).toBeCalled();

  // check extensionUri
  const grabUri: containerDesktopAPI.Uri = activateMethod.mock.calls[0]?.[0].extensionUri;
  expect(grabUri).toBeDefined();
  expect(grabUri.fsPath).toBe('dummy');
});

test('Verify exports and packageJSON', async () => {
  const id = 'extension.id';
  const activateMethod = vi.fn();
  activateMethod.mockResolvedValue({
    hello: () => 'world',
  });

  configurationRegistryGetConfigurationMock.mockReturnValue({ get: vi.fn().mockReturnValue(1) });

  await extensionLoader.activateExtension(
    {
      id: id,
      name: 'id',
      path: 'dummy',
      api: {} as typeof containerDesktopAPI,
      mainPath: '',
      removable: false,
      manifest: {
        foo: 'bar',
      },
      subscriptions: [],
      readme: '',
      dispose: vi.fn(),
    },
    { activate: activateMethod },
  );

  expect(activateMethod).toBeCalled();

  const myActivatedExtension = extensionLoader.getActivatedExtensions().get(id);
  expect(myActivatedExtension).toBeDefined();

  expect(myActivatedExtension?.exports).toBeDefined();
  expect(myActivatedExtension?.exports.hello()).toBe('world');

  expect(myActivatedExtension?.packageJSON).toBeDefined();
  expect((myActivatedExtension?.packageJSON as any)?.foo).toBe('bar');

  const exposed = extensionLoader.getExposedExtension(id);
  expect(exposed).toBeDefined();
  expect(exposed?.exports.hello()).toBe('world');
  expect((exposed as any).packageJSON.foo).toBe('bar');

  const allExtensions = extensionLoader.getAllExposedExtensions();
  expect(allExtensions).toBeDefined();
  // 1 item
  expect(allExtensions.length).toBe(1);
  expect(allExtensions[0]?.exports.hello()).toBe('world');
  expect((allExtensions[0] as any).packageJSON.foo).toBe('bar');
});

describe('Navigation', async () => {
  test('navigateToContainers', async () => {
    const api = createApi();

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    await api.navigation.navigateToContainers();
    expect(sendMock).toBeCalledWith('navigate', { page: NavigationPage.CONTAINERS });
  });

  test.each([
    {
      name: 'navigateToContainer valid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) => api.navigateToContainer,
      expected: {
        page: NavigationPage.CONTAINER,
        parameters: {
          id: 'valid',
        },
      },
    },
    {
      name: 'navigateToContainerLogs valid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) =>
        api.navigateToContainerLogs,
      expected: {
        page: NavigationPage.CONTAINER_LOGS,
        parameters: {
          id: 'valid',
        },
      },
    },
    {
      name: 'navigateToContainerInspect valid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) =>
        api.navigateToContainerInspect,
      expected: {
        page: NavigationPage.CONTAINER_INSPECT,
        parameters: {
          id: 'valid',
        },
      },
    },
    {
      name: 'navigateToContainerTerminal valid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) =>
        api.navigateToContainerTerminal,
      expected: {
        page: NavigationPage.CONTAINER_TERMINAL,
        parameters: {
          id: 'valid',
        },
      },
    },
  ])('$name', async ({ method, expected }) => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const containerExistSpy = vi.spyOn(containerProviderRegistry, 'containerExist');
    containerExistSpy.mockImplementation(() => Promise.resolve(true));

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    await method(api.navigation)('valid');

    // Ensure the send method is called properly
    expect(sendMock).toBeCalledWith('navigate', expected);

    // Valid we listed the contains properly
    expect(containerExistSpy).toHaveBeenCalledOnce();
  });

  test.each([
    {
      name: 'navigateToContainer invalid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) => api.navigateToContainer,
    },
    {
      name: 'navigateToContainerLogs invalid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) =>
        api.navigateToContainerLogs,
    },
    {
      name: 'navigateToContainerInspect invalid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) =>
        api.navigateToContainerInspect,
    },
    {
      name: 'navigateToContainerTerminal invalid',
      method: (api: typeof containerDesktopAPI.navigation): ((id: string) => Promise<void>) =>
        api.navigateToContainerTerminal,
    },
  ])('$name', async ({ method }) => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const containerExistSpy = vi.spyOn(containerProviderRegistry, 'containerExist');
    containerExistSpy.mockImplementation(() => Promise.resolve(false));

    // Call the method provided
    let error = undefined;
    try {
      await method(api.navigation)('invalid');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();

    // Valid we listed the contains properly
    expect(containerExistSpy).toHaveBeenCalledOnce();
  });

  test('navigateToImages', async () => {
    const api = createApi();

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    await api.navigation.navigateToImages();
    expect(sendMock).toBeCalledWith('navigate', { page: NavigationPage.IMAGES });
  });
  test('navigateToImage existing image', async () => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const imageExistSpy = vi.spyOn(containerProviderRegistry, 'imageExist');
    imageExistSpy.mockImplementation(() => Promise.resolve(true));
    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    await api.navigation.navigateToImage('valid-id', 'valid-engine', 'valid-tag');

    // Ensure the send method is called properly
    expect(sendMock).toBeCalledWith('navigate', {
      page: NavigationPage.IMAGE,
      parameters: {
        id: 'valid-id',
        engineId: 'valid-engine',
        tag: 'valid-tag',
      },
    });

    // Valid we listed the contains properly each time
    expect(imageExistSpy).toHaveBeenCalledOnce();
  });
  test('navigateToImage non-existent image', async () => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const imageExistSpy = vi.spyOn(containerProviderRegistry, 'imageExist');
    imageExistSpy.mockImplementation(() => Promise.resolve(false));

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    let error = undefined;
    try {
      await api.navigation.navigateToImage('non-valid-id', 'non-valid-engine', 'non-valid-tag');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();

    // Ensure the send method is never called
    expect(sendMock).toHaveBeenCalledTimes(0);

    // Valid we listed the contains properly each time
    expect(imageExistSpy).toHaveBeenCalledOnce();
  });
  test('navigateToVolumes', async () => {
    const api = createApi();

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    await api.navigation.navigateToVolumes();
    expect(sendMock).toBeCalledWith('navigate', { page: NavigationPage.VOLUMES });
  });
  test('navigateToVolume existing volume', async () => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const volumeExistSpy = vi.spyOn(containerProviderRegistry, 'volumeExist');
    volumeExistSpy.mockImplementation(() => Promise.resolve(true));
    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    await api.navigation.navigateToVolume('valid-name', 'valid-engine');

    // Ensure the send method is called properly
    expect(sendMock).toBeCalledWith('navigate', {
      page: NavigationPage.VOLUME,
      parameters: {
        name: 'valid-name',
      },
    });

    // Valid we listed the contains properly each time
    expect(volumeExistSpy).toHaveBeenCalledOnce();
  });
  test('navigateToVolume non-existent volume', async () => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const volumeExistSpy = vi.spyOn(containerProviderRegistry, 'volumeExist');
    volumeExistSpy.mockImplementation(() => Promise.resolve(false));

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    let error = undefined;
    try {
      await api.navigation.navigateToVolume('non-valid-name', 'non-valid-engine');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();

    // Ensure the send method is called properly
    expect(sendMock).toHaveBeenCalledTimes(0);

    // Valid we listed the contains properly each time
    expect(volumeExistSpy).toHaveBeenCalledOnce();
  });
  test('navigateToPods', async () => {
    const api = createApi();

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    await api.navigation.navigateToPods();
    expect(sendMock).toBeCalledWith('navigate', { page: NavigationPage.PODMAN_PODS });
  });
  test('navigateToPod existing pod', async () => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const podExistSpy = vi.spyOn(containerProviderRegistry, 'podExist');
    podExistSpy.mockImplementation(() => Promise.resolve(true));

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    await api.navigation.navigateToPod('valid-kind', 'valid-name', 'valid-engine');

    // Ensure the send method is called properly
    expect(sendMock).toBeCalledWith('navigate', {
      page: NavigationPage.PODMAN_POD,
      parameters: {
        name: 'valid-name',
        engineId: 'valid-engine',
      },
    });

    // Valid we listed the contains properly each time
    expect(podExistSpy).toHaveBeenCalledOnce();
  });
  test('navigateToPod non-existent volume', async () => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const podExistSpy = vi.spyOn(containerProviderRegistry, 'podExist');
    podExistSpy.mockImplementation(() => Promise.resolve(false));

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    let error = undefined;
    try {
      await api.navigation.navigateToPod('non-valid-kind', 'non-valid-name', 'non-valid-engine');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();

    // Ensure the send method is called properly
    expect(sendMock).toHaveBeenCalledTimes(0);

    // Valid we listed the contains properly each time
    expect(podExistSpy).toHaveBeenCalledOnce();
  });

  test('navigateToContribution existing contribution', async () => {
    const api = createApi();

    // Mock listSimpleContainer implementation
    const listContributionsSpy = vi.spyOn(contributionManager, 'listContributions');
    listContributionsSpy.mockImplementation(() => [
      {
        name: 'valid-name',
      } as unknown as ContributionInfo,
    ]);
    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    await api.navigation.navigateToContribution('valid-name');

    // Ensure the send method is called properly
    expect(sendMock).toBeCalledWith('navigate', {
      page: NavigationPage.CONTRIBUTION,
      parameters: {
        name: 'valid-name',
      },
    });

    // Valid we listed the contains properly each time
    expect(listContributionsSpy).toHaveBeenCalledOnce();
  });
  test('navigateToContribution non-existent contribution', async () => {
    const api = createApi();

    // Mock listContributions implementation
    const listContributionsSpy = vi.spyOn(contributionManager, 'listContributions');
    listContributionsSpy.mockImplementation(() => []);
    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    // Call the method provided
    let error = undefined;
    try {
      await api.navigation.navigateToContribution('non-valid-name');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();

    // Ensure the send method is called properly
    expect(sendMock).toHaveBeenCalledTimes(0);

    // Valid we listed the contains properly each time
    expect(listContributionsSpy).toHaveBeenCalledOnce();
  });

  test('navigateToWebview', async () => {
    const api = createApi();

    vi.mocked(webviewRegistry.listWebviews).mockReturnValue([
      {
        id: 'myWebviewId',
      } as unknown as WebviewInfo,
    ]);

    await api.navigation.navigateToWebview('myWebviewId');

    // Ensure the send method is called properly
    expect(vi.mocked(apiSender).send).toBeCalledWith('navigate', {
      page: NavigationPage.WEBVIEW,
      parameters: {
        id: 'myWebviewId',
      },
    });

    expect(vi.mocked(webviewRegistry.listWebviews)).toHaveBeenCalled();
  });

  test('navigateToOnboarding without parameter', async () => {
    const api = createApi();

    vi.mocked(onboardingRegistry.getOnboarding).mockReturnValue({
      extension: 'foo',
    } as OnboardingInfo);

    await api.navigation.navigateToOnboarding();
    expect(vi.mocked(apiSender.send)).toBeCalledWith('navigate', {
      page: NavigationPage.ONBOARDING,
      parameters: {
        extensionId: 'publisher.extension-name',
      },
    });

    // checked on onboarding registry
    expect(vi.mocked(onboardingRegistry.getOnboarding)).toHaveBeenCalledWith('publisher.extension-name');
  });

  test('navigateToOnboarding with parameter', async () => {
    vi.mocked(onboardingRegistry.getOnboarding).mockReturnValue({
      extension: 'foo',
    } as OnboardingInfo);

    const api = createApi();

    // Call the method provided
    await api.navigation.navigateToOnboarding('my.extension');

    // Ensure the send method is called properly
    expect(vi.mocked(apiSender.send)).toBeCalledWith('navigate', {
      page: NavigationPage.ONBOARDING,
      parameters: {
        extensionId: 'my.extension',
      },
    });

    // checked on onboarding registry
    expect(vi.mocked(onboardingRegistry.getOnboarding)).toHaveBeenCalledWith('my.extension');
  });

  test('navigateToOnboarding but no onboarding available', async () => {
    vi.mocked(onboardingRegistry.getOnboarding).mockReturnValue(undefined);

    const api = createApi();

    // Call the method provided
    let error = undefined;
    try {
      await api.navigation.navigateToOnboarding('do.not-exists');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();

    // Ensure the send method is never called
    expect(vi.mocked(apiSender.send)).not.toHaveBeenCalled();

    // checked on onboarding registry
    expect(vi.mocked(onboardingRegistry.getOnboarding)).toHaveBeenCalledWith('do.not-exists');
  });

  test('navigateToCliTools', async () => {
    const api = createApi();

    // Spy send method
    const sendMock = vi.spyOn(apiSender, 'send');

    await api.navigation.navigateToCliTools();
    expect(sendMock).toBeCalledWith('navigate', { page: NavigationPage.CLI_TOOLS });
  });
});

test('check listWebviews', async () => {
  const api = createApi();

  // Mock listSimpleWebviews implementation
  const listSimpleWebviewsSpy = vi.spyOn(webviewRegistry, 'listSimpleWebviews');
  listSimpleWebviewsSpy.mockImplementation(() =>
    Promise.resolve([
      {
        id: '123',
        viewType: 'customView',
        title: 'customTitle1',
      },
      {
        id: '456',
        viewType: 'anotherView',
        title: 'customTitle2',
      },
    ]),
  );
  // Call the method provided
  const result = await api.window.listWebviews();

  // check we called method
  expect(listSimpleWebviewsSpy).toHaveBeenCalledOnce();

  // esnure we got result
  expect(result).toBeDefined();
  expect(result.length).toBe(2);
  expect(result[0]?.id).toBe('123');
  expect(result[0]?.viewType).toBe('customView');
  expect(result[0]?.title).toBe('customTitle1');
  expect(result[1]?.id).toBe('456');
  expect(result[1]?.viewType).toBe('anotherView');
  expect(result[1]?.title).toBe('customTitle2');
});

test('check version', async () => {
  const fakeVersion = '1.2.3.4';
  // mock electron.app.getVersion
  vi.mocked(app.getVersion).mockReturnValue(fakeVersion);
  const api = createApi();

  const readPodmanVersion = api.version;

  // check we called method
  expect(readPodmanVersion).toBe(fakeVersion);
});

test('listPods', async () => {
  const listPodsSpy = vi.spyOn(containerProviderRegistry, 'listPods');

  const api = createApi();

  await api.containerEngine.listPods();
  expect(listPodsSpy).toHaveBeenCalledOnce();
});

test('stopPod', async () => {
  const stopPodSpy = vi.spyOn(containerProviderRegistry, 'stopPod');
  const api = createApi();
  await api.containerEngine.stopPod('engine1', 'pod1');
  expect(stopPodSpy).toHaveBeenCalledWith('engine1', 'pod1');
});

test('removePod', async () => {
  const removePodSpy = vi.spyOn(containerProviderRegistry, 'removePod');
  const api = createApi();
  await api.containerEngine.removePod('engine1', 'pod1');
  expect(removePodSpy).toHaveBeenCalledWith('engine1', 'pod1');
});

describe('authentication Provider', async () => {
  const BASE64ENCODEDIMAGE = 'BASE64ENCODEDIMAGE';

  const providerMock = {
    onDidChangeSessions: vi.fn(),
    getSessions: vi.fn().mockResolvedValue([]),
    createSession: vi.fn(),
    removeSession: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('basic registerAuthenticationProvider ', async () => {
    const disposables: IDisposable[] = [];

    const api = createApi(disposables);
    expect(api).toBeDefined();
    // size is 0 for disposables
    expect(disposables.length).toBe(0);
    api.authentication.registerAuthenticationProvider('provider1.id', 'Provider1 Label', providerMock, {
      supportsMultipleAccounts: true,
    });
    // one disposable
    expect(disposables.length).toBe(1);

    expect(authenticationProviderRegistry.registerAuthenticationProvider).toBeCalledWith(
      'provider1.id',
      'Provider1 Label',
      providerMock,
      { supportsMultipleAccounts: true },
    );
  });

  test('allows images option to be undefined or empty', async () => {
    vi.mocked(getBase64Image).mockReturnValue(BASE64ENCODEDIMAGE);
    const api = createApi();

    expect(api).toBeDefined();

    api.authentication.registerAuthenticationProvider('provider1.id', 'Provider1 Label', providerMock, {});

    // grab the call to authenticationProviderRegistry.registerAuthenticationProvider
    const call = vi.mocked(authenticationProviderRegistry.registerAuthenticationProvider).mock.calls[0];

    // get options from the call
    const options = call?.[3];

    expect(options?.images?.logo).toBeUndefined();
    expect(options?.images?.icon).toBeUndefined();
  });

  test('allows images option to be single image', async () => {
    vi.mocked(getBase64Image).mockReturnValue(BASE64ENCODEDIMAGE);
    const api = createApi();

    expect(api).toBeDefined();

    api.authentication.registerAuthenticationProvider('provider1.id', 'Provider1 Label', providerMock, {
      images: {
        icon: './image.png',
        logo: './image.png',
      },
    });
    // grab the call to authenticationProviderRegistry.registerAuthenticationProvider
    const call = vi.mocked(authenticationProviderRegistry.registerAuthenticationProvider).mock.calls[0];

    // get options from the call
    const options = call?.[3];

    expect(options?.images?.logo).equals(BASE64ENCODEDIMAGE);
    expect(options?.images?.icon).equals(BASE64ENCODEDIMAGE);
  });

  test('allows images option to be light/dark image', async () => {
    vi.mocked(getBase64Image).mockReturnValue(BASE64ENCODEDIMAGE);
    const api = createApi();

    expect(api).toBeDefined();

    api.authentication.registerAuthenticationProvider('provider1.id', 'Provider1 Label', providerMock, {
      images: {
        icon: {
          light: './image.png',
          dark: './image.png',
        },
        logo: {
          light: './image.png',
          dark: './image.png',
        },
      },
    });
    // grab the call to authenticationProviderRegistry.registerAuthenticationProvider
    const call = vi.mocked(authenticationProviderRegistry.registerAuthenticationProvider).mock.calls[0];

    // get options from the call
    const options = call?.[3];

    const themeIcon = typeof options?.images?.icon === 'string' ? undefined : options?.images?.icon;
    expect(themeIcon).toBeDefined();
    expect(themeIcon?.light).equals(BASE64ENCODEDIMAGE);
    expect(themeIcon?.dark).equals(BASE64ENCODEDIMAGE);
    const themeLogo = typeof options?.images?.logo === 'string' ? undefined : options?.images?.logo;
    expect(themeLogo).toBeDefined();
    expect(themeLogo?.light).equals(BASE64ENCODEDIMAGE);
    expect(themeLogo?.dark).equals(BASE64ENCODEDIMAGE);
  });
});

test('createCliTool ', async () => {
  const disposables: IDisposable[] = [];

  const api = createApi(disposables);

  expect(api).toBeDefined();
  expect(disposables.length).toBe(0);
  const options: containerDesktopAPI.CliToolOptions = {
    name: 'tool-name',
    displayName: 'tool-display-name',
    markdownDescription: 'markdown description',
    images: {},
    version: '1.0.1',
    path: 'path/to/tool-name',
  };

  vi.mocked(cliToolRegistry.createCliTool).mockReturnValue({ id: 'created' } as containerDesktopAPI.CliTool);

  const newCliTool = api.cli.createCliTool(options);
  expect(disposables.length).toBe(1);

  expect(cliToolRegistry.createCliTool).toBeCalledWith(expect.objectContaining({ extensionPath: '/path' }), options);
  expect(newCliTool).toStrictEqual({ id: 'created' });
});

test('registerImageCheckerProvider ', async () => {
  const disposables: IDisposable[] = [];

  const api = createApi(disposables);

  expect(api).toBeDefined();

  const provider = {
    check: (
      _image: containerDesktopAPI.ImageInfo,
      _token?: containerDesktopAPI.CancellationToken,
    ): containerDesktopAPI.ProviderResult<containerDesktopAPI.ImageChecks> => {
      return {
        checks: [
          {
            name: 'check1',
            status: 'failed',
          },
        ],
      };
    },
  };

  vi.mocked(imageCheckerImpl.registerImageCheckerProvider).mockReturnValue(Disposable.create(() => {}));
  expect(disposables.length).toBe(0);
  api.imageChecker.registerImageCheckerProvider(provider, { label: 'dummyLabel' });
  expect(disposables.length).toBe(1);
  expect(imageCheckerImpl.registerImageCheckerProvider).toBeCalledWith(
    expect.objectContaining({ extensionPath: '/path' }),
    provider,
    { label: 'dummyLabel' },
  );
});

test('loadExtension with themes', async () => {
  const manifest = {
    name: 'hello',
    contributes: {
      themes: [
        {
          id: 'custom-dark',
          name: 'Custom dark theme',
          parent: 'dark',
          colors: {
            TitlebarBg: 'red',
          },
        },
      ],
    },
  };

  const fakeExtension = {
    manifest,
    api: {},
    subscriptions: [],
  } as unknown as AnalyzedExtension;

  await extensionLoader.loadExtension(fakeExtension);

  expect(colorRegistry.registerExtensionThemes).toBeCalledWith(fakeExtension, manifest.contributes.themes);
});

describe('window', async () => {
  test('showOpenDialog ', async () => {
    const api = createApi();

    expect(api).toBeDefined();

    const filePaths = ['/path-to-file1', '/path-to-file2'];
    vi.mocked(dialogRegistry.openDialog).mockResolvedValue(filePaths);

    const uris = await api.window.showOpenDialog();
    expect(uris?.length).toBe(2);
    const urisArray = uris as containerDesktopAPI.Uri[];

    expect(dialogRegistry.openDialog).toBeCalled();
    expect(urisArray[0]?.fsPath).toContain('path-to-file1');
    expect(urisArray[1]?.fsPath).toContain('path-to-file2');
  });

  test('showSaveDialog ', async () => {
    const api = createApi();

    expect(api).toBeDefined();

    const filePath = '/path-to-file1';
    vi.mocked(dialogRegistry.saveDialog).mockResolvedValue(Uri.file(filePath));

    const uri = await api.window.showSaveDialog();

    expect(dialogRegistry.saveDialog).toBeCalled();
    expect(uri?.fsPath).toContain('path-to-file1');
  });
});

describe('containerEngine', async () => {
  const CONTAINER_PROVIDER_MOCK = {
    name: 'dummyProvider',
  } as unknown as containerDesktopAPI.ContainerProviderConnection;

  describe('buildImage', () => {
    let api: typeof containerDesktopAPI;
    beforeEach(() => {
      api = createApi();
      expect(api).toBeDefined();
    });

    test('buildImage without options should call ContainerProviderRegistry#buildImage without options', async () => {
      const callbackMock = vi.fn();
      await api.containerEngine.buildImage('context', callbackMock);

      expect(containerProviderRegistry.buildImage).toHaveBeenCalledOnce();
      expect(containerProviderRegistry.buildImage).toHaveBeenCalledWith('context', callbackMock, undefined);
    });

    test('non-(string | boolean) pull option should throw an error', async () => {
      await expect(async () => {
        await api.containerEngine.buildImage('context', vi.fn(), {
          pull: { foo: 'bar' }, // non-sense
        } as unknown as containerDesktopAPI.BuildImageOptions);
      }).rejects.toThrowError('option pull should be of type string or boolean got object');
    });

    type TestCase = {
      name: string;
      options?: containerDesktopAPI.BuildImageOptions;
      expected?: InternalBuildImageOptions;
    };

    test.each([
      {
        name: 'pull options as true string',
        options: {
          pull: 'true',
        },
        expected: {
          pull: true,
        },
      },
      {
        name: 'pull options as True string (uppercase)',
        options: {
          pull: 'True',
        },
        expected: {
          pull: true,
        },
      },
      {
        name: 'pull options as non-true string',
        options: {
          pull: 'false',
        },
        expected: {
          pull: false,
        },
      },
      {
        name: 'pull options as non-true string',
        options: {
          pull: 'false',
        },
        expected: {
          pull: false,
        },
      },
    ] as Array<TestCase>)('$name', async ({ options, expected }) => {
      await api.containerEngine.buildImage('context', vi.fn(), options);

      expect(containerProviderRegistry.buildImage).toHaveBeenCalledWith('context', expect.any(Function), expected);
    });
  });

  test('statsContainer ', async () => {
    vi.mocked(containerProviderRegistry.getContainerStats).mockResolvedValue(99);
    vi.mocked(containerProviderRegistry.stopContainerStats).mockResolvedValue(undefined);

    const api = createApi();

    expect(api).toBeDefined();

    const disposable = await api.containerEngine.statsContainer('dummyEngineId', 'dummyContainerId', () => {});
    expect(disposable).toBeDefined();
    expect(disposable instanceof Disposable).toBeTruthy();
    expect(containerProviderRegistry.getContainerStats).toHaveBeenCalledWith(
      'dummyEngineId',
      'dummyContainerId',
      expect.anything(),
    );

    disposable.dispose();
    await vi.waitUntil(() => {
      expect(containerProviderRegistry.stopContainerStats).toHaveBeenCalledWith(99);
      return true;
    });
  });

  test('listImages without option ', async () => {
    vi.mocked(containerProviderRegistry.podmanListImages).mockResolvedValue([]);

    const api = createApi();

    expect(api).toBeDefined();

    const images = await api.containerEngine.listImages();
    expect(images.length).toBe(0);
    expect(containerProviderRegistry.podmanListImages).toHaveBeenCalledWith(undefined);
  });

  test('listImages with provider option', async () => {
    vi.mocked(containerProviderRegistry.podmanListImages).mockResolvedValue([]);
    const api = createApi();

    expect(api).toBeDefined();

    const images = await api.containerEngine.listImages({
      provider: CONTAINER_PROVIDER_MOCK,
    });
    expect(images.length).toBe(0);
    expect(containerProviderRegistry.podmanListImages).toHaveBeenCalledWith({
      provider: CONTAINER_PROVIDER_MOCK,
    });
  });

  test('listInfos without option', async () => {
    vi.mocked(containerProviderRegistry.listInfos).mockResolvedValue([]);
    const api = createApi();

    expect(api).toBeDefined();

    const infos = await api.containerEngine.listInfos();
    expect(infos.length).toBe(0);
    expect(containerProviderRegistry.listInfos).toHaveBeenCalledWith(undefined);
  });

  test('listInfos with provider option', async () => {
    vi.mocked(containerProviderRegistry.listInfos).mockResolvedValue([]);
    const api = createApi();
    expect(api).toBeDefined();

    const infos = await api.containerEngine.listInfos({
      provider: CONTAINER_PROVIDER_MOCK,
    });
    expect(infos.length).toBe(0);
    expect(containerProviderRegistry.listInfos).toHaveBeenCalledWith({
      provider: CONTAINER_PROVIDER_MOCK,
    });
  });

  test('pullImage with minimal arguments', async () => {
    const CALLBACK_MOCK = vi.fn();
    const api = createApi();
    expect(api).toBeDefined();

    await api.containerEngine.pullImage(CONTAINER_PROVIDER_MOCK, 'dummy-image:tag', CALLBACK_MOCK);
    expect(containerProviderRegistry.pullImage).toHaveBeenCalledWith(
      CONTAINER_PROVIDER_MOCK,
      'dummy-image:tag',
      CALLBACK_MOCK,
      undefined, // platform
      undefined, // abort controller
    );
  });

  test('pullImage with a cancellation token', async () => {
    const CANCELLATION_TOKEN: containerDesktopAPI.CancellationToken = {
      onCancellationRequested: vi.fn(),
      isCancellationRequested: false,
    };
    const api = createApi();
    expect(api).toBeDefined();

    // pass out cancellation token to the containerEngine api
    await api.containerEngine.pullImage(
      CONTAINER_PROVIDER_MOCK,
      'dummy-image:tag',
      vi.fn(),
      undefined,
      CANCELLATION_TOKEN,
    );

    // ensure an abort controller has been passed to pull image
    expect(containerProviderRegistry.pullImage).toHaveBeenCalledWith(
      CONTAINER_PROVIDER_MOCK,
      'dummy-image:tag',
      expect.any(Function),
      undefined, // platform
      expect.any(AbortController), // abort controller
    );

    // get back the controller using vi.mocked
    const controller: AbortController | undefined = vi.mocked(containerProviderRegistry.pullImage).mock.calls[0]?.[4];
    expect(controller).toBeDefined();
    // ensure it is not aborted
    expect(controller?.signal.aborted).toBeFalsy();

    // expect one subscriber, and get it
    expect(CANCELLATION_TOKEN.onCancellationRequested).toHaveBeenCalledOnce();
    const callback = vi.mocked(CANCELLATION_TOKEN.onCancellationRequested).mock.calls[0]?.[0];
    callback?.(undefined);

    // the signal should be marked as aborted
    expect(controller?.signal.aborted).toBeTruthy();
  });
});

describe('extensionContext', async () => {
  test('secrets', async () => {
    vi.mock('node:fs');

    vi.mocked(fs.existsSync).mockReturnValue(true);

    const extension: AnalyzedExtension = {
      subscriptions: [],
      id: 'fooPublisher.fooName',
      name: 'fooName',
      manifest: {
        version: '1.0',
      },
    } as unknown as AnalyzedExtension;

    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(5),
    } as unknown as containerDesktopAPI.Configuration);

    const getMock = vi.fn();
    const storeMock = vi.fn();
    const deleteMock = vi.fn();

    vi.mocked(safeStorageRegistry.getExtensionStorage).mockReturnValue({
      get: getMock,
      store: storeMock,
      delete: deleteMock,
    } as unknown as ExtensionSecretStorage);

    let extensionContext: containerDesktopAPI.ExtensionContext | undefined;

    const activateMethod = (context: containerDesktopAPI.ExtensionContext): void => {
      extensionContext = context;
    };

    const extensionMain = {
      activate: activateMethod,
    };

    await extensionLoader.activateExtension(extension, extensionMain);

    expect(extensionContext).toBeDefined();
    expect(extensionContext?.secrets).toBeDefined();
    expect(telemetry.track).toBeCalledWith('activateExtension', {
      extensionId: 'fooPublisher.fooName',
      extensionVersion: '1.0',
      duration: expect.any(Number),
    });

    expect(safeStorageRegistry.getExtensionStorage).toBeCalledWith('fooPublisher.fooName');

    await extensionContext?.secrets.store('key', 'value');
    expect(storeMock).toBeCalledWith('key', 'value');

    await extensionContext?.secrets.get('key');
    expect(getMock).toBeCalledWith('key');

    await extensionContext?.secrets.delete('key');
    expect(deleteMock).toBeCalledWith('key');
  });
});

test('load extensions sequentially', async () => {
  // Check if missing dependencies are found
  const extensionId1 = 'foo.extension1';
  const extensionId2 = 'foo.extension2';
  const extensionId3 = 'foo.extension3';
  const unknownExtensionId = 'foo.unknown';

  // extension1 has no dependencies
  const analyzedExtension1: AnalyzedExtension = {
    id: extensionId1,
    manifest: {
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension2 depends on extension 1
  const analyzedExtension2: AnalyzedExtension = {
    id: extensionId2,
    manifest: {
      extensionDependencies: [extensionId1],
      name: 'hello',
    },
  } as AnalyzedExtension;

  // extension3 depends on unknown extension unknown
  const analyzedExtension3: AnalyzedExtension = {
    id: extensionId3,
    manifest: {
      extensionDependencies: [unknownExtensionId],
      name: 'hello',
    },
  } as AnalyzedExtension;

  // mock loadExtension
  const loadExtensionMock = vi.spyOn(extensionLoader, 'loadExtension');
  loadExtensionMock.mockImplementation(extension => {
    if (extension.id === extensionId1) {
      // extension 1 takes 1s to load
      return new Promise(resolve => setTimeout(resolve, 1000));
    } else if (extension.id === extensionId2) {
      return new Promise(resolve => setTimeout(resolve, 100));
    } else if (extension.id === extensionId3) {
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
    return Promise.resolve();
  });

  const start = performance.now();
  await extensionLoader.loadExtensions([analyzedExtension1, analyzedExtension2, analyzedExtension3]);
  const end = performance.now();

  const delta = end - start;
  // delta should be greater than 2s as it's sequential (so 1s + 1s + 100ms) > 2s
  expect(delta).toBeGreaterThan(2000);

  // check if loadExtension is called in order
  expect(loadExtensionMock).toBeCalledTimes(3);
  expect(loadExtensionMock.mock.calls[0]?.[0]).toBe(analyzedExtension1);
  expect(loadExtensionMock.mock.calls[1]?.[0]).toBe(analyzedExtension2);
  expect(loadExtensionMock.mock.calls[2]?.[0]).toBe(analyzedExtension3);
});

test('when loading registry registerRegistry, do not push to disposables', async () => {
  const disposables: IDisposable[] = [];

  const api = createApi(disposables);
  expect(api).toBeDefined();

  const fakeRegistry = {
    source: 'fake',
    serverUrl: 'http://fake',
    username: 'foo',
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    password: 'bar',
    secret: 'baz',
  };

  api.registry.registerRegistry(fakeRegistry);

  expect(disposables.length).toBe(0);
});

test('when registering a navigation route, should be pushed to disposables', () => {
  const disposables: IDisposable[] = [];

  const api = createApi(disposables);
  expect(api).toBeDefined();

  expect(disposables.length).toBe(0);
  api.navigation.register('dummy-route-id', 'dummy-command-id');
  expect(disposables.length).toBe(1);
});

test('withProgress should add the extension id to the routeId', async () => {
  vi.mocked(progress.withProgress).mockResolvedValue(undefined);
  const api = createApi();

  expect(api).toBeDefined();

  await api.window.withProgress<void>(
    {
      location: ProgressLocation.TASK_WIDGET,
      title: 'Dummy title',
      details: {
        routeId: 'publisher.extension-name.publisher.extension-name.dummy-route-id',
        routeArgs: ['hello', 'world'],
      },
    },
    async () => {},
  );

  expect(progress.withProgress).toHaveBeenCalledWith(
    {
      location: ProgressLocation.TASK_WIDGET,
      title: 'Dummy title',
      details: {
        routeId: 'publisher.extension-name.publisher.extension-name.publisher.extension-name.dummy-route-id',
        routeArgs: ['hello', 'world'],
      },
    },
    expect.any(Function),
  );
});

describe('loading extension folders', () => {
  const fileEntry = {
    isDirectory: () => false,
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
  const nodeModulesEntry = {
    isDirectory: () => true,
    name: 'node_modules',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
  const dirEntry = {
    isDirectory: () => true,
    name: 'extension1',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
  const dirEntry2 = {
    isDirectory: () => true,
    name: 'extension2',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
  const dirEntry3 = {
    isDirectory: () => true,
    name: 'extension3',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
  const dirEntry4 = {
    isDirectory: () => true,
    name: 'extension4',
  } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;

  describe('in dev mode', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      vi.resetAllMocks();
    });

    test('ignores files', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([fileEntry]);

      const folders = await extensionLoader.readDevelopmentFolders('path');

      expect(folders).length(0);
    });
    test('ignores node_modules folders', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([nodeModulesEntry]);

      const folders = await extensionLoader.readDevelopmentFolders('path');

      expect(folders).length(0);
    });
    test('ignores folders without package.json', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([dirEntry]);
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const folders = await extensionLoader.readDevelopmentFolders('path');

      expect(folders).length(0);
    });

    test('recognizes a plain extension when only ext/package.json is present', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([dirEntry]);
      vi.spyOn(fs, 'existsSync').mockReturnValueOnce(false).mockReturnValueOnce(true);
      const folders = await extensionLoader.readDevelopmentFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(path.join('path', 'extension1'));
    });

    test('recognizes as an api extension when only ext/packages/extension/package.json is present', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([dirEntry]);
      vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true).mockReturnValueOnce(true);
      const folders = await extensionLoader.readDevelopmentFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(path.join('path', 'extension1', 'packages', 'extension'));
    });

    test('recognizes as an api extension when ext/package.json and ext/packages/extension/package.json are present', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([dirEntry]);
      vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true).mockReturnValueOnce(false);
      const folders = await extensionLoader.readDevelopmentFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(path.join('path', 'extension1', 'packages', 'extension'));
    });

    test('works correctly for multiple different extensions, files and empty folders', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([fileEntry, dirEntry, dirEntry2, dirEntry3, dirEntry4]);
      vi.spyOn(fs, 'existsSync')
        // an api extension
        .mockReturnValueOnce(true)
        // an plain extension
        .mockReturnValueOnce(false) // plain extension
        // priority to an api extension
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true) // priority to api extension
        // ignore no package.json folders
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);
      const folders = await extensionLoader.readDevelopmentFolders('path');

      expect(folders).length(3);
      expect(folders[0]).toBe(path.join('path', 'extension1', 'packages', 'extension'));
      expect(folders[1]).toBe(path.join('path', 'extension2'));
      expect(folders[2]).toBe(path.join('path', 'extension3', 'packages', 'extension'));
    });
  });

  describe('in prod mode', () => {
    test('ignores files', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([fileEntry]);

      const folders = await extensionLoader.readProductionFolders('path');

      expect(folders).length(0);
    });
    test('ignores node_modules folders', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([nodeModulesEntry]);

      const folders = await extensionLoader.readProductionFolders('path');

      expect(folders).length(0);
    });
    test('recognizes a plain extension when only ext/package.json is present', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([dirEntry]);
      vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
      const folders = await extensionLoader.readProductionFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(path.join('path', 'extension1', 'builtin', 'extension1.cdix'));
    });
    test('recognizes an api extension when ext/package.json is not present', async () => {
      vi.spyOn(fs.promises, 'readdir').mockResolvedValue([dirEntry]);
      vi.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
      const folders = await extensionLoader.readProductionFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(path.join('path', 'extension1', 'packages', 'extension', 'builtin', `extension1.cdix`));
    });
  });
});

test('reload extensions', async () => {
  const extension = {
    path: 'fakePath',
    manifest: {
      displayName: 'My Extension Display Name',
    },
    id: 'my.extensionId',
  } as unknown as AnalyzedExtension;

  // override deactivateExtension
  const deactivateSpy = vi.spyOn(extensionLoader, 'deactivateExtension');
  const analyzeExtensionSpy = vi.spyOn(extensionLoader, 'analyzeExtension');
  const loadExtensionSpy = vi.spyOn(extensionLoader, 'loadExtension');
  const analyzedExtension = {} as unknown as AnalyzedExtensionWithApi;
  analyzeExtensionSpy.mockResolvedValue(analyzedExtension);

  const fakeDisposableObject = {
    dispose: vi.fn(),
  } as unknown as Disposable;
  vi.mocked(notificationRegistry.addNotification).mockReturnValue(fakeDisposableObject);

  // reload the extension
  await extensionLoader.reloadExtension(extension, false);

  expect(deactivateSpy).toBeCalledWith(extension.id);
  expect(analyzeExtensionSpy).toBeCalledWith(extension.path, false);
  expect(loadExtensionSpy).toBeCalledWith(analyzedExtension, true);

  expect(vi.mocked(notificationRegistry.addNotification)).toBeCalledWith({
    extensionId: extension.id,
    title: 'Extension My Extension Display Name has been updated',
    type: 'info',
  });

  // restore the spy
  deactivateSpy.mockRestore();
  analyzeExtensionSpy.mockRestore();
  loadExtensionSpy.mockRestore();

  // wait the notification is disposed
  await vi.waitFor(() => expect(fakeDisposableObject.dispose).toBeCalled(), { timeout: 5_000 });
});

describe('init', () => {
  test('check configuration being registered', async () => {
    await extensionLoader.init();
    expect(configurationRegistry.registerConfigurations).toBeCalled();

    // get the object being called
    const call = vi.mocked(configurationRegistry.registerConfigurations).mock.calls[0];
    expect(call).toBeDefined();

    // check the developmentMode property is passed
    const configurations = call?.[0];
    expect(configurations).toBeDefined();
    expect(configurations?.length).toBeGreaterThanOrEqual(3);
    expect(configurations?.[2]?.id).toBe('preferences.extensions');
    const property =
      configurations?.[2]?.properties?.[
        `${ExtensionLoaderSettings.SectionName}.${ExtensionLoaderSettings.DevelopmentMode}`
      ];
    expect(property).toBeDefined();
    expect(property?.type).toBe('boolean');
    expect(property?.default).toBeTruthy();
  });
});

describe('loadDevelopmentFolderExtensions', () => {
  test('check loading', async () => {
    vi.mocked(extensionDevelopmentFolder).getDevelopmentFolders.mockReturnValue([
      { path: 'foo' },
      { path: 'bar' },
      { path: 'baz' },
    ]);

    // spy console.error
    const consoleErrorSpy = vi.spyOn(console, 'error');

    // 1st is non existing
    vi.mocked(fs.existsSync).mockReturnValueOnce(false);
    // 2nd exists
    vi.mocked(fs.existsSync).mockReturnValueOnce(true);
    // 3rd exists
    vi.mocked(fs.existsSync).mockReturnValueOnce(true);

    const analyzeExtensionSpy = vi.spyOn(extensionLoader, 'analyzeExtension');
    // bar is working
    const barAnalyzedExtension = {} as AnalyzedExtensionWithApi;
    analyzeExtensionSpy.mockResolvedValueOnce(barAnalyzedExtension);
    // baz has error
    const bazAnalyzedExtension = { error: 'dummy error' } as AnalyzedExtensionWithApi;
    analyzeExtensionSpy.mockResolvedValueOnce(bazAnalyzedExtension);

    const analyzedExtensions: AnalyzedExtension[] = [];
    await extensionLoader.loadDevelopmentFolderExtensions(analyzedExtensions);

    // check only bar has been added
    expect(analyzedExtensions.length).toBe(1);
    expect(analyzedExtensions[0]).toBe(barAnalyzedExtension);

    // expect we got a console error for baz
    expect(consoleErrorSpy).toBeCalledWith('Error while analyzing extension baz', bazAnalyzedExtension.error);

    consoleErrorSpy.mockRestore();
  });
});
