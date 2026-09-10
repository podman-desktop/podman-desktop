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

import { promises } from 'node:fs';
import * as path from 'node:path';

import type { ExtensionInfo } from '@podman-desktop/core-api';
import type { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import type { CatalogFetchableExtension } from '@podman-desktop/core-api/extension-catalog';
import type { IpcMain, IpcMainEvent } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { CancellationTokenRegistry } from '/@/plugin/cancellation-token-registry.js';
import type { ContainerProviderRegistry } from '/@/plugin/container-registry.js';
import type { ContributionManager } from '/@/plugin/contribution-manager.js';
import type { Directories } from '/@/plugin/directories.js';
import {
  DockerDesktopContribution,
  DockerDesktopInstaller,
} from '/@/plugin/docker-extension/docker-desktop-installer.js';
import type { ExtensionsCatalog } from '/@/plugin/extension/catalog/extensions-catalog.js';
import type { AnalyzedExtension } from '/@/plugin/extension/extension-analyzer.js';
import type { ExtensionLoader } from '/@/plugin/extension/extension-loader.js';
import type { ImageRegistry } from '/@/plugin/image-registry.js';
import type { TaskManager } from '/@/plugin/tasks/task-manager.js';
import type { Telemetry } from '/@/plugin/telemetry/telemetry.js';

import { ExtensionInstaller } from './extension-installer.js';
import { LocalExtensionImageLoader } from './local-extension-image-loader.js';

let extensionInstaller: ExtensionInstaller;

const apiSenderSendMock = vi.fn();
const apiSender: ApiSenderType = {
  send: apiSenderSendMock,
} as unknown as ApiSenderType;

const getPluginsDirectoryMock = vi.fn();
getPluginsDirectoryMock.mockReturnValue('/fake/plugins/directory');

const listExtensionsMock = vi.fn();
const loadExtensionMock = vi.fn();
const analyzeExtensionMock = vi.fn();
const loadExtensionsMock = vi.fn();
const removeExtensionMock = vi.fn();
const ensureExtensionsMock = vi.fn();
const extensionLoader: ExtensionLoader = {
  getPluginsDirectory: getPluginsDirectoryMock,
  listExtensions: listExtensionsMock,
  loadExtension: loadExtensionMock,
  loadExtensions: loadExtensionsMock,
  removeExtension: removeExtensionMock,
  analyzeExtension: analyzeExtensionMock,
  ensureExtensionIsEnabled: ensureExtensionsMock,
} as unknown as ExtensionLoader;

const getImageConfigLabelsMock = vi.fn();
const downloadAndExtractImageMock = vi.fn();
const imageRegistry: ImageRegistry = {
  getImageConfigLabels: getImageConfigLabelsMock,
  downloadAndExtractImage: downloadAndExtractImageMock,
} as unknown as ImageRegistry;

const getFetchableExtensionsMock = vi.fn();
const extensionsCatalog = {
  getFetchableExtensions: getFetchableExtensionsMock,
} as unknown as ExtensionsCatalog;

const telemetryMock = {
  track: vi.fn(),
} as unknown as Telemetry;

const directories = {
  getPluginsDirectory: vi.fn(),
  getContributionStorageDir: vi.fn(),
} as unknown as Directories;

const contributionManager = {} as unknown as ContributionManager;
const ipcMainOnMock = vi.fn();

const containerRegistry = {
  listImages: vi.fn(),
} as unknown as ContainerProviderRegistry;

const cancellationTokenRegistry = {
  getCancellationTokenSource: vi.fn(),
} as unknown as CancellationTokenRegistry;

const createTaskMock = vi.fn();
const taskManager = {
  createTask: createTaskMock,
} as unknown as TaskManager;

const findLocalImageMock = vi.spyOn(LocalExtensionImageLoader.prototype, 'findLocalImage');
const downloadAndExtractLocalImageMock = vi.spyOn(LocalExtensionImageLoader.prototype, 'downloadAndExtractImage');
const setupContributionMock = vi.spyOn(DockerDesktopInstaller.prototype, 'setupContribution');
const removeContributionMock = vi.spyOn(DockerDesktopInstaller.prototype, 'removeContribution');

vi.mock(import('node:fs'));
vi.mock(import('/@/plugin/docker-extension/docker-desktop-installer.js'));

beforeEach(() => {
  vi.resetAllMocks();

  findLocalImageMock.mockResolvedValue(undefined);
  downloadAndExtractLocalImageMock.mockResolvedValue(undefined);
  setupContributionMock.mockResolvedValue(undefined);
  removeContributionMock.mockResolvedValue(undefined);

  createTaskMock.mockReturnValue({
    status: 'in-progress',
    progress: undefined,
    error: undefined,
  });

  vi.mocked(promises.rm).mockResolvedValue(undefined);
  vi.mocked(promises.mkdir).mockResolvedValue(undefined);
  vi.mocked(promises.mkdtemp).mockResolvedValue('/fake/tmp/directory');
  vi.mocked(directories.getPluginsDirectory).mockReturnValue('/fake/plugins/directory');
  vi.mocked(directories.getContributionStorageDir).mockReturnValue('/fake/dd/directory');
  extensionInstaller = new ExtensionInstaller(
    apiSender,
    extensionLoader,
    containerRegistry,
    imageRegistry,
    extensionsCatalog,
    telemetryMock,
    directories,
    contributionManager,
    ipcMainOnMock,
    taskManager,
    cancellationTokenRegistry,
  );
});

describe('installFromImage task lifecycle', () => {
  const imageToPull = 'fake.io/fake-image:fake-tag';

  test('should create a task with the image name on success', async () => {
    getImageConfigLabelsMock.mockResolvedValueOnce({
      'org.opencontainers.image.title': 'title',
      'org.opencontainers.image.description': 'desc',
      'org.opencontainers.image.vendor': 'vendor',
      'io.podman-desktop.api.version': '1.0.0',
    });
    listExtensionsMock.mockResolvedValueOnce([]);
    vi.spyOn(extensionInstaller, 'extractExtensionFiles').mockResolvedValueOnce();
    analyzeExtensionMock.mockResolvedValueOnce({ manifest: {} } as AnalyzedExtension);

    await extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageToPull);

    expect(createTaskMock).toHaveBeenCalledWith({ title: `Installing extension ${imageToPull}` });
    const task = createTaskMock.mock.results[0]?.value;
    expect(task.status).toBe('success');
  });

  test('should update task.progress during image download', async () => {
    getImageConfigLabelsMock.mockResolvedValueOnce({
      'org.opencontainers.image.title': 'title',
      'org.opencontainers.image.description': 'desc',
      'org.opencontainers.image.vendor': 'vendor',
      'io.podman-desktop.api.version': '1.0.0',
    });
    listExtensionsMock.mockResolvedValueOnce([]);
    vi.spyOn(extensionInstaller, 'extractExtensionFiles').mockResolvedValueOnce();
    analyzeExtensionMock.mockResolvedValueOnce({ manifest: {} } as AnalyzedExtension);

    downloadAndExtractImageMock.mockImplementation(
      async (_image: string, _dest: string, logger: (event: { message: string; progress: number }) => void) => {
        logger({ message: 'Downloading layer 1/2', progress: 50 });
        logger({ message: 'Downloading layer 2/2', progress: 100 });
      },
    );

    await extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageToPull);

    const task = createTaskMock.mock.results[0]?.value;
    expect(task.progress).toBe(100);
  });

  test('should mark task as failed when installation errors', async () => {
    getImageConfigLabelsMock.mockRejectedValueOnce(new Error('network failure'));

    await extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageToPull);

    expect(createTaskMock).toHaveBeenCalledWith({ title: `Installing extension ${imageToPull}` });
    const task = createTaskMock.mock.results[0]?.value;
    expect(task.error).toBe('Error while analyzing image: Error: network failure');
  });

  test('should create a cancellable task and mark it canceled', async () => {
    const token = { isCancellationRequested: true };
    vi.mocked(cancellationTokenRegistry.getCancellationTokenSource).mockReturnValue({ token } as never);
    findLocalImageMock.mockRejectedValueOnce(new Error('Extension installation canceled'));

    await expect(
      extensionInstaller.installFromImage(
        vi.fn(),
        vi.fn(),
        vi.fn(),
        'localhost/example/extension:latest',
        undefined,
        undefined,
        42,
      ),
    ).rejects.toThrow('Extension installation canceled');

    expect(createTaskMock).toHaveBeenCalledWith({
      title: 'Installing extension localhost/example/extension:latest',
      cancellable: true,
      cancellationTokenSourceId: 42,
    });
    expect(createTaskMock.mock.results[0]?.value.status).toBe('canceled');
  });

  test('passes cancellation through remote label lookup and layer extraction', async () => {
    const token = { isCancellationRequested: false };
    vi.mocked(cancellationTokenRegistry.getCancellationTokenSource).mockReturnValue({ token } as never);
    getImageConfigLabelsMock.mockResolvedValueOnce({
      'org.opencontainers.image.title': 'title',
      'org.opencontainers.image.description': 'desc',
      'org.opencontainers.image.vendor': 'vendor',
      'io.podman-desktop.api.version': '1.0.0',
    });
    listExtensionsMock.mockResolvedValueOnce([]);
    vi.spyOn(extensionInstaller, 'extractExtensionFiles').mockResolvedValueOnce();
    analyzeExtensionMock.mockResolvedValueOnce({ manifest: {} } as AnalyzedExtension);

    await extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageToPull, undefined, undefined, 42);

    expect(getImageConfigLabelsMock).toHaveBeenCalledWith(imageToPull, token);
    expect(downloadAndExtractImageMock).toHaveBeenCalledWith(
      imageToPull,
      '/fake/tmp/directory',
      expect.any(Function),
      token,
    );
  });
});

describe('local image installation', () => {
  const imageName = 'localhost/example/extension:latest';
  const labels = {
    'org.opencontainers.image.title': 'Local extension',
    'org.opencontainers.image.description': 'Local extension description',
    'org.opencontainers.image.vendor': 'Example',
    'io.podman-desktop.api.version': '1.0.0',
  };

  test('uses the local engine for labels and layer extraction', async () => {
    const localImage = {
      engineId: 'podman-machine',
      engineName: 'Podman Machine',
      id: 'sha256:image',
      labels,
    };
    findLocalImageMock.mockResolvedValueOnce(localImage);
    listExtensionsMock.mockResolvedValueOnce([]);
    vi.spyOn(extensionInstaller, 'extractExtensionFiles').mockResolvedValueOnce();
    analyzeExtensionMock.mockResolvedValueOnce({ id: 'example.extension', manifest: {} } as AnalyzedExtension);

    await extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageName);

    expect(downloadAndExtractLocalImageMock).toHaveBeenCalledWith(
      localImage,
      imageName,
      '/fake/tmp/directory',
      expect.any(Function),
      undefined,
    );
    expect(getImageConfigLabelsMock).not.toHaveBeenCalled();
    expect(downloadAndExtractImageMock).not.toHaveBeenCalled();
  });

  test('preserves registry fallback when the localhost image is absent', async () => {
    getImageConfigLabelsMock.mockResolvedValueOnce(labels);
    listExtensionsMock.mockResolvedValueOnce([]);
    vi.spyOn(extensionInstaller, 'extractExtensionFiles').mockResolvedValueOnce();
    analyzeExtensionMock.mockResolvedValueOnce({ id: 'example.extension', manifest: {} } as AnalyzedExtension);

    await extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageName);

    expect(getImageConfigLabelsMock).toHaveBeenCalledWith(imageName, undefined);
    expect(downloadAndExtractImageMock).toHaveBeenCalledWith(
      imageName,
      '/fake/tmp/directory',
      expect.any(Function),
      undefined,
    );
    expect(downloadAndExtractLocalImageMock).not.toHaveBeenCalled();
  });

  test('reports missing labels without contacting a registry', async () => {
    findLocalImageMock.mockResolvedValueOnce({
      engineId: 'podman-machine',
      engineName: 'Podman Machine',
      id: 'sha256:image',
      labels: undefined,
    });
    const sendError = vi.fn();

    await extensionInstaller.installFromImage(vi.fn(), sendError, vi.fn(), imageName);

    expect(sendError).toHaveBeenCalledWith(
      `Image ${imageName} is not a Podman Desktop Extension. Unable to grab image config labels.`,
    );
    expect(getImageConfigLabelsMock).not.toHaveBeenCalled();
  });

  test('reports local lookup ambiguity without contacting a registry', async () => {
    findLocalImageMock.mockRejectedValueOnce(new Error('image exists in multiple running container engines'));
    const sendError = vi.fn();

    await extensionInstaller.installFromImage(vi.fn(), sendError, vi.fn(), imageName);

    expect(sendError).toHaveBeenCalledWith(
      'Error while analyzing image: Error: image exists in multiple running container engines',
    );
    expect(getImageConfigLabelsMock).not.toHaveBeenCalled();
  });

  test('removes temporary and partial final directories after extraction fails', async () => {
    findLocalImageMock.mockResolvedValueOnce({
      engineId: 'podman-machine',
      engineName: 'Podman Machine',
      id: 'sha256:image',
      labels,
    });
    listExtensionsMock.mockResolvedValueOnce([]);
    downloadAndExtractLocalImageMock.mockRejectedValueOnce(new Error('malformed saved image'));

    await expect(extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageName)).rejects.toThrow(
      'malformed saved image',
    );

    expect(promises.rm).toHaveBeenCalledWith('/fake/plugins/directory/localhostexampleextension', {
      recursive: true,
      force: true,
    });
    expect(promises.rm).toHaveBeenCalledWith('/fake/tmp/directory', { recursive: true, force: true });
  });

  test('reports the reserved destination when another install already claimed it', async () => {
    findLocalImageMock.mockResolvedValueOnce({
      engineId: 'podman-machine',
      engineName: 'Podman Machine',
      id: 'sha256:image',
      labels,
    });
    listExtensionsMock.mockResolvedValueOnce([]);
    vi.mocked(promises.mkdir).mockRejectedValueOnce(Object.assign(new Error('already exists'), { code: 'EEXIST' }));
    const sendError = vi.fn();

    await extensionInstaller.installFromImage(vi.fn(), sendError, vi.fn(), imageName);

    expect(sendError).toHaveBeenCalledWith(
      `Unable to install image ${imageName}: the target extension directory /fake/plugins/directory/localhostexampleextension already exists. Remove it if no installed extension uses it, then retry.`,
    );
    expect(downloadAndExtractLocalImageMock).not.toHaveBeenCalled();
  });

  test('removes extracted files when extension analysis returns no metadata', async () => {
    findLocalImageMock.mockResolvedValueOnce({
      engineId: 'podman-machine',
      engineName: 'Podman Machine',
      id: 'sha256:image',
      labels,
    });
    listExtensionsMock.mockResolvedValueOnce([]);
    vi.spyOn(extensionInstaller, 'extractExtensionFiles').mockResolvedValueOnce();
    analyzeExtensionMock.mockResolvedValueOnce(undefined);
    const sendError = vi.fn();

    await extensionInstaller.installFromImage(vi.fn(), sendError, vi.fn(), imageName);

    expect(sendError).toHaveBeenCalledWith('Error while analyzing extension: no extension metadata was returned');
    expect(promises.rm).toHaveBeenCalledWith('/fake/plugins/directory/localhostexampleextension', {
      recursive: true,
      force: true,
    });
  });
});

test('should install an image if labels are correct', async () => {
  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();

  const imageToPull = 'fake.io/fake-image:fake-tag';

  getImageConfigLabelsMock.mockResolvedValueOnce({
    'org.opencontainers.image.title': 'fake-title',
    'org.opencontainers.image.description': 'fake-description',
    'org.opencontainers.image.vendor': 'fake-vendor',
    'io.podman-desktop.api.version': '1.0.0',
  });

  listExtensionsMock.mockResolvedValueOnce([]);

  const spyExtractExtensionFiles = vi.spyOn(extensionInstaller, 'extractExtensionFiles');
  spyExtractExtensionFiles.mockResolvedValueOnce();

  analyzeExtensionMock.mockResolvedValueOnce({
    manifest: {},
  } as AnalyzedExtension);

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  expect(ensureExtensionsMock).toHaveBeenCalled();

  expect(sendLog).toHaveBeenCalledWith(`Analyzing image ${imageToPull}...`);
  // expect no error
  expect(sendError).not.toHaveBeenCalled();

  expect(sendEnd).toHaveBeenCalledWith('Extension Successfully installed.');

  // extension started
  expect(apiSenderSendMock).toHaveBeenCalledWith('extension-started');
});

test('should install an image (dd extensions) if labels are correct', async () => {
  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();

  const imageToPull = 'fake.io/fake-image:fake-tag';

  vi.mocked(imageRegistry.getImageConfigLabels).mockResolvedValueOnce({
    'org.opencontainers.image.title': 'fake-title',
    'org.opencontainers.image.description': 'fake-description',
    'org.opencontainers.image.vendor': 'fake-vendor',
    'com.docker.desktop.extension.api.version': '1.0.0',
  });

  const spyExtractExtensionFiles = vi.spyOn(extensionInstaller, 'extractExtensionFiles');

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  expect(sendLog).toHaveBeenCalledWith(`Analyzing image ${imageToPull}...`);
  // expect no error
  expect(sendError).not.toHaveBeenCalled();

  expect(spyExtractExtensionFiles).not.toHaveBeenCalled();
});

describe('Docker Desktop contribution cleanup', () => {
  const imageName = 'fake.io/fake-image:fake-tag';
  const finalFolderPath = '/fake/dd/directory/fakeiofakeimage';
  const labels = {
    'org.opencontainers.image.title': 'fake-title',
    'org.opencontainers.image.description': 'fake-description',
    'org.opencontainers.image.vendor': 'fake-vendor',
    'com.docker.desktop.extension.api.version': '1.0.0',
  };

  test('removes an incomplete contribution and allows a retry when setup returns undefined', async () => {
    getImageConfigLabelsMock.mockResolvedValue(labels);
    const installed = new DockerDesktopContribution('fake-title', finalFolderPath, {
      name: 'fake-title',
      ui: {},
    });
    setupContributionMock.mockResolvedValueOnce(undefined).mockResolvedValueOnce(installed);

    await expect(extensionInstaller.analyzeFromImage(vi.fn(), vi.fn(), imageName)).resolves.toBeUndefined();
    expect(promises.rm).toHaveBeenCalledWith(finalFolderPath, { recursive: true, force: true });

    await expect(extensionInstaller.analyzeFromImage(vi.fn(), vi.fn(), imageName)).resolves.toBe(installed);
    expect(setupContributionMock).toHaveBeenCalledTimes(2);
  });

  test('removes an incomplete contribution when setup throws', async () => {
    getImageConfigLabelsMock.mockResolvedValue(labels);
    setupContributionMock.mockRejectedValueOnce(new Error('setup failed'));

    await expect(extensionInstaller.analyzeFromImage(vi.fn(), vi.fn(), imageName)).rejects.toThrow('setup failed');
    expect(promises.rm).toHaveBeenCalledWith(finalFolderPath, { recursive: true, force: true });
  });

  test('removes an incomplete contribution when cancellation is requested during setup', async () => {
    getImageConfigLabelsMock.mockResolvedValue(labels);
    let canceled = false;
    const token = {
      get isCancellationRequested(): boolean {
        return canceled;
      },
    } as never;
    setupContributionMock.mockImplementationOnce(async () => {
      canceled = true;
      return new DockerDesktopContribution('fake-title', finalFolderPath, {
        name: 'fake-title',
        ui: {},
      });
    });

    await expect(
      extensionInstaller.analyzeFromImage(vi.fn(), vi.fn(), imageName, undefined, undefined, token),
    ).rejects.toThrow('Extension installation canceled');
    expect(removeContributionMock).toHaveBeenCalledOnce();
    expect(promises.rm).toHaveBeenCalledWith(finalFolderPath, { recursive: true, force: true });
  });
});

describe('extension loading rollback', () => {
  const imageName = 'fake.io/fake-image:fake-tag';
  const analyzedExtension = {
    id: 'example.extension',
    path: '/fake/plugins/directory/example',
    manifest: {},
  } as AnalyzedExtension;

  test('removes analyzed extensions when loading fails', async () => {
    vi.spyOn(extensionInstaller, 'analyzeFromImage').mockResolvedValueOnce(analyzedExtension);
    loadExtensionsMock.mockRejectedValueOnce(new Error('load failed'));

    await expect(extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageName)).rejects.toThrow(
      'load failed',
    );

    expect(removeExtensionMock).toHaveBeenCalledWith(analyzedExtension.id);
    expect(promises.rm).toHaveBeenCalledWith(analyzedExtension.path, { recursive: true, force: true });
    expect(apiSenderSendMock).not.toHaveBeenCalledWith('extension-started');
  });

  test('removes a loaded extension when cancellation is requested during loading', async () => {
    let canceled = false;
    const token = {
      get isCancellationRequested(): boolean {
        return canceled;
      },
    };
    vi.mocked(cancellationTokenRegistry.getCancellationTokenSource).mockReturnValue({ token } as never);
    vi.spyOn(extensionInstaller, 'analyzeFromImage').mockResolvedValueOnce(analyzedExtension);
    loadExtensionsMock.mockImplementationOnce(async () => {
      canceled = true;
    });

    await expect(
      extensionInstaller.installFromImage(vi.fn(), vi.fn(), vi.fn(), imageName, undefined, undefined, 42),
    ).rejects.toThrow('Extension installation canceled');

    expect(removeExtensionMock).toHaveBeenCalledWith(analyzedExtension.id);
    expect(promises.rm).toHaveBeenCalledWith(analyzedExtension.path, { recursive: true, force: true });
    expect(apiSenderSendMock).not.toHaveBeenCalledWith('extension-started');
  });
});

test('should fail if extension with same id is already installed', async () => {
  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();
  const imageToPull = 'fake.io/new-image:tag';

  // Mock valid labels
  vi.mocked(imageRegistry.getImageConfigLabels).mockResolvedValueOnce({
    'org.opencontainers.image.title': 'fake-title',
    'org.opencontainers.image.description': 'fake-description',
    'org.opencontainers.image.vendor': 'fake-vendor',
    'io.podman-desktop.api.version': '1.0.0',
  });

  // Mock existing extension with collision
  const publisher = 'my-publisher';
  const name = 'my-extension';

  const id = `${publisher}.${name}`;
  listExtensionsMock.mockResolvedValue([
    {
      id,
      name: name,
      path: '/some/existing/path',
    },
  ]);

  analyzeExtensionMock.mockResolvedValueOnce({
    id,
  } as AnalyzedExtension);

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  expect(sendLog).toHaveBeenCalledWith(`Analyzing image ${imageToPull}...`);

  // expect error
  expect(sendError).toHaveBeenCalledWith(`Extension ${publisher}.${name} is already installed.`);

  expect(sendEnd).not.toBeCalled();
});

test('should fail if extension is already installed', async () => {
  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();

  const imageToPull = 'fake.io/fake-image:fake-tag';

  getImageConfigLabelsMock.mockResolvedValueOnce({
    'org.opencontainers.image.title': 'fake-title',
    'org.opencontainers.image.description': 'fake-description',
    'org.opencontainers.image.vendor': 'fake-vendor',
    'io.podman-desktop.api.version': '1.0.0',
  });

  const extensionName = 'fake extension';
  listExtensionsMock.mockResolvedValueOnce([
    {
      name: 'fake extension',
      path: path.join('/fake/plugins/directory', 'fakeiofakeimage'),
    },
  ]);

  const spyExtractExtensionFiles = vi.spyOn(extensionInstaller, 'extractExtensionFiles');
  spyExtractExtensionFiles.mockResolvedValueOnce();

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  expect(sendLog).toHaveBeenCalledWith(`Analyzing image ${imageToPull}...`);

  // expect error
  expect(sendError).toHaveBeenCalledWith(`Extension ${extensionName} is already installed`);

  expect(sendEnd).not.toBeCalled();

  // extension not started
  expect(apiSenderSendMock).not.toBeCalled();
});

test('should fail if an image have incorrect labels', async () => {
  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();

  const imageToPull = 'fake.io/fake-image:fake-tag';

  // no labels to make invalid image
  getImageConfigLabelsMock.mockResolvedValueOnce({});

  listExtensionsMock.mockResolvedValueOnce([]);

  const spyExtractExtensionFiles = vi.spyOn(extensionInstaller, 'extractExtensionFiles');
  spyExtractExtensionFiles.mockResolvedValueOnce();

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  expect(sendLog).toHaveBeenCalledWith(`Analyzing image ${imageToPull}...`);
  // expect error
  expect(sendError).toHaveBeenCalledWith(`Image ${imageToPull} is not a Podman Desktop Extension`);

  expect(sendEnd).not.toBeCalled();

  // extension not started
  expect(apiSenderSendMock).not.toBeCalled();
});

test('should report error', async () => {
  const imageToPull = 'fake.io/fake-image:fake-tag';

  const spyExtractExtensionFiles = vi.spyOn(extensionInstaller, 'extractExtensionFiles');
  spyExtractExtensionFiles.mockResolvedValueOnce();

  const replyMethodMock = vi.fn();

  const spyInstaller = vi.spyOn(extensionInstaller, 'installFromImage');
  spyInstaller.mockRejectedValueOnce(new Error('fake error'));

  vi.mocked(ipcMainOnMock).mockImplementation(
    (_channel: string, listener: (event: IpcMainEvent, ...args: unknown[]) => void) => {
      // let's call the callback
      listener({ reply: replyMethodMock } as unknown as IpcMainEvent, imageToPull, 0);
      return {} as IpcMain;
    },
  );

  // call init method
  await extensionInstaller.init();

  // wait calls on reply mock with a loop
  while (replyMethodMock.mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // expect to have the sendError method called
  expect(replyMethodMock).toHaveBeenCalledWith('extension-installer:install-from-image-error', 0, 'Error: fake error');
});

test('should install an image with extension pack', async () => {
  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();

  const imageToPull = 'fake.io/fake-image:fake-tag';
  const analyzeFromImageSpy = vi.spyOn(extensionInstaller, 'analyzeFromImage');

  const extensionWithPack = {
    manifest: {
      name: 'extension-with-pack',
      extensionPack: ['my.other-extension', 'my.another-extension'],
    },
  } as AnalyzedExtension;

  const extensionOther = {
    manifest: {
      name: 'other-extension',
    },
  } as AnalyzedExtension;

  const extensionAnother = {
    manifest: {
      name: 'another-extension',
    },
  } as AnalyzedExtension;

  analyzeFromImageSpy.mockImplementation(
    (_sendLog: (message: string) => void, _sendError: (message: string) => void, imageName: string) => {
      if (imageName === 'fake.io/fake-image:fake-tag') {
        return Promise.resolve(extensionWithPack);
      } else if (imageName === 'my-other-extension-link') {
        return Promise.resolve(extensionOther);
      } else {
        return Promise.resolve(extensionAnother);
      }
    },
  );

  // no installed extension
  listExtensionsMock.mockResolvedValue([]);

  const fetchableExtension1: CatalogFetchableExtension = {
    extensionId: 'my.other-extension',
    link: 'my-other-extension-link',
    version: 'latest',
  };
  const fetchableExtension2: CatalogFetchableExtension = {
    extensionId: 'my.another-extension',
    link: 'my-another-extension-link',
    version: 'latest',
  };

  getFetchableExtensionsMock.mockResolvedValue([fetchableExtension1, fetchableExtension2]);

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  // expect no error
  expect(sendError).not.toHaveBeenCalled();

  expect(sendEnd).toHaveBeenCalledWith('Extension Successfully installed.');

  // extension started
  expect(apiSenderSendMock).toHaveBeenCalledWith('extension-started');

  // should have been called to load two extensions (current + extension pack)
  // expect to have 2 arguments in array
  expect(loadExtensionsMock).toHaveBeenCalledWith(
    expect.arrayContaining([extensionWithPack, extensionOther, extensionAnother]),
  );
});

test('should install an image with transitive dependencies', async () => {
  // extension A depends on extension B
  // extension B depends on extension C
  // extension C depends on nothing

  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();

  const imageToPull = 'fake.io/extensionA';
  const analyzeFromImageSpy = vi.spyOn(extensionInstaller, 'analyzeFromImage');

  const extensionA = {
    manifest: {
      name: 'extension-a',
      extensionDependencies: ['my.extension-b'],
    },
  } as AnalyzedExtension;

  const extensionB = {
    manifest: {
      name: 'extension-b',
      extensionDependencies: ['my.extension-c'],
    },
  } as AnalyzedExtension;

  const extensionC = {
    manifest: {
      name: 'extension-c',
    },
  } as AnalyzedExtension;

  analyzeFromImageSpy.mockImplementation(
    (_sendLog: (message: string) => void, _sendError: (message: string) => void, imageName: string) => {
      if (imageName === 'fake.io/extensionA') {
        return Promise.resolve(extensionA);
      } else if (imageName === 'fake.io/extensionB') {
        return Promise.resolve(extensionB);
      } else if (imageName === 'fake.io/extensionC') {
        return Promise.resolve(extensionC);
      }
      return Promise.reject(new Error(`Unknown image name ${imageName}`));
    },
  );

  // no installed extension
  listExtensionsMock.mockResolvedValue([]);

  const fetchableExtensionB: CatalogFetchableExtension = {
    extensionId: 'my.extension-b',
    link: 'fake.io/extensionB',
    version: 'latest',
  };
  const fetchableExtensionC: CatalogFetchableExtension = {
    extensionId: 'my.extension-c',
    link: 'fake.io/extensionC',
    version: 'latest',
  };

  getFetchableExtensionsMock.mockResolvedValue([fetchableExtensionB, fetchableExtensionC]);

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  // expect no error
  expect(sendError).not.toHaveBeenCalled();

  expect(sendEnd).toHaveBeenCalledWith('Extension Successfully installed.');

  // extension started
  expect(apiSenderSendMock).toHaveBeenCalledWith('extension-started');

  // should have been called to load two extensions (current + extension pack)
  // expect to have 2 arguments in array
  expect(loadExtensionsMock).toHaveBeenCalledWith(expect.arrayContaining([extensionA, extensionB, extensionC]));
});

test('should install an image with extension pack with an existing dependency already installed', async () => {
  const sendLog = vi.fn();
  const sendError = vi.fn();
  const sendEnd = vi.fn();

  const imageToPull = 'fake.io/fake-image:fake-tag';
  const analyzeFromImageSpy = vi.spyOn(extensionInstaller, 'analyzeFromImage');

  const extensionWithPack = {
    manifest: {
      name: 'extension-with-pack',
      extensionPack: ['my.another-extension', 'my.other-extension'],
    },
  } as AnalyzedExtension;

  const extensionOther = {
    manifest: {
      name: 'other-extension',
    },
  } as AnalyzedExtension;

  const extensionAnother = {
    manifest: {
      name: 'another-extension',
    },
  } as AnalyzedExtension;

  analyzeFromImageSpy.mockImplementation(
    (_sendLog: (message: string) => void, _sendError: (message: string) => void, imageName: string) => {
      if (imageName === 'fake.io/fake-image:fake-tag') {
        return Promise.resolve(extensionWithPack);
      } else if (imageName === 'my-other-extension-link') {
        return Promise.resolve(extensionOther);
      } else {
        return Promise.resolve(extensionAnother);
      }
    },
  );

  // my.another-extension is already installed
  const extensionInfo = {
    id: 'my.another-extension',
  } as unknown as ExtensionInfo;
  listExtensionsMock.mockResolvedValue([extensionInfo]);

  const fetchableExtension1: CatalogFetchableExtension = {
    extensionId: 'my.other-extension',
    link: 'my-other-extension-link',
    version: 'latest',
  };
  const fetchableExtension2: CatalogFetchableExtension = {
    extensionId: 'my.another-extension',
    link: 'my-another-extension-link',
    version: 'latest',
  };

  getFetchableExtensionsMock.mockResolvedValue([fetchableExtension1, fetchableExtension2]);

  await extensionInstaller.installFromImage(sendLog, sendError, sendEnd, imageToPull);

  // expect no error
  expect(sendError).not.toHaveBeenCalled();

  expect(sendEnd).toHaveBeenCalledWith('Extension Successfully installed.');

  // extension started
  expect(apiSenderSendMock).toHaveBeenCalledWith('extension-started');

  // should have been called to load two extensions (current + extension pack)
  // expect to have 2 arguments in array
  expect(loadExtensionsMock).toHaveBeenCalledWith(expect.arrayContaining([extensionWithPack, extensionOther]));

  expect(analyzeFromImageSpy).toHaveBeenCalledWith(
    expect.any(Function),
    expect.any(Function),
    'my-other-extension-link',
    undefined,
    undefined,
    undefined,
  );

  // this extension is already installed, so we should not analyze it
  expect(analyzeFromImageSpy).not.toHaveBeenCalledWith(
    expect.any(Function),
    expect.any(Function),
    'my-another-extension-link',
    undefined,
    undefined,
    undefined,
  );
});
