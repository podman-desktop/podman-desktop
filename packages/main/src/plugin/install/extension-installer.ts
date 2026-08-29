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
import { cp } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import type { CancellationToken } from '@podman-desktop/api';
import type { ExtensionInfo } from '@podman-desktop/core-api';
import { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import type { IpcMainEvent } from 'electron';
import { inject, injectable } from 'inversify';

import { IPCMainOn } from '/@/plugin/api.js';
import { CancellationTokenRegistry } from '/@/plugin/cancellation-token-registry.js';
import { ContainerProviderRegistry } from '/@/plugin/container-registry.js';
import { ContributionManager } from '/@/plugin/contribution-manager.js';
import { Directories } from '/@/plugin/directories.js';
import {
  DockerDesktopContribution,
  DockerDesktopInstaller,
} from '/@/plugin/docker-extension/docker-desktop-installer.js';
import { ExtensionsCatalog } from '/@/plugin/extension/catalog/extensions-catalog.js';
import type { AnalyzedExtension } from '/@/plugin/extension/extension-analyzer.js';
import { ExtensionLoader } from '/@/plugin/extension/extension-loader.js';
import { ImageRegistry } from '/@/plugin/image-registry.js';
import { TaskManager } from '/@/plugin/tasks/task-manager.js';
import { Telemetry } from '/@/plugin/telemetry/telemetry.js';

import { LocalExtensionImageLoader } from './local-extension-image-loader.js';

function getStringLabels(labels: Record<string, unknown> | undefined): Record<string, string> | undefined {
  if (!labels || !Object.values(labels).every(label => typeof label === 'string')) {
    return undefined;
  }
  return labels as Record<string, string>;
}

@injectable()
export class ExtensionInstaller {
  #dockerDesktopInstaller: DockerDesktopInstaller;
  #localExtensionImageLoader: LocalExtensionImageLoader;

  constructor(
    @inject(ApiSenderType)
    private apiSender: ApiSenderType,
    @inject(ExtensionLoader)
    private extensionLoader: ExtensionLoader,
    @inject(ContainerProviderRegistry)
    containerRegistry: ContainerProviderRegistry,
    @inject(ImageRegistry)
    private imageRegistry: ImageRegistry,
    @inject(ExtensionsCatalog)
    private extensionCatalog: ExtensionsCatalog,
    @inject(Telemetry)
    private telemetry: Telemetry,
    @inject(Directories)
    private directories: Directories,
    @inject(ContributionManager)
    contributionManager: ContributionManager,
    @inject(IPCMainOn)
    private readonly ipcMainOn: IPCMainOn,
    @inject(TaskManager)
    private taskManager: TaskManager,
    @inject(CancellationTokenRegistry)
    private cancellationTokenRegistry: CancellationTokenRegistry,
  ) {
    this.#dockerDesktopInstaller = new DockerDesktopInstaller(contributionManager);
    this.#localExtensionImageLoader = new LocalExtensionImageLoader(containerRegistry);
  }

  async extractExtensionFiles(
    tmpFolderPath: string,
    finalFolderPath: string,
    reportLog: (message: string) => void,
  ): Promise<void> {
    // files or folder to grab
    const filesExtension: string[] = [];
    const hostFiles: string[] = [];
    // do we have binaries in ${tmpFolderPath}/extension folder ?
    if (fs.existsSync(`${tmpFolderPath}/extension`)) {
      // list all files in the binaries/${platform} folder
      const extensionFolder = `${tmpFolderPath}/extension/`;

      // grab files from that directory using fs promises
      const extensionFiles = await fs.promises.readdir(extensionFolder, { withFileTypes: true });

      // add all files
      for (const file of extensionFiles) {
        // if it's a file, add it to the files list
        //if (file.isFile()) {
        filesExtension.push(file.name);
        //}
      }
    }

    // copy all files
    await Promise.all(
      filesExtension.map(async (file: string) => {
        return cp(path.join(tmpFolderPath, 'extension', file), path.join(finalFolderPath, file), { recursive: true });
      }),
    );
    // copy all host files
    await Promise.all(
      hostFiles.map(async (file: string) => {
        const sourceFile = path.join(tmpFolderPath, file);
        // get only the filename from the path
        const destFile = path.basename(sourceFile);
        reportLog(`Copying host file ${destFile}.`);
        return cp(sourceFile, path.join(finalFolderPath, 'host', destFile), { recursive: true });
      }),
    );
  }

  async analyzeFromImage(
    sendLog: (message: string) => void,
    sendError: (message: string) => void,
    imageName: string,
    catatlogExtensionId?: string,
    onProgress?: (progress: number) => void,
    token?: CancellationToken,
  ): Promise<AnalyzedExtension | DockerDesktopContribution | undefined> {
    imageName = imageName.trim();
    sendLog(`Analyzing image ${imageName}...`);
    let localImage;
    try {
      localImage = await this.#localExtensionImageLoader.findLocalImage(imageName, token);
    } catch (error) {
      if (token?.isCancellationRequested) {
        throw new Error('Extension installation canceled');
      }
      sendError('Error while analyzing image: ' + error);
      return;
    }

    let imageConfigLabels = getStringLabels(localImage?.labels);
    if (!localImage) {
      try {
        imageConfigLabels = getStringLabels(await this.imageRegistry.getImageConfigLabels(imageName, token));
      } catch (error) {
        if (token?.isCancellationRequested) {
          throw new Error('Extension installation canceled');
        }
        sendError(
          this.#localExtensionImageLoader.isLocalImageReference(imageName)
            ? `Local image ${imageName} was not found in a running container engine. Registry fallback failed: ${error}`
            : 'Error while analyzing image: ' + error,
        );
        return;
      }
    }

    if (!imageConfigLabels) {
      sendError(`Image ${imageName} is not a Podman Desktop Extension. Unable to grab image config labels.`);
      return;
    }

    const titleLabel = imageConfigLabels['org.opencontainers.image.title'] as string | undefined;
    const descriptionLabel = imageConfigLabels['org.opencontainers.image.description'];
    const vendorLabel = imageConfigLabels['org.opencontainers.image.vendor'];
    const apiVersion = imageConfigLabels['io.podman-desktop.api.version'];
    const apiDDVersion = imageConfigLabels['com.docker.desktop.extension.api.version'];

    if (!titleLabel || !descriptionLabel || !vendorLabel || (!apiVersion && !apiDDVersion)) {
      sendError(`Image ${imageName} is not a Podman Desktop Extension`);
      return;
    }

    const isDDExtension = apiDDVersion ? true : false;
    const isPDExtension = apiVersion ? true : false;

    let unpackedFolder;
    // where to unpack the extension
    if (isPDExtension) {
      unpackedFolder = this.directories.getPluginsDirectory();
    } else {
      unpackedFolder = this.directories.getContributionStorageDir();
    }

    // strip the digest and tag from the image name
    let imageNameWithoutTag = imageName.split('@')[0];
    if (!imageNameWithoutTag) {
      sendError(`Image ${imageName} is not a Podman Desktop Extension`);
      return;
    }
    const lastSlash = imageNameWithoutTag.lastIndexOf('/');
    const lastColon = imageNameWithoutTag.lastIndexOf(':');
    if (lastColon > lastSlash) {
      imageNameWithoutTag = imageNameWithoutTag.slice(0, lastColon);
    }

    // remove all special characters from the image name
    const imageNameWithoutSpecialChars = imageNameWithoutTag.replace(/[^a-zA-Z0-9]/g, '');

    // final folder
    const finalFolderPath = path.join(unpackedFolder, imageNameWithoutSpecialChars);

    // grab all extensions
    let extensions: ExtensionInfo[] = [];
    if (isPDExtension) {
      extensions = await this.extensionLoader.listExtensions();

      // check if the extension is already installed for that path
      const alreadyInstalledExtension = extensions.find(extension => extension.path === finalFolderPath);

      if (alreadyInstalledExtension) {
        sendError(`Extension ${alreadyInstalledExtension.name} is already installed`);
        return;
      }
    }

    if (fs.existsSync(finalFolderPath)) {
      sendError(`Unable to install image ${imageName}: the target extension directory already exists`);
      return;
    }

    // tmp folder
    const tmpFolderPath = await fs.promises.mkdtemp(path.join(os.tmpdir(), `${imageNameWithoutSpecialChars}-`));
    try {
      sendLog(localImage ? 'Extracting local image layers...' : 'Downloading and extract layers...');
      const reportProgress = (event: { message: string; progress: number }): void => {
        sendLog(event.message);
        onProgress?.(event.progress);
      };
      if (localImage) {
        await this.#localExtensionImageLoader.downloadAndExtractImage(
          localImage,
          imageName,
          tmpFolderPath,
          reportProgress,
          token,
        );
      } else {
        await this.imageRegistry.downloadAndExtractImage(imageName, tmpFolderPath, reportProgress, token);
      }

      if (token?.isCancellationRequested) {
        throw new Error('Extension installation canceled');
      }

      sendLog('Filtering image content...');
      if (isPDExtension) {
        await this.extractExtensionFiles(tmpFolderPath, finalFolderPath, sendLog);
      } else if (isDDExtension) {
        await this.#dockerDesktopInstaller.extractExtensionFiles(
          tmpFolderPath,
          finalFolderPath,
          sendLog,
          catatlogExtensionId,
        );
      }
    } catch (error) {
      await fs.promises.rm(finalFolderPath, { recursive: true, force: true });
      throw error;
    } finally {
      await fs.promises.rm(tmpFolderPath, { recursive: true, force: true });
    }

    if (isPDExtension) {
      let analyzedExtension: AnalyzedExtension | undefined;
      try {
        analyzedExtension = await this.extensionLoader.analyzeExtension({
          extensionPath: finalFolderPath,
          removable: true,
        });
      } catch (error) {
        sendError('Error while analyzing extension: ' + error);
        await fs.promises.rm(finalFolderPath, { recursive: true, force: true });
        return;
      }
      if (!analyzedExtension) {
        sendError('Error while analyzing extension: no extension metadata was returned');
        await fs.promises.rm(finalFolderPath, { recursive: true, force: true });
        return;
      }
      if (analyzedExtension?.error) {
        sendError('Could not load extension: ' + analyzedExtension?.error);
        await fs.promises.rm(finalFolderPath, { recursive: true, force: true });
        return;
      }
      if (extensions.find(extension => extension.id === analyzedExtension?.id)) {
        sendError(`Extension ${analyzedExtension?.id} is already installed.`);
        await fs.promises.rm(finalFolderPath, { recursive: true, force: true });
        return;
      }
      return analyzedExtension;
    } else if (isDDExtension) {
      try {
        if (token?.isCancellationRequested) {
          throw new Error('Extension installation canceled');
        }
        const contribution = await this.#dockerDesktopInstaller.setupContribution(
          titleLabel,
          imageName,
          finalFolderPath,
          sendLog,
          sendError,
        );
        if (token?.isCancellationRequested) {
          throw new Error('Extension installation canceled');
        }
        if (!contribution) {
          await fs.promises.rm(finalFolderPath, { recursive: true, force: true });
        }
        return contribution;
      } catch (error) {
        await fs.promises.rm(finalFolderPath, { recursive: true, force: true });
        throw error;
      }
    }
    return undefined;
  }

  async analyzeTransitiveDependencies(
    analyzedExtension: AnalyzedExtension | undefined,
    analyzedExtensions: AnalyzedExtension[],
    errors: string[],
    sendLog: (message: string) => void,
    sendError: (message: string) => void,
    token?: CancellationToken,
  ): Promise<boolean> {
    if (!analyzedExtension) {
      return false;
    }

    analyzedExtensions.push(analyzedExtension);

    const dependencyExtensionIds: string[] = [];

    // do we have extensionPack or extension dependencies
    if (analyzedExtension?.manifest?.extensionPack) {
      dependencyExtensionIds.push(...analyzedExtension.manifest.extensionPack);
    }
    if (analyzedExtension?.manifest?.extensionDependencies) {
      dependencyExtensionIds.push(...analyzedExtension.manifest.extensionDependencies);
    }

    // if we have dependencies, we need to analyze them first if not yet installed
    if (dependencyExtensionIds.length > 0) {
      const fetchableExtensions = await this.extensionCatalog.getFetchableExtensions();
      const alreadyInstalledExtensionIds = (await this.extensionLoader.listExtensions()).map(extension => extension.id);

      // need to analyze extensions that are in dependency minus the one installed or already analyzed
      const extensionsToAnalyze = dependencyExtensionIds.filter(
        dependency =>
          !alreadyInstalledExtensionIds.includes(dependency) &&
          !analyzedExtensions.find(extension => extension.id === dependency),
      );

      // check if all dependencies are in the catalog
      const missingDependencies = extensionsToAnalyze.filter(
        dependency => !fetchableExtensions.find(extension => extension.extensionId === dependency),
      );
      if (missingDependencies.length > 0) {
        errors.push(
          `Extension ${
            analyzedExtension.manifest.name
          } has missing installable dependencies: ${missingDependencies.join(', ')} from extensionPack attribute.`,
        );
        return false;
      }

      // first, grab name of the OCI image for each extension
      const imagesOfExtensionsToAnalyze = extensionsToAnalyze.reduce<string[]>((prev, id) => {
        const ext = fetchableExtensions.find(extension => extension.extensionId === id);
        if (ext) prev.push(ext.link);
        return prev;
      }, []);

      // now analyze all these dependencies
      for (const imageNameToAnalyze of imagesOfExtensionsToAnalyze) {
        try {
          const imageToAnalyze = token
            ? await this.analyzeFromImage(sendLog, sendError, imageNameToAnalyze, undefined, undefined, token)
            : await this.analyzeFromImage(sendLog, sendError, imageNameToAnalyze);

          if (!imageToAnalyze || imageToAnalyze instanceof DockerDesktopContribution) {
            return false;
          }
          if (token) {
            await this.analyzeTransitiveDependencies(
              imageToAnalyze,
              analyzedExtensions,
              errors,
              sendLog,
              sendError,
              token,
            );
          } else {
            await this.analyzeTransitiveDependencies(imageToAnalyze, analyzedExtensions, errors, sendLog, sendError);
          }
        } catch (error) {
          errors.push(`Error while analyzing extension ${imageNameToAnalyze}: ${error}`);
        }
      }
    }
    return true;
  }

  async installFromImage(
    sendLog: (message: string) => void,
    sendError: (message: string) => void,
    sendEnd: (message: string) => void,
    imageName: string,
    extensionAnalyzed?: (extension: AnalyzedExtension) => void,
    catalogExtensionId?: string,
    cancellationTokenSourceId?: number,
  ): Promise<void> {
    const token = cancellationTokenSourceId
      ? this.cancellationTokenRegistry.getCancellationTokenSource(cancellationTokenSourceId)?.token
      : undefined;
    if (cancellationTokenSourceId && !token) {
      throw new Error(`Unknown cancellation token ${cancellationTokenSourceId}`);
    }

    const task = this.taskManager.createTask({
      title: `Installing extension ${imageName}`,
      ...(cancellationTokenSourceId ? { cancellable: true, cancellationTokenSourceId } : {}),
    });

    const wrappedSendError = (message: string): void => {
      sendError(message);
      if (token?.isCancellationRequested) {
        task.status = 'canceled';
      } else {
        task.error = message;
      }
    };

    try {
      await this.doInstallFromImage(
        sendLog,
        wrappedSendError,
        sendEnd,
        imageName,
        extensionAnalyzed,
        catalogExtensionId,
        (progress: number) => {
          task.progress = progress;
        },
        token,
      );
    } catch (error: unknown) {
      if (token?.isCancellationRequested) {
        task.status = 'canceled';
      } else {
        task.error = String(error);
      }
      throw error;
    } finally {
      if (!task.error && task.status !== 'canceled') {
        task.status = 'success';
      }
    }
  }

  protected async doInstallFromImage(
    sendLog: (message: string) => void,
    sendError: (message: string) => void,
    sendEnd: (message: string) => void,
    imageName: string,
    extensionAnalyzed?: (extension: AnalyzedExtension) => void,
    catalogExtensionId?: string,
    onProgress?: (progress: number) => void,
    token?: CancellationToken,
  ): Promise<void> {
    // now collect all transitive dependencies
    const analyzedExtensions: AnalyzedExtension[] = [];
    const errors: string[] = [];
    const analyzedExtension = await this.analyzeFromImage(
      sendLog,
      sendError,
      imageName,
      catalogExtensionId,
      onProgress,
      token,
    );
    if (analyzedExtension instanceof DockerDesktopContribution) {
      sendEnd('Docker Desktop Extension Successfully installed.');
      return;
    }

    if (token?.isCancellationRequested) {
      if (analyzedExtension?.path) {
        await fs.promises.rm(analyzedExtension.path, { recursive: true, force: true });
      }
      throw new Error('Extension installation canceled');
    }

    if (analyzedExtension) extensionAnalyzed?.(analyzedExtension);

    const analyzeSuccessful = await this.analyzeTransitiveDependencies(
      analyzedExtension,
      analyzedExtensions,
      errors,
      sendLog,
      sendError,
      token,
    );

    const cleanupAnalyzedExtensions = async (): Promise<void> => {
      await Promise.all(
        analyzedExtensions
          .filter(extension => extension !== undefined)
          .map(extension =>
            extension?.path ? fs.promises.rm(extension.path, { recursive: true, force: true }) : Promise.resolve(),
          ),
      );
    };

    // if we have some undefined objects, it is an error, cleanup extensions
    if (errors.length > 0) {
      await cleanupAnalyzedExtensions();
      sendError(`Error while installing extension ${imageName}: ${errors.join('\n')}`);
      return;
    }

    if (!analyzeSuccessful) {
      await cleanupAnalyzedExtensions();
      return;
    }

    if (token?.isCancellationRequested) {
      await cleanupAnalyzedExtensions();
      throw new Error('Extension installation canceled');
    }

    // load all extensions
    analyzedExtensions.forEach(extension => this.extensionLoader.ensureExtensionIsEnabled(extension.id));

    await this.extensionLoader.loadExtensions(analyzedExtensions);

    sendEnd('Extension Successfully installed.');
    this.apiSender.send('extension-started');
  }

  async init(): Promise<void> {
    this.ipcMainOn(
      'extension-installer:install-from-image',
      (
        event: IpcMainEvent,
        imageName: string,
        logCallbackId: number,
        catalogExtensionId?: string,
        cancellationTokenSourceId?: number,
      ): void => {
        const telemetryData: {
          extensionId?: string;
          error?: string;
        } = {};

        const sendLog = (message: string): void => {
          event.reply('extension-installer:install-from-image-log', logCallbackId, message);
        };

        const sendError = (message: string): void => {
          telemetryData.error = message;
          event.reply('extension-installer:install-from-image-error', logCallbackId, message);
        };

        const sendEnd = (message: string): void => {
          event.reply('extension-installer:install-from-image-end', logCallbackId, message);
        };

        const extAnalyzed = (extension: AnalyzedExtension): void => {
          if (extension) {
            telemetryData.extensionId = extension.id;
          }
        };

        this.installFromImage(
          sendLog,
          sendError,
          sendEnd,
          imageName,
          extAnalyzed,
          catalogExtensionId,
          cancellationTokenSourceId,
        )
          .catch((error: unknown) => {
            sendError('' + error);
            telemetryData.error = `${error}`;
          })
          .finally(() => {
            this.telemetry.track('installedExtension', telemetryData);
          });
      },
    );
  }
}
