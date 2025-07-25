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
import * as path from 'node:path';

import { Octokit } from '@octokit/rest';
import * as extensionApi from '@podman-desktop/api';

import { getSystemBinaryPath, installBinaryToSystem } from './cli-run';
import type { ComposeGithubReleaseArtifactMetadata } from './compose-github-releases';
import { ComposeGitHubReleases } from './compose-github-releases';
import { Detect } from './detect';
import { ComposeDownload } from './download';
import * as handler from './handler';
import { OS } from './os';

let composeVersionMetadata: ComposeGithubReleaseArtifactMetadata | undefined;
let composeCliTool: extensionApi.CliTool | undefined;
let composeCliToolUpdaterDisposable: extensionApi.Disposable | undefined;
let composeCliToolInstallerDisposable: extensionApi.Disposable | undefined;
const os = new OS();

// Telemetry
let telemetryLogger: extensionApi.TelemetryLogger | undefined;

export function initTelemetryLogger(): void {
  telemetryLogger = extensionApi.env.createTelemetryLogger();
}

const composeCliName = 'docker-compose';
const composeDisplayName = 'Compose';
const composeDescription = `The Compose extension provides optional command line support for [Compose files](https://compose-spec.io/) with Podman.\n\nMore information: [Podman Desktop Documentation](https://podman-desktop.io/docs/tags/compose)`;
const imageLocation = './icon.png';

let binaryVersion: string | undefined;
let binaryPath: string | undefined;

export async function activate(extensionContext: extensionApi.ExtensionContext): Promise<void> {
  initTelemetryLogger();
  // required in tests, because activate function called multiple times
  // does not affect runtime
  binaryVersion = undefined;
  binaryPath = undefined;

  // Check docker-compose binary has been downloaded and update both
  // the configuration setting and the context accordingly
  await handler.updateConfigAndContextComposeBinary(extensionContext);

  // Setup configuration changes if the user toggles the "Install compose system-wide" boolean
  handler.handleConfigurationChanges(extensionContext);

  // Create new classes to handle the onboarding sequence
  const octokit = new Octokit();
  const detect = new Detect(os, extensionContext.storagePath);

  const composeGitHubReleases = new ComposeGitHubReleases(octokit);
  const composeDownload = new ComposeDownload(extensionContext, composeGitHubReleases, os);

  // add a command to display the onboarding page
  const openOnboardingCommand = extensionApi.commands.registerCommand('compose.openComposeOnboarding', async () => {
    await extensionApi.navigation.navigateToOnboarding();
  });

  // ONBOARDING: Command to check compose is downloaded
  const onboardingCheckDownloadCommand = extensionApi.commands.registerCommand(
    'compose.onboarding.checkDownloadedCommand',
    async () => {
      // Check that docker-compose binary has been downloaded to the storage folder.
      // instead of checking for `docker-compose` on the command line, the most reliable way is to see
      // if we can get the pathname to the binary from the configuration
      const isDownloaded = await detect.getStoragePath();
      if (isDownloaded === '') {
        extensionApi.context.setValue('composeIsNotDownloaded', true, 'onboarding');
      } else {
        extensionApi.context.setValue('composeIsNotDownloaded', false, 'onboarding');
      }

      // EDGE CASE: Update system-wide download context in case the user has removed
      // the binary from the system path while podman-desktop is running (we only check on startup)
      await handler.updateConfigAndContextComposeBinary(extensionContext);

      // CheckDownload is the first step in the onboarding sequence,
      // we will run getLatestVersionAsset so we can show the user the latest
      // latest version of compose that is available.
      if (!isDownloaded) {
        // Get the latest version and store the metadata in a local variable
        const composeLatestVersion = await composeDownload.getLatestVersionAsset();
        // Set the value in the context to the version we're downloading so it appears in the onboarding sequence
        if (composeLatestVersion) {
          composeVersionMetadata = composeLatestVersion;
          extensionApi.context.setValue('composeDownloadVersion', composeVersionMetadata.tag, 'onboarding');
        }
      }

      // Log if it's downloaded and what version is being selected for download (can be either latest, or chosen by user)
      telemetryLogger?.logUsage('compose.onboarding.checkDownloadedCommand', {
        downloaded: isDownloaded === '' ? false : true,
        version: composeVersionMetadata?.tag,
      });
    },
  );

  // ONBOARDING; Command to download the compose binary. We will get the value that the user has "picked"
  // from the context value. This is because we have the option to either "select a version" or "download the latest"
  const onboardingDownloadComposeCommand = extensionApi.commands.registerCommand(
    'compose.onboarding.downloadCommand',
    async () => {
      // If the version is undefined (checks weren't run, or the user didn't select a version)
      // we will just download the latest version
      let downloaded: boolean = false;
      try {
        composeVersionMetadata ??= await composeDownload.getLatestVersionAsset();
        // Download
        await composeDownload.download(composeVersionMetadata);

        // We are all done, so we can set the context value to false / downloaded to true
        extensionApi.context.setValue('composeIsNotDownloaded', false, 'onboarding');
        downloaded = true;

        // register the cli tool if necessary
        if (!composeCliTool) {
          await registerCLITool(composeDownload, detect, extensionContext);
        }
      } catch (error) {
        await extensionApi.window.showErrorMessage(`Unable to download docker-compose binary: ${error}`);
      } finally {
        // Make sure we log the telemetry even if we encounter an error
        // If we have downloaded the binary, we can log it as being successfully downloaded
        telemetryLogger?.logUsage('compose.onboarding.downloadCommand', {
          successful: downloaded,
          version: composeVersionMetadata?.tag,
        });
      }
    },
  );

  // ONBOARDING: Prompt the user for the version of Compose they want to download
  const onboardingPromptUserForVersionCommand = extensionApi.commands.registerCommand(
    'compose.onboarding.promptUserForVersion',
    async () => {
      // Prompt the user for the verison
      const composeRelease = await composeDownload.promptUserForVersion();

      // Update the context value that this is the version we are downloading
      // we'll store both the metadata as well as version number in a sepearate context value
      if (composeRelease) {
        composeVersionMetadata = composeRelease;
        extensionApi.context.setValue('composeDownloadVersion', composeRelease.tag, 'onboarding');
      }

      // Log the telemetry that the user picked a version
      telemetryLogger?.logUsage('compose.onboarding.promptUserForVersion', {
        version: composeRelease?.tag,
      });

      // Note, we do not refresh the UI when setValue has been set, only when "when" has been updated
      // TEMPORARY FIX until we can find a better way to do this. This forces a refresh by changing the "when" evaluation
      // of the dialog so it'll refresh the composeDownloadVersion value.
      extensionApi.context.setValue('composeShowCustomDownloadDialog', true, 'onboarding');
      extensionApi.context.setValue('composeShowCustomDownloadDialog', false, 'onboarding');
    },
  );

  // ONBOARDING: Install compose system wide step
  const onboardingInstallSystemWideCommand = extensionApi.commands.registerCommand(
    'compose.onboarding.installSystemWideCommand',
    async () => {
      // This is TEMPORARY until we re-add the "Installing compose system wide" toggle again
      // We will just call the handler function directly
      let installed: boolean = false;
      try {
        await handler.installComposeBinary(detect, extensionContext);
        // update the cli version
        binaryVersion = composeVersionMetadata?.tag.replace('v', '');
        if (!binaryVersion) {
          return;
        }
        binaryPath = getSystemBinaryPath(composeCliName);
        // update the version and the path
        composeCliTool?.updateVersion({
          version: binaryVersion,
          path: binaryPath,
          installationSource: 'extension',
        });
        // if installed version is the newest, dispose the updater
        installed = true;
      } finally {
        telemetryLogger?.logUsage('compose.onboarding.installSystemWideCommand', {
          successful: installed,
        });
      }
    },
  );

  // Push the commands that will be used within the onboarding sequence
  extensionContext.subscriptions.push(
    openOnboardingCommand,
    onboardingCheckDownloadCommand,
    onboardingPromptUserForVersionCommand,
    onboardingDownloadComposeCommand,
    onboardingInstallSystemWideCommand,
  );

  // Need to "ADD" a provider so we can actually press the button!
  // We set this to "unknown" so it does not appear on the dashboard (we only want it in preferences).
  const providerOptions: extensionApi.ProviderOptions = {
    name: composeDisplayName,
    id: composeDisplayName,
    status: 'unknown',
    images: {
      icon: imageLocation,
    },
  };

  providerOptions.emptyConnectionMarkdownDescription = composeDescription;
  const provider = extensionApi.provider.createProvider(providerOptions);
  extensionContext.subscriptions.push(provider);

  // Push the CLI tool as well (but it will do it postActivation so it does not block the activate() function)
  // Post activation
  registerCLITool(composeDownload, detect, extensionContext).catch((error: unknown) => {
    console.error('Error activating extension', error);
  });
}

// Activate the CLI tool (check version, etc) and register the CLi so it does not block activation.
async function registerCLITool(
  composeDownload: ComposeDownload,
  detect: Detect,
  context: extensionApi.ExtensionContext,
): Promise<void> {
  // build executable name for current platform
  const executable = os.isWindows() ? composeCliName + '.exe' : composeCliName;

  // binary info
  let binaryInfo: { version: string; path: string; updatable?: boolean } | undefined = undefined;

  // let's check for system-wide
  const installedSystemWide = await detect.checkSystemWideDockerCompose();
  let installationSource: extensionApi.CliToolInstallationSource | undefined;
  if (installedSystemWide) {
    binaryInfo = await detect.getDockerComposeBinaryInfo(executable);
    const systemPath = getSystemBinaryPath(composeCliName);
    installationSource = path.normalize(binaryInfo.path) === path.normalize(systemPath) ? 'extension' : 'external';
  } else {
    // if not installed, let's check for local version
    const extensionExecutable = await detect.getStoragePath();
    // if local version exists
    if (extensionExecutable.length !== 0) {
      binaryInfo = await detect.getDockerComposeBinaryInfo(executable, detect.getExtensionStorageBin());
      installationSource = 'extension';
    }
  }

  // if binary has been detected we extract its version and path
  if (binaryInfo) {
    binaryVersion = removeVersionPrefix(binaryInfo.version);
    binaryPath = binaryInfo.path;
  }

  // update existing CLI tool
  if (composeCliTool) {
    if (binaryVersion) {
      composeCliTool.updateVersion({
        version: binaryVersion,
        path: binaryPath,
        installationSource,
      });
    }
  } else {
    // Register the CLI tool so it appears in the preferences page.
    composeCliTool = extensionApi.cli.createCliTool({
      name: composeCliName,
      displayName: composeDisplayName,
      markdownDescription: composeDescription,
      images: {
        icon: imageLocation,
      },
      version: binaryVersion,
      path: binaryPath,
      installationSource,
    });
  }

  // register the updater to allow users to upgrade/downgrade their cli
  let releaseToUpdateTo: ComposeGithubReleaseArtifactMetadata | undefined;
  let releaseVersionToUpdateTo: string | undefined;

  let latestVersionAsset: ComposeGithubReleaseArtifactMetadata | undefined;
  try {
    latestVersionAsset = await composeDownload.getLatestVersionAsset();
  } catch (error) {
    console.log('Error when loading compose latest release meta.', error);
  }

  const latestVersion = latestVersionAsset ? removeVersionPrefix(latestVersionAsset.tag) : undefined;

  const update = {
    version: latestVersion !== composeCliTool.version ? latestVersion : undefined,
    selectVersion: async (): Promise<string> => {
      const selected = await composeDownload.promptUserForVersion(binaryVersion);
      releaseToUpdateTo = selected;
      releaseVersionToUpdateTo = removeVersionPrefix(selected.tag);
      return releaseVersionToUpdateTo;
    },
    doUpdate: async (): Promise<void> => {
      if (!binaryVersion || !binaryPath) {
        throw new Error(`Cannot update ${composeCliName}. No cli tool installed.`);
      }
      if (!releaseVersionToUpdateTo) {
        // update request to latest version
        if (latestVersionAsset) {
          releaseToUpdateTo = latestVersionAsset;
          releaseVersionToUpdateTo = latestVersion;
        }
      }
      if (!releaseToUpdateTo || !releaseVersionToUpdateTo) {
        throw new Error(`Cannot update ${binaryInfo?.path} version ${binaryVersion}. No release selected.`);
      }
      // binaryInfo is undefined when compose cli is not installed
      if (binaryInfo && !binaryInfo?.updatable) {
        throw new Error(
          `Cannot update ${binaryInfo?.path} version ${binaryVersion} to ${releaseVersionToUpdateTo} as it was not installed by podman-desktop`,
        );
      }

      // download, install system wide and update cli version
      await composeDownload.download(releaseToUpdateTo);
      // get the binary in the extension folder
      const storagePath = await detect.getStoragePath();
      binaryPath = await installBinaryToSystem(storagePath, composeCliName);
      composeCliTool?.updateVersion({
        version: releaseVersionToUpdateTo,
        path: binaryPath,
        installationSource: 'extension',
      });
      binaryVersion = releaseVersionToUpdateTo;
      releaseVersionToUpdateTo = undefined;
      releaseToUpdateTo = undefined;
    },
  };

  // register installer
  let releaseToInstall: ComposeGithubReleaseArtifactMetadata | undefined;
  let releaseVersionToInstall: string | undefined;

  context.subscriptions.push(
    composeCliTool.onDidUpdateVersion((version: string) => {
      if (version === latestVersion) {
        delete update.version;
      } else {
        update.version = latestVersion;
      }
    }),
  );

  composeCliToolInstallerDisposable = composeCliTool.registerInstaller({
    selectVersion: async () => {
      const selected = await composeDownload.promptUserForVersion();
      releaseToInstall = selected;
      releaseVersionToInstall = removeVersionPrefix(selected.tag);
      return releaseVersionToInstall;
    },
    doInstall: async _logger => {
      if (binaryVersion ?? binaryPath) {
        throw new Error(
          `Cannot install ${composeCliName}. Version ${binaryVersion} in ${binaryPath} is already installed.`,
        );
      }
      if (!releaseToInstall || !releaseVersionToInstall) {
        throw new Error(`Cannot install ${composeCliName}. No release selected.`);
      }

      // download, install system wide and update cli version
      await composeDownload.download(releaseToInstall);
      // get the binary in the extension folder
      const storagePath = await detect.getStoragePath();
      binaryPath = await installBinaryToSystem(storagePath, composeCliName);
      composeCliTool?.updateVersion({
        version: releaseVersionToInstall,
        path: binaryPath,
        installationSource: 'extension',
      });
      binaryVersion = releaseVersionToInstall;
      releaseVersionToInstall = undefined;
      releaseToInstall = undefined;
      extensionApi.context.setValue('compose.isComposeInstalledSystemWide', true);
    },
    doUninstall: async _logger => {
      if (!binaryVersion) {
        throw new Error(`Cannot uninstall ${composeCliName}. No version detected.`);
      }

      // delete the executable stored in the storage folder
      const storagePath = await detect.getStoragePath();
      await deleteFile(storagePath);

      // delete the executable in the system path
      const systemPath = getSystemBinaryPath(composeCliName);
      await deleteExecutableAsAdmin(systemPath);

      // update the version to undefined
      binaryVersion = undefined;
      binaryPath = undefined;
      extensionApi.context.setValue('compose.isComposeInstalledSystemWide', false);
    },
  });

  // if the tool has been installed by the user we do not register the updater/installer
  if (installationSource === 'external') {
    return;
  }

  composeCliToolUpdaterDisposable = composeCliTool.registerUpdate(update);
}

async function deleteFile(filePath: string): Promise<void> {
  if (filePath && fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error.code === 'EACCES' || error.code === 'EPERM')
      ) {
        await deleteFileAsAdmin(filePath);
      } else {
        throw error;
      }
    }
  }
}

async function deleteFileAsAdmin(filePath: string): Promise<void> {
  const args: string[] = [filePath];
  const command = extensionApi.env.isWindows ? 'del' : 'rm';

  try {
    // Use admin privileges
    await extensionApi.process.exec(command, args, { isAdmin: true });
  } catch (error) {
    console.error(`Failed to uninstall '${filePath}': ${error}`);
    throw error;
  }
}

async function deleteExecutableAsAdmin(filePath: string): Promise<void> {
  const command = extensionApi.env.isWindows ? 'del' : 'rm';
  try {
    // Use admin privileges
    await extensionApi.process.exec(command, [filePath], { isAdmin: true });
  } catch (error) {
    console.error(`Failed to uninstall '${filePath}': ${error}`);
    throw error;
  }
}

function removeVersionPrefix(version: string): string {
  return version.replace('v', '').trim();
}

export async function deactivate(): Promise<void> {
  // Dispose the CLI tool
  if (composeCliTool) {
    composeCliTool.dispose();
    composeCliTool = undefined;
  }
  composeCliToolUpdaterDisposable?.dispose();
  composeCliToolInstallerDisposable?.dispose();
}
